/**
 * NeuroTrace - Domain Types & Data Contracts
 * Cross-System Causal Explainability Platform
 */

export type UserRole =
  | 'ADMIN'
  | 'DEVELOPER'
  | 'AUDITOR'
  | 'COMPLIANCE_OFFICER'
  | 'MANAGER'
  | 'EXECUTIVE';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarUrl?: string;
  organization: string;
  permissions: string[];
  issuedAt: string;
  expiresAt: string;
  token: string;
}

export type DecisionOutcome =
  | 'APPROVED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'BLOCKED'
  | 'FLAGGED';

export type IndustryDomain =
  | 'FINTECH_BANKING'
  | 'HEALTHCARE'
  | 'CYBERSECURITY'
  | 'INSURANCE'
  | 'ECOMMERCE';

export interface Span {
  id: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  service: string;
  status: 'SUCCESS' | 'ERROR' | 'WARN';
  startTimeOffsetMs: number;
  durationMs: number;
  httpStatus: number;
  protocol: 'gRPC' | 'REST' | 'Kafka' | 'Internal' | 'HTTP/2';
  attributes: Record<string, string | number | boolean>;
  payloadInput?: Record<string, any>;
  payloadOutput?: Record<string, any>;
}

export type ComponentType =
  | 'API_GATEWAY'
  | 'AUTH'
  | 'CUSTOMER_SERVICE'
  | 'DATA_SERVICE'
  | 'RISK_ENGINE'
  | 'FRAUD_DETECTION'
  | 'ML_MODEL'
  | 'POLICY_RULES'
  | 'COMPLIANCE_ENGINE'
  | 'DECISION_SERVICE'
  | 'DATABASE';

export type DecisionImpact =
  | 'CRITICAL_BLOCKER'
  | 'PRIMARY_DRIVER'
  | 'SUPPORTING_FACTOR'
  | 'PASS_THROUGH'
  | 'ANOMALOUS';

export interface CausalNode {
  id: string;
  spanId: string;
  serviceName: string;
  componentType: ComponentType;
  title: string;
  executionTimeMs: number;
  status: 'SUCCESS' | 'ERROR' | 'WARN';
  errorDetails?: string;
  contributionScore: number; // 0 to 100 percentage
  causalWeight: number; // -1 (strong rejection) to +1 (strong approval)
  decisionImpact: DecisionImpact;
  modelDetails?: {
    modelName: string;
    modelVersion: string;
    framework: string;
    inferenceLatencyMs: number;
    predictionScore: number;
    threshold: number;
  };
  attributes: Record<string, any>;
  x: number;
  y: number;
}

export interface CausalEdge {
  id: string;
  sourceId: string;
  targetId: string;
  dependencyType: 'DIRECT_CALL' | 'DATA_FEED' | 'CAUSAL_GATING' | 'FALLBACK_TRIGGER';
  isCriticalPath: boolean;
  latencyMs: number;
  causalFlowDirection: 'FORWARD' | 'FEEDBACK';
}

export interface FeatureAttribution {
  featureName: string;
  category: 'FINANCIAL' | 'BEHAVIORAL' | 'IDENTITY' | 'TELEMETRY' | 'HISTORICAL' | 'CLINICAL';
  featureValue: string | number;
  baselineValue: string | number;
  shapValue: number; // positive = pushes toward approval/target, negative = pushes toward rejection
  normalizedImportance: number; // 0 to 1 scale
  humanReadableImpact: string;
  direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface RegulatoryCheck {
  framework: 'EU_AI_ACT' | 'GDPR_ART_22' | 'ECOA_FAIR_LENDING' | 'ISO_42001' | 'BASEL_III' | 'HIPAA';
  rule: string;
  status: 'COMPLIANT' | 'FLAGGED' | 'MANUAL_REVIEW_REQUIRED';
  detail: string;
  code?: string;
}

export interface DecisionTrace {
  id: string;
  traceId: string;
  fingerprintHash: string; // SHA-256
  eventHash: string;
  decisionVersion: string;
  timestamp: string;
  industry: IndustryDomain;
  decisionType: string;
  entityId: string;
  finalOutcome: DecisionOutcome;
  confidenceScore: number; // 0.0 - 1.0
  riskScore: number; // 0 - 100
  totalDurationMs: number;
  servicesCount: number;
  spansCount: number;
  responsibleService: string;
  rootCauseSummary: string;
  naturalLanguageExplanation: string;
  executiveSummary: string;
  regulatoryFlags: RegulatoryCheck[];
  inputParameters: Record<string, any>;
  features: FeatureAttribution[];
  nodes: CausalNode[];
  edges: CausalEdge[];
  spans: Span[];
}

export interface ReplaySimulationConfig {
  traceId: string;
  targetModelVersion?: string;
  mutatedInputs: Record<string, any>;
}

export interface ReplayResult {
  originalTraceId: string;
  replayTraceId: string;
  timestamp: string;
  previousOutcome: DecisionOutcome;
  newOutcome: DecisionOutcome;
  outcomeFlipped: boolean;
  previousConfidence: number;
  newConfidence: number;
  confidenceDelta: number;
  previousRiskScore: number;
  newRiskScore: number;
  pathDivergenceNodes: string[];
  simulatedDurationMs: number;
  causalDivergenceSummary: string;
  newFeatures: FeatureAttribution[];
}

export interface SystemMetrics {
  totalDecisions24h: number;
  rejectionRatePercent: number;
  meanAttributionLatencyMs: number;
  activePipelines: number;
  slaCompliancePercent: number;
  flaggedAuditCount: number;
  topRiskServices: Array<{ service: string; rejectionInfluence: number; errorRate: number }>;
}
