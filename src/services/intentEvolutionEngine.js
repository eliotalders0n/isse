/**
 * Intent Evolution Engine - Layer 5
 *
 * Tracks directional change in intents across segments.
 * Detects trends, escalations, breakthroughs, and stagnation.
 *
 * Design principles:
 * - Track change, not absolute values
 * - Explainable: Every insight traceable to intent deltas
 * - Actionable: Provides clear signals for intervention
 * - Deterministic: Same segments always produce same evolution
 */

import {
  createIntentDelta,
  createCriticalMoment,
  createIntentTrends,
  createIntentEvolutionTimeline,
} from '../types/index.js';

/**
 * Calculate intent evolution across segments
 *
 * @param {Array} segments - Array of ConversationSegment objects
 * @param {string} chatId - Chat identifier
 * @returns {Object} IntentEvolutionTimeline
 */
export function calculateIntentEvolution(segments, chatId) {
  if (segments.length === 0) {
    return createEmptyEvolution(chatId);
  }

  // Calculate deltas between consecutive segments
  const deltas = [];
  for (let i = 1; i < segments.length; i++) {
    const prevSegment = segments[i - 1];
    const currSegment = segments[i];

    const delta = calculateSegmentDelta(prevSegment, currSegment);
    deltas.push(delta);
  }

  // Detect critical moments
  const escalationPoints = detectEscalationPoints(segments, deltas);
  const alignmentBreakthroughs = detectAlignmentBreakthroughs(segments, deltas);
  const resolutionPoints = detectResolutionPoints(segments, deltas);

  return createIntentEvolutionTimeline({
    chatId,
    segments,
    escalationPoints,
    alignmentBreakthroughs,
    resolutionPoints,
  });
}

/**
 * Calculate delta between two segments
 */
function calculateSegmentDelta(prevSegment, currSegment) {
  return createIntentDelta(prevSegment.aggregateIntent, currSegment.aggregateIntent);
}

/**
 * Analyze trends across all deltas
 */
function analyzeTrends(deltas) {
  if (deltas.length < 3) {
    return {
      alignmentTrend: 'stable',
      resistanceTrend: 'stable',
      urgencyTrend: 'stable',
      delegationTrend: 'stable',
      closureTrend: 'stable',
      uncertaintyTrend: 'stable',
    };
  }

  return {
    alignmentTrend: detectTrend(deltas.map(d => d.alignment)),
    resistanceTrend: detectTrend(deltas.map(d => d.resistance)),
    urgencyTrend: detectTrend(deltas.map(d => d.urgency)),
    delegationTrend: detectTrend(deltas.map(d => d.delegation)),
    closureTrend: detectTrend(deltas.map(d => d.closure)),
    uncertaintyTrend: detectTrend(deltas.map(d => d.uncertainty)),
  };
}

/**
 * Detect trend in a series of values
 */
function detectTrend(values) {
  if (values.length < 3) return 'stable';

  // Count increases vs decreases
  let increasing = 0;
  let decreasing = 0;

  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1]) {
      increasing++;
    } else if (values[i] < values[i - 1]) {
      decreasing++;
    }
  }

  // Determine trend
  if (increasing > decreasing * 2) {
    return 'increasing';
  } else if (decreasing > increasing * 2) {
    return 'decreasing';
  }

  // Check variance for volatility
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;

  return variance > 0.15 ? 'volatile' : 'stable';
}

/**
 * Detect escalation points
 */
function detectEscalationPoints(segments, deltas) {
  const escalations = [];

  for (let i = 0; i < deltas.length; i++) {
    const delta = deltas[i];
    const segment = segments[i + 1]; // Delta is between i and i+1

    // Escalation signals:
    // - Large increase in resistance
    // - Large increase in urgency
    // - Degrading directionality
    const isEscalation = (
      delta.resistance > 0.3 ||
      delta.urgency > 0.3 ||
      delta.directionality === 'degrading' ||
      (delta.resistance > 0.2 && delta.uncertainty > 0.2)
    );

    if (isEscalation) {
      // Determine severity
      let severity = 'low';
      if (delta.resistance > 0.5 || delta.urgency > 0.5) {
        severity = 'high';
      } else if (delta.resistance > 0.4 || delta.urgency > 0.4) {
        severity = 'medium';
      }

      // Generate reason
      let reason = 'Unknown escalation';
      if (delta.resistance > 0.3) {
        reason = `Resistance increased by ${(delta.resistance * 100).toFixed(0)}%`;
      } else if (delta.urgency > 0.3) {
        reason = `Urgency spiked by ${(delta.urgency * 100).toFixed(0)}%`;
      } else if (delta.directionality === 'degrading') {
        reason = `Overall conversation trajectory degrading`;
      }

      escalations.push(createCriticalMoment({
        segmentId: segment.id,
        timestamp: segment.startTimestamp,
        type: 'escalation',
        severity,
        reason,
        intentSnapshot: segment.aggregateIntent,
        delta,
      }));
    }
  }

  return escalations;
}

/**
 * Detect alignment breakthroughs
 */
function detectAlignmentBreakthroughs(segments, deltas) {
  const breakthroughs = [];

  for (let i = 0; i < deltas.length; i++) {
    const delta = deltas[i];
    const segment = segments[i + 1];

    // Breakthrough signals:
    // - Large increase in alignment
    // - Large increase in closure
    // - Improving directionality
    const isBreakthrough = (
      delta.alignment > 0.3 ||
      delta.closure > 0.3 ||
      delta.directionality === 'improving' ||
      (delta.alignment > 0.2 && delta.closure > 0.2)
    );

    if (isBreakthrough) {
      // Determine potential
      let severity = 'low';
      if (delta.alignment > 0.5 || delta.closure > 0.5) {
        severity = 'high';
      } else if (delta.alignment > 0.4 || delta.closure > 0.4) {
        severity = 'medium';
      }

      // Generate reason
      let reason = 'Unknown breakthrough';
      if (delta.alignment > 0.3) {
        reason = `Alignment increased by ${(delta.alignment * 100).toFixed(0)}%`;
      } else if (delta.closure > 0.3) {
        reason = `Closure signals increased by ${(delta.closure * 100).toFixed(0)}%`;
      } else if (delta.directionality === 'improving') {
        reason = `Overall conversation trajectory improving`;
      }

      breakthroughs.push(createCriticalMoment({
        segmentId: segment.id,
        timestamp: segment.startTimestamp,
        type: 'breakthrough',
        severity,
        reason,
        intentSnapshot: segment.aggregateIntent,
        delta,
      }));
    }
  }

  return breakthroughs;
}

/**
 * Detect resolution points
 */
function detectResolutionPoints(segments, deltas) {
  const resolutions = [];

  for (let i = 0; i < deltas.length; i++) {
    const delta = deltas[i];
    const segment = segments[i + 1];

    // Resolution signals:
    // - High closure in segment
    // - Decrease in uncertainty
    // - Decrease in resistance
    const hasHighClosure = segment.aggregateIntent.closure > 0.5;
    const uncertaintyDropped = delta.uncertainty < -0.2;
    const resistanceDropped = delta.resistance < -0.2;

    if (hasHighClosure || (uncertaintyDropped && resistanceDropped)) {
      let severity = 'low';
      if (segment.aggregateIntent.closure > 0.7) {
        severity = 'high';
      } else if (segment.aggregateIntent.closure > 0.6) {
        severity = 'medium';
      }

      const reason = `Closure signals strong (${(segment.aggregateIntent.closure * 100).toFixed(0)}%)`;

      resolutions.push(createCriticalMoment({
        segmentId: segment.id,
        timestamp: segment.startTimestamp,
        type: 'resolution',
        severity,
        reason,
        intentSnapshot: segment.aggregateIntent,
        delta,
      }));
    }
  }

  return resolutions;
}

/**
 * Calculate overall directionality
 */
function calculateOverallDirectionality(deltas) {
  if (deltas.length === 0) return 'stable';

  // Count directional trends
  const improving = deltas.filter(d => d.directionality === 'improving').length;
  const degrading = deltas.filter(d => d.directionality === 'degrading').length;
  const volatile = deltas.filter(d => d.directionality === 'volatile').length;

  if (volatile > deltas.length * 0.4) return 'volatile';
  if (improving > degrading * 1.5) return 'improving';
  if (degrading > improving * 1.5) return 'degrading';
  return 'stable';
}

/**
 * Assess conversation health
 */
function assessConversationHealth(segments, deltas, trends) {
  // Factors for health assessment:
  // 1. Overall alignment level
  // 2. Resistance level
  // 3. Trend directions
  // 4. Number of escalations vs breakthroughs

  const avgAlignment = segments.reduce((sum, s) => sum + s.aggregateIntent.alignment, 0) / segments.length;
  const avgResistance = segments.reduce((sum, s) => sum + s.aggregateIntent.resistance, 0) / segments.length;

  const improving = deltas.filter(d => d.directionality === 'improving').length;
  const degrading = deltas.filter(d => d.directionality === 'degrading').length;

  // Calculate health score (0-100)
  let healthScore = 50; // Start neutral

  // Positive factors
  if (avgAlignment > 0.6) healthScore += 20;
  else if (avgAlignment > 0.4) healthScore += 10;

  if (improving > degrading) healthScore += 15;

  if (trends.alignmentTrend === 'increasing') healthScore += 10;
  if (trends.resistanceTrend === 'decreasing') healthScore += 10;

  // Negative factors
  if (avgResistance > 0.6) healthScore -= 20;
  else if (avgResistance > 0.4) healthScore -= 10;

  if (degrading > improving) healthScore -= 15;

  if (trends.resistanceTrend === 'increasing') healthScore -= 10;
  if (trends.alignmentTrend === 'decreasing') healthScore -= 10;

  // Clamp to 0-100
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Classify
  if (healthScore >= 80) return 'excellent';
  if (healthScore >= 60) return 'healthy';
  if (healthScore >= 40) return 'concerning';
  return 'critical';
}

/**
 * Create empty evolution for empty conversation
 */
function createEmptyEvolution(chatId) {
  return createIntentEvolutionTimeline({
    chatId,
    segments: [],
    escalationPoints: [],
    alignmentBreakthroughs: [],
    resolutionPoints: [],
  });
}

/**
 * Get intent evolution summary
 */
export function getEvolutionSummary(evolution) {
  const {
    segments,
    deltas,
    trends,
    escalationPoints,
    alignmentBreakthroughs,
    resolutionPoints,
    conversationHealth,
  } = evolution;

  // Calculate summary metrics
  const avgAlignment = segments.length > 0
    ? segments.reduce((sum, s) => sum + s.aggregateIntent.alignment, 0) / segments.length
    : 0;

  const avgResistance = segments.length > 0
    ? segments.reduce((sum, s) => sum + s.aggregateIntent.resistance, 0) / segments.length
    : 0;

  const totalShiftMagnitude = deltas.reduce((sum, d) => sum + d.shiftMagnitude, 0);
  const avgShiftMagnitude = deltas.length > 0 ? totalShiftMagnitude / deltas.length : 0;

  // Identify most volatile intent
  const intentVariances = {
    alignment: calculateVariance(deltas.map(d => d.alignment)),
    resistance: calculateVariance(deltas.map(d => d.resistance)),
    urgency: calculateVariance(deltas.map(d => d.urgency)),
    delegation: calculateVariance(deltas.map(d => d.delegation)),
    closure: calculateVariance(deltas.map(d => d.closure)),
    uncertainty: calculateVariance(deltas.map(d => d.uncertainty)),
  };

  const mostVolatileIntent = Object.entries(intentVariances)
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    segmentCount: segments.length,
    avgAlignment,
    avgResistance,
    avgShiftMagnitude,
    mostVolatileIntent,
    conversationHealth,
    escalationCount: escalationPoints.length,
    breakthroughCount: alignmentBreakthroughs.length,
    resolutionCount: resolutionPoints.length,
    trends,
  };
}

/**
 * Calculate variance
 */
function calculateVariance(values) {
  if (values.length === 0) return 0;

  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
}

/**
 * Get segment by ID
 */
export function getSegmentById(evolution, segmentId) {
  return evolution.segments.find(s => s.id === segmentId) || null;
}

/**
 * Get deltas for a specific intent
 */
export function getDeltasForIntent(evolution, intentName) {
  return evolution.deltas.map((delta, idx) => ({
    segmentIndex: idx + 1,
    segment: evolution.segments[idx + 1],
    value: delta[intentName],
    directionality: delta.directionality,
  }));
}

/**
 * Get critical moments sorted by timestamp
 */
export function getAllCriticalMoments(evolution) {
  const all = [
    ...evolution.escalationPoints,
    ...evolution.alignmentBreakthroughs,
    ...evolution.resolutionPoints,
  ];

  return all.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Analyze intent trajectory (for visualization)
 */
export function getIntentTrajectory(evolution, intentName) {
  return evolution.segments.map((segment, idx) => ({
    segmentId: segment.id,
    segmentIndex: idx,
    timestamp: segment.startTimestamp,
    value: segment.aggregateIntent[intentName],
    delta: idx > 0 ? evolution.deltas[idx - 1][intentName] : 0,
  }));
}
