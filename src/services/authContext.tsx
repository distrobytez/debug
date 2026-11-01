/**
 * NeuroTrace - Enterprise Authentication & Multi-Role Authorization (RBAC)
 */
import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserRole, UserSession } from '../types/neurotrace';

interface AuthContextType {
  currentUser: UserSession;
  allRoles: UserRole[];
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  rawJwtToken: string;
}

const ROLE_PROFILES: Record<UserRole, Omit<UserSession, 'token'>> = {
  ADMIN: {
    id: 'usr_sec_admin_01',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.bank.com',
    role: 'ADMIN',
    title: 'Principal Security & Platform Architect',
    organization: 'Global Risk & Identity Infrastructure',
    permissions: [
      'trace:read',
      'trace:replay',
      'trace:ingest',
      'trace:delete',
      'audit:sign_off',
      'policy:mutate',
      'system:configure',
      'report:export_pdf',
      'keys:manage'
    ],
    issuedAt: '2026-10-06T18:00:00Z',
    expiresAt: '2026-10-07T18:00:00Z'
  },
  DEVELOPER: {
    id: 'usr_dev_lead_02',
    name: 'Marcus Vance',
    email: 'm.vance@neurotrace.internal',
    role: 'DEVELOPER',
    title: 'Lead Microservice & OTel Engineer',
    organization: 'Decision Engine Distributed Systems',
    permissions: [
      'trace:read',
      'trace:replay',
      'trace:ingest',
      'system:configure'
    ],
    issuedAt: '2026-10-06T19:30:00Z',
    expiresAt: '2026-10-07T07:30:00Z'
  },
  AUDITOR: {
    id: 'usr_audit_lead_03',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@kpmg-audit.external',
    role: 'AUDITOR',
    title: 'Independent Senior AI Systems Auditor',
    organization: 'Financial & Algorithm Assurance Practice',
    permissions: [
      'trace:read',
      'trace:replay',
      'audit:sign_off',
      'report:export_pdf'
    ],
    issuedAt: '2026-10-06T20:00:00Z',
    expiresAt: '2026-10-07T04:00:00Z'
  },
  COMPLIANCE_OFFICER: {
    id: 'usr_compliance_04',
    name: 'Sophia Chen, Esq.',
    email: 'sophia.chen@legal.enterprise.com',
    role: 'COMPLIANCE_OFFICER',
    title: 'VP of Algorithmic Regulatory Compliance',
    organization: 'Corporate Legal & Fair Lending Oversight',
    permissions: [
      'trace:read',
      'audit:sign_off',
      'report:export_pdf'
    ],
    issuedAt: '2026-10-06T17:15:00Z',
    expiresAt: '2026-10-07T05:15:00Z'
  },
  MANAGER: {
    id: 'usr_mgr_05',
    name: 'David Sterling',
    email: 'd.sterling@operations.enterprise.com',
    role: 'MANAGER',
    title: 'Director of Underwriting & Automated Operations',
    organization: 'Consumer Credit & Risk Operations',
    permissions: [
      'trace:read',
      'report:export_pdf'
    ],
    issuedAt: '2026-10-06T16:00:00Z',
    expiresAt: '2026-10-07T04:00:00Z'
  },
  EXECUTIVE: {
    id: 'usr_exec_06',
    name: 'Catherine Morales',
    email: 'catherine.morales@c-suite.enterprise.com',
    role: 'EXECUTIVE',
    title: 'Chief Risk Officer (CRO)',
    organization: 'Executive Committee',
    permissions: [
      'trace:read',
      'report:export_pdf'
    ],
    issuedAt: '2026-10-06T15:00:00Z',
    expiresAt: '2026-10-07T03:00:00Z'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('DEVELOPER');

  const profile = ROLE_PROFILES[selectedRole];

  // Synthesize realistic signed JWT
  const rawJwtToken = useMemo(() => {
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'nt-prod-2026-k1' }));
    const payload = btoa(JSON.stringify({
      sub: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      title: profile.title,
      org: profile.organization,
      permissions: profile.permissions,
      iss: 'https://auth.neurotrace.internal/oauth2/token',
      aud: 'https://api.neurotrace.internal',
      iat: Math.floor(new Date(profile.issuedAt).getTime() / 1000),
      exp: Math.floor(new Date(profile.expiresAt).getTime() / 1000)
    }));
    const signature = 'dGVzdF9zaWduYXR1cmVfaGV4Xzk5ODFhY2RmZTcxMGJjODRhY2RiMTk5';
    return `${header}.${payload}.${signature}`;
  }, [profile]);

  const currentUser: UserSession = {
    ...profile,
    token: rawJwtToken
  };

  const hasPermission = (permission: string) => {
    return profile.permissions.includes(permission);
  };

  const allRoles: UserRole[] = [
    'ADMIN',
    'DEVELOPER',
    'AUDITOR',
    'COMPLIANCE_OFFICER',
    'MANAGER',
    'EXECUTIVE'
  ];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allRoles,
        switchRole: setSelectedRole,
        hasPermission,
        rawJwtToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
