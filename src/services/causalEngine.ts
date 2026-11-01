/**
 * NeuroTrace - Causal Graph & Attribution Engine
 * Implements DAG reconstruction, Critical Path Identification,
 * Service Contribution scoring, and Counterfactual Replay logic.
 */
import { CausalNode, CausalEdge, DecisionTrace, ReplayResult, FeatureAttribution } from '../types/neurotrace';

export class CausalEngine {
  /**
   * Identifies the primary critical path in the DAG leading to the decision outcome.
   */
  public static computeCriticalPath(nodes: CausalNode[], edges: CausalEdge[]): string[] {
    const criticalNodeIds = new Set<string>();
    
    // Nodes that are critical blockers or primary drivers are always in critical path
    nodes.forEach(n => {
      if (n.decisionImpact === 'CRITICAL_BLOCKER' || n.decisionImpact === 'PRIMARY_DRIVER') {
        criticalNodeIds.add(n.id);
      }
    });

    // Traverse edges marked as critical path
    edges.forEach(e => {
      if (e.isCriticalPath) {
        criticalNodeIds.add(e.sourceId);
        criticalNodeIds.add(e.targetId);
      }
    });

    return Array.from(criticalNodeIds);
  }

  /**
   * Calculates service contribution percentages summing to 100%
   */
  public static calculateContributionDistribution(nodes: CausalNode[]): Record<string, number> {
    const total = nodes.reduce((acc, curr) => acc + curr.contributionScore, 0) || 1;
    const distribution: Record<string, number> = {};

    nodes.forEach(n => {
      const normalized = Math.round((n.contributionScore / total) * 100);
      distribution[n.serviceName] = (distribution[n.serviceName] || 0) + normalized;
    });

    return distribution;
  }

  /**
   * Executes a counterfactual replay simulation with modified input parameters.
   */
  public static simulateReplay(
    trace: DecisionTrace,
    mutatedInputs: Record<string, any>
  ): ReplayResult {
    const replayTraceId = 'sim_' + Math.random().toString(16).substring(2, 10);
    const now = new Date().toISOString();

    let newOutcome = trace.finalOutcome;
    let newConfidence = trace.confidenceScore;
    let newRiskScore = trace.riskScore;
    const divergedNodes: string[] = [];
    const updatedFeatures: FeatureAttribution[] = JSON.parse(JSON.stringify(trace.features));

    // Handle Banking Loan Underwriting Counterfactuals
    if (trace.industry === 'FINTECH_BANKING') {
      const dscr = mutatedInputs.calculatedDscr !== undefined ? Number(mutatedInputs.calculatedDscr) : trace.inputParameters.calculatedDscr;
      const inq = mutatedInputs.hardInquiriesLast90d !== undefined ? Number(mutatedInputs.hardInquiriesLast90d) : trace.inputParameters.hardInquiriesLast90d;
      const dti = mutatedInputs.debtToIncomeRatio !== undefined ? Number(mutatedInputs.debtToIncomeRatio) : trace.inputParameters.debtToIncomeRatio;
      const fico = mutatedInputs.creditBureauScore !== undefined ? Number(mutatedInputs.creditBureauScore) : trace.inputParameters.creditBureauScore;

      // Update features with mutated values
      updatedFeatures.forEach(f => {
        if (f.featureName.includes('DSCR')) {
          f.featureValue = `${dscr.toFixed(2)}x`;
          f.shapValue = dscr >= 1.25 ? 0.35 : -0.428;
          f.direction = dscr >= 1.25 ? 'POSITIVE' : 'NEGATIVE';
        }
        if (f.featureName.includes('Inquiries')) {
          f.featureValue = `${inq} inquiries`;
          f.shapValue = inq <= 2 ? 0.22 : -0.284;
          f.direction = inq <= 2 ? 'POSITIVE' : 'NEGATIVE';
        }
        if (f.featureName.includes('Debt-to-Income')) {
          f.featureValue = `${(dti * 100).toFixed(1)}%`;
          f.shapValue = dti <= 0.35 ? 0.25 : -0.192;
          f.direction = dti <= 0.35 ? 'POSITIVE' : 'NEGATIVE';
        }
        if (f.featureName.includes('FICO')) {
          f.featureValue = `${fico}`;
          f.shapValue = fico >= 680 ? 0.20 : -0.114;
          f.direction = fico >= 680 ? 'POSITIVE' : 'NEGATIVE';
        }
      });

      // Recalculate Risk & Policy rules
      const passedDscr = dscr >= 1.25;
      const passedInq = inq <= 3;
      const passedDti = dti <= 0.40;
      const passedFico = fico >= 660;

      if (passedDscr && passedInq && passedDti && passedFico) {
        newOutcome = 'APPROVED';
        newRiskScore = 22.4;
        newConfidence = 0.945;
        divergedNodes.push('node-risk', 'node-ml', 'node-policy', 'node-dispatch');
      } else if (passedDscr && passedFico) {
        newOutcome = 'ESCALATED';
        newRiskScore = 52.0;
        newConfidence = 0.720;
        divergedNodes.push('node-policy');
      } else {
        newOutcome = 'REJECTED';
        newRiskScore = Math.max(65, 95 - (dscr * 15) - (fico / 50));
        newConfidence = 0.88;
      }
    }
    // Handle Healthcare ICU Sepsis Counterfactuals
    else if (trace.industry === 'HEALTHCARE') {
      const lactate = mutatedInputs.serumLactate !== undefined ? Number(mutatedInputs.serumLactate) : trace.inputParameters.serumLactate;
      const map = mutatedInputs.meanArterialPressure !== undefined ? Number(mutatedInputs.meanArterialPressure) : trace.inputParameters.meanArterialPressure;
      
      updatedFeatures.forEach(f => {
        if (f.featureName.includes('Lactate')) {
          f.featureValue = `${lactate} mmol/L`;
          f.shapValue = lactate <= 2.0 ? -0.35 : 0.442;
          f.direction = lactate <= 2.0 ? 'POSITIVE' : 'NEGATIVE';
        }
        if (f.featureName.includes('Mean Arterial Pressure')) {
          f.featureValue = `${map} mmHg`;
          f.shapValue = map >= 65 ? -0.28 : 0.318;
          f.direction = map >= 65 ? 'POSITIVE' : 'NEGATIVE';
        }
      });

      if (lactate <= 2.0 && map >= 65) {
        newOutcome = 'APPROVED'; // Nominal / Stable
        newRiskScore = 18.5;
        newConfidence = 0.96;
        divergedNodes.push('node-sepsis-net', 'node-steward', 'node-pager');
      } else {
        newOutcome = 'ESCALATED';
        newRiskScore = 84.0;
        newConfidence = 0.92;
      }
    }
    // Handle Cybersecurity Impossible Travel Counterfactuals
    else if (trace.industry === 'CYBERSECURITY') {
      const velocity = mutatedInputs.velocityKmH !== undefined ? Number(mutatedInputs.velocityKmH) : trace.inputParameters.velocityKmH;
      const kmsDecrypt = mutatedInputs.kmsDecryptCount !== undefined ? Number(mutatedInputs.kmsDecryptCount) : trace.inputParameters.kmsDecryptCount;

      updatedFeatures.forEach(f => {
        if (f.featureName.includes('Velocity')) {
          f.featureValue = `${velocity} km/h`;
          f.shapValue = velocity <= 900 ? 0.45 : -0.684;
          f.direction = velocity <= 900 ? 'POSITIVE' : 'NEGATIVE';
        }
        if (f.featureName.includes('KMS')) {
          f.featureValue = `${kmsDecrypt} req/min`;
          f.shapValue = kmsDecrypt <= 5 ? 0.30 : -0.212;
          f.direction = kmsDecrypt <= 5 ? 'POSITIVE' : 'NEGATIVE';
        }
      });

      if (velocity <= 900 && kmsDecrypt <= 10) {
        newOutcome = 'APPROVED';
        newRiskScore = 8.2;
        newConfidence = 0.975;
        divergedNodes.push('sec-threat', 'sec-pep', 'sec-okta');
      } else {
        newOutcome = 'BLOCKED';
        newRiskScore = 91.0;
        newConfidence = 0.96;
      }
    }
    // Generic Counterfactual Fallback
    else {
      newRiskScore = Math.max(10, trace.riskScore - 35);
      newConfidence = 0.91;
      newOutcome = 'APPROVED';
      divergedNodes.push(trace.nodes[trace.nodes.length - 2]?.id || 'node-policy');
    }

    const outcomeFlipped = newOutcome !== trace.finalOutcome;
    const confidenceDelta = Number((newConfidence - trace.confidenceScore).toFixed(3));

    let causalDivergenceSummary = '';
    if (outcomeFlipped) {
      causalDivergenceSummary = `Decision state shifted from ${trace.finalOutcome} to ${newOutcome}. Primary causal gate '${divergedNodes[0] || 'policy'}' neutralized due to parameter adjustments satisfying statutory guardrails.`;
    } else {
      causalDivergenceSummary = `Outcome remained ${newOutcome}. Parameter modifications produced a ${confidenceDelta >= 0 ? '+' : ''}${(confidenceDelta * 100).toFixed(1)}% confidence delta, but were insufficient to cross the decisive policy gating threshold.`;
    }

    return {
      originalTraceId: trace.id,
      replayTraceId,
      timestamp: now,
      previousOutcome: trace.finalOutcome,
      newOutcome,
      outcomeFlipped,
      previousConfidence: trace.confidenceScore,
      newConfidence,
      confidenceDelta,
      previousRiskScore: trace.riskScore,
      newRiskScore,
      pathDivergenceNodes: divergedNodes,
      simulatedDurationMs: Math.max(85, Math.round(trace.totalDurationMs * 0.82)),
      causalDivergenceSummary,
      newFeatures: updatedFeatures
    };
  }
}
