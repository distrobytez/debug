# NeuroTrace: Cross-System Causal Explainability Platform

## Executive Summary

NeuroTrace is a decision intelligence and explainability dashboard designed for modern enterprise systems where automated choices are made across microservices, ML models, policy engines, and compliance workflows. The platform helps teams trace why a decision was made, which components influenced it, how risk and confidence evolved, and whether the outcome aligns with regulatory and operational standards.

This project is a full-stack-style front-end prototype that simulates an enterprise environment for:

- causal graph reconstruction of decision pipelines
- AI feature attribution and natural-language explanations
- audit replay and sensitivity analysis
- compliance and governance reporting
- executive monitoring across business-critical workflows

The application is built as a React + Vite dashboard and is meant to act as a demonstration platform for explainable AI, decision observability, and transparent automated governance.

---

## Problem Statement

Automated decisions are increasingly distributed across systems:

- authentication and identity services
- fraud or credit-risk engines
- rules-based policy evaluation
- machine learning inference models
- compliance gateways and audit systems

When a decision is approved, blocked, escalated, or rejected, most teams can see the final output but cannot easily answer:

- What caused the outcome?
- Which services or features drove the result?
- Were there hidden dependencies, cascading failures, or policy conflicts?
- Did the decision remain explainable and defensible under compliance rules?

NeuroTrace addresses this by turning opaque pipeline behavior into traceable, explainable narratives and visual causal evidence.

---

## Product Goals

The platform is built to provide end-to-end visibility across decision systems.

### Core goals

- Reconstruct causality across distributed execution traces
- Highlight the factors with greatest positive or negative impact
- Surface risk, confidence, latency, and pipeline drift
- Support audit-style replay on modified inputs or model versions
- Provide compliance checks against governance frameworks
- Present operational and executive-level summaries in a single interface

---

## End-to-End Workflow

The experience follows a realistic decision lifecycle from ingestion to explanation and governance.

### 1. Decision trace ingestion

An engineer, analyst, or compliance reviewer starts with a trace representing a real or simulated decision event. The application loads structured metadata such as:

- decision type
- root cause summary
- confidence and risk scores
- execution duration
- entity identity
- associated services and spans

These traces represent cross-system decisions with first-class observability data.

### 2. Causal graph analysis

The platform reconstructs a causal dependency graph from the selected trace. Nodes and edges indicate the interaction between services and components, including:

- API gateways
- risk engines
- policy engines
- fraud detection components
- ML model evaluations
- decision services
- downstream data services

This lets users visualize the decision path and identify the services that materially shaped the output.

### 3. Feature attribution

NeuroTrace evaluates each feature in context and indicates whether it pushed the decision toward approval, rejection, or escalation.

This includes:

- financial signals
- behavioral indicators
- historical context
- identity or telemetry metadata
- model-driven feature contributions

Each attribution provides a human-readable explanation and a normalized strength score to support decision transparency.

### 4. Explainability narrative

Instead of only showing raw model coefficients or service logs, the application translates technical data into natural language insight. This makes the system useful to:

- engineers debugging pipeline behavior
- auditors validating governance coverage
- compliance teams checking fairness and controls
- executives seeking high-level risk understanding

### 5. Replay and simulation

The audit replay studio allows the user to test how a decision would behave under modified inputs or alternative model versions. This helps answer:

- What if a feature changed?
- What if the model version was different?
- Did the outcome flip or become riskier?
- Which path diverged from the original decision?

### 6. Governance and compliance

The compliance dashboard checks the decision against a range of frameworks, including:

- EU AI Act
- GDPR Article 22
- ECOA fair lending principles
- ISO 42001 governance
- Basel III risk controls
- HIPAA-related clinical safeguards

Flagged items are categorized as compliant, flagged, or requiring manual review.

### 7. Executive analytics

The platform also calculates operational KPIs, such as:

- decisions in the last 24 hours
- rejection rate
- mean attribution latency
- active pipelines
- SLA compliance
- flagged audit counts
- high-risk services

This gives leadership a concise operational view without losing the underlying traceability.

---

## Primary Features

### Trace explorer

The main dashboard exposes the full set of decision traces and lets users switch between them quickly. Each trace includes:

- decision identity and timestamp
- entity context
- outcome and confidence
- risk score and latency
- service ownership
- causal and policy summaries

### Causal graph viewer

This is the visual backbone of the experience. It summarizes the decision path as a graph where nodes represent services and edges represent causal dependencies, data flow, or decision gating.

### Timeline view

The OpenTelemetry-style timeline shows the chronology of each span and its duration, making cross-service execution easy to analyze and compare.

### Feature attribution view

This module illustrates how input features or risk indicators contributed to the final result, allowing stakeholders to understand whether the decision was driven by strong negative or positive evidence.

### Explainability report

The report translates measurable model behavior into a composed decision narrative, highlighting:

- primary drivers
- risk factors
- root causes
- policy relevance
- overall decision quality

### Audit replay studio

This environment simulates alternative decision paths and quantifies how outcomes change under controlled modifications. It is especially useful for evaluating model drift, input mutation, or policy sensitivity.

### Compliance dashboard

This module maps the decision to a regulatory checklist and highlights any governance risk, manual-review requirements, or decision quality concerns.

### Executive analytics

This section converts the trace set into business intelligence, helping operations and leadership see trends, risk concentrations, and adoption quality across the system.

### Authentication and role modeling

The app includes a role-based auth layer with different user contexts, such as:

- administrators
- developers
- auditors
- compliance officers
- managers
- executives

Each role has a different permission profile and can inspect JWT-style tokens and role claims.

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- motion library for UI transitions

### Observability / Simulation

- structured trace models
- causal graph data structures
- service and span simulation
- replay-based decision comparison

### Document generation and integration

- jsPDF for report export support
- Gemini integration hooks for AI-assisted explanation generation
- environment-based configuration for app and API secrets

---

## Repository Structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── components/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── compliance/
│   │   ├── docs/
│   │   ├── layout/
│   │   ├── replay/
│   │   ├── simulator/
│   │   └── trace/
│   ├── data/
│   │   └── seedTraces.ts
│   ├── services/
│   │   ├── authContext.tsx
│   │   ├── causalEngine.ts
│   │   ├── explainabilityService.ts
│   │   └── pdfExportService.ts
│   └── types/
│       └── neurotrace.ts
└── dist/
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example file and set your local values:

```bash
cp .env.example .env
```

The project expects:

- GEMINI_API_KEY for AI-backed explainability calls
- APP_URL for app-specific runtime references

### Run the app locally

```bash
npm run dev
```

This starts the Vite application and exposes it on the configured port, which is set in the package script to port 3000.

### Build the project

```bash
npm run build
```

### Type-check the project

```bash
npm run lint
```

---

## Runtime Experience

When the project is started, the user is presented with a polished dashboard that guides them through the decision lifecycle rather than a generic form or list. It behaves like a multi-panel enterprise console.

The left and top-level navigation supports shifting between:

- decision traces
- causal graph analysis
- explainability and AI report
- replay studio
- compliance and governance
- executive analytics
- AWS Security Hub account audits

This enables different stakeholder groups to look at the same decision from different lenses while preserving the same underlying evidence.

---

## Example Use Cases

### Financial services

A lending platform uses NeuroTrace to review credit decisions and validate whether risk assumptions, identity data, and behavioral factors were fairly and causally applied.

### Healthcare automation

A care triage or claims decision engine can inspect patient-related decisions, highlight which clinical indicators mattered most, and verify compliance and traceability.

### Cybersecurity workflows

Incident classification and access decisions can be analyzed by causal path and policy gating to ensure that enforcement logic is consistent and auditable.

### Insurance underwriting

The platform supports policy-based underwriting review and helps verify that automated decisions are grounded in explainable evidence rather than opaque scoring alone.

---

## Security and Governance View

The platform is designed to reflect enterprise concerns around trust and explainability. It emphasizes:

- RBAC-style role handling
- signed JWT inspection
- clear permission boundaries
- governance-aware decision analysis
- explainability for regulated decisions

This is especially relevant in settings where AI and automated reasoning must be auditable and defensible.

---

## Risks and Future Enhancements

This project is a strong prototype and can be extended in several directions:

- real API integration with an observability backend
- persistent storage for traces and reports
- Kafka or event-stream ingestion
- live ML model and policy evaluation hooks
- export to PDF or structured compliance packages
- user authentication backed by a real identity provider
- analytics powered by a time-series or warehouse backend
- AWS Security Hub account audits through read-only cross-account roles

---

## Conclusion

NeuroTrace presents a realistic and practical vision for explainable, auditable decision systems in enterprise environments. It moves beyond dashboards of metrics and converts complex decision pipelines into transparent, causal, and compliance-aware workflows.

The project demonstrates how a modern application can combine observability, AI explainability, governance, and executive reporting in one coherent interface.

---

## Quick Start Summary

```bash
npm install
cp .env.example .env
npm run dev
```

Then open the local app on the Vite port and explore the trace, causal graph, compliance, replay, and executive analytics modules.

---

## AWS Security Hub account audits

The AWS Audit tab links accounts through a customer-created IAM role. The API assumes that role on the server with a per-link external ID and 15-minute STS credentials, then reads up to the 100 most recently updated active Security Hub findings. It does not accept or store AWS access keys.

### Prerequisites

- Node.js 22.13 or newer.
- An OIDC identity provider that issues signed JWT access tokens with `sub`, `iss`, and `aud` claims. The current role selector in this prototype creates demo tokens and is **not** production authentication; the API rejects them.
- An AWS service identity for this API with permission to call `sts:AssumeRole` on each linked account's audit role.
- Security Hub enabled in each account/region being audited.
- Durable, private storage for the SQLite account-link database in production.

### Configure and run

Set these server-side values in `.env` (do not prefix them with `VITE_`):

```env
AWS_AUDIT_JWKS_URL=https://YOUR_OIDC_ISSUER/.well-known/jwks.json
AWS_AUDIT_ISSUER=https://YOUR_OIDC_ISSUER/
AWS_AUDIT_AUDIENCE=YOUR_API_AUDIENCE
AWS_AUDIT_PRINCIPAL_ARN=arn:aws:iam::111122223333:role/NeuroTraceAuditService
AWS_AUDIT_DB_PATH=data/aws-audit.sqlite
API_PORT=4000
```

`AWS_AUDIT_PRINCIPAL_ARN` must be the exact IAM role used by the API's AWS credential provider. That role needs `sts:AssumeRole` permission for the customer audit roles. `AWS_AUDIT_DB_PATH` defaults to `data/aws-audit.sqlite`; persist and protect this file and its SQLite WAL files in production.

Run `npm run dev` to start the Vite app on port 3000 and the API on port 4000. For production, build the frontend with `npm run build`, then run `npm start` behind HTTPS with the OIDC and AWS environment configured.

### Link an account

1. In NeuroTrace, create an account link with the AWS account ID, IAM role ARN, and Security Hub region.
2. The app generates a unique external ID and displays a role trust statement for that user/account link. Add the statement to the linked role's trust relationship, preserving any other required statements. This statement trusts only the configured `AWS_AUDIT_PRINCIPAL_ARN` and that external ID.
3. Attach the AWS-managed `AWSSecurityHubReadOnlyAccess` policy to the linked role. Enable Security Hub in the selected region.
4. Choose **Verify & audit**. The API confirms role assumption and Security Hub read access before marking the link connected.

Account links are scoped to the verified OIDC `sub` claim. Removing a link deletes the NeuroTrace association but does not change IAM in the customer's AWS account; remove the NeuroTrace principal from the role trust policy to revoke access fully. Configure the OIDC provider, secure deployment secrets, HTTPS, and persistent database storage before enabling real users.
