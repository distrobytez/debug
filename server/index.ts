import 'dotenv/config';
import { GetFindingsCommand, SecurityHubClient } from '@aws-sdk/client-securityhub';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import express, { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { dirname, resolve } from 'node:path';

declare global {
  namespace Express {
    interface Request {
      authSubject?: string;
    }
  }
}

interface AccountRow {
  id: string;
  owner_sub: string;
  aws_account_id: string;
  role_arn: string;
  region: string;
  external_id: string;
  status: 'pending' | 'connected';
  created_at: string;
  last_verified_at: string | null;
}

const app = express();
const port = Number(process.env.API_PORT || 4000);
const databasePath = resolve(process.env.AWS_AUDIT_DB_PATH || 'data/aws-audit.sqlite');

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS aws_audit_accounts (
    id TEXT PRIMARY KEY,
    owner_sub TEXT NOT NULL,
    aws_account_id TEXT NOT NULL,
    role_arn TEXT NOT NULL,
    region TEXT NOT NULL,
    external_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'connected')),
    created_at TEXT NOT NULL,
    last_verified_at TEXT,
    UNIQUE (owner_sub, aws_account_id)
  );
`);

let remoteJwks: ReturnType<typeof createRemoteJWKSet> | undefined;

app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '16kb', inflate: false }));

function getAuthConfiguration() {
  const { AWS_AUDIT_JWKS_URL, AWS_AUDIT_ISSUER, AWS_AUDIT_AUDIENCE } = process.env;
  if (!AWS_AUDIT_JWKS_URL || !AWS_AUDIT_ISSUER || !AWS_AUDIT_AUDIENCE) {
    return undefined;
  }

  const jwksUrl = new URL(AWS_AUDIT_JWKS_URL);
  if (jwksUrl.protocol !== 'https:' && jwksUrl.hostname !== 'localhost') {
    throw new Error('AWS_AUDIT_JWKS_URL must use HTTPS.');
  }

  remoteJwks ??= createRemoteJWKSet(jwksUrl);
  return {
    jwks: remoteJwks,
    issuer: AWS_AUDIT_ISSUER,
    audience: AWS_AUDIT_AUDIENCE,
  };
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const config = getAuthConfiguration();
    if (!config) {
      res.status(503).json({
        error: 'Live AWS auditing requires AWS_AUDIT_JWKS_URL, AWS_AUDIT_ISSUER, and AWS_AUDIT_AUDIENCE.',
      });
      return;
    }

    const authorization = req.header('authorization');
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) {
      res.status(401).json({ error: 'A signed OIDC bearer token is required.' });
      return;
    }

    const { payload } = await jwtVerify(token, config.jwks, {
      issuer: config.issuer,
      audience: config.audience,
      algorithms: ['RS256', 'ES256'],
    });
    if (!payload.sub || payload.sub.length > 255) {
      res.status(401).json({ error: 'The OIDC token must include a valid subject claim.' });
      return;
    }

    req.authSubject = payload.sub;
    next();
  } catch (error) {
    const name = error instanceof Error ? error.name : 'UnknownError';
    console.error('AWS audit authentication failed', { errorName: name });
    res.status(401).json({ error: 'The OIDC token could not be verified.' });
  }
}

function getOwnedAccount(ownerSub: string, accountId: string): AccountRow | undefined {
  return database.prepare(`
    SELECT id, owner_sub, aws_account_id, role_arn, region, external_id, status, created_at, last_verified_at
    FROM aws_audit_accounts
    WHERE owner_sub = ? AND id = ?
  `).get(ownerSub, accountId) as AccountRow | undefined;
}

function toPublicAccount(account: AccountRow) {
  return {
    id: account.id,
    awsAccountId: account.aws_account_id,
    roleArn: account.role_arn,
    region: account.region,
    status: account.status,
    createdAt: account.created_at,
    lastVerifiedAt: account.last_verified_at,
  };
}

function isValidPrincipalArn(value: string | undefined): value is string {
  return Boolean(value && /^arn:aws(?:-[a-z0-9-]+)?:iam::\d{12}:role\/[A-Za-z0-9_+=,.@/-]+$/.test(value));
}

function makeTrustPolicy(account: AccountRow) {
  const principalArn = process.env.AWS_AUDIT_PRINCIPAL_ARN;
  if (!isValidPrincipalArn(principalArn)) {
    throw new Error('AWS_AUDIT_PRINCIPAL_ARN must be a valid IAM role ARN.');
  }

  return {
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: { AWS: principalArn },
      Action: 'sts:AssumeRole',
      Condition: {
        StringEquals: { 'sts:ExternalId': account.external_id },
      },
    }],
  };
}

async function listSecurityHubFindings(account: AccountRow) {
  const sts = new STSClient({ region: account.region });
  const assumedRole = await sts.send(new AssumeRoleCommand({
    RoleArn: account.role_arn,
    RoleSessionName: 'NeuroTraceSecurityAudit',
    ExternalId: account.external_id,
    DurationSeconds: 900,
  }));
  const credentials = assumedRole.Credentials;
  if (!credentials?.AccessKeyId || !credentials.SecretAccessKey || !credentials.SessionToken) {
    throw new Error('AWS STS did not return temporary credentials.');
  }

  const securityHub = new SecurityHubClient({
    region: account.region,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
    },
  });
  const result = await securityHub.send(new GetFindingsCommand({
    MaxResults: 100,
    Filters: {
      RecordState: [{ Comparison: 'EQUALS', Value: 'ACTIVE' }],
    },
    SortCriteria: [{ Field: 'UpdatedAt', SortOrder: 'desc' }],
  }));

  return (result.Findings || []).map((finding) => ({
    id: finding.Id || `${finding.ProductArn || 'security-hub'}:${finding.Resources?.[0]?.Id || 'finding'}`,
    title: finding.Title || 'Untitled finding',
    description: finding.Description || '',
    severity: finding.Severity?.Label || 'UNSPECIFIED',
    workflowStatus: finding.Workflow?.Status || 'NEW',
    resourceId: finding.Resources?.[0]?.Id || 'Unknown resource',
    resourceType: finding.Resources?.[0]?.Type || 'Unknown type',
    updatedAt: finding.UpdatedAt || finding.CreatedAt || null,
    region: finding.Region || account.region,
  }));
}

function sendAwsError(res: Response, operation: string, error: unknown) {
  const name = error instanceof Error ? error.name : 'UnknownError';
  console.error('AWS Security Hub operation failed', { operation, errorName: name });

  if (name.includes('AccessDenied') || name.includes('Unauthorized')) {
    res.status(502).json({
      error: 'AWS denied the request. Check the account role trust policy and its AWSSecurityHubReadOnlyAccess permission.',
    });
    return;
  }
  if (name.includes('ResourceNotFound')) {
    res.status(502).json({
      error: 'Security Hub is not enabled in the selected AWS region for this account.',
    });
    return;
  }
  res.status(502).json({
    error: 'AWS could not complete the request. Check the role ARN, AWS region, and Security Hub setup.',
  });
}

app.get('/api/aws/accounts', authenticate, (req, res) => {
  if (!isValidPrincipalArn(process.env.AWS_AUDIT_PRINCIPAL_ARN)) {
    res.status(503).json({ error: 'Set AWS_AUDIT_PRINCIPAL_ARN to a valid IAM role ARN before viewing linked AWS accounts.' });
    return;
  }

  const accounts = database.prepare(`
    SELECT id, owner_sub, aws_account_id, role_arn, region, external_id, status, created_at, last_verified_at
    FROM aws_audit_accounts
    WHERE owner_sub = ?
    ORDER BY created_at DESC
  `).all(req.authSubject!) as unknown as AccountRow[];
  res.json({
    accounts: accounts.map((account) => ({
      ...toPublicAccount(account),
      externalId: account.external_id,
      trustPolicy: makeTrustPolicy(account),
    })),
  });
});

app.post('/api/aws/accounts', authenticate, (req, res) => {
  const { awsAccountId, roleArn, region } = req.body as {
    awsAccountId?: unknown;
    roleArn?: unknown;
    region?: unknown;
  };

  if (
    typeof awsAccountId !== 'string'
    || !/^\d{12}$/.test(awsAccountId)
    || typeof roleArn !== 'string'
    || roleArn.length > 2048
    || typeof region !== 'string'
    || !/^[a-z]{2}(?:-[a-z0-9]+)+-\d$/.test(region)
  ) {
    res.status(400).json({ error: 'Provide a 12-digit AWS account ID, role ARN, and valid AWS region.' });
    return;
  }

  const arnMatch = roleArn.match(/^arn:aws(?:-[a-z0-9-]+)?:iam::(\d{12}):role\/[A-Za-z0-9_+=,.@/-]+$/);
  if (!arnMatch || arnMatch[1] !== awsAccountId) {
    res.status(400).json({ error: 'The IAM role ARN must belong to the supplied AWS account ID.' });
    return;
  }

  if (!isValidPrincipalArn(process.env.AWS_AUDIT_PRINCIPAL_ARN)) {
    res.status(503).json({ error: 'Set AWS_AUDIT_PRINCIPAL_ARN to a valid IAM role ARN before linking an AWS account.' });
    return;
  }

  const ownerSub = req.authSubject!;
  const existing = database.prepare(
    'SELECT id FROM aws_audit_accounts WHERE owner_sub = ? AND aws_account_id = ?',
  ).get(ownerSub, awsAccountId);
  if (existing) {
    res.status(409).json({ error: 'This AWS account is already linked to your user.' });
    return;
  }

  const account: AccountRow = {
    id: randomUUID(),
    owner_sub: ownerSub,
    aws_account_id: awsAccountId,
    role_arn: roleArn,
    region,
    external_id: randomBytes(32).toString('hex'),
    status: 'pending',
    created_at: new Date().toISOString(),
    last_verified_at: null,
  };
  database.prepare(`
    INSERT INTO aws_audit_accounts
      (id, owner_sub, aws_account_id, role_arn, region, external_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    account.id,
    account.owner_sub,
    account.aws_account_id,
    account.role_arn,
    account.region,
    account.external_id,
    account.status,
    account.created_at,
  );

  res.status(201).json({
    account: toPublicAccount(account),
    trustPolicy: makeTrustPolicy(account),
    externalId: account.external_id,
  });
});

app.post('/api/aws/accounts/:id/verify', authenticate, async (req, res) => {
  const account = getOwnedAccount(req.authSubject!, req.params.id);
  if (!account) {
    res.status(404).json({ error: 'AWS account link not found.' });
    return;
  }

  try {
    const findings = await listSecurityHubFindings(account);
    const verifiedAt = new Date().toISOString();
    database.prepare(`
      UPDATE aws_audit_accounts
      SET status = 'connected', last_verified_at = ?
      WHERE owner_sub = ? AND id = ?
    `).run(verifiedAt, req.authSubject!, account.id);
    res.json({
      account: toPublicAccount({ ...account, status: 'connected', last_verified_at: verifiedAt }),
      findings,
      returnedFindingCount: findings.length,
      maxFindings: 100,
    });
  } catch (error) {
    sendAwsError(res, 'verify account', error);
  }
});

app.get('/api/aws/accounts/:id/findings', authenticate, async (req, res) => {
  const account = getOwnedAccount(req.authSubject!, req.params.id);
  if (!account) {
    res.status(404).json({ error: 'AWS account link not found.' });
    return;
  }

  try {
    const findings = await listSecurityHubFindings(account);
    const verifiedAt = new Date().toISOString();
    database.prepare(`
      UPDATE aws_audit_accounts
      SET status = 'connected', last_verified_at = ?
      WHERE owner_sub = ? AND id = ?
    `).run(verifiedAt, req.authSubject!, account.id);
    res.json({ findings, returnedFindingCount: findings.length, maxFindings: 100, lastVerifiedAt: verifiedAt });
  } catch (error) {
    sendAwsError(res, 'list findings', error);
  }
});

app.delete('/api/aws/accounts/:id', authenticate, (req, res) => {
  const result = database.prepare(
    'DELETE FROM aws_audit_accounts WHERE owner_sub = ? AND id = ?',
  ).run(req.authSubject!, req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'AWS account link not found.' });
    return;
  }
  res.json({ removed: true });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'AWS audit endpoint not found.' });
});

app.use(express.static(resolve(process.cwd(), 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(resolve(process.cwd(), 'dist', 'index.html'));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const name = error instanceof Error ? error.name : 'UnknownError';
  const statusCode = (
    typeof error === 'object'
    && error !== null
    && 'status' in error
    && typeof error.status === 'number'
    && error.status >= 400
    && error.status < 500
  ) ? error.status : 500;
  console.error('Unhandled AWS audit API error', { errorName: name, statusCode });
  res.status(statusCode).json({
    error: statusCode < 500 ? 'Invalid API request body.' : 'An unexpected server error occurred.',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`NeuroTrace AWS audit API listening on port ${port}`);
});
