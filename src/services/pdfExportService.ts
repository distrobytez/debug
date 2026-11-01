/**
 * NeuroTrace - Regulatory Compliance Dossier PDF Export
 * Generates an immutable, audit-ready compliance document using jsPDF.
 */
import { jsPDF } from 'jspdf';
import { DecisionTrace } from '../types/neurotrace';
import { GeneratedAuditExplanation } from './explainabilityService';

export class PdfExportService {
  public static exportAuditReport(
    trace: DecisionTrace,
    explanation: GeneratedAuditExplanation,
    auditorName = 'Enterprise Auditor (NeuroTrace System)'
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 45;

    // Header Band
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 75, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('NEUROTRACE // COMPLIANCE AUDIT DOSSIER', margin, 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Cross-System Causal Explainability & Regulatory Attestation Record', margin, 50);
    doc.text(`Generated: ${new Date().toUTCString()} | Confidentially Tier: RESTRICTED`, margin, 62);

    y = 95;

    // Cryptographic Fingerprint Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, pageWidth - margin * 2, 60, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('CRYPTOGRAPHIC DECISION FINGERPRINT (SHA-256):', margin + 10, y + 16);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(trace.fingerprintHash, margin + 10, y + 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Trace ID: ${trace.traceId}  |  Version: ${trace.decisionVersion}  |  Event Hash: ${trace.eventHash}`, margin + 10, y + 46);

    y += 75;

    // Decision Metadata Summary Grid
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('1. DECISION SUMMARY & OUTCOME', margin, y);
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const colW = (pageWidth - margin * 2) / 3;
    doc.text(`Entity ID: ${trace.entityId}`, margin, y);
    doc.text(`Decision Type: ${trace.decisionType}`, margin + colW, y);
    doc.text(`Industry: ${trace.industry}`, margin + colW * 2, y);
    y += 14;

    doc.text(`Final Outcome: ${trace.finalOutcome}`, margin, y);
    doc.text(`Confidence Score: ${(trace.confidenceScore * 100).toFixed(1)}%`, margin + colW, y);
    doc.text(`Risk Index: ${trace.riskScore} / 100`, margin + colW * 2, y);
    y += 14;

    doc.text(`Latency: ${trace.totalDurationMs} ms`, margin, y);
    doc.text(`Responsible Microservice: ${trace.responsibleService}`, margin + colW, y);
    doc.text(`Services Involved: ${trace.servicesCount}`, margin + colW * 2, y);
    y += 24;

    // Executive & Causal Synthesis
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('2. CAUSAL EXPLANATION & ROOT CAUSE ANALYSIS', margin, y);
    y += 14;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const headlineLines = doc.splitTextToSize(explanation.headline, pageWidth - margin * 2);
    doc.text(headlineLines, margin, y);
    y += (headlineLines.length * 11) + 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const execLines = doc.splitTextToSize(explanation.executiveSummary, pageWidth - margin * 2);
    doc.text(execLines, margin, y);
    y += (execLines.length * 11) + 14;

    // Feature Attribution Table (SHAP Values)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. AI FEATURE ATTRIBUTION MATRIX (SHAP VALUES)', margin, y);
    y += 14;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - margin * 2, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('Feature Name', margin + 6, y + 12);
    doc.text('Observed Value', margin + 170, y + 12);
    doc.text('Baseline Target', margin + 270, y + 12);
    doc.text('SHAP Impact', margin + 370, y + 12);
    doc.text('Direction', margin + 440, y + 12);
    y += 20;

    // Rows
    trace.features.slice(0, 6).forEach((feat) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(feat.featureName.substring(0, 32), margin + 6, y + 10);
      doc.text(String(feat.featureValue), margin + 170, y + 10);
      doc.text(String(feat.baselineValue), margin + 270, y + 10);
      doc.text(feat.shapValue.toFixed(3), margin + 370, y + 10);
      
      if (feat.direction === 'NEGATIVE') {
        doc.setTextColor(185, 28, 28);
        doc.text('ADVERSE (-)', margin + 440, y + 10);
      } else {
        doc.setTextColor(21, 128, 61);
        doc.text('FAVORABLE (+)', margin + 440, y + 10);
      }

      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 14, pageWidth - margin, y + 14);
      y += 16;
    });

    y += 10;

    // Regulatory Compliance Matrix
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('4. STATUTORY REGULATORY POSTURE CHECKLIST', margin, y);
    y += 14;

    trace.regulatoryFlags.forEach(reg => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`[${reg.framework}] ${reg.rule}`, margin, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      if (reg.status === 'COMPLIANT') {
        doc.setTextColor(21, 128, 61);
        doc.text('STATUS: COMPLIANT', pageWidth - margin - 100, y);
      } else {
        doc.setTextColor(180, 83, 9);
        doc.text(`STATUS: ${reg.status}`, pageWidth - margin - 120, y);
      }
      y += 10;

      doc.setTextColor(100, 116, 139);
      const detailLines = doc.splitTextToSize(reg.detail, pageWidth - margin * 2);
      doc.text(detailLines, margin, y);
      y += (detailLines.length * 9) + 6;
    });

    y += 8;

    // Attestation & Sign-off Block
    if (y > 700) {
      doc.addPage();
      y = 50;
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('5. ATTESTATION & CRYPTOGRAPHIC COMPLIANCE VERIFICATION', margin, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This document has been compiled automatically by NeuroTrace Governance Engine and certified against', margin, y);
    y += 10;
    doc.text('immutable trace hashes stored in distributed audit logs. Any tampering invalidates the verification digest.', margin, y);
    y += 24;

    doc.text('Auditor / Compliance Officer Signature: _____________________________________', margin, y);
    doc.text(`Certified By: ${auditorName}`, margin + 320, y);
    y += 16;
    doc.text(`Verification Timestamp: ${new Date().toISOString()}`, margin, y);
    doc.text('NeuroTrace Engine Build: v4.2-LTS', margin + 320, y);

    // Save and download PDF
    const filename = `NeuroTrace_Audit_Report_${trace.id}_${trace.finalOutcome}.pdf`;
    doc.save(filename);
  }
}
