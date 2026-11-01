/**
 * NeuroTrace - Trace Ingestion Simulator Modal
 * Allows developers and architects to submit telemetry and inject decision events into the pipeline.
 */
import React, { useState } from 'react';
import { DecisionTrace, IndustryDomain, DecisionOutcome } from '../../types/neurotrace';
import { X, Plus, Terminal, Zap, CheckCircle2 } from 'lucide-react';

interface TraceIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestTrace: (newTrace: DecisionTrace) => void;
}

export const TraceIngestionModal: React.FC<TraceIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestTrace
}) => {
  const [industry, setIndustry] = useState<IndustryDomain>('FINTECH_BANKING');
  const [decisionType, setDecisionType] = useState('Real-Time Instant Credit Line Evaluation');
  const [entityId, setEntityId] = useState('APP-SIM-2026-X99');
  const [requestedOutcome, setRequestedOutcome] = useState<DecisionOutcome>('APPROVED');
  const [rawPayload, setRawPayload] = useState(
    JSON.stringify(
      {
        requestedAmount: 150000,
        annualRevenue: 980000,
        dscr: 1.42,
        debtToIncome: 0.28,
        hardInquiries90d: 1,
        ficoScore: 742,
        businessAgeYears: 5.2
      },
      null,
      2
    )
  );

  if (!isOpen) return null;

  const handlePresetSelect = (preset: 'BANK_APPROVE' | 'SEPSIS_ALERT' | 'IAM_ATTACK') => {
    if (preset === 'BANK_APPROVE') {
      setIndustry('FINTECH_BANKING');
      setDecisionType('SBA Fast-Track Working Capital Facility');
      setEntityId('SBA-SIM-8840');
      setRequestedOutcome('APPROVED');
      setRawPayload(
        JSON.stringify(
          {
            requestedAmount: 175000,
            annualRevenue: 1250000,
            dscr: 1.55,
            debtToIncome: 0.24,
            hardInquiries90d: 0,
            ficoScore: 780,
            businessAgeYears: 7.1
          },
          null,
          2
        )
      );
    } else if (preset === 'SEPSIS_ALERT') {
      setIndustry('HEALTHCARE');
      setDecisionType('Automated ICU Sepsis Alert & Triage Protocol');
      setEntityId('PT-SIM-BED-09');
      setRequestedOutcome('ESCALATED');
      setRawPayload(
        JSON.stringify(
          {
            patientId: 'PT-9901-ICU',
            serumLactate: 3.8,
            meanArterialPressure: 54,
            heartRateBpm: 124,
            coreTempCelsius: 39.2,
            qSOFA: 3
          },
          null,
          2
        )
      );
    } else {
      setIndustry('CYBERSECURITY');
      setDecisionType('Zero-Trust IAM Access Token Revocation');
      setEntityId('USR-SIM-SEC-12');
      setRequestedOutcome('BLOCKED');
      setRawPayload(
        JSON.stringify(
          {
            userId: 'sim_admin_attacker',
            originCity1: 'New York',
            originCity2: 'Hong Kong',
            distanceKm: 12900,
            elapsedMinutes: 9,
            velocityKmH: 86000,
            kmsDecryptCount: 300
          },
          null,
          2
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedInput: Record<string, any> = {};
    try {
      parsedInput = JSON.parse(rawPayload);
    } catch {
      parsedInput = { rawText: rawPayload };
    }

    const newTraceId = 'trc_' + Math.random().toString(16).substring(2, 10);
    const hex32 = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const sha256 = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const isApproval = requestedOutcome === 'APPROVED';

    const newTrace: DecisionTrace = {
      id: `TRC-2026-INGEST-${Math.floor(1000 + Math.random() * 9000)}`,
      traceId: hex32,
      fingerprintHash: sha256,
      eventHash: hex32.substring(0, 32),
      decisionVersion: 'v4.2.5-live',
      timestamp: new Date().toISOString(),
      industry,
      decisionType,
      entityId,
      finalOutcome: requestedOutcome,
      confidenceScore: isApproval ? 0.954 : 0.928,
      riskScore: isApproval ? 16.2 : 88.4,
      totalDurationMs: Math.floor(120 + Math.random() * 300),
      servicesCount: 6,
      spansCount: 10,
      responsibleService: isApproval ? 'decision-dispatcher' : 'policy-rules-engine',
      rootCauseSummary: isApproval
        ? 'All downstream policy thresholds satisfied across solvency, identity, and model predictions.'
        : 'Statutory policy gating triggered due to input vectors crossing adverse thresholds.',
      naturalLanguageExplanation: `Simulated live telemetry processed across distributed services for entity ${entityId}. Outcome concluded as ${requestedOutcome}.`,
      executiveSummary: `Live decision ingestion verified. Cryptographic fingerprint ${sha256.substring(0, 16)}... registered into immutable audit ledger.`,
      regulatoryFlags: [
        {
          framework: 'EU_AI_ACT',
          rule: 'Article 13 - Transparency of Automated Decisions',
          status: 'COMPLIANT',
          detail: 'Continuous OTel logging registered.'
        },
        {
          framework: 'BASEL_III',
          rule: 'BCBS 239 - Risk Data Architecture',
          status: 'COMPLIANT',
          detail: 'Trace payload cryptographic hash stored in ledger.'
        }
      ],
      inputParameters: parsedInput,
      features: [
        {
          featureName: 'Primary Metric Vector',
          category: 'FINANCIAL',
          featureValue: isApproval ? '1.55x Nominal' : 'Threshold Breach',
          baselineValue: '1.25x Baseline',
          shapValue: isApproval ? 0.45 : -0.52,
          normalizedImportance: 0.45,
          humanReadableImpact: isApproval ? 'High solvency support factor.' : 'Adverse driver triggering policy intercept.',
          direction: isApproval ? 'POSITIVE' : 'NEGATIVE'
        },
        {
          featureName: 'Secondary Risk Factor',
          category: 'BEHAVIORAL',
          featureValue: isApproval ? 'Low Variance' : 'High Frequency Spike',
          baselineValue: 'Baseline Standard',
          shapValue: isApproval ? 0.25 : -0.32,
          normalizedImportance: 0.35,
          humanReadableImpact: isApproval ? 'Stable behavioral score.' : 'Elevated risk velocity.',
          direction: isApproval ? 'POSITIVE' : 'NEGATIVE'
        }
      ],
      nodes: [
        {
          id: 'sim-gw',
          spanId: 's-01',
          serviceName: 'api-gateway',
          componentType: 'API_GATEWAY',
          title: 'Ingress & TLS Termination',
          executionTimeMs: 12,
          status: 'SUCCESS',
          contributionScore: 4,
          causalWeight: 0.0,
          decisionImpact: 'PASS_THROUGH',
          attributes: { protocol: 'HTTP/2', ip: '10.0.4.12' },
          x: 60,
          y: 180
        },
        {
          id: 'sim-auth',
          spanId: 's-02',
          serviceName: 'iam-auth-service',
          componentType: 'AUTH',
          title: 'Identity & Keycloak Token Verification',
          executionTimeMs: 24,
          status: 'SUCCESS',
          contributionScore: 8,
          causalWeight: 0.05,
          decisionImpact: 'PASS_THROUGH',
          attributes: { verified: true },
          x: 300,
          y: 180
        },
        {
          id: 'sim-engine',
          spanId: 's-03',
          serviceName: 'policy-rules-engine',
          componentType: 'POLICY_RULES',
          title: 'Statutory Policy Gating',
          executionTimeMs: 65,
          status: isApproval ? 'SUCCESS' : 'ERROR',
          contributionScore: 68,
          causalWeight: isApproval ? 0.88 : -0.92,
          decisionImpact: isApproval ? 'PRIMARY_DRIVER' : 'CRITICAL_BLOCKER',
          attributes: { outcome: requestedOutcome },
          x: 580,
          y: 180
        },
        {
          id: 'sim-dispatch',
          spanId: 's-04',
          serviceName: 'decision-dispatcher',
          componentType: 'DECISION_SERVICE',
          title: 'Kafka Pipeline Dispatcher',
          executionTimeMs: 18,
          status: 'SUCCESS',
          contributionScore: 10,
          causalWeight: 0.0,
          decisionImpact: 'PASS_THROUGH',
          attributes: { published: true },
          x: 880,
          y: 180
        }
      ],
      edges: [
        { id: 'se1', sourceId: 'sim-gw', targetId: 'sim-auth', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 12, causalFlowDirection: 'FORWARD' },
        { id: 'se2', sourceId: 'sim-auth', targetId: 'sim-engine', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 24, causalFlowDirection: 'FORWARD' },
        { id: 'se3', sourceId: 'sim-engine', targetId: 'sim-dispatch', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 65, causalFlowDirection: 'FORWARD' }
      ],
      spans: [
        { id: 's-01', traceId: hex32, name: 'POST /v1/decide', service: 'api-gateway', status: 'SUCCESS', startTimeOffsetMs: 0, durationMs: 120, httpStatus: 200, protocol: 'HTTP/2', attributes: { 'http.status': 200 } },
        { id: 's-02', traceId: hex32, parentSpanId: 's-01', name: 'ValidateSessionToken', service: 'iam-auth-service', status: 'SUCCESS', startTimeOffsetMs: 15, durationMs: 24, httpStatus: 200, protocol: 'REST', attributes: { 'auth.valid': true } },
        { id: 's-03', traceId: hex32, parentSpanId: 's-01', name: 'EvaluateRulesEngine', service: 'policy-rules-engine', status: isApproval ? 'SUCCESS' : 'ERROR', startTimeOffsetMs: 42, durationMs: 65, httpStatus: isApproval ? 200 : 422, protocol: 'Internal', attributes: { 'policy.passed': isApproval } }
      ]
    };

    onIngestTrace(newTrace);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900/60 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Inject Automated Decision Trace
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Quick Scenario Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('BANK_APPROVE')}
                className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded text-left transition-colors"
              >
                <div className="font-semibold text-slate-200">SBA Loan Approval</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Outcome: APPROVED</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('SEPSIS_ALERT')}
                className="p-2.5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded text-left transition-colors"
              >
                <div className="font-semibold text-slate-200">ICU Sepsis Spike</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">Outcome: ESCALATED</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('IAM_ATTACK')}
                className="p-2.5 bg-slate-900 border border-slate-800 hover:border-red-500 rounded text-left transition-colors"
              >
                <div className="font-semibold text-slate-200">Zero-Trust Breach</div>
                <div className="text-[10px] text-red-400 font-mono mt-0.5">Outcome: BLOCKED</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Industry Domain</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryDomain)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="FINTECH_BANKING">FinTech & Commercial Banking</option>
                <option value="HEALTHCARE">Healthcare Clinical Systems</option>
                <option value="CYBERSECURITY">Cybersecurity & IAM</option>
                <option value="INSURANCE">Casualty Insurance</option>
                <option value="ECOMMERCE">E-Commerce & Anti-Bot</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Target Decision Outcome</label>
              <select
                value={requestedOutcome}
                onChange={(e) => setRequestedOutcome(e.target.value as DecisionOutcome)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="ESCALATED">ESCALATED</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Decision Pipeline Name</label>
              <input
                type="text"
                value={decisionType}
                onChange={(e) => setDecisionType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Subject Entity ID</label>
              <input
                type="text"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Input Parameters (JSON)</label>
            <textarea
              rows={5}
              value={rawPayload}
              onChange={(e) => setRawPayload(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 font-mono text-[11px] text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Ingest & Reconstruct Causal Graph</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
