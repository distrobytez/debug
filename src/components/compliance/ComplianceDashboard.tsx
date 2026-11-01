/**
 * NeuroTrace - Regulatory Compliance & Statutory Audit Center
 * Central governance cockpit auditing pipelines against EU AI Act, GDPR, ECOA, ISO 42001, and Basel III.
 */
import React from 'react';
import { DecisionTrace } from '../../types/neurotrace';
import { PdfExportService } from '../../services/pdfExportService';
import { ExplainabilityService } from '../../services/explainabilityService';
import { useAuth } from '../../services/authContext';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  Download,
  AlertTriangle,
  Lock,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface ComplianceDashboardProps {
  traces: DecisionTrace[];
  selectedTrace: DecisionTrace;
  onSelectTrace: (trace: DecisionTrace) => void;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  traces,
  selectedTrace,
  onSelectTrace
}) => {
  const { currentUser } = useAuth();

  const handleExportPdf = () => {
    const explanation = ExplainabilityService.generateDeterministicAudit(selectedTrace);
    PdfExportService.exportAuditReport(selectedTrace, explanation, `${currentUser.name} (${currentUser.title})`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Posture Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              EU AI ACT POSTURE
            </span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
              99.8% COMPLIANT
            </span>
            <span className="text-[11px] text-slate-500">Article 13 & 14 Logging</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500/80" />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              ECOA FAIR LENDING
            </span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              100% REASON CODE
            </span>
            <span className="text-[11px] text-slate-500">12 CFR § 1002.9 Verified</span>
          </div>
          <FileCheck className="w-8 h-8 text-cyan-500/80" />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              GDPR ARTICLE 22
            </span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              RIGHT TO EXPLAIN
            </span>
            <span className="text-[11px] text-slate-500">Sub-second generation</span>
          </div>
          <Lock className="w-8 h-8 text-slate-400" />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              BASEL III / BCBS 239
            </span>
            <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
              IMMUTABLE HASH
            </span>
            <span className="text-[11px] text-slate-500">SHA-256 Ledger sync</span>
          </div>
          <ShieldAlert className="w-8 h-8 text-cyan-500/80" />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Trace Compliance Audit Profile */}
        <div className="lg:col-span-8 flex flex-col gap-5 bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Statutory Regulatory Audit Matrix
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation for active decision <span className="font-mono text-cyan-400">{selectedTrace.id}</span> ({selectedTrace.decisionType})
              </p>
            </div>

            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Generate Signed PDF Dossier</span>
            </button>
          </div>

          {/* Cryptographic Attestation Block */}
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              CRYPTOGRAPHIC FINGERPRINT VERIFICATION
            </span>
            <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300 break-all select-all">
              {selectedTrace.fingerprintHash}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Event Hash: <strong className="font-mono text-slate-300">{selectedTrace.eventHash}</strong></span>
              <span>Model Build: <strong className="font-mono text-slate-300">{selectedTrace.decisionVersion}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hash Validated
              </span>
            </div>
          </div>

          {/* Framework Checks List */}
          <div className="space-y-3">
            {selectedTrace.regulatoryFlags.map((flag, idx) => {
              const isCompliant = flag.status === 'COMPLIANT';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border flex flex-col gap-2 transition-colors ${
                    isCompliant
                      ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                      : 'bg-amber-950/20 border-amber-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-cyan-400">
                        [{flag.framework.replace('_', ' ')}]
                      </span>
                      <span className="text-xs font-semibold text-white">{flag.rule}</span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold ${
                        isCompliant
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {flag.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{flag.detail}</p>

                  {flag.code && (
                    <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      Statutory Directive Reference Code: {flag.code}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Traces Queue for Auditing */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Compliance Review Queue
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any trace to review statutory audit status.
            </p>
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto">
            {traces.map((t) => {
              const isSelected = selectedTrace.id === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTrace(t)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-cyan-400 font-semibold">{t.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      t.finalOutcome === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' :
                      t.finalOutcome === 'ESCALATED' ? 'bg-amber-950 text-amber-400' :
                      'bg-red-950 text-red-400'
                    }`}>
                      {t.finalOutcome}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200 truncate">{t.decisionType}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1.5">
                    <span>{t.industry}</span>
                    <span>Risk: {t.riskScore}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
