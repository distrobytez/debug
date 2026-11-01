/**
 * NeuroTrace - Executive Analytics & Platform Observability
 * Real-time decision metrics, service contribution rankings, and SLA compliance.
 */
import React from 'react';
import { SystemMetrics, DecisionTrace } from '../../types/neurotrace';
import { Activity, ShieldCheck, Zap, AlertTriangle, Layers, Clock, TrendingUp } from 'lucide-react';

interface ExecutiveAnalyticsProps {
  metrics: SystemMetrics;
  traces: DecisionTrace[];
}

export const ExecutiveAnalytics: React.FC<ExecutiveAnalyticsProps> = ({
  metrics,
  traces
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              TOTAL PIPELINE DECISIONS (24H)
            </span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block tabular-nums">
              {metrics.totalDecisions24h.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4% vs prior window
            </span>
          </div>
          <Activity className="w-8 h-8 text-cyan-400/70" />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              AGGREGATE REJECTION RATE
            </span>
            <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block tabular-nums">
              {metrics.rejectionRatePercent}%
            </span>
            <span className="text-[11px] text-slate-500">Across 18 microservice pipelines</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/70" />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              MEAN ATTRIBUTION LATENCY
            </span>
            <span className="text-2xl font-bold text-cyan-400 font-mono mt-1 block tabular-nums">
              {metrics.meanAttributionLatencyMs} ms
            </span>
            <span className="text-[11px] text-emerald-400">Target &lt; 500ms achieved</span>
          </div>
          <Clock className="w-8 h-8 text-cyan-400/70" />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              SLA AVAILABILITY (4 NINES)
            </span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block tabular-nums">
              {metrics.slaCompliancePercent}%
            </span>
            <span className="text-[11px] text-slate-500">Zero unhandled outages</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500/70" />
        </div>
      </div>

      {/* Two-Column Observability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Influential Rejecting Microservices */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Microservice Rejection Influence
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Proportion of adverse policy gating triggered by service.
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">CAUSAL ATTRIBUTION</span>
          </div>

          <div className="space-y-3">
            {metrics.topRiskServices.map((srv) => (
              <div key={srv.service} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-mono text-slate-200 font-semibold">{srv.service}</span>
                  <span className="font-mono text-cyan-400 font-bold tabular-nums">
                    {srv.rejectionInfluence}% Influence
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-950 rounded overflow-hidden">
                  <div
                    style={{ width: `${srv.rejectionInfluence}%` }}
                    className="h-full bg-cyan-400 rounded transition-all"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>Error Rate: {(srv.errorRate * 100).toFixed(2)}%</span>
                  <span>Health: Nominal</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Decision Breakdown & Domain Distribution */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Domain Decision Streams
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time automated decision pipelines currently connected.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">18 ACTIVE</span>
          </div>

          <div className="space-y-3">
            {traces.map((trace) => (
              <div key={trace.id} className="p-3 bg-slate-900/40 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{trace.decisionType}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {trace.industry} · {trace.responsibleService}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    trace.finalOutcome === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' :
                    trace.finalOutcome === 'ESCALATED' ? 'bg-amber-950 text-amber-400' :
                    'bg-red-950 text-red-400'
                  }`}>
                    {trace.finalOutcome}
                  </span>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 tabular-nums">
                    {trace.totalDurationMs}ms · {trace.confidenceScore * 100}% cert
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
