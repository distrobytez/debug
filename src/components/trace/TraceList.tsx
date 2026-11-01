/**
 * NeuroTrace - Decision Traces High-Density Explorer
 * Follows SaaS Dashboard design guidelines: high-density table, tabular numerals,
 * zero-pill metadata discipline, and active search/filtering.
 */
import React, { useState, useMemo } from 'react';
import { DecisionTrace, DecisionOutcome, IndustryDomain } from '../../types/neurotrace';
import { Search, Filter, ArrowUpDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface TraceListProps {
  traces: DecisionTrace[];
  selectedTrace: DecisionTrace;
  onSelectTrace: (trace: DecisionTrace) => void;
}

export const TraceList: React.FC<TraceListProps> = ({
  traces,
  selectedTrace,
  onSelectTrace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<string>('ALL');
  const [filterIndustry, setFilterIndustry] = useState<string>('ALL');

  const filteredTraces = useMemo(() => {
    return traces.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.decisionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.responsibleService.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOutcome = filterOutcome === 'ALL' || t.finalOutcome === filterOutcome;
      const matchesIndustry = filterIndustry === 'ALL' || t.industry === filterIndustry;

      return matchesSearch && matchesOutcome && matchesIndustry;
    });
  }, [traces, searchQuery, filterOutcome, filterIndustry]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Search & Filter Header Bar */}
      <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trace ID, entity, decision, or service..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <span className="px-2 text-slate-500 text-[11px] font-mono">STATUS:</span>
            {['ALL', 'APPROVED', 'REJECTED', 'ESCALATED', 'BLOCKED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterOutcome(status)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                  filterOutcome === status
                    ? 'bg-slate-800 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Industries</option>
            <option value="FINTECH_BANKING">Banking & FinTech</option>
            <option value="HEALTHCARE">Healthcare & ICU</option>
            <option value="CYBERSECURITY">Cybersecurity & IAM</option>
            <option value="INSURANCE">Insurance Casualty</option>
            <option value="ECOMMERCE">E-Commerce & Retail</option>
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30 text-[11px] text-slate-400 font-medium">
              <th className="py-2.5 px-4">DECISION & ID</th>
              <th className="py-2.5 px-4">OUTCOME</th>
              <th className="py-2.5 px-4">INDUSTRY</th>
              <th className="py-2.5 px-4">RESPONSIBLE SERVICE</th>
              <th className="py-2.5 px-4 text-right">RISK INDEX</th>
              <th className="py-2.5 px-4 text-right">LATENCY</th>
              <th className="py-2.5 px-4 text-right">CONFIDENCE</th>
              <th className="py-2.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTraces.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No decision traces matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredTraces.map((trace) => {
                const isSelected = selectedTrace.id === trace.id;

                return (
                  <tr
                    key={trace.id}
                    onClick={() => onSelectTrace(trace)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-900/90 border-l-2 border-l-cyan-400'
                        : 'hover:bg-slate-900/40'
                    }`}
                  >
                    {/* Decision Name & Entity */}
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-200">{trace.decisionType}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        <span>{trace.id}</span>
                        <span className="mx-1.5 text-slate-600">·</span>
                        <span>{trace.entityId}</span>
                      </div>
                    </td>

                    {/* Outcome Status */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {trace.finalOutcome === 'APPROVED' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {trace.finalOutcome === 'ESCALATED' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {(trace.finalOutcome === 'REJECTED' || trace.finalOutcome === 'BLOCKED') && (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className={`font-mono font-semibold text-[11px] ${
                          trace.finalOutcome === 'APPROVED' ? 'text-emerald-400' :
                          trace.finalOutcome === 'ESCALATED' ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {trace.finalOutcome}
                        </span>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                      {trace.industry.replace('_', ' ')}
                    </td>

                    {/* Responsible Service */}
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-slate-300 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {trace.responsibleService}
                      </span>
                    </td>

                    {/* Risk Index (Numeric Right-aligned) */}
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-300">
                      <span className={trace.riskScore > 70 ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                        {trace.riskScore.toFixed(1)}
                      </span>
                      <span className="text-slate-500 text-[10px]"> / 100</span>
                    </td>

                    {/* Latency (Numeric Right-aligned) */}
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-400">
                      {trace.totalDurationMs} ms
                    </td>

                    {/* Confidence (Numeric Right-aligned) */}
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-cyan-400 font-semibold">
                      {(trace.confidenceScore * 100).toFixed(1)}%
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                        isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                      }`}>
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
