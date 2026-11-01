/**
 * NeuroTrace - OpenTelemetry Distributed Timeline Waterfall
 * Reconstructs the exact execution timeline with sub-millisecond spans,
 * parent-child hierarchy, and microservice call latencies.
 */
import React, { useState } from 'react';
import { Span } from '../../types/neurotrace';
import { Clock, Layers, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface TimelineViewerProps {
  spans: Span[];
  totalDurationMs: number;
}

export const TimelineViewer: React.FC<TimelineViewerProps> = ({
  spans,
  totalDurationMs
}) => {
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(spans[0] || null);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-white">
            Distributed Execution Waterfall
          </span>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-xs font-mono text-cyan-400 tabular-nums">
            Total Trace Time: {totalDurationMs} ms
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {spans.length} OpenTelemetry Spans
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[460px]">
        {/* Waterfall Table & Timeline Bars */}
        <div className="flex-1 overflow-x-auto p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Time axis ruler */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-3 px-2 border-b border-slate-800 pb-1 tabular-nums">
            <span>0 ms</span>
            <span>{Math.round(totalDurationMs * 0.25)} ms</span>
            <span>{Math.round(totalDurationMs * 0.5)} ms</span>
            <span>{Math.round(totalDurationMs * 0.75)} ms</span>
            <span>{totalDurationMs} ms</span>
          </div>

          <div className="space-y-1.5">
            {spans.map((span) => {
              const isSelected = selectedSpan?.id === span.id;
              const leftPercent = Math.min(95, (span.startTimeOffsetMs / (totalDurationMs || 1)) * 100);
              const widthPercent = Math.max(3, (span.durationMs / (totalDurationMs || 1)) * 100);

              let barBg = 'bg-cyan-500/80';
              if (span.status === 'ERROR') barBg = 'bg-red-500';
              if (span.status === 'WARN') barBg = 'bg-amber-500';

              return (
                <div
                  key={span.id}
                  onClick={() => setSelectedSpan(span)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected ? 'bg-slate-900 border border-cyan-500/40' : 'hover:bg-slate-900/60'
                  }`}
                >
                  {/* Service & Span Name */}
                  <div className="w-64 shrink-0 flex items-center gap-2 overflow-hidden">
                    {span.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {span.status === 'WARN' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {span.status === 'ERROR' && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{span.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">{span.service}</div>
                    </div>
                  </div>

                  {/* Protocol & HTTP Code */}
                  <div className="w-24 shrink-0 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {span.protocol}
                    </span>
                    <span className={span.httpStatus >= 400 ? 'text-red-400 font-semibold' : 'text-slate-400'}>
                      {span.httpStatus}
                    </span>
                  </div>

                  {/* Gantt Bar Lane */}
                  <div className="flex-1 relative h-6 bg-slate-900/80 rounded overflow-hidden">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-10">
                      <div className="border-r border-slate-500" />
                      <div className="border-r border-slate-500" />
                      <div className="border-r border-slate-500" />
                    </div>

                    {/* Span Bar */}
                    <div
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.min(100 - leftPercent, widthPercent)}%`
                      }}
                      className={`absolute top-1 bottom-1 rounded transition-all flex items-center px-1.5 ${barBg}`}
                    >
                      <span className="text-[9px] font-mono text-slate-950 font-bold tabular-nums truncate">
                        {span.durationMs}ms
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Span Detail Panel */}
        <div className="w-full lg:w-80 p-4 bg-slate-900/30 flex flex-col gap-3">
          <div className="pb-2 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              OTEL SPAN DETAILS
            </span>
            <h4 className="text-sm font-semibold text-white mt-0.5 truncate">
              {selectedSpan?.name}
            </h4>
            <span className="text-xs font-mono text-slate-400">{selectedSpan?.service}</span>
          </div>

          {selectedSpan && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400">Duration</span>
                  <span className="font-mono font-semibold text-white block mt-0.5 tabular-nums">
                    {selectedSpan.durationMs} ms
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400">Start Offset</span>
                  <span className="font-mono font-semibold text-white block mt-0.5 tabular-nums">
                    +{selectedSpan.startTimeOffsetMs} ms
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  OpenTelemetry Attributes
                </span>
                <pre className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-auto">
                  {JSON.stringify(selectedSpan.attributes, null, 2)}
                </pre>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="text-slate-500 font-mono">Trace ID: </span>
                <span className="font-mono text-slate-300 truncate block">{selectedSpan.traceId}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
