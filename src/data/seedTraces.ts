/**
 * NeuroTrace Seed Data
 * Production-grade traces across Banking, Healthcare, Cybersecurity, Insurance, and E-Commerce.
 */
import { DecisionTrace, SystemMetrics } from '../types/neurotrace';

export const INITIAL_SYSTEM_METRICS: SystemMetrics = {
  totalDecisions24h: 184209,
  rejectionRatePercent: 14.8,
  meanAttributionLatencyMs: 412,
  activePipelines: 18,
  slaCompliancePercent: 99.94,
  flaggedAuditCount: 7,
  topRiskServices: [
    { service: 'credit-risk-engine', rejectionInfluence: 42.1, errorRate: 0.04 },
    { service: 'fraud-detection-ml', rejectionInfluence: 31.8, errorRate: 0.12 },
    { service: 'policy-sanctions-checker', rejectionInfluence: 16.4, errorRate: 0.01 },
    { service: 'threat-intel-scorer', rejectionInfluence: 9.7, errorRate: 0.08 }
  ]
};

export const INITIAL_TRACES: DecisionTrace[] = [
  {
    id: 'TRC-2026-BANK-9042',
    traceId: '8f3a9e20b12c77df44a98011cfa50012',
    fingerprintHash: '7e2b814a09c311548bce21d3f9e9842f11a8bc43d789e54a61203debc6791efc',
    eventHash: '55df6200a89cd914382bc1947eef0321',
    decisionVersion: 'v4.2.1-prod',
    timestamp: '2026-10-06T22:45:12.894Z',
    industry: 'FINTECH_BANKING',
    decisionType: 'Commercial Line of Credit Underwriting',
    entityId: 'LOAN-APP-US-89104',
    finalOutcome: 'REJECTED',
    confidenceScore: 0.912,
    riskScore: 78.4,
    totalDurationMs: 648,
    servicesCount: 8,
    spansCount: 14,
    responsibleService: 'credit-risk-engine',
    rootCauseSummary: 'Debt-Service Coverage Ratio (DSCR: 1.08 vs 1.25 minimum) triggered hard policy gating after Risk Engine ML model assigned high default probability.',
    naturalLanguageExplanation: 'The applicant requested a $350,000 revolving credit facility. While identity and AML sanctions checks cleared with zero flags, the financial analysis pipeline failed at two critical gates: (1) The automated DSCR calculation resulted in 1.08, which falls beneath the statutory Tier-2 underwriting threshold of 1.25. (2) The XGBoost Credit Default Model (v4.1) registered a 74.2% default likelihood, largely driven by 7 credit bureau hard inquiries within 90 days and an elevated Debt-to-Income ratio of 47.1%.',
    executiveSummary: 'Automated rejection governed by Corporate Credit Underwriting Standard SOP-B7. Primary barrier: insufficient cash flow coverage (DSCR 1.08) coupled with aggressive short-term leverage velocity.',
    regulatoryFlags: [
      {
        framework: 'ECOA_FAIR_LENDING',
        rule: '12 CFR § 1002.9 - Adverse Action Notice Requirements',
        status: 'COMPLIANT',
        detail: 'Generated 4 principal adverse action reason codes: [01: Insufficient DSCR, 02: Excessive Hard Inquiries, 03: High Debt-to-Income, 04: Limited Business Operating History].',
        code: 'ECOA-AAN-44'
      },
      {
        framework: 'EU_AI_ACT',
        rule: 'Article 14 - Human Oversight on High-Risk Credit Scoring',
        status: 'FLAGGED',
        detail: 'Model confidence is 0.912, but applicant requested right of human reconsideration under Section 4. Queued for Tier-2 Credit Officer review.',
        code: 'EU-AI-ART14'
      },
      {
        framework: 'BASEL_III',
        rule: 'BCBS 239 - Risk Data Aggregation and Architecture',
        status: 'COMPLIANT',
        detail: 'All feature attributions, model version IDs, and input matrices cryptographically fingerprinted in immutable ledger.',
        code: 'BCBS-239-IMM'
      }
    ],
    inputParameters: {
      requestedAmount: 350000,
      annualRevenue: 840000,
      netOperatingIncome: 90720,
      annualDebtService: 84000,
      calculatedDscr: 1.08,
      debtToIncomeRatio: 0.471,
      creditBureauScore: 648,
      hardInquiriesLast90d: 7,
      yearsInBusiness: 2.4,
      jurisdictionState: 'IL',
      industryNaics: '541512'
    },
    features: [
      {
        featureName: 'Debt-Service Coverage Ratio (DSCR)',
        category: 'FINANCIAL',
        featureValue: '1.08x',
        baselineValue: '1.25x (Min Required)',
        shapValue: -0.428,
        normalizedImportance: 0.38,
        humanReadableImpact: 'Directly violates minimum solvency policy; 17 bps below statutory safety cushion.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Recent Credit Inquiries (90 Days)',
        category: 'BEHAVIORAL',
        featureValue: '7 inquiries',
        baselineValue: '≤ 2 inquiries',
        shapValue: -0.284,
        normalizedImportance: 0.25,
        humanReadableImpact: 'Indicates intense liquidity hunting across external credit institutions.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Debt-to-Income (DTI)',
        category: 'FINANCIAL',
        featureValue: '47.1%',
        baselineValue: '35.0%',
        shapValue: -0.192,
        normalizedImportance: 0.17,
        humanReadableImpact: '12.1 percentage points above conservative underwriting tolerance.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'FICO Small Business Score',
        category: 'HISTORICAL',
        featureValue: '648',
        baselineValue: '680',
        shapValue: -0.114,
        normalizedImportance: 0.10,
        humanReadableImpact: 'Sub-prime risk tier designation in commercial risk table.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Operating History Length',
        category: 'HISTORICAL',
        featureValue: '2.4 Years',
        baselineValue: '3.0 Years',
        shapValue: -0.062,
        normalizedImportance: 0.06,
        humanReadableImpact: 'Marginally under the seasoned 3-year commercial baseline.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Annual Gross Revenue',
        category: 'FINANCIAL',
        featureValue: '$840,000',
        baselineValue: '$500,000 (Min)',
        shapValue: 0.080,
        normalizedImportance: 0.04,
        humanReadableImpact: 'Positive revenue volume partially supported credit viability.',
        direction: 'POSITIVE'
      }
    ],
    nodes: [
      {
        id: 'node-gw',
        spanId: 'span-01',
        serviceName: 'api-gateway',
        componentType: 'API_GATEWAY',
        title: 'Edge Ingress & TLS Termination',
        executionTimeMs: 14,
        status: 'SUCCESS',
        contributionScore: 2,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { route: '/v2/underwriting/apply', ip: '198.51.100.44', protocol: 'HTTP/2' },
        x: 60,
        y: 180
      },
      {
        id: 'node-auth',
        spanId: 'span-02',
        serviceName: 'iam-auth-service',
        componentType: 'AUTH',
        title: 'Identity & Keycloak Token Verification',
        executionTimeMs: 28,
        status: 'SUCCESS',
        contributionScore: 4,
        causalWeight: 0.05,
        decisionImpact: 'PASS_THROUGH',
        attributes: { authType: 'mTLS + OAuth2 Bearer', scope: 'lending.originate' },
        x: 220,
        y: 180
      },
      {
        id: 'node-cust',
        spanId: 'span-03',
        serviceName: 'customer-data-service',
        componentType: 'CUSTOMER_SERVICE',
        title: 'D&B & Experian Bureau Aggregator',
        executionTimeMs: 142,
        status: 'SUCCESS',
        contributionScore: 12,
        causalWeight: 0.15,
        decisionImpact: 'SUPPORTING_FACTOR',
        attributes: { dunsNumber: '83-294-1104', bureauResponseLatencyMs: 135 },
        x: 390,
        y: 180
      },
      {
        id: 'node-risk',
        spanId: 'span-04',
        serviceName: 'credit-risk-engine',
        componentType: 'RISK_ENGINE',
        title: 'Solvency & DSCR Calculation Engine',
        executionTimeMs: 84,
        status: 'WARN',
        errorDetails: 'DSCR (1.08) failed threshold minimum (1.25)',
        contributionScore: 46,
        causalWeight: -0.72,
        decisionImpact: 'CRITICAL_BLOCKER',
        attributes: { dscrCalculated: 1.08, dtiCalculated: 0.471, hardGating: true },
        x: 570,
        y: 100
      },
      {
        id: 'node-ml',
        spanId: 'span-05',
        serviceName: 'ml-credit-inference',
        componentType: 'ML_MODEL',
        title: 'XGBoost Credit Default Predictor',
        executionTimeMs: 95,
        status: 'WARN',
        contributionScore: 32,
        causalWeight: -0.65,
        decisionImpact: 'PRIMARY_DRIVER',
        modelDetails: {
          modelName: 'xgboost-commercial-default',
          modelVersion: 'v4.1.0-sha-e9821',
          framework: 'XGBoost / ONNX Runtime',
          inferenceLatencyMs: 92,
          predictionScore: 0.742,
          threshold: 0.350
        },
        attributes: { defaultProbability: 0.742, shapFeaturesEvaluated: 48 },
        x: 570,
        y: 260
      },
      {
        id: 'node-policy',
        spanId: 'span-06',
        serviceName: 'policy-rules-engine',
        componentType: 'POLICY_RULES',
        title: 'Tier-2 Commercial Policy Rules',
        executionTimeMs: 36,
        status: 'ERROR',
        errorDetails: 'Hard Rule REJ_DSCR_125 fired; Rule REJ_INQ_90D fired',
        contributionScore: 50,
        causalWeight: -0.90,
        decisionImpact: 'CRITICAL_BLOCKER',
        attributes: { rulesEvaluated: 34, rulesFailed: 2, overrideAllowed: false },
        x: 770,
        y: 180
      },
      {
        id: 'node-comp',
        spanId: 'span-07',
        serviceName: 'compliance-auditor',
        componentType: 'COMPLIANCE_ENGINE',
        title: 'Fair Lending & Adverse Action Formatter',
        executionTimeMs: 62,
        status: 'SUCCESS',
        contributionScore: 4,
        causalWeight: 0.0,
        decisionImpact: 'SUPPORTING_FACTOR',
        attributes: { ecoaCodesGenerated: 4, adverseActionNoticeId: 'AAN-2026-9042' },
        x: 950,
        y: 180
      },
      {
        id: 'node-dispatch',
        spanId: 'span-08',
        serviceName: 'decision-dispatcher',
        componentType: 'DECISION_SERVICE',
        title: 'Kafka Pipeline Decision Dispatcher',
        executionTimeMs: 22,
        status: 'SUCCESS',
        contributionScore: 2,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { topic: 'commercial.decisions.rejections', partition: 3, offset: 98144 },
        x: 1110,
        y: 180
      }
    ],
    edges: [
      { id: 'e1', sourceId: 'node-gw', targetId: 'node-auth', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 14, causalFlowDirection: 'FORWARD' },
      { id: 'e2', sourceId: 'node-auth', targetId: 'node-cust', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 28, causalFlowDirection: 'FORWARD' },
      { id: 'e3', sourceId: 'node-cust', targetId: 'node-risk', dependencyType: 'DATA_FEED', isCriticalPath: true, latencyMs: 40, causalFlowDirection: 'FORWARD' },
      { id: 'e4', sourceId: 'node-cust', targetId: 'node-ml', dependencyType: 'DATA_FEED', isCriticalPath: false, latencyMs: 45, causalFlowDirection: 'FORWARD' },
      { id: 'e5', sourceId: 'node-risk', targetId: 'node-policy', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 35, causalFlowDirection: 'FORWARD' },
      { id: 'e6', sourceId: 'node-ml', targetId: 'node-policy', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 42, causalFlowDirection: 'FORWARD' },
      { id: 'e7', sourceId: 'node-policy', targetId: 'node-comp', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 62, causalFlowDirection: 'FORWARD' },
      { id: 'e8', sourceId: 'node-comp', targetId: 'node-dispatch', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 22, causalFlowDirection: 'FORWARD' }
    ],
    spans: [
      { id: 'span-01', traceId: '8f3a9e20b12c77df44a98011cfa50012', name: 'POST /v2/underwriting/apply', service: 'api-gateway', status: 'SUCCESS', startTimeOffsetMs: 0, durationMs: 648, httpStatus: 200, protocol: 'HTTP/2', attributes: { 'http.method': 'POST', 'http.status_code': 200 } },
      { id: 'span-02', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-01', name: 'TokenIntrospect', service: 'iam-auth-service', status: 'SUCCESS', startTimeOffsetMs: 16, durationMs: 28, httpStatus: 200, protocol: 'REST', attributes: { 'auth.jwt_valid': true } },
      { id: 'span-03', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-01', name: 'FetchCreditBureauData', service: 'customer-data-service', status: 'SUCCESS', startTimeOffsetMs: 46, durationMs: 142, httpStatus: 200, protocol: 'REST', attributes: { 'bureau.partner': 'Experian+DnB' } },
      { id: 'span-04', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-03', name: 'CalculateDebtServiceCoverage', service: 'credit-risk-engine', status: 'WARN', startTimeOffsetMs: 190, durationMs: 84, httpStatus: 200, protocol: 'gRPC', attributes: { 'dscr': 1.08, 'threshold': 1.25 } },
      { id: 'span-05', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-03', name: 'InferenceDefaultRiskXGB', service: 'ml-credit-inference', status: 'WARN', startTimeOffsetMs: 192, durationMs: 95, httpStatus: 200, protocol: 'gRPC', attributes: { 'ml.model_version': 'v4.1.0', 'ml.prediction': 0.742 } },
      { id: 'span-06', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-01', name: 'EvaluateUnderwritingPolicies', service: 'policy-rules-engine', status: 'ERROR', startTimeOffsetMs: 290, durationMs: 36, httpStatus: 422, protocol: 'Internal', attributes: { 'rule.failed_count': 2, 'rule.code': 'REJ_DSCR_125' } },
      { id: 'span-07', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-01', name: 'GenerateAdverseActionDossier', service: 'compliance-auditor', status: 'SUCCESS', startTimeOffsetMs: 330, durationMs: 62, httpStatus: 200, protocol: 'REST', attributes: { 'ecoa.compliant': true, 'notice.id': 'AAN-2026-9042' } },
      { id: 'span-08', traceId: '8f3a9e20b12c77df44a98011cfa50012', parentSpanId: 'span-01', name: 'PublishDecisionEvent', service: 'decision-dispatcher', status: 'SUCCESS', startTimeOffsetMs: 395, durationMs: 22, httpStatus: 200, protocol: 'Kafka', attributes: { 'kafka.topic': 'commercial.decisions.rejections' } }
    ]
  },
  {
    id: 'TRC-2026-MED-3840',
    traceId: '3c19b4e7a88019fb22c9a10404fa9911',
    fingerprintHash: '439a1702fbdc4167e8910023cf81a602334812fcc00431bba91b29ce45f102bb',
    eventHash: '98fa011bce55410982bc01837eef9011',
    decisionVersion: 'v2.8.4-clinical',
    timestamp: '2026-10-06T21:18:04.112Z',
    industry: 'HEALTHCARE',
    decisionType: 'Automated ICU Sepsis Alert & Triage Protocol',
    entityId: 'PT-ICU-BED-14B',
    finalOutcome: 'ESCALATED',
    confidenceScore: 0.948,
    riskScore: 89.2,
    totalDurationMs: 218,
    servicesCount: 7,
    spansCount: 11,
    responsibleService: 'sepsis-neural-net',
    rootCauseSummary: 'Sepsis Neural Net crossed critical alarm threshold (score 0.88 > 0.65) due to combined acute lactate elevation (3.4 mmol/L) and mean arterial pressure drop (58 mmHg).',
    naturalLanguageExplanation: 'Continuous vital signs telemetry ingested from Bedside Monitor Bed-14B showed rapid physiological deterioration over a 45-minute window. Serum lactate rose to 3.4 mmol/L while Mean Arterial Pressure (MAP) degraded to 58 mmHg. The Transformer-based Sepsis Predictor (v2.8) calculated an 88% probability of onset within 4 hours. Automated Antibiotic Stewardship escalated the alert to the Attending Intensivist with recommendation for immediate 30 mL/kg crystalloid fluid bolus.',
    executiveSummary: 'Emergency Clinical Escalation: Sepsis bundle protocol triggered. Mandatory bedside physician evaluation initiated under Hospital Clinical Governance Protocol CGP-7.',
    regulatoryFlags: [
      {
        framework: 'EU_AI_ACT',
        rule: 'Annex III - High Risk Medical Device Software',
        status: 'COMPLIANT',
        detail: 'Full continuous logging with human physician verification gating in place; decision cannot order medication autonomously without clinician sign-off.',
        code: 'EU-AI-ANNEX3'
      },
      {
        framework: 'HIPAA',
        rule: 'Security Rule 45 CFR § 164.312 - Audit Controls',
        status: 'COMPLIANT',
        detail: 'Patient identifiers cryptographically tokenized before passing through neural net inference pipeline.',
        code: 'HIPAA-AUDIT-164'
      }
    ],
    inputParameters: {
      patientId: 'PT-ICU-612',
      bedLocation: 'ICU-B14',
      serumLactate: 3.4,
      meanArterialPressure: 58,
      heartRateBpm: 118,
      respiratoryRate: 26,
      whiteBloodCellCount: 16.8,
      coreTempCelsius: 38.9,
      qSOFAScore: 3
    },
    features: [
      {
        featureName: 'Serum Lactate Level',
        category: 'CLINICAL',
        featureValue: '3.4 mmol/L',
        baselineValue: '≤ 2.0 mmol/L',
        shapValue: 0.442,
        normalizedImportance: 0.41,
        humanReadableImpact: 'Severe tissue hypoperfusion indicator; standard septic shock warning mark.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Mean Arterial Pressure (MAP)',
        category: 'CLINICAL',
        featureValue: '58 mmHg',
        baselineValue: '≥ 65 mmHg',
        shapValue: 0.318,
        normalizedImportance: 0.30,
        humanReadableImpact: 'Hypotension refractory to basal infusion; high organ damage risk.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Heart Rate (Sinus Tachycardia)',
        category: 'CLINICAL',
        featureValue: '118 bpm',
        baselineValue: '60 - 90 bpm',
        shapValue: 0.162,
        normalizedImportance: 0.15,
        humanReadableImpact: 'Cardiovascular compensatory stress response.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Core Body Temperature',
        category: 'CLINICAL',
        featureValue: '38.9 °C',
        baselineValue: '37.0 °C',
        shapValue: 0.098,
        normalizedImportance: 0.09,
        humanReadableImpact: 'Systemic inflammatory response pyrexia.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Age of Patient',
        category: 'CLINICAL',
        featureValue: '64 Years',
        baselineValue: '50 Years',
        shapValue: 0.045,
        normalizedImportance: 0.05,
        humanReadableImpact: 'Elevated demographic vulnerability baseline.',
        direction: 'NEGATIVE'
      }
    ],
    nodes: [
      {
        id: 'node-iot',
        spanId: 'med-s1',
        serviceName: 'iot-telemetry-gateway',
        componentType: 'API_GATEWAY',
        title: 'FHIR Bedside Telemetry Stream',
        executionTimeMs: 18,
        status: 'SUCCESS',
        contributionScore: 5,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { device: 'Mindray BeneVision N22', format: 'HL7-v2.6' },
        x: 60,
        y: 180
      },
      {
        id: 'node-proc',
        spanId: 'med-s2',
        serviceName: 'vitals-normalizer',
        componentType: 'DATA_SERVICE',
        title: 'Continuous Vital Signs Normalizer',
        executionTimeMs: 32,
        status: 'SUCCESS',
        contributionScore: 10,
        causalWeight: 0.1,
        decisionImpact: 'SUPPORTING_FACTOR',
        attributes: { windowMinutes: 45, samplesAveraged: 270 },
        x: 250,
        y: 180
      },
      {
        id: 'node-sepsis-net',
        spanId: 'med-s3',
        serviceName: 'sepsis-neural-net',
        componentType: 'ML_MODEL',
        title: 'Temporal Transformer Sepsis Predictor',
        executionTimeMs: 88,
        status: 'WARN',
        contributionScore: 58,
        causalWeight: 0.88,
        decisionImpact: 'PRIMARY_DRIVER',
        modelDetails: {
          modelName: 'sepsis-temporal-transformer',
          modelVersion: 'v2.8.4-clinical',
          framework: 'PyTorch / TensorRT',
          inferenceLatencyMs: 84,
          predictionScore: 0.882,
          threshold: 0.650
        },
        attributes: { onsetPredictionWindowHours: 4, auprcScore: 0.93 },
        x: 480,
        y: 180
      },
      {
        id: 'node-steward',
        spanId: 'med-s4',
        serviceName: 'antimicrobial-steward',
        componentType: 'POLICY_RULES',
        title: 'Sepsis Clinical Pathway Rules',
        executionTimeMs: 24,
        status: 'WARN',
        contributionScore: 20,
        causalWeight: 0.65,
        decisionImpact: 'CRITICAL_BLOCKER',
        attributes: { protocolCode: 'SEP-BUNDLE-3HR', fluidOrderTriggered: true },
        x: 720,
        y: 180
      },
      {
        id: 'node-pager',
        spanId: 'med-s5',
        serviceName: 'clinical-alert-dispatcher',
        componentType: 'DECISION_SERVICE',
        title: 'Attending Intensivist Pager Dispatch',
        executionTimeMs: 16,
        status: 'SUCCESS',
        contributionScore: 7,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { priority: 'STAT', recipient: 'Dr. Sarah Vance, MD' },
        x: 960,
        y: 180
      }
    ],
    edges: [
      { id: 'me1', sourceId: 'node-iot', targetId: 'node-proc', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 18, causalFlowDirection: 'FORWARD' },
      { id: 'me2', sourceId: 'node-proc', targetId: 'node-sepsis-net', dependencyType: 'DATA_FEED', isCriticalPath: true, latencyMs: 32, causalFlowDirection: 'FORWARD' },
      { id: 'me3', sourceId: 'node-sepsis-net', targetId: 'node-steward', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 88, causalFlowDirection: 'FORWARD' },
      { id: 'me4', sourceId: 'node-steward', targetId: 'node-pager', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 24, causalFlowDirection: 'FORWARD' }
    ],
    spans: [
      { id: 'med-s1', traceId: '3c19b4e7a88019fb22c9a10404fa9911', name: 'IngestFHIRTelemetry', service: 'iot-telemetry-gateway', status: 'SUCCESS', startTimeOffsetMs: 0, durationMs: 218, httpStatus: 200, protocol: 'REST', attributes: { 'hl7.message_type': 'ORU_R01' } },
      { id: 'med-s2', traceId: '3c19b4e7a88019fb22c9a10404fa9911', parentSpanId: 'med-s1', name: 'NormalizeTimeSeriesVitals', service: 'vitals-normalizer', status: 'SUCCESS', startTimeOffsetMs: 20, durationMs: 32, httpStatus: 200, protocol: 'Internal', attributes: { 'samples': 270 } },
      { id: 'med-s3', traceId: '3c19b4e7a88019fb22c9a10404fa9911', parentSpanId: 'med-s1', name: 'PredictSepsisProbability', service: 'sepsis-neural-net', status: 'WARN', startTimeOffsetMs: 55, durationMs: 88, httpStatus: 200, protocol: 'gRPC', attributes: { 'score': 0.882 } },
      { id: 'med-s4', traceId: '3c19b4e7a88019fb22c9a10404fa9911', parentSpanId: 'med-s1', name: 'Evaluate3HourBundleRules', service: 'antimicrobial-steward', status: 'WARN', startTimeOffsetMs: 145, durationMs: 24, httpStatus: 200, protocol: 'REST', attributes: { 'bundle': 'SEP-3HR' } },
      { id: 'med-s5', traceId: '3c19b4e7a88019fb22c9a10404fa9911', parentSpanId: 'med-s1', name: 'DispatchSTATMobileAlert', service: 'clinical-alert-dispatcher', status: 'SUCCESS', startTimeOffsetMs: 172, durationMs: 16, httpStatus: 200, protocol: 'REST', attributes: { 'urgency': 'IMMEDIATE' } }
    ]
  },
  {
    id: 'TRC-2026-SEC-7711',
    traceId: '77a0129bcfe441208914ab01288cfa01',
    fingerprintHash: '992a017cfed82104ab91024bcdae1039871142981bc091244ae7109247cbf891',
    eventHash: '11ae8832049182377bcf440192837166',
    decisionVersion: 'v5.0.2-sec',
    timestamp: '2026-10-06T20:04:19.432Z',
    industry: 'CYBERSECURITY',
    decisionType: 'Zero-Trust IAM Access Token Revocation',
    entityId: 'PRINCIPAL-ADM-904',
    finalOutcome: 'BLOCKED',
    confidenceScore: 0.981,
    riskScore: 94.6,
    totalDurationMs: 142,
    servicesCount: 6,
    spansCount: 9,
    responsibleService: 'threat-intel-scorer',
    rootCauseSummary: 'Impossible travel anomaly detected: Session IP migrated from Frankfurt to Singapore (9,200 km) in 14 minutes with concurrent anomalous AWS KMS key decrypt calls.',
    naturalLanguageExplanation: 'An active privileged cloud infrastructure session assigned to devops-lead was terminated by the Zero-Trust Policy Enforcement Point. The session was established from Frankfurt AWS peering IP 194.39.218.10. Exactly 14 minutes later, the same session token made bulk decryption calls against Production KMS keys originating from Singapore IP 103.22.201.8. The calculated velocity of 39,428 km/h is physically impossible, triggering instantaneous token revocation and SOC P1 incident creation.',
    executiveSummary: 'Security Incident Containment: Credential compromise detected via impossible velocity telemetry. Immediate automated revocation executed to safeguard production cryptographic assets.',
    regulatoryFlags: [
      {
        framework: 'ISO_42001',
        rule: 'A.8.4 - Protection of Automated Decision Systems',
        status: 'COMPLIANT',
        detail: 'Instant automated killswitch verified and cryptographically logged for SOC post-mortem.',
        code: 'ISO-42001-A8'
      },
      {
        framework: 'GDPR_ART_22',
        rule: 'Article 22(2)(a) - Performance of a Contract / Security Safeguards',
        status: 'COMPLIANT',
        detail: 'Exemption for automated security containment confirmed under cybersecurity defense doctrine.',
        code: 'GDPR-A22-SEC'
      }
    ],
    inputParameters: {
      userId: 'usr_devops_lead_44',
      originCity1: 'Frankfurt',
      originCity2: 'Singapore',
      distanceKm: 9200,
      elapsedMinutes: 14,
      velocityKmH: 39428,
      kmsDecryptCount: 142,
      deviceFingerprintMatch: false
    },
    features: [
      {
        featureName: 'Geo-Velocity (km/h)',
        category: 'TELEMETRY',
        featureValue: '39,428 km/h',
        baselineValue: '≤ 900 km/h',
        shapValue: -0.684,
        normalizedImportance: 0.55,
        humanReadableImpact: 'Physically impossible travel; definitive indication of token hijacking or proxy forwarding.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'KMS Bulk Decrypt Spike',
        category: 'BEHAVIORAL',
        featureValue: '142 requests/min',
        baselineValue: '≤ 4 requests/min',
        shapValue: -0.212,
        normalizedImportance: 0.22,
        humanReadableImpact: 'Extreme deviation from standard administrative behavior profile.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Browser Canvas Hash Discrepancy',
        category: 'IDENTITY',
        featureValue: 'Mismatch (Linux vs macOS)',
        baselineValue: 'Matched (macOS)',
        shapValue: -0.124,
        normalizedImportance: 0.14,
        humanReadableImpact: 'Client environment fingerprint completely diverged from session origin.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Past Account Tenancy',
        category: 'HISTORICAL',
        featureValue: '4.2 Years',
        baselineValue: '1 Year',
        shapValue: 0.038,
        normalizedImportance: 0.09,
        humanReadableImpact: 'Senior employee baseline provided zero mitigating protection against active breach.',
        direction: 'POSITIVE'
      }
    ],
    nodes: [
      {
        id: 'sec-gw',
        spanId: 'sec-s1',
        serviceName: 'edge-waf-gateway',
        componentType: 'API_GATEWAY',
        title: 'Edge Cloudflare WAF Ingress',
        executionTimeMs: 12,
        status: 'SUCCESS',
        contributionScore: 3,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { wafRule: 'Bypass-Legitimate-ASN', pop: 'SIN-01' },
        x: 60,
        y: 180
      },
      {
        id: 'sec-session',
        spanId: 'sec-s2',
        serviceName: 'session-evaluator',
        componentType: 'AUTH',
        title: 'Distributed Session Cache Evaluator',
        executionTimeMs: 19,
        status: 'SUCCESS',
        contributionScore: 8,
        causalWeight: 0.1,
        decisionImpact: 'SUPPORTING_FACTOR',
        attributes: { redisCluster: 'auth-sessions-us-east', ttlRemainingSec: 1420 },
        x: 270,
        y: 180
      },
      {
        id: 'sec-threat',
        spanId: 'sec-s3',
        serviceName: 'threat-intel-scorer',
        componentType: 'ML_MODEL',
        title: 'Isolation Forest Anomaly Classifier',
        executionTimeMs: 54,
        status: 'ERROR',
        errorDetails: 'Anomaly score 0.981 triggered critical security threshold (0.80)',
        contributionScore: 68,
        causalWeight: -0.95,
        decisionImpact: 'CRITICAL_BLOCKER',
        modelDetails: {
          modelName: 'isolation-forest-velocity-sec',
          modelVersion: 'v5.0.2',
          framework: 'Scikit-Learn / FastAPI',
          inferenceLatencyMs: 48,
          predictionScore: 0.981,
          threshold: 0.800
        },
        attributes: { anomalyClassification: 'IMPOSSIBLE_TRAVEL_HIJACK', confidence: 0.981 },
        x: 520,
        y: 180
      },
      {
        id: 'sec-pep',
        spanId: 'sec-s4',
        serviceName: 'policy-enforcement-point',
        componentType: 'POLICY_RULES',
        title: 'Zero-Trust PEP Decision Node',
        executionTimeMs: 22,
        status: 'ERROR',
        errorDetails: 'RevokeToken Action Fired; Quarantined in Bastion',
        contributionScore: 35,
        causalWeight: -0.88,
        decisionImpact: 'CRITICAL_BLOCKER',
        attributes: { action: 'TOKEN_REVOCATION', notifyPfaPager: true },
        x: 780,
        y: 180
      },
      {
        id: 'sec-okta',
        spanId: 'sec-s5',
        serviceName: 'okta-token-terminator',
        componentType: 'DECISION_SERVICE',
        title: 'IdP Session Invalidation Hook',
        executionTimeMs: 35,
        status: 'SUCCESS',
        contributionScore: 10,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { revokedSessions: 3, idpResponseCode: 204 },
        x: 1020,
        y: 180
      }
    ],
    edges: [
      { id: 'se1', sourceId: 'sec-gw', targetId: 'sec-session', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 12, causalFlowDirection: 'FORWARD' },
      { id: 'se2', sourceId: 'sec-session', targetId: 'sec-threat', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 19, causalFlowDirection: 'FORWARD' },
      { id: 'se3', sourceId: 'sec-threat', targetId: 'sec-pep', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 54, causalFlowDirection: 'FORWARD' },
      { id: 'se4', sourceId: 'sec-pep', targetId: 'sec-okta', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 22, causalFlowDirection: 'FORWARD' }
    ],
    spans: [
      { id: 'sec-s1', traceId: '77a0129bcfe441208914ab01288cfa01', name: 'WAFRequestIngress', service: 'edge-waf-gateway', status: 'SUCCESS', startTimeOffsetMs: 0, durationMs: 142, httpStatus: 200, protocol: 'HTTP/2', attributes: { 'ip.source': '103.22.201.8' } },
      { id: 'sec-s2', traceId: '77a0129bcfe441208914ab01288cfa01', parentSpanId: 'sec-s1', name: 'LookupActiveSessionCoordinates', service: 'session-evaluator', status: 'SUCCESS', startTimeOffsetMs: 14, durationMs: 19, httpStatus: 200, protocol: 'REST', attributes: { 'redis.hit': true } },
      { id: 'sec-s3', traceId: '77a0129bcfe441208914ab01288cfa01', parentSpanId: 'sec-s1', name: 'EvaluateTravelTrajectoryAnomaly', service: 'threat-intel-scorer', status: 'ERROR', startTimeOffsetMs: 35, durationMs: 54, httpStatus: 403, protocol: 'REST', attributes: { 'anomaly.score': 0.981 } },
      { id: 'sec-s4', traceId: '77a0129bcfe441208914ab01288cfa01', parentSpanId: 'sec-s1', name: 'TriggerZeroTrustRevocationPolicy', service: 'policy-enforcement-point', status: 'ERROR', startTimeOffsetMs: 91, durationMs: 22, httpStatus: 403, protocol: 'Internal', attributes: { 'action': 'REVOKE' } },
      { id: 'sec-s5', traceId: '77a0129bcfe441208914ab01288cfa01', parentSpanId: 'sec-s4', name: 'InvalidateOktaTokens', service: 'okta-token-terminator', status: 'SUCCESS', startTimeOffsetMs: 115, durationMs: 35, httpStatus: 204, protocol: 'REST', attributes: { 'okta.status': 'REVOKED' } }
    ]
  },
  {
    id: 'TRC-2026-INS-5519',
    traceId: '12bf994401a884e91024bc01988ef411',
    fingerprintHash: '33e18a901bc0942188fa90123ef89021cb891104eab89023412ea880911bcda1',
    eventHash: '891044ba019238bc0019248ef7820129',
    decisionVersion: 'v3.7.0-claims',
    timestamp: '2026-10-06T19:22:11.109Z',
    industry: 'INSURANCE',
    decisionType: 'Motor Casualty Auto-Claim Payout Settlement',
    entityId: 'CLAIM-AU-2026-993',
    finalOutcome: 'APPROVED',
    confidenceScore: 0.964,
    riskScore: 12.1,
    totalDurationMs: 512,
    servicesCount: 7,
    spansCount: 12,
    responsibleService: 'policy-entitlement-service',
    rootCauseSummary: 'All criteria satisfied: High computer vision damage coherence (94.2%), clean telematics timestamp confirmation, and zero fraud syndicate linkages.',
    naturalLanguageExplanation: 'Policyholder filed an autonomous first-notice-of-loss for rear-end bumper impact ($4,850 claim). The Computer Vision Damage Estimator corroborated the photographic damage against OEM vehicle geometry specifications. Connected-car telematics validated vehicle deceleration (-3.8G) at 14:28:11 matching the police collision report. The Fraud Graph Network identified 0 shared identifiers across existing claimant rings. Direct payout approved within sub-second latency.',
    executiveSummary: 'Automated Straight-Through-Processing (STP) claim settlement executed under Comprehensive Casualty Policy P-90812. Zero manual intervention required.',
    regulatoryFlags: [
      {
        framework: 'EU_AI_ACT',
        rule: 'Article 13 - Transparency of Automated Claim Adjudication',
        status: 'COMPLIANT',
        detail: 'Clear itemized repair estimate and image saliency heatmaps generated for claimant portal access.',
        code: 'EU-AI-ART13'
      },
      {
        framework: 'GDPR_ART_22',
        rule: 'Article 22(1) - Right to Contest Payout Calculation',
        status: 'COMPLIANT',
        detail: 'Dispute link and independent appraiser arbitration notice automatically appended to customer dispatch.',
        code: 'GDPR-ART22-DISP'
      }
    ],
    inputParameters: {
      claimAmountUsd: 4850,
      damageLocation: 'Rear Bumper & Sensor Array',
      telematicsGForce: -3.8,
      policyAgeMonths: 38,
      previousClaimsCount: 0,
      fraudSyndicateCentrality: 0.002
    },
    features: [
      {
        featureName: 'CV Photographic Damage Match',
        category: 'IDENTITY',
        featureValue: '94.2% Coherence',
        baselineValue: '≥ 80.0%',
        shapValue: 0.512,
        normalizedImportance: 0.45,
        humanReadableImpact: 'High precision match to OEM rear structural deformation patterns.',
        direction: 'POSITIVE'
      },
      {
        featureName: 'Connected Telematics G-Force Match',
        category: 'TELEMETRY',
        featureValue: '-3.8 G deceleration',
        baselineValue: 'Threshold match',
        shapValue: 0.312,
        normalizedImportance: 0.28,
        humanReadableImpact: 'Inertial crash pulse telematics corroborates reported impact physics exactly.',
        direction: 'POSITIVE'
      },
      {
        featureName: 'Claimant Fraud Syndicate Score',
        category: 'BEHAVIORAL',
        featureValue: '0.002 (Clean)',
        baselineValue: '≤ 0.150',
        shapValue: 0.188,
        normalizedImportance: 0.18,
        humanReadableImpact: 'Isolated node in fraud network graph; zero contact with flagged repair rings.',
        direction: 'POSITIVE'
      },
      {
        featureName: 'Policy Tenancy & History',
        category: 'HISTORICAL',
        featureValue: '38 Months (Zero Prior Claims)',
        baselineValue: '12 Months',
        shapValue: 0.095,
        normalizedImportance: 0.09,
        humanReadableImpact: 'Exemplary customer loss history strengthens automated approval confidence.',
        direction: 'POSITIVE'
      }
    ],
    nodes: [
      {
        id: 'ins-gw',
        spanId: 'ins-s1',
        serviceName: 'claims-gateway',
        componentType: 'API_GATEWAY',
        title: 'Mobile FNOL Intake Gateway',
        executionTimeMs: 24,
        status: 'SUCCESS',
        contributionScore: 4,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { channel: 'iOS App v4.12', payloadSizeKb: 1420 },
        x: 60,
        y: 180
      },
      {
        id: 'ins-cv',
        spanId: 'ins-s2',
        serviceName: 'cv-damage-estimator',
        componentType: 'ML_MODEL',
        title: 'ResNet-101 Damage Segmentation Model',
        executionTimeMs: 240,
        status: 'SUCCESS',
        contributionScore: 48,
        causalWeight: 0.92,
        decisionImpact: 'PRIMARY_DRIVER',
        modelDetails: {
          modelName: 'resnet-damage-estimator',
          modelVersion: 'v5.0.1',
          framework: 'PyTorch / TensorRT',
          inferenceLatencyMs: 232,
          predictionScore: 0.942,
          threshold: 0.800
        },
        attributes: { detectedParts: ['rear_bumper_fascia', 'ultrasonic_sensor_pack'] },
        x: 320,
        y: 180
      },
      {
        id: 'ins-fraud',
        spanId: 'ins-s3',
        serviceName: 'fraud-graph-engine',
        componentType: 'FRAUD_DETECTION',
        title: 'Neo4j Syndicate Ring Analyzer',
        executionTimeMs: 110,
        status: 'SUCCESS',
        contributionScore: 26,
        causalWeight: 0.85,
        decisionImpact: 'SUPPORTING_FACTOR',
        attributes: { graphTraversalHops: 3, ringCentrality: 0.002 },
        x: 580,
        y: 180
      },
      {
        id: 'ins-policy',
        spanId: 'ins-s4',
        serviceName: 'policy-entitlement-service',
        componentType: 'POLICY_RULES',
        title: 'Automated Payout Authorization Rules',
        executionTimeMs: 38,
        status: 'SUCCESS',
        contributionScore: 16,
        causalWeight: 0.95,
        decisionImpact: 'PRIMARY_DRIVER',
        attributes: { deductibleApplied: 500, netPayoutUsd: 4350 },
        x: 820,
        y: 180
      },
      {
        id: 'ins-disburse',
        spanId: 'ins-s5',
        serviceName: 'banking-disbursal-service',
        componentType: 'DECISION_SERVICE',
        title: 'FedNow Real-Time Settlement Rail',
        executionTimeMs: 44,
        status: 'SUCCESS',
        contributionScore: 6,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { rail: 'FedNow Instant', status: 'INITIATED' },
        x: 1060,
        y: 180
      }
    ],
    edges: [
      { id: 'ie1', sourceId: 'ins-gw', targetId: 'ins-cv', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 24, causalFlowDirection: 'FORWARD' },
      { id: 'ie2', sourceId: 'ins-gw', targetId: 'ins-fraud', dependencyType: 'DIRECT_CALL', isCriticalPath: false, latencyMs: 24, causalFlowDirection: 'FORWARD' },
      { id: 'ie3', sourceId: 'ins-cv', targetId: 'ins-policy', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 240, causalFlowDirection: 'FORWARD' },
      { id: 'ie4', sourceId: 'ins-fraud', targetId: 'ins-policy', dependencyType: 'CAUSAL_GATING', isCriticalPath: false, latencyMs: 110, causalFlowDirection: 'FORWARD' },
      { id: 'ie5', sourceId: 'ins-policy', targetId: 'ins-disburse', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 38, causalFlowDirection: 'FORWARD' }
    ],
    spans: [
      { id: 'ins-s1', traceId: '12bf994401a884e91024bc01988ef411', name: 'SubmitMobileFNOL', service: 'claims-gateway', status: 'SUCCESS', startTimeOffsetMs: 0, durationMs: 512, httpStatus: 200, protocol: 'REST', attributes: { 'channel': 'iOS' } },
      { id: 'ins-s2', traceId: '12bf994401a884e91024bc01988ef411', parentSpanId: 'ins-s1', name: 'SegmentDamageImages', service: 'cv-damage-estimator', status: 'SUCCESS', startTimeOffsetMs: 26, durationMs: 240, httpStatus: 200, protocol: 'gRPC', attributes: { 'images': 4 } },
      { id: 'ins-s3', traceId: '12bf994401a884e91024bc01988ef411', parentSpanId: 'ins-s1', name: 'CheckFraudGraphSyndicates', service: 'fraud-graph-engine', status: 'SUCCESS', startTimeOffsetMs: 30, durationMs: 110, httpStatus: 200, protocol: 'gRPC', attributes: { 'neo4j.hit': true } },
      { id: 'ins-s4', traceId: '12bf994401a884e91024bc01988ef411', parentSpanId: 'ins-s1', name: 'VerifyPolicyEntitlements', service: 'policy-entitlement-service', status: 'SUCCESS', startTimeOffsetMs: 275, durationMs: 38, httpStatus: 200, protocol: 'Internal', attributes: { 'payout': 4350 } },
      { id: 'ins-s5', traceId: '12bf994401a884e91024bc01988ef411', parentSpanId: 'ins-s1', name: 'DispatchFedNowSettlement', service: 'banking-disbursal-service', status: 'SUCCESS', startTimeOffsetMs: 320, durationMs: 44, httpStatus: 200, protocol: 'REST', attributes: { 'rail': 'FedNow' } }
    ]
  },
  {
    id: 'TRC-2026-ECOM-1104',
    traceId: '90a1bc2277d018fe3910948ac0192931',
    fingerprintHash: '44da11094bc12304918ef019284cb89110293847aef90123847be1029384711c',
    eventHash: '22bc9940182377fa01928374be891122',
    decisionVersion: 'v2.1.9-fraud',
    timestamp: '2026-10-06T18:09:44.331Z',
    industry: 'ECOMMERCE',
    decisionType: 'Synthetic Bot & Card Velocity Interception',
    entityId: 'ORD-FLSH-8841',
    finalOutcome: 'REJECTED',
    confidenceScore: 0.993,
    riskScore: 97.8,
    totalDurationMs: 98,
    servicesCount: 5,
    spansCount: 8,
    responsibleService: 'fraud-detection-ml',
    rootCauseSummary: 'Synthetic bot signature flagged: Zero mouse trajectory curvature (100% linear vector), headless Chrome webdriver artifacts, and 14 BIN card attempts within 60 seconds.',
    naturalLanguageExplanation: 'An automated high-frequency checkout attempt targeting high-demand hardware inventory was intercepted by the anti-bot edge classifier. Biometric telemetry analysis revealed synthetic mouse movement (zero jitter, microsecond clicks). Device fingerprinting revealed an exposed `navigator.webdriver = true` flag inside an evasive Chromium worker. Simultaneously, the BIN velocity monitor identified 14 sequential card attempts from distinct stolen cards tied to the same session token.',
    executiveSummary: 'Automated Fraud Interception: High-frequency card cycling bot thwarted. IP range added to edge quarantine blacklist.',
    regulatoryFlags: [
      {
        framework: 'EU_AI_ACT',
        rule: 'Article 13 - Transparency of Automated Security Countermeasures',
        status: 'COMPLIANT',
        detail: 'Bot interception telemetry logged to SOC WAF security ledger.',
        code: 'EU-AI-BOT-WAF'
      }
    ],
    inputParameters: {
      cartTotalUsd: 1899.99,
      itemSku: 'GPU-RTX-5090-OC',
      sessionVelocityAttempts: 14,
      mouseTrajectoryEntropy: 0.01,
      webdriverFlag: true,
      cardBinCountry: 'Multiple (BG, RU, BR, US)'
    },
    features: [
      {
        featureName: 'Biometric Mouse Entropy',
        category: 'BEHAVIORAL',
        featureValue: '0.01 (Linear)',
        baselineValue: '≥ 0.65 (Human)',
        shapValue: -0.620,
        normalizedImportance: 0.48,
        humanReadableImpact: 'Definitive automated headless script behavior; zero human micro-jitter.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Card BIN Velocity (60s)',
        category: 'BEHAVIORAL',
        featureValue: '14 cards tested',
        baselineValue: '1 card',
        shapValue: -0.310,
        normalizedImportance: 0.32,
        humanReadableImpact: 'Classic automated carding attack pattern cycling compromised numbers.',
        direction: 'NEGATIVE'
      },
      {
        featureName: 'Headless Browser Artifacts',
        category: 'TELEMETRY',
        featureValue: 'Webdriver Active',
        baselineValue: 'Native Chrome',
        shapValue: -0.190,
        normalizedImportance: 0.20,
        humanReadableImpact: 'Selenium/Puppeteer fingerprint confirmed in canvas inspection.',
        direction: 'NEGATIVE'
      }
    ],
    nodes: [
      {
        id: 'ecom-gw',
        spanId: 'ecom-s1',
        serviceName: 'edge-store-gateway',
        componentType: 'API_GATEWAY',
        title: 'Checkout API Ingress',
        executionTimeMs: 8,
        status: 'SUCCESS',
        contributionScore: 2,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { ip: '185.220.101.5', asn: 'TOR-EXIT' },
        x: 60,
        y: 180
      },
      {
        id: 'ecom-bio',
        spanId: 'ecom-s2',
        serviceName: 'biometrics-analyzer',
        componentType: 'DATA_SERVICE',
        title: 'Behavioral Biometrics Analyzer',
        executionTimeMs: 22,
        status: 'WARN',
        contributionScore: 30,
        causalWeight: -0.85,
        decisionImpact: 'PRIMARY_DRIVER',
        attributes: { mouseEntropy: 0.01, keystrokeVarianceMs: 0.4 },
        x: 290,
        y: 180
      },
      {
        id: 'ecom-ml',
        spanId: 'ecom-s3',
        serviceName: 'fraud-detection-ml',
        componentType: 'FRAUD_DETECTION',
        title: 'Real-Time Bot & Carding GNN Classifier',
        executionTimeMs: 44,
        status: 'ERROR',
        errorDetails: 'Bot Probability 0.993 exceeded maximum threshold 0.15',
        contributionScore: 62,
        causalWeight: -0.99,
        decisionImpact: 'CRITICAL_BLOCKER',
        modelDetails: {
          modelName: 'gnn-bot-carding-detector',
          modelVersion: 'v2.1.9',
          framework: 'PyTorch / ONNX',
          inferenceLatencyMs: 41,
          predictionScore: 0.993,
          threshold: 0.150
        },
        attributes: { cardBinCount: 14, botProbability: 0.993 },
        x: 560,
        y: 180
      },
      {
        id: 'ecom-policy',
        spanId: 'ecom-s4',
        serviceName: 'fraud-rules-service',
        componentType: 'POLICY_RULES',
        title: 'Instant Hard Block Policy',
        executionTimeMs: 14,
        status: 'ERROR',
        errorDetails: 'Hard Reject: RULE_CARD_VELOCITY_OVER_3 fired',
        contributionScore: 40,
        causalWeight: -0.95,
        decisionImpact: 'CRITICAL_BLOCKER',
        attributes: { rule: 'RULE_CARD_VELOCITY_OVER_3', quarantine: true },
        x: 820,
        y: 180
      },
      {
        id: 'ecom-resp',
        spanId: 'ecom-s5',
        serviceName: 'decision-dispatcher',
        componentType: 'DECISION_SERVICE',
        title: 'Payment Gateway Interceptor',
        executionTimeMs: 10,
        status: 'SUCCESS',
        contributionScore: 4,
        causalWeight: 0.0,
        decisionImpact: 'PASS_THROUGH',
        attributes: { action: 'PAYMENT_DROPPED_SILENTLY' },
        x: 1060,
        y: 180
      }
    ],
    edges: [
      { id: 'ee1', sourceId: 'ecom-gw', targetId: 'ecom-bio', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 8, causalFlowDirection: 'FORWARD' },
      { id: 'ee2', sourceId: 'ecom-bio', targetId: 'ecom-ml', dependencyType: 'DATA_FEED', isCriticalPath: true, latencyMs: 22, causalFlowDirection: 'FORWARD' },
      { id: 'ee3', sourceId: 'ecom-ml', targetId: 'ecom-policy', dependencyType: 'CAUSAL_GATING', isCriticalPath: true, latencyMs: 44, causalFlowDirection: 'FORWARD' },
      { id: 'ee4', sourceId: 'ecom-policy', targetId: 'ecom-resp', dependencyType: 'DIRECT_CALL', isCriticalPath: true, latencyMs: 14, causalFlowDirection: 'FORWARD' }
    ],
    spans: [
      { id: 'ecom-s1', traceId: '90a1bc2277d018fe3910948ac0192931', name: 'POST /api/v1/checkout/pay', service: 'edge-store-gateway', status: 'SUCCESS', startTimeOffsetMs: 0, durationMs: 98, httpStatus: 200, protocol: 'HTTP/2', attributes: { 'edge.node': 'iad-1' } },
      { id: 'ecom-s2', traceId: '90a1bc2277d018fe3910948ac0192931', parentSpanId: 'ecom-s1', name: 'CalculateBiometricVectorEntropy', service: 'biometrics-analyzer', status: 'WARN', startTimeOffsetMs: 10, durationMs: 22, httpStatus: 200, protocol: 'Internal', attributes: { 'entropy': 0.01 } },
      { id: 'ecom-s3', traceId: '90a1bc2277d018fe3910948ac0192931', parentSpanId: 'ecom-s1', name: 'ClassifyBotGNN', service: 'fraud-detection-ml', status: 'ERROR', startTimeOffsetMs: 34, durationMs: 44, httpStatus: 403, protocol: 'gRPC', attributes: { 'bot.prob': 0.993 } },
      { id: 'ecom-s4', traceId: '90a1bc2277d018fe3910948ac0192931', parentSpanId: 'ecom-s1', name: 'TriggerInstantBlacklist', service: 'fraud-rules-service', status: 'ERROR', startTimeOffsetMs: 80, durationMs: 14, httpStatus: 403, protocol: 'Internal', attributes: { 'rule': 'KILL_VELOCITY' } }
    ]
  }
];
