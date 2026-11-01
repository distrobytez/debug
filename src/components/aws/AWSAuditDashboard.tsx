import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CircleHelp,
  Cloud,
  Copy,
  ExternalLink,
  LoaderCircle,
  LockKeyhole,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../services/authContext';
import {
  awsAuditApi,
  AWSAccountConnection,
  AWSFinding,
  AWSFindingSeverity,
} from '../../services/awsAuditApi';

const severityOrder: AWSFindingSeverity[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
  'INFORMATIONAL',
  'UNSPECIFIED',
];

function formatDate(value: string | null | undefined) {
  if (!value) return 'Never';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
}

function severityClass(severity: AWSFindingSeverity) {
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    return 'border-red-300 bg-red-50 text-red-800';
  }
  if (severity === 'MEDIUM') {
    return 'border-amber-300 bg-amber-50 text-amber-800';
  }
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

export const AWSAuditDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<AWSAccountConnection[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [findings, setFindings] = useState<AWSFinding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [awsAccountId, setAwsAccountId] = useState('');
  const [roleArn, setRoleArn] = useState('');
  const [region, setRegion] = useState('us-east-1');

  const loadAccounts = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await awsAuditApi.listAccounts(currentUser.token);
      setAccounts(response.accounts);
      setSelectedAccountId((current) => (
        response.accounts.some((account) => account.id === current)
          ? current
          : response.accounts[0]?.id || ''
      ));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load linked AWS accounts.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.token]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const sortedFindings = useMemo(() => [...findings].sort((left, right) => (
    severityOrder.indexOf(left.severity) - severityOrder.indexOf(right.severity)
  )), [findings]);
  const findingCounts = useMemo(() => ({
    critical: findings.filter((finding) => finding.severity === 'CRITICAL').length,
    high: findings.filter((finding) => finding.severity === 'HIGH').length,
    total: findings.length,
  }), [findings]);

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);
    try {
      const response = await awsAuditApi.createAccount(currentUser.token, {
        awsAccountId: awsAccountId.trim(),
        roleArn: roleArn.trim(),
        region,
      });
      const account = {
        ...response.account,
        externalId: response.externalId,
        trustPolicy: response.trustPolicy,
      };
      setAccounts((current) => [account, ...current]);
      setSelectedAccountId(account.id);
      setFindings([]);
      setAwsAccountId('');
      setRoleArn('');
      setShowConnectForm(false);
      setNotice('Account link created. Apply the trust policy and Security Hub read permission, then verify the connection.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create the AWS account link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshFindings = async (verify = false) => {
    if (!selectedAccount) return;
    setError('');
    setNotice('');
    setIsRefreshing(true);
    try {
      const result = verify
        ? await awsAuditApi.verifyAccount(currentUser.token, selectedAccount.id)
        : await awsAuditApi.getFindings(currentUser.token, selectedAccount.id);
      setFindings(result.findings);
      if (result.account) {
        setAccounts((current) => current.map((account) => (
          account.id === result.account?.id ? { ...account, ...result.account } : account
        )));
      } else {
        setAccounts((current) => current.map((account) => (
          account.id === selectedAccount.id
            ? { ...account, status: 'connected', lastVerifiedAt: result.lastVerifiedAt || new Date().toISOString() }
            : account
        )));
      }
      setNotice(`Loaded ${result.returnedFindingCount} active Security Hub finding${result.returnedFindingCount === 1 ? '' : 's'}${result.returnedFindingCount === result.maxFindings ? ' (latest 100)' : ''}.`);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to load AWS Security Hub findings.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemoveAccount = async (account: AWSAccountConnection) => {
    if (!window.confirm(`Remove AWS account ${account.awsAccountId} from NeuroTrace? You must also remove the NeuroTrace principal from the IAM role trust policy in AWS to revoke access.`)) {
      return;
    }
    setError('');
    setNotice('');
    try {
      await awsAuditApi.removeAccount(currentUser.token, account.id);
      setAccounts((current) => current.filter((entry) => entry.id !== account.id));
      setFindings([]);
      setSelectedAccountId((current) => current === account.id
        ? accounts.find((entry) => entry.id !== account.id)?.id || ''
        : current);
      setNotice(`AWS account ${account.awsAccountId} was removed from NeuroTrace. Remove its IAM role trust in AWS to revoke access.`);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove the AWS account link.');
    }
  };

  const copyTrustPolicy = async () => {
    if (!selectedAccount?.trustPolicy) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedAccount.trustPolicy, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not access the clipboard. Select and copy the trust policy manually.');
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            <h1 className="text-xl font-bold">AWS Security Hub audit</h1>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Link AWS accounts with a read-only IAM role. NeuroTrace uses short-lived STS credentials to read active Security Hub findings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowConnectForm((value) => !value);
            setError('');
            setNotice('');
          }}
          className="inline-flex items-center gap-2 rounded-md border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Link AWS account
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Linked accounts</p>
          <p className="mt-2 text-2xl font-bold">{accounts.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Critical findings</p>
          <p className="mt-2 text-2xl font-bold">{findingCounts.critical}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">High findings</p>
          <p className="mt-2 text-2xl font-bold">{findingCounts.high}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Credentials stay server-side.</strong> The account role needs{' '}
          <code className="rounded bg-white px-1 py-0.5">AWSSecurityHubReadOnlyAccess</code>.
          NeuroTrace never asks for AWS access keys or stores assumed-role credentials.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Authentication setup required.</strong> This project currently uses simulated demo profiles.
          Live account operations require a real OIDC access token verified by the server; the demo role selector
          cannot authorize AWS access.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {showConnectForm && (
        <form onSubmit={handleCreateAccount} className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-base font-bold">Link an AWS account</h2>
          <p className="mt-1 text-sm text-slate-600">
            Add the account and role that your AWS administrator will configure for this connection.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              AWS account ID
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{12}"
                maxLength={12}
                value={awsAccountId}
                onChange={(event) => setAwsAccountId(event.target.value)}
                placeholder="123456789012"
                className="rounded-md border border-slate-300 px-3 py-2 font-mono"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              IAM role ARN
              <input
                required
                value={roleArn}
                onChange={(event) => setRoleArn(event.target.value)}
                placeholder="arn:aws:iam::123456789012:role/NeuroTraceSecurityAudit"
                className="rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Security Hub region
              <input
                required
                pattern="[a-z]{2}(-[a-z0-9]+)+-[0-9]"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                placeholder="eu-west-1"
                className="rounded-md border border-slate-300 px-3 py-2 font-mono"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setShowConnectForm(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create secure link
            </button>
          </div>
        </form>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-bold">Your AWS accounts</h2>
            <button
              type="button"
              onClick={() => void loadAccounts()}
              aria-label="Refresh linked accounts"
              className="rounded p-1.5 hover:bg-slate-100"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 p-4 text-sm text-slate-600">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading linked accounts
            </div>
          ) : accounts.length === 0 ? (
            <div className="p-4 text-sm text-slate-600">
              No AWS accounts linked yet. Link an account to begin a Security Hub audit.
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {accounts.map((account) => (
                <li key={account.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccountId(account.id);
                      setFindings([]);
                      setError('');
                      setNotice('');
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${selectedAccountId === account.id ? 'bg-slate-50' : ''}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-semibold">{account.awsAccountId}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${account.status === 'connected' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
                        {account.status}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{account.region} · {account.roleArn}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          {!selectedAccount ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-6 text-center">
              <Cloud className="h-8 w-8 text-slate-400" />
              <p className="mt-3 font-semibold">Connect an AWS account to start auditing</p>
              <p className="mt-1 text-sm text-slate-500">Findings will appear here after role access is verified.</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <h2 className="font-bold">Account {selectedAccount.awsAccountId}</h2>
                    </div>
                    <p className="mt-1 break-all font-mono text-xs text-slate-600">{selectedAccount.roleArn}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedAccount.region} · Last verified {formatDate(selectedAccount.lastVerifiedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void refreshFindings(selectedAccount.status !== 'connected')}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {isRefreshing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      {selectedAccount.status === 'connected' ? 'Refresh findings' : 'Verify & audit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRemoveAccount(selectedAccount)}
                      title="Remove account link"
                      aria-label="Remove account link"
                      className="rounded-md border border-slate-300 p-2 hover:bg-slate-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {selectedAccount.status === 'pending' && selectedAccount.trustPolicy && (
                  <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-2">
                      <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold">Finish setup in AWS</h3>
                        <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-700">
                          <li>In IAM, create or update the linked role. Add the statement below to its trust relationship; preserve other statements.</li>
                          <li>Attach the AWS-managed <code>AWSSecurityHubReadOnlyAccess</code> policy to that role.</li>
                          <li>Enable Security Hub in {selectedAccount.region}, then choose Verify &amp; audit.</li>
                        </ol>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold">Role trust policy to add</span>
                          <button
                            type="button"
                            onClick={() => void copyTrustPolicy()}
                            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs"
                          >
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="mt-2 max-h-56 overflow-auto rounded border border-slate-200 bg-white p-3 text-[11px] leading-relaxed">
                          {JSON.stringify(selectedAccount.trustPolicy, null, 2)}
                        </pre>
                        <a
                          href="https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-enable.html"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs underline"
                        >
                          AWS Security Hub setup guide <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold">Active Security Hub findings</h2>
                    <p className="mt-0.5 text-xs text-slate-500">Most recently updated findings · maximum 100 per refresh</p>
                  </div>
                  <span className="text-xs text-slate-500">{findingCounts.total} findings</span>
                </div>
                {findings.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    {selectedAccount.status === 'connected'
                      ? 'No findings loaded. Refresh findings to check this account.'
                      : 'Verify account access to retrieve Security Hub findings.'}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {sortedFindings.map((finding) => (
                      <article key={finding.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-semibold">{finding.title}</h3>
                            <p className="mt-1 break-words text-xs text-slate-600">{finding.description || 'No description provided.'}</p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${severityClass(finding.severity)}`}>
                            {finding.severity}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                          <span>{finding.resourceType}</span>
                          <span className="max-w-full break-all font-mono">{finding.resourceId}</span>
                          <span>{finding.region}</span>
                          <span>{finding.workflowStatus}</span>
                          <span>{formatDate(finding.updatedAt)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {findings.length > 0 && (
                  <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                    Severity categories: {severityOrder.filter((severity) => findings.some((finding) => finding.severity === severity)).join(', ')}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
