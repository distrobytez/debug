/**
 * NeuroTrace - JWT & Enterprise RBAC Inspector Modal
 * Displays real decoded JWT claims, digital signatures, and permission matrices.
 */
import React from 'react';
import { useAuth } from '../../services/authContext';
import { X, ShieldCheck, Key, Lock, Check } from 'lucide-react';

interface TokenInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenInspectorModal: React.FC<TokenInspectorModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, rawJwtToken, allRoles, switchRole } = useAuth();

  if (!isOpen) return null;

  const parts = rawJwtToken.split('.');
  let decodedHeader: any = {};
  let decodedPayload: any = {};

  try {
    decodedHeader = JSON.parse(atob(parts[0]));
    decodedPayload = JSON.parse(atob(parts[1]));
  } catch (e) {
    // ignore
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              JWT & RBAC Security Credential Inspector
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Active User Card */}
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                AUTHENTICATED PRINCIPAL
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">{currentUser.name}</h4>
              <p className="text-slate-400 font-mono text-[11px]">{currentUser.email}</p>
              <p className="text-slate-500 text-[11px] mt-1">{currentUser.title} · {currentUser.organization}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block mb-1">SWITCH ROLE</span>
              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-cyan-300 font-mono rounded px-2.5 py-1 text-xs cursor-pointer focus:outline-none"
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Decoded JWT Claims */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                JWT Header (JOSE)
              </span>
              <pre className="p-3 bg-slate-900/80 rounded border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
                {JSON.stringify(decodedHeader, null, 2)}
              </pre>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                JWT Payload (Claims & Scopes)
              </span>
              <pre className="p-3 bg-slate-900/80 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-56">
                {JSON.stringify(decodedPayload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Raw Encoded Token */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Raw Bearer Token (Base64URL)
            </span>
            <div className="p-2.5 bg-slate-900/40 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all select-all">
              {rawJwtToken}
            </div>
          </div>

          {/* Active Permissions List */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Effective Granted Permissions ({currentUser.permissions.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {currentUser.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
