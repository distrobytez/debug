/**
 * NeuroTrace - Top Bar
 * Conforms to the Top Bar Contract (Section 2):
 * Zone 1: Single-element brand wordmark
 * Zone 2: Clean single-line text navigation links
 * Zone 3: 1-2 primary actions (Active Role + New Trace Trigger)
 */
import React from 'react';
import { useAuth } from '../../services/authContext';
import { UserRole } from '../../types/neurotrace';
import { Cloud, ShieldCheck, Plus, Terminal } from 'lucide-react';

export type ActiveTab =
  | 'TRACES'
  | 'CAUSAL_GRAPH'
  | 'EXPLAINABILITY'
  | 'REPLAY_STUDIO'
  | 'COMPLIANCE'
  | 'ANALYTICS'
  | 'AWS_AUDIT'
  | 'ARCHITECTURE';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSimulator: () => void;
  onOpenJwtModal: () => void;
  onOpenArchDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSimulator,
  onOpenJwtModal,
  onOpenArchDocs
}) => {
  const { currentUser, allRoles, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('TRACES')}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          NeuroTrace
        </button>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex max-w-[72vw] items-center gap-5 overflow-x-auto text-sm font-medium">
        <button
          onClick={() => onSelectTab('TRACES')}
          className={`whitespace-nowrap transition-colors py-1 ${
            activeTab === 'TRACES'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Decisions & Traces
        </button>

        <button
          onClick={() => onSelectTab('CAUSAL_GRAPH')}
          className={`whitespace-nowrap transition-colors py-1 ${
            activeTab === 'CAUSAL_GRAPH'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Causal DAG Graph
        </button>

        <button
          onClick={() => onSelectTab('EXPLAINABILITY')}
          className={`whitespace-nowrap transition-colors py-1 ${
            activeTab === 'EXPLAINABILITY'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Explainability
        </button>

        <button
          onClick={() => onSelectTab('REPLAY_STUDIO')}
          className={`whitespace-nowrap transition-colors py-1 ${
            activeTab === 'REPLAY_STUDIO'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit Replay
        </button>

        <button
          onClick={() => onSelectTab('COMPLIANCE')}
          className={`whitespace-nowrap transition-colors py-1 ${
            activeTab === 'COMPLIANCE'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Compliance & Dossiers
        </button>

        <button
          onClick={() => onSelectTab('ANALYTICS')}
          className={`whitespace-nowrap transition-colors py-1 ${
            activeTab === 'ANALYTICS'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Executive Analytics
        </button>

        <button
          onClick={() => onSelectTab('AWS_AUDIT')}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
            activeTab === 'AWS_AUDIT'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cloud className="h-3.5 w-3.5" />
          AWS Audit
        </button>

        <button
          onClick={onOpenArchDocs}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 py-1 px-2.5 rounded bg-slate-900 border border-slate-800 transition-colors"
          title="View Complete Phase 1-10 Enterprise System Architecture & Specs"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Architecture Docs</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('AWS_AUDIT')}
          aria-label="Open AWS Audit"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-2.5 py-2 text-xs text-slate-300 hover:text-white md:hidden"
        >
          <Cloud className="h-4 w-4" />
          <span>AWS Audit</span>
        </button>

        {/* Role Switcher & Token Trigger */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <button
            onClick={onOpenJwtModal}
            title="Inspect Active JWT & RBAC Claims"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">ROLE:</span>
          </button>
          <select
            value={currentUser.role}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {allRoles.map((role) => (
              <option key={role} value={role} className="bg-slate-900 text-slate-200">
                {role.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Simulate / Ingest Button */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ingest Trace</span>
        </button>
      </div>
    </header>
  );
};
