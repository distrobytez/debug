/**
 * NeuroTrace - Cross-System Causal Explainability Platform
 * Main Application Root
 */
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/authContext';
import { INITIAL_TRACES, INITIAL_SYSTEM_METRICS } from './data/seedTraces';
import { DecisionTrace } from './types/neurotrace';
import { Header, ActiveTab } from './components/layout/Header';
import { TraceList } from './components/trace/TraceList';
import { CausalGraphViewer } from './components/trace/CausalGraphViewer';
import { TimelineViewer } from './components/trace/TimelineViewer';
import { FeatureAttributionView } from './components/trace/FeatureAttributionView';
import { ExplainabilityReport } from './components/trace/ExplainabilityReport';
import { AuditReplayStudio } from './components/replay/AuditReplayStudio';
import { ComplianceDashboard } from './components/compliance/ComplianceDashboard';
import { ExecutiveAnalytics } from './components/analytics/ExecutiveAnalytics';
import { TraceIngestionModal } from './components/simulator/TraceIngestionModal';
import { TokenInspectorModal } from './components/auth/TokenInspectorModal';
import { ArchitectureExplorerModal } from './components/docs/ArchitectureExplorerModal';
import { AWSAuditDashboard } from './components/aws/AWSAuditDashboard';
import {
  GitFork,
  Clock,
  Sparkles,
  Sliders,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hash,
  ExternalLink
} from 'lucide-react';

function NeuroTraceDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('TRACES');
  const [traces, setTraces] = useState<DecisionTrace[]>(INITIAL_TRACES);
  const [selectedTrace, setSelectedTrace] = useState<DecisionTrace>(INITIAL_TRACES[0]);
  const [metrics, setMetrics] = useState(INITIAL_SYSTEM_METRICS);

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isJwtModalOpen, setIsJwtModalOpen] = useState(false);
  const [isArchDocsOpen, setIsArchDocsOpen] = useState(false);

  // Trace ingestion handler
  const handleIngestNewTrace = (newTrace: DecisionTrace) => {
    setTraces((prev) => [newTrace, ...prev]);
    setSelectedTrace(newTrace);
    setActiveTab('CAUSAL_GRAPH'); // Navigate directly to visualize the reconstructed causal graph!
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Strict 3-zone Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenJwtModal={() => setIsJwtModalOpen(true)}
        onOpenArchDocs={() => setIsArchDocsOpen(true)}
      />

      {/* Breadcrumb Contextual Subheader */}
      <div className="bg-white border-b border-black/10 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-black/60 font-mono">SELECTED DECISION:</span>
          <span className="font-mono text-black font-bold">{selectedTrace.id}</span>
          <span className="text-black/40">/</span>
          <span className="text-black font-semibold truncate">{selectedTrace.decisionType}</span>
          <span className="text-black/40 hidden sm:inline">·</span>
          <span className="text-black/70 font-mono hidden sm:inline">{selectedTrace.entityId}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-black/70">OUTCOME:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              selectedTrace.finalOutcome === 'APPROVED' ? 'bg-black text-white border border-black' :
              selectedTrace.finalOutcome === 'ESCALATED' ? 'bg-neutral-900 text-white border border-neutral-900' :
              'bg-black text-white border border-black'
            }`}>
              {selectedTrace.finalOutcome}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-black/70 font-mono text-[11px]">
            <span>RISK: <strong className={selectedTrace.riskScore > 70 ? 'text-black' : 'text-black'}>{selectedTrace.riskScore}/100</strong></span>
            <span className="text-black/40">·</span>
            <span>LATENCY: <strong className="text-black">{selectedTrace.totalDurationMs}ms</strong></span>
            <span className="text-black/40">·</span>
            <span>CONFIDENCE: <strong className="text-black">{(selectedTrace.confidenceScore * 100).toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <main className="flex-1 p-6 max-w-[1720px] w-full mx-auto flex flex-col gap-6">
        {/* TAB 1: DECISIONS & TRACES OVERVIEW */}
        {activeTab === 'TRACES' && (
          <div className="flex flex-col gap-6">
            <TraceList
              traces={traces}
              selectedTrace={selectedTrace}
              onSelectTrace={setSelectedTrace}
            />

            {/* Quick Context Split Views */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-cyan-400" /> Causal Graph Preview
                  </span>
                  <button
                    onClick={() => setActiveTab('CAUSAL_GRAPH')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    Open Full DAG Canvas <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <CausalGraphViewer trace={selectedTrace} />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" /> OpenTelemetry Trace Waterfall
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedTrace.spans.length} Spans · {selectedTrace.totalDurationMs}ms
                  </span>
                </div>
                <TimelineViewer spans={selectedTrace.spans} totalDurationMs={selectedTrace.totalDurationMs} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAUSAL DAG GRAPH */}
        {activeTab === 'CAUSAL_GRAPH' && (
          <div className="flex flex-col gap-6">
            <CausalGraphViewer trace={selectedTrace} />
            <FeatureAttributionView
              features={selectedTrace.features}
              confidenceScore={selectedTrace.confidenceScore}
              finalOutcome={selectedTrace.finalOutcome}
            />
          </div>
        )}

        {/* TAB 3: AI EXPLAINABILITY & STATUTORY REPORT */}
        {activeTab === 'EXPLAINABILITY' && (
          <div className="flex flex-col gap-6">
            <ExplainabilityReport trace={selectedTrace} />
            <FeatureAttributionView
              features={selectedTrace.features}
              confidenceScore={selectedTrace.confidenceScore}
              finalOutcome={selectedTrace.finalOutcome}
            />
          </div>
        )}

        {/* TAB 4: AUDIT REPLAY STUDIO */}
        {activeTab === 'REPLAY_STUDIO' && (
          <AuditReplayStudio trace={selectedTrace} />
        )}

        {/* TAB 5: COMPLIANCE & STATUTORY DOSSIERS */}
        {activeTab === 'COMPLIANCE' && (
          <ComplianceDashboard
            traces={traces}
            selectedTrace={selectedTrace}
            onSelectTrace={setSelectedTrace}
          />
        )}

        {/* TAB 6: EXECUTIVE ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <ExecutiveAnalytics metrics={metrics} traces={traces} />
        )}

        {/* TAB 7: LIVE AWS SECURITY HUB AUDIT */}
        {activeTab === 'AWS_AUDIT' && (
          <AWSAuditDashboard />
        )}
      </main>

      {/* Modals */}
      <TraceIngestionModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onIngestTrace={handleIngestNewTrace}
      />

      <TokenInspectorModal
        isOpen={isJwtModalOpen}
        onClose={() => setIsJwtModalOpen(false)}
      />

      <ArchitectureExplorerModal
        isOpen={isArchDocsOpen}
        onClose={() => setIsArchDocsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NeuroTraceDashboard />
    </AuthProvider>
  );
}
