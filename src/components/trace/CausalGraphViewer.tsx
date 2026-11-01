/**
 * NeuroTrace - Causal DAG Graph Engine Viewer
 * Interactive directed acyclic graph illustrating microservice causality,
 * gating dependencies, model inference nodes, and critical causal pathways.
 */
import React, { useState, useMemo } from 'react';
import { DecisionTrace, CausalNode, CausalEdge } from '../../types/neurotrace';
import { CausalEngine } from '../../services/causalEngine';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code2,
  Layers,
  Clock,
  Cpu,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface CausalGraphViewerProps {
  trace: DecisionTrace;
  onSelectNode?: (node: CausalNode) => void;
}

export const CausalGraphViewer: React.FC<CausalGraphViewerProps> = ({
  trace,
  onSelectNode
}) => {
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(trace.nodes[3] || trace.nodes[0]);
  const [highlightCriticalPathOnly, setHighlightCriticalPathOnly] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Compute critical path node and edge IDs
  const criticalPathNodeIds = useMemo(() => {
    return new Set(CausalEngine.computeCriticalPath(trace.nodes, trace.edges));
  }, [trace]);

  const handleNodeClick = (node: CausalNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  // Node color helper
  const getNodeColor = (node: CausalNode) => {
    if (node.status === 'ERROR') return { border: 'border-red-500', bg: 'bg-red-950/40', text: 'text-red-400', fill: '#ef4444' };
    if (node.status === 'WARN') return { border: 'border-amber-500', bg: 'bg-amber-950/40', text: 'text-amber-400', fill: '#f59e0b' };
    if (node.decisionImpact === 'PRIMARY_DRIVER') return { border: 'border-cyan-500', bg: 'bg-cyan-950/40', text: 'text-cyan-400', fill: '#06b6d4' };
    return { border: 'border-slate-700', bg: 'bg-slate-900/90', text: 'text-slate-300', fill: '#64748b' };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[720px] bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden p-4">
      {/* Main Graph Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
        {/* Graph Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white tracking-wide uppercase">Causal Graph DAG</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-mono text-cyan-400 tabular-nums">{trace.id}</span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">{trace.nodes.length} Nodes</span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">{trace.edges.length} Causal Edges</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightCriticalPathOnly(!highlightCriticalPathOnly)}
              title="Critical Path"
              aria-label="Critical Path"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                highlightCriticalPathOnly
                  ? 'bg-black text-white border border-black'
                  : 'bg-white text-black border border-black/15 hover:bg-black hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase">CP</span>
            </button>

            <div className="flex items-center border border-slate-700 rounded bg-slate-800/70">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-400 tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 border-l border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* SVG Viewport */}
        <div className="flex-1 relative overflow-auto p-6 flex items-center justify-center">
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', minWidth: '1200px', minHeight: '440px' }}
            className="relative w-full h-full transition-transform duration-150"
          >
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                <marker
                  id="arrow-critical"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-gating"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
              </defs>

              {trace.edges.map((edge) => {
                const source = trace.nodes.find((n) => n.id === edge.sourceId);
                const target = trace.nodes.find((n) => n.id === edge.targetId);
                if (!source || !target) return null;

                const isCritical = edge.isCriticalPath;
                const isDimmed = highlightCriticalPathOnly && !isCritical;

                // Compute node boundary connectors
                const x1 = source.x + 110;
                const y1 = source.y + 40;
                const x2 = target.x;
                const y2 = target.y + 40;

                // Cubic Bezier curve for clean layout
                const dx = (x2 - x1) / 2;
                const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                let strokeColor = '#334155';
                let marker = 'url(#arrow-default)';
                let strokeWidth = 1.5;

                if (isCritical) {
                  strokeColor = '#f59e0b';
                  marker = 'url(#arrow-critical)';
                  strokeWidth = 2.5;
                } else if (edge.dependencyType === 'CAUSAL_GATING') {
                  strokeColor = '#06b6d4';
                  marker = 'url(#arrow-gating)';
                }

                return (
                  <g key={edge.id} opacity={isDimmed ? 0.2 : 1}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.dependencyType === 'DATA_FEED' ? '4 4' : undefined}
                      markerEnd={marker}
                    />
                    {/* Edge latency tag */}
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {edge.latencyMs}ms
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Causal Nodes */}
            {trace.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isCritical = criticalPathNodeIds.has(node.id);
              const isDimmed = highlightCriticalPathOnly && !isCritical;
              const style = getNodeColor(node);

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: '180px'
                  }}
                  className={`absolute z-10 cursor-pointer rounded-lg border p-3 transition-all duration-150 select-none ${
                    style.bg
                  } ${style.border} ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'hover:border-slate-500'
                  } ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                      {node.componentType.replace('_', ' ')}
                    </span>
                    {node.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {node.status === 'WARN' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {node.status === 'ERROR' && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                  </div>

                  <h4 className="text-xs font-semibold text-white leading-tight mb-2 truncate" title={node.title}>
                    {node.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
                    <span className="tabular-nums">{node.executionTimeMs}ms</span>
                    <span className={`font-semibold tabular-nums ${node.causalWeight < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {node.causalWeight >= 0 ? '+' : ''}
                      {node.causalWeight.toFixed(2)} W
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Footer */}
        <div className="flex items-center gap-6 px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
            <span>Primary Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span>Critical Path / Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span>Hard Policy / Blocker</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
            <span>Pass-Through</span>
          </div>
        </div>
      </div>

      {/* Node Inspection Drawer */}
      <div className="w-full lg:w-96 bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col overflow-y-auto">
        {selectedNode ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  NODE INSPECTION
                </span>
                <h3 className="text-sm font-semibold text-white mt-0.5">{selectedNode.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedNode.serviceName}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                selectedNode.status === 'ERROR' ? 'bg-red-950 text-red-400 border border-red-800' :
                selectedNode.status === 'WARN' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {selectedNode.status}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Latency
                </span>
                <span className="text-sm font-mono font-semibold text-white tabular-nums mt-1 block">
                  {selectedNode.executionTimeMs} ms
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" /> Contribution
                </span>
                <span className="text-sm font-mono font-semibold text-cyan-400 tabular-nums mt-1 block">
                  {selectedNode.contributionScore}%
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Causal Impact Weight</span>
                <span className={`text-sm font-mono font-semibold tabular-nums mt-1 block ${
                  selectedNode.causalWeight < 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {selectedNode.causalWeight >= 0 ? '+' : ''}{selectedNode.causalWeight.toFixed(2)}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400">Decision Classification</span>
                <span className="text-xs font-semibold text-slate-300 mt-1 block truncate">
                  {selectedNode.decisionImpact.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Error or Alert details if any */}
            {selectedNode.errorDetails && (
              <div className="p-3 bg-red-950/30 border border-red-800/60 rounded text-xs text-red-300">
                <span className="font-semibold block mb-0.5">Execution Interception:</span>
                <span>{selectedNode.errorDetails}</span>
              </div>
            )}

            {/* Model specifics if ML Node */}
            {selectedNode.modelDetails && (
              <div className="p-3 bg-slate-950/90 border border-slate-800 rounded flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> AI Model Parameters
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model Name:</span>
                    <span className="font-mono text-slate-200">{selectedNode.modelDetails.modelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span className="font-mono text-slate-200">{selectedNode.modelDetails.modelVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Framework:</span>
                    <span className="text-slate-200">{selectedNode.modelDetails.framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prediction Score:</span>
                    <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                      {(selectedNode.modelDetails.predictionScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gating Threshold:</span>
                    <span className="font-mono text-amber-400 tabular-nums">
                      {(selectedNode.modelDetails.threshold * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Node Attributes JSON */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Node Attributes Payload
              </span>
              <pre className="p-2.5 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-44">
                {JSON.stringify(selectedNode.attributes, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <Info className="w-6 h-6 mb-2 text-slate-600" />
            <span>Select any node on the graph to inspect causal execution details</span>
          </div>
        )}
      </div>
    </div>
  );
};
