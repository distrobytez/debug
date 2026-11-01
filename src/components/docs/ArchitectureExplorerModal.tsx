/**
 * NeuroTrace - Architecture & Enterprise Specification Explorer
 * Interactive documentation hub covering Phase 1 through Phase 10:
 * Architecture Diagrams, SQL DDL Schema, Spring Boot 3 & FastAPI Code Structures,
 * Kubernetes Manifests, and Regulatory Specifications.
 */
import React, { useState } from 'react';
import { X, BookOpen, Database, Server, Cpu, Cloud, Shield, CheckCircle2, Copy } from 'lucide-react';

interface ArchitectureExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureExplorerModal: React.FC<ArchitectureExplorerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4' | 'PHASE5' | 'PHASE7'>('PHASE2');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-5xl h-[88vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                NeuroTrace Enterprise System Architecture Specifications
              </h3>
              <p className="text-[11px] text-slate-400">
                Phase 1 - Phase 10 Production Blueprint: Spring Boot 3, FastAPI, Causal DAG, MySQL & K8s
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-950 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSection('PHASE1')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeSection === 'PHASE1' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 1: SRS & Requirements
          </button>
          <button
            onClick={() => setActiveSection('PHASE2')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeSection === 'PHASE2' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 2: Enterprise Architecture & C4
          </button>
          <button
            onClick={() => setActiveSection('PHASE3')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeSection === 'PHASE3' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 3: Database & SQL Schema
          </button>
          <button
            onClick={() => setActiveSection('PHASE4')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeSection === 'PHASE4' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 4: Spring Boot Microservices
          </button>
          <button
            onClick={() => setActiveSection('PHASE5')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeSection === 'PHASE5' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 5: FastAPI AI Causal Engine
          </button>
          <button
            onClick={() => setActiveSection('PHASE7')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeSection === 'PHASE7' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 7: DevOps & Kubernetes
          </button>
        </div>

        {/* Section Viewport */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-300 space-y-6">
          {activeSection === 'PHASE1' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">PHASE 1: SOFTWARE REQUIREMENT SPECIFICATION (SRS)</h4>
              <p className="text-slate-400 leading-relaxed">
                NeuroTrace addresses the fundamental gap in modern distributed tracing: standard OpenTelemetry records request paths (Where did the request go?), but fails to capture causality (Why was the loan rejected? Which model threshold or policy rule intercepted execution?).
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded border border-slate-800 space-y-2">
                  <h5 className="font-semibold text-white">Functional Requirements:</h5>
                  <ul className="space-y-1 text-slate-400 list-disc pl-4">
                    <li>High-throughput OpenTelemetry Collector (100k+ traces/sec via Redis Streams/Kafka).</li>
                    <li>Cryptographic Fingerprint Generator (SHA-256 content hashing of input matrices).</li>
                    <li>Dynamic Causal Graph (DAG) construction with Critical Path extraction.</li>
                    <li>Local Feature Attribution using SHAP/LIME kernels with baseline comparisons.</li>
                    <li>Sub-second Counterfactual Audit Replay Simulator.</li>
                    <li>Regulatory compliance dossiers for EU AI Act, GDPR Art. 22, and Fair Lending ECOA.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900 rounded border border-slate-800 space-y-2">
                  <h5 className="font-semibold text-white">Non-Functional Standards:</h5>
                  <ul className="space-y-1 text-slate-400 list-disc pl-4">
                    <li>Availability: 99.99% multi-region active-active deployment.</li>
                    <li>Latency: Sub-500ms causal attribution synthesis.</li>
                    <li>Audit Retention: 7-year immutable compliance storage (BCBS 239).</li>
                    <li>Security: TLS 1.3, AES-256 field encryption, OAuth2 / OIDC mTLS tokens.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'PHASE2' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">PHASE 2: ENTERPRISE ARCHITECTURE & C4 CONTAINER MODEL</h4>
              <p className="text-slate-400 leading-relaxed">
                NeuroTrace employs Domain-Driven Design (DDD) with clean microservice boundaries. Telemetry ingestion is decoupled from AI inference through distributed event brokers.
              </p>

              <div className="p-4 bg-slate-900 rounded border border-slate-800">
                <h5 className="font-semibold text-cyan-400 mb-2 font-mono">MICROSERVICE TOPOLOGY:</h5>
                <pre className="font-mono text-[11px] text-slate-300 leading-tight">
{`Client Applications / Edge Systems
       │
       ▼ [OTel gRPC / REST Port 4317]
┌──────────────────────────────────────────────┐
│  NeuroTrace API Gateway (Spring Cloud 8080)  │  ◄── Rate Limiting, CORS, JWT
└──────────────────────┬───────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
┌───────────────┐             ┌─────────────────┐
│ Collector Svc │             │ Auth Svc (8081) │ ◄── Keycloak / Spring Security
│ (WebFlux 8082)│             └─────────────────┘
└──────┬────────┘
       │ [Redis Streams / Kafka Topic: trace.raw.spans]
       ▼
┌───────────────────────────────┐
│   Processor Service (8083)    │ ◄── DAG Builder, Causal Edge Mapping
└──────┬────────────────────────┘
       │ [gRPC Port 50051]
       ▼
┌───────────────────────────────┐
│ FastAPI AI Engine (8084)      │ ◄── SHAP / LIME, NetworkX, Replay Simulator
└──────┬────────────────────────┘
       │
       ▼
┌───────────────────────────────┐
│ MySQL Aurora + Redis Cluster  │ ◄── Persistent Audit DB + Caching
└───────────────────────────────┘`}
                </pre>
              </div>
            </div>
          )}

          {activeSection === 'PHASE3' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">PHASE 3: DATABASE ARCHITECTURE & NORMALIZED SQL SCHEMA</h4>
              <p className="text-slate-400">
                Fully normalized 3NF relational schema with foreign key constraints, indexes, and immutable audit log tables.
              </p>

              <pre className="p-4 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-96">
{`-- 1. DECISION TRACE MASTER TABLE
CREATE TABLE decision_traces (
    id VARCHAR(64) PRIMARY KEY,
    trace_id VARCHAR(32) NOT NULL,
    fingerprint_hash CHAR(64) NOT NULL,
    event_hash VARCHAR(64) NOT NULL,
    decision_version VARCHAR(32) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    industry ENUM('FINTECH_BANKING','HEALTHCARE','CYBERSECURITY','INSURANCE','ECOMMERCE') NOT NULL,
    decision_type VARCHAR(128) NOT NULL,
    final_outcome ENUM('APPROVED','REJECTED','ESCALATED','BLOCKED','FLAGGED') NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL,
    total_duration_ms INT UNSIGNED NOT NULL,
    responsible_service VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_trace_lookup (trace_id),
    INDEX idx_fingerprint (fingerprint_hash),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CAUSAL NODES TABLE
CREATE TABLE causal_nodes (
    id VARCHAR(64) PRIMARY KEY,
    trace_id VARCHAR(64) NOT NULL,
    service_name VARCHAR(64) NOT NULL,
    component_type VARCHAR(32) NOT NULL,
    title VARCHAR(128) NOT NULL,
    execution_time_ms INT UNSIGNED NOT NULL,
    status ENUM('SUCCESS','ERROR','WARN') NOT NULL,
    contribution_score DECIMAL(5,2) NOT NULL,
    causal_weight DECIMAL(4,3) NOT NULL,
    decision_impact VARCHAR(32) NOT NULL,
    attributes_json JSON NOT NULL,
    FOREIGN KEY (trace_id) REFERENCES decision_traces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. IMMUTABLE REGULATORY AUDIT LOG
CREATE TABLE audit_regulatory_attestations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trace_id VARCHAR(64) NOT NULL,
    framework VARCHAR(32) NOT NULL,
    rule_directive VARCHAR(128) NOT NULL,
    compliance_status VARCHAR(32) NOT NULL,
    auditor_principal VARCHAR(128) NOT NULL,
    attestation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cryptographic_digest CHAR(64) NOT NULL,
    FOREIGN KEY (trace_id) REFERENCES decision_traces(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
              </pre>
            </div>
          )}

          {activeSection === 'PHASE4' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">PHASE 4: SPRING BOOT 3 (JAVA 21) MICROSERVICES</h4>
              <p className="text-slate-400">
                Production Spring Boot architecture featuring WebFlux reactive collector, Spring Data JPA, Hibernate, MapStruct, and Resilience4j circuit breakers.
              </p>

              <pre className="p-4 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-96">
{`package com.neurotrace.processor.presentation.controllers;

@RestController
@RequestMapping("/api/v1/causal-traces")
@RequiredArgsConstructor
@Tag(name = "Causal Explainability Engine")
public class CausalTraceController {

    private final CausalAnalysisService causalAnalysisService;
    private final ReplaySimulatorService replaySimulatorService;

    @GetMapping("/{traceId}")
    @PreAuthorize("hasAuthority('trace:read')")
    public ResponseEntity<CausalTraceResponseDTO> getCausalTrace(@PathVariable String traceId) {
        CausalTrace trace = causalAnalysisService.reconstructCausalGraph(traceId);
        return ResponseEntity.ok(CausalTraceMapper.INSTANCE.toDTO(trace));
    }

    @PostMapping("/{traceId}/replay")
    @PreAuthorize("hasAuthority('trace:replay')")
    public ResponseEntity<ReplaySimulationResultDTO> executeReplay(
            @PathVariable String traceId,
            @Valid @RequestBody ReplayRequestDTO request) {
        ReplayResult result = replaySimulatorService.simulateHypothetical(traceId, request.getMutatedInputs());
        return ResponseEntity.ok(result);
    }
}`}
              </pre>
            </div>
          )}

          {activeSection === 'PHASE5' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">PHASE 5: FASTAPI AI EXPLAINABILITY ENGINE (PYTHON 3.11)</h4>
              <p className="text-slate-400">
                FastAPI asynchronous microservice executing SHAP TreeExplainer, NetworkX directed graph causal inference, and Gemini natural language generation.
              </p>

              <pre className="p-4 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-96">
{`from fastapi import FastAPI, Depends, HTTPException, status
import networkx as nx
import shap
from pydantic import BaseModel

app = FastAPI(title="NeuroTrace AI Causal & Attribution Engine", version="4.2.0")

class AttributionRequest(BaseModel):
    trace_id: str
    feature_vector: dict[str, float]
    model_version: str

@app.post("/api/v1/attribution/shap")
async def calculate_shap_contributions(req: AttributionRequest):
    # Execute tree-based local explanation
    explainer = load_cached_explainer(req.model_version)
    shap_values = explainer(req.feature_vector)
    
    # Construct NetworkX DAG
    dag = nx.DiGraph()
    # Compute topological critical path
    critical_path = nx.dag_longest_path(dag, weight="causal_weight")
    
    return {
        "trace_id": req.trace_id,
        "shap_values": shap_values.values.tolist(),
        "critical_path": critical_path
    }`}
              </pre>
            </div>
          )}

          {activeSection === 'PHASE7' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">PHASE 7: DEVOPS, KUBERNETES & OBSERVABILITY</h4>
              <p className="text-slate-400">
                Cloud-native Kubernetes deployment with Helm charts, horizontal pod autoscaling (HPA), and Prometheus Alertmanager rules.
              </p>

              <pre className="p-4 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-96">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: neurotrace-causal-processor
  namespace: neurotrace-prod
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: processor
        image: ghcr.io/neurotrace/processor:v4.2.1
        resources:
          requests:
            cpu: "1000m"
            memory: "2Gi"
          limits:
            cpu: "4000m"
            memory: "8Gi"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8083`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
