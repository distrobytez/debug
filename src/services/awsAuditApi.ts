export type AWSAccountStatus = 'pending' | 'connected';

export interface AWSAccountConnection {
  id: string;
  awsAccountId: string;
  roleArn: string;
  region: string;
  status: AWSAccountStatus;
  createdAt: string;
  lastVerifiedAt: string | null;
  externalId?: string;
  trustPolicy?: Record<string, unknown>;
}

export type AWSFindingSeverity =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFORMATIONAL'
  | 'UNSPECIFIED';

export interface AWSFinding {
  id: string;
  title: string;
  description: string;
  severity: AWSFindingSeverity;
  workflowStatus: string;
  resourceId: string;
  resourceType: string;
  updatedAt: string | null;
  region: string;
}

interface AccountListResponse {
  accounts: AWSAccountConnection[];
}

interface AccountCreateResponse {
  account: AWSAccountConnection;
  trustPolicy: Record<string, unknown>;
  externalId: string;
}

interface AuditResponse {
  account?: AWSAccountConnection;
  findings: AWSFinding[];
  returnedFindingCount: number;
  maxFindings: number;
  lastVerifiedAt?: string;
}

async function request<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  let payload: { error?: string } & Record<string, unknown>;
  try {
    payload = await response.json() as typeof payload;
  } catch {
    throw new Error(`AWS audit API returned an invalid response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(payload.error || `AWS audit API request failed (${response.status}).`);
  }
  return payload as T;
}

export const awsAuditApi = {
  listAccounts(token: string) {
    return request<AccountListResponse>(token, '/api/aws/accounts');
  },

  createAccount(
    token: string,
    input: { awsAccountId: string; roleArn: string; region: string },
  ) {
    return request<AccountCreateResponse>(token, '/api/aws/accounts', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  verifyAccount(token: string, accountId: string) {
    return request<AuditResponse>(token, `/api/aws/accounts/${encodeURIComponent(accountId)}/verify`, {
      method: 'POST',
    });
  },

  getFindings(token: string, accountId: string) {
    return request<AuditResponse>(
      token,
      `/api/aws/accounts/${encodeURIComponent(accountId)}/findings`,
    );
  },

  removeAccount(token: string, accountId: string) {
    return request<void>(token, `/api/aws/accounts/${encodeURIComponent(accountId)}`, {
      method: 'DELETE',
    });
  },
};
