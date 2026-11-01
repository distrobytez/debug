/**
 * NeuroTrace - Audit Replay Studio & Counterfactual Simulator
 * Allows auditors and developers to mutate historical decision parameters,
 * re-execute policy pipelines, and observe causal graph divergences in real time.
 */
import React, { useState } from 'react';
import { DecisionTrace, ReplayResult } from '../../types/neurotrace';
import { CausalEngine } from '../../services/causalEngine';
import {
  Play,
  RotateCcw,
  Sliders,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Layers
} from 'lucide-react';

interface AuditReplayStudioProps {
  trace: DecisionTrace;
}

export const AuditReplayStudio: React.FC<AuditReplayStudioProps> = ({ trace }) => {
  // Input parameters state for mutation
  const [params, setParams] = useState<Record<string, any>>(trace.inputParameters);
  const [replayResult, setReplayResult] = useState<ReplayResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleParamChange = (key: string, value: any) => {
    setParams((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRunReplay = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = CausalEngine.simulateReplay(trace, params);
      setReplayResult(result);
      setIsSimulating(false);
    }, 400);
  };

  const handleReset = () => {
    setParams(trace.inputParameters);
    setReplayResult(null);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col gap-6 p-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Counterfactual Replay & Policy Simulator
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate hypothetical scenarios: Mutate underlying input attributes to observe how downstream causal gates and outcomes transform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
          <button
            onClick={handleRunReplay}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating Pipeline...' : 'Execute Counterfactual Replay'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Mutation Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-900/40 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Decision Input Vector
            </span>
            <span className="text-[10px] font-mono text-cyan-400">{trace.decisionType}</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {Object.entries(params).map(([key, val]) => {
              const isNumeric = typeof val === 'number';

              return (
                <div key={key} className="p-2.5 bg-slate-950 rounded border border-slate-800/80 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-mono text-slate-300 text-[11px] truncate max-w-[200px]" title={key}>
                      {key}
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Orig: {String(trace.inputParameters[key])}
                    </span>
                  </div>

                  {isNumeric ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="any"
                        value={val}
                        onChange={(e) => handleParamChange(key, parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={String(val)}
                      onChange={(e) => handleParamChange(key, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Replay Comparison Outcome */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {replayResult ? (
            <div className="flex flex-col gap-4">
              {/* Outcome Diff Card */}
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GitCompare className="w-4 h-4 text-cyan-400" />
                    Causal Execution Comparison
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold ${
                    replayResult.outcomeFlipped ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {replayResult.outcomeFlipped ? 'OUTCOME FLIPPED' : 'OUTCOME UNCHANGED'}
                  </span>
                </div>

                {/* Outcome Transition Flow */}
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Original Outcome</span>
                    <span className={`text-sm font-bold font-mono px-3 py-1 rounded border ${
                      replayResult.previousOutcome === 'REJECTED' || replayResult.previousOutcome === 'BLOCKED' ? 'bg-red-950/60 border-red-800 text-red-400' :
                      replayResult.previousOutcome === 'APPROVED' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' :
                      'bg-amber-950/60 border-amber-800 text-amber-400'
                    }`}>
                      {replayResult.previousOutcome}
                    </span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0" />

                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Replay Outcome</span>
                    <span className={`text-sm font-bold font-mono px-3 py-1 rounded border ${
                      replayResult.newOutcome === 'REJECTED' || replayResult.newOutcome === 'BLOCKED' ? 'bg-red-950/60 border-red-800 text-red-400' :
                      replayResult.newOutcome === 'APPROVED' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' :
                      'bg-amber-950/60 border-amber-800 text-amber-400'
                    }`}>
                      {replayResult.newOutcome}
                    </span>
                  </div>
                </div>

                {/* Metrics Delta Grid */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Confidence Delta</span>
                    <span className={`text-sm font-mono font-semibold tabular-nums mt-1 block ${
                      replayResult.confidenceDelta >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {replayResult.confidenceDelta >= 0 ? '+' : ''}{(replayResult.confidenceDelta * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {(replayResult.previousConfidence * 100).toFixed(1)}% → {(replayResult.newConfidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Risk Score Delta</span>
                    <span className="text-sm font-mono font-semibold text-cyan-400 tabular-nums mt-1 block">
                      {replayResult.previousRiskScore.toFixed(1)} → {replayResult.newRiskScore.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Max Index: 100</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Simulated Latency</span>
                    <span className="text-sm font-mono font-semibold text-slate-200 tabular-nums mt-1 block">
                      {replayResult.simulatedDurationMs} ms
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Sub-second execution</span>
                  </div>
                </div>

                {/* Causal Divergence Narrative */}
                <div className="p-3.5 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-cyan-400 block mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Causal Graph Divergence Analysis
                  </span>
                  <p className="leading-relaxed">{replayResult.causalDivergenceSummary}</p>
                </div>

                {/* Diverged Microservice Nodes */}
                {replayResult.pathDivergenceNodes.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                      Diverged DAG Nodes (Modified Causal State)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {replayResult.pathDivergenceNodes.map((nodeId) => (
                        <span
                          key={nodeId}
                          className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono text-xs"
                        >
                          {nodeId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] flex flex-col items-center justify-center p-8 bg-slate-900/20 border border-slate-800 rounded-lg text-center">
              <Play className="w-8 h-8 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300 mb-1">
                Awaiting Counterfactual Execution
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Adjust input parameters on the left (e.g. increase DSCR, decrease credit inquiries) and click 'Execute Counterfactual Replay' to simulate how policies react.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
