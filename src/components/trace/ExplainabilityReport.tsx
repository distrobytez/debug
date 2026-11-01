/**
 * NeuroTrace - Natural Language Causal Explainability Dossier
 * Bridges technical microservice traces and executive/statutory compliance reports.
 */
import React, { useState, useEffect } from 'react';
import { DecisionTrace } from '../../types/neurotrace';
import { ExplainabilityService, GeneratedAuditExplanation } from '../../services/explainabilityService';
import { PdfExportService } from '../../services/pdfExportService';
import { useAuth } from '../../services/authContext';
import {
  FileText,
  Download,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

interface ExplainabilityReportProps {
  trace: DecisionTrace;
}

export const ExplainabilityReport: React.FC<ExplainabilityReportProps> = ({ trace }) => {
  const { currentUser, hasPermission } = useAuth();
  const [explanation, setExplanation] = useState<GeneratedAuditExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  // Initial load
  useEffect(() => {
    loadExplanation();
  }, [trace.id]);

  const loadExplanation = async (question?: string) => {
    setLoading(true);
    try {
      const result = await ExplainabilityService.generateDeepExplanation(trace, question);
      setExplanation(result);
    } catch (e) {
      console.error(e);
      setExplanation(ExplainabilityService.generateDeterministicAudit(trace, question));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!explanation) return;
    PdfExportService.exportAuditReport(trace, explanation, `${currentUser.name} (${currentUser.title})`);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    loadExplanation(customQuestion.trim());
  };

  if (!explanation && loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-950 border border-slate-800 rounded-xl">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-3" />
        <span className="text-sm">Synthesizing cross-system causal explainability dossier...</span>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col gap-6 p-6">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            Statutory Causal Explainability Dossier
          </span>
          <h2 className="text-base font-bold text-white mt-1">
            {explanation.headline}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadExplanation()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download PDF Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* Interactive Auditor Prompt Input */}
      <form onSubmit={handleCustomQuestionSubmit} className="flex gap-2">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Ask a specific auditor question (e.g. 'Did DTI violate state threshold? What was the ML model version?')"
          className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={loading || !customQuestion.trim()}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-medium text-slate-200 rounded-lg transition-colors"
        >
          Synthesize Analysis
        </button>
      </form>

      {/* Two-Column Structured Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Executive Summary */}
        <div className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-lg flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Executive Causal Narrative
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation.executiveSummary}
          </p>
        </div>

        {/* Technical Root Cause */}
        <div className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-lg flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Microservice & Policy Root Cause
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {explanation.technicalRootCause}
          </p>
        </div>
      </div>

      {/* Statutory Adverse Action Section */}
      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-lg flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Regulatory Notice
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Mandated under ECOA 12 CFR § 1002.9 / EU AI Act Art. 13
          </span>
        </div>
        <div className="p-3 bg-slate-950 rounded border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
          {explanation.adverseActionNotice}
        </div>
      </div>

      {/* Recommendations & Audit Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-cyan-400" /> Remediation Path for Decision Flipping
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {explanation.mitigationRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audit Verification */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Immutable Audit Attestation
          </span>
          <p className="text-xs text-slate-400 leading-relaxed">
            {explanation.regulatoryAuditNotes}
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
            <span>Sign-Off: {currentUser.name}</span>
            <span>Role: {currentUser.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
