/**
 * NeuroTrace - AI Feature Attribution (SHAP / LIME) Matrix
 * Quantifies mathematical influence of input variables on the automated decision.
 */
import React from 'react';
import { FeatureAttribution } from '../../types/neurotrace';
import { BarChart3, HelpCircle } from 'lucide-react';

interface FeatureAttributionViewProps {
  features: FeatureAttribution[];
  confidenceScore: number;
  finalOutcome: string;
}

export const FeatureAttributionView: React.FC<FeatureAttributionViewProps> = ({
  features,
  confidenceScore,
  finalOutcome
}) => {
  // Find max absolute SHAP value for scaling bars
  const maxAbsShap = Math.max(...features.map((f) => Math.abs(f.shapValue)), 0.1);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-5 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            AI Feature Attribution (SHAP Local Importance)
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Local feature contributions calculated via Shapley additive explanations for this decision vector.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-300">Favorable (+)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span className="text-slate-300">Adverse (-)</span>
          </div>
        </div>
      </div>

      {/* Feature Attribution List */}
      <div className="space-y-4">
        {features.map((feature, idx) => {
          const isNegative = feature.direction === 'NEGATIVE';
          const barWidthPercent = (Math.abs(feature.shapValue) / maxAbsShap) * 100;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col gap-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{feature.featureName}</span>
                  <span className="text-[10px] font-mono text-slate-500">[{feature.category}]</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-400">
                    Observed: <strong className="text-slate-200">{feature.featureValue}</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    Baseline: <span className="text-slate-300">{feature.baselineValue}</span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className={`font-semibold tabular-nums ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                    {feature.shapValue >= 0 ? '+' : ''}{feature.shapValue.toFixed(3)} SHAP
                  </span>
                </div>
              </div>

              {/* Dual Direction Visual Bar */}
              <div className="h-2.5 w-full bg-slate-950 rounded overflow-hidden relative flex">
                {/* Center marker */}
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-700 z-10" />

                {/* Left lane (Negative) */}
                <div className="w-1/2 flex justify-end">
                  {isNegative && (
                    <div
                      style={{ width: `${barWidthPercent}%` }}
                      className="h-full bg-red-500 rounded-l"
                    />
                  )}
                </div>

                {/* Right lane (Positive) */}
                <div className="w-1/2 flex justify-start">
                  {!isNegative && (
                    <div
                      style={{ width: `${barWidthPercent}%` }}
                      className="h-full bg-emerald-500 rounded-r"
                    />
                  )}
                </div>
              </div>

              {/* Impact Narrative */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{feature.humanReadableImpact}</span>
                <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                  Normalized: {Math.round(feature.normalizedImportance * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
