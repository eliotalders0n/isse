/**
 * Conversation Segmentation - Layer 4
 *
 * Segments conversations into atomic analysis units. NEVER analyze
 * entire conversations as one blob - segments are the foundation
 * for intent evolution tracking.
 *
 * Design principles:
 * - Atomic: Each segment is independently analyzable
 * - Boundary-driven: Segments created based on clear boundaries
 * - Context-preserving: Segments maintain enough context for analysis
 */

import { createIntentVector, getZeroIntentVector } from './lexical.js';

/**
 * @typedef {'inactivity'|'topic-shift'|'speaker-dominance-flip'|'intent-reversal'|'resolution'|'manual'} SegmentBoundaryType
 */

/**
 * @typedef {'improving'|'degrading'|'stable'|'volatile'} DirectionalityType
 */

/**
 * @typedef {'increasing'|'decreasing'|'stable'|'volatile'} TrendType
 */

/**
 * @typedef {Object} IntentDelta
 * @property {number} alignment - Change in alignment (-1 to +1)
 * @property {number} resistance - Change in resistance (-1 to +1)
 * @property {number} urgency - Change in urgency (-1 to +1)
 * @property {number} delegation - Change in delegation (-1 to +1)
 * @property {number} closure - Change in closure (-1 to +1)
 * @property {number} uncertainty - Change in uncertainty (-1 to +1)
 * @property {string|null} primaryShift - Largest changed intent
 * @property {number} shiftMagnitude - How much it changed (absolute value)
 * @property {DirectionalityType} directionality - Direction of change
 */

/**
 * @typedef {Object} ConversationSegment
 * @property {string} id - Deterministic segment ID
 * @property {string} chatId - Parent conversation ID
 * @property {string} startMessageId - First message ID
 * @property {string} endMessageId - Last message ID
 * @property {string[]} messageIds - All messages in this segment
 * @property {Date} startTimestamp - Segment start time
 * @property {Date} endTimestamp - Segment end time
 * @property {number} durationMinutes - Duration in minutes
 * @property {SegmentBoundaryType} boundaryType - How this boundary was detected
 * @property {number} boundaryConfidence - 0-1, confidence in boundary detection
 * @property {string} [boundaryReason] - Human-readable explanation
 * @property {Object} aggregateIntent - Aggregate intent vector
 * @property {IntentDelta} intentEvolution - Change within segment
 * @property {string[]} participants - Participants in segment
 * @property {Object.<string, number>} messageCountBySender - Message count per sender
 * @property {string|null} dominantSpeaker - Most active speaker
 * @property {number} participationBalance - 0-1, how evenly distributed
 * @property {number} avgMessageLength - Average message length
 * @property {number} avgResponseTime - Average response time in minutes
 * @property {number} messageFrequency - Messages per hour
 * @property {boolean} hasResolution - Did issues get resolved?
 * @property {boolean} hasEscalation - Did tension increase?
 * @property {boolean} hasBreakthrough - Did alignment improve significantly?
 * @property {number} alignmentScore - 0-1, how aligned are participants
 * @property {number} topicCoherence - 0-1, keyword overlap within segment
 * @property {string[]} dominantKeywords - Most frequent words in segment
 */

/**
 * @typedef {Object} CriticalMoment
 * @property {string} segmentId - Segment where this occurred
 * @property {Date} timestamp - When this occurred
 * @property {'escalation'|'breakthrough'|'resolution'|'stagnation'} type - Type of moment
 * @property {'low'|'medium'|'high'} severity - Severity level
 * @property {string} reason - Human-readable explanation
 * @property {Object} intentSnapshot - Intent state at this moment
 * @property {IntentDelta} [delta] - Change that triggered this moment
 */

/**
 * @typedef {Object} IntentTrends
 * @property {TrendType} alignmentTrend - Alignment trend
 * @property {TrendType} resistanceTrend - Resistance trend
 * @property {TrendType} urgencyTrend - Urgency trend
 * @property {TrendType} delegationTrend - Delegation trend
 * @property {TrendType} closureTrend - Closure trend
 * @property {TrendType} uncertaintyTrend - Uncertainty trend
 */

/**
 * @typedef {Object} IntentEvolutionTimeline
 * @property {string} chatId - Conversation ID
 * @property {ConversationSegment[]} segments - Conversation segments
 * @property {IntentDelta[]} deltas - Changes between consecutive segments
 * @property {IntentTrends} trends - Trend analysis
 * @property {CriticalMoment[]} escalationPoints - Critical escalation moments
 * @property {CriticalMoment[]} alignmentBreakthroughs - Breakthrough moments
 * @property {CriticalMoment[]} resolutionPoints - Resolution moments
 * @property {DirectionalityType} overallDirectionality - Overall trajectory
 * @property {'excellent'|'healthy'|'concerning'|'critical'} conversationHealth - Health rating
 * @property {string} generatedAt - ISO 8601 timestamp
 * @property {number} segmentCount - Number of segments
 * @property {number} avgSegmentDuration - Average duration in minutes
 */

/**
 * @typedef {Object} SegmentationConfig
 * @property {number} inactivityThresholdMinutes - Minimum gap to create boundary
 * @property {number} topicShiftThreshold - 0-1, minimum keyword overlap drop
 * @property {number} topicWindowSize - Number of messages to compare
 * @property {number} dominanceThreshold - 0-1, percentage to qualify as dominant
 * @property {number} dominanceFlipSensitivity - How much change triggers boundary
 * @property {number} intentShiftThreshold - Minimum intent delta to trigger boundary
 * @property {number} minSegmentSize - Minimum messages per segment
 * @property {number} maxSegmentSize - Maximum messages per segment
 * @property {boolean} groupChatMode - Different rules for 3+ participants
 * @property {number} groupInactivityMultiplier - Shorter gaps for group chats
 */

/**
 * Factory: Create intent delta
 * @param {Object} from - Starting intent vector
 * @param {Object} to - Ending intent vector
 * @returns {IntentDelta}
 */
export function createIntentDelta(from, to) {
  const delta = {
    alignment: to.alignment - from.alignment,
    resistance: to.resistance - from.resistance,
    urgency: to.urgency - from.urgency,
    delegation: to.delegation - from.delegation,
    closure: to.closure - from.closure,
    uncertainty: to.uncertainty - from.uncertainty,
  };

  // Find primary shift
  const absDeltas = Object.entries(delta).map(([key, val]) => [key, Math.abs(val)]);
  const maxEntry = absDeltas.reduce((max, curr) => curr[1] > max[1] ? curr : max, ['none', 0]);
  const primaryShift = maxEntry[1] > 0.1 ? maxEntry[0] : null;
  const shiftMagnitude = maxEntry[1];

  // Determine directionality
  const positiveChanges = (delta.alignment + delta.closure) - (delta.resistance + delta.uncertainty);
  let directionality;
  if (shiftMagnitude < 0.1) directionality = 'stable';
  else if (shiftMagnitude > 0.4) directionality = 'volatile';
  else if (positiveChanges > 0.2) directionality = 'improving';
  else if (positiveChanges < -0.2) directionality = 'degrading';
  else directionality = 'stable';

  return {
    ...delta,
    primaryShift,
    shiftMagnitude,
    directionality,
  };
}

/**
 * Factory: Create conversation segment
 * @param {Object} params - Segment parameters
 * @returns {ConversationSegment}
 */
export function createConversationSegment({
  id,
  chatId,
  startMessageId,
  endMessageId,
  messageIds,
  startTimestamp,
  endTimestamp,
  boundaryType,
  boundaryConfidence = 0.8,
  boundaryReason,
  aggregateIntent,
  intentEvolution,
  participants,
  messageCountBySender,
  dominantSpeaker = null,
  participationBalance = 0.5,
  avgMessageLength = 0,
  avgResponseTime = 0,
  messageFrequency = 0,
  hasResolution = false,
  hasEscalation = false,
  hasBreakthrough = false,
  alignmentScore = 0.5,
  topicCoherence = 0.5,
  dominantKeywords = [],
}) {
  const durationMinutes = (endTimestamp - startTimestamp) / (1000 * 60);

  return {
    id,
    chatId,
    startMessageId,
    endMessageId,
    messageIds,
    startTimestamp,
    endTimestamp,
    durationMinutes,
    boundaryType,
    boundaryConfidence,
    boundaryReason,
    aggregateIntent: aggregateIntent || getZeroIntentVector(),
    intentEvolution: intentEvolution || createIntentDelta(getZeroIntentVector(), getZeroIntentVector()),
    participants,
    messageCountBySender,
    dominantSpeaker,
    participationBalance,
    avgMessageLength,
    avgResponseTime,
    messageFrequency,
    hasResolution,
    hasEscalation,
    hasBreakthrough,
    alignmentScore,
    topicCoherence,
    dominantKeywords,
  };
}

/**
 * Factory: Create critical moment
 * @param {Object} params - Moment parameters
 * @returns {CriticalMoment}
 */
export function createCriticalMoment({
  segmentId,
  timestamp,
  type,
  severity = 'medium',
  reason = '',
  intentSnapshot,
  delta,
}) {
  return {
    segmentId,
    timestamp,
    type,
    severity,
    reason,
    intentSnapshot: intentSnapshot || getZeroIntentVector(),
    delta,
  };
}

/**
 * Factory: Create intent trends
 * @param {ConversationSegment[]} segments - Segments to analyze
 * @returns {IntentTrends}
 */
export function createIntentTrends(segments) {
  if (!segments || segments.length < 2) {
    return {
      alignmentTrend: 'stable',
      resistanceTrend: 'stable',
      urgencyTrend: 'stable',
      delegationTrend: 'stable',
      closureTrend: 'stable',
      uncertaintyTrend: 'stable',
    };
  }

  const intents = ['alignment', 'resistance', 'urgency', 'delegation', 'closure', 'uncertainty'];
  const trends = {};

  for (const intent of intents) {
    const values = segments.map(s => s.aggregateIntent[intent]);
    const trend = calculateTrend(values);
    trends[`${intent}Trend`] = trend;
  }

  return trends;
}

/**
 * Helper: Calculate trend from value series
 * @param {number[]} values - Series of values
 * @returns {TrendType}
 */
function calculateTrend(values) {
  if (values.length < 2) return 'stable';

  // Calculate simple moving direction
  const first = values.slice(0, Math.floor(values.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 2);
  const second = values.slice(Math.floor(values.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(values.length / 2);

  const diff = second - first;
  const variance = values.reduce((sum, val) => sum + Math.abs(val - (first + second) / 2), 0) / values.length;

  if (variance > 0.3) return 'volatile';
  if (Math.abs(diff) < 0.1) return 'stable';
  if (diff > 0) return 'increasing';
  return 'decreasing';
}

/**
 * Factory: Create intent evolution timeline
 * @param {Object} params - Timeline parameters
 * @returns {IntentEvolutionTimeline}
 */
export function createIntentEvolutionTimeline({
  chatId,
  segments,
  escalationPoints = [],
  alignmentBreakthroughs = [],
  resolutionPoints = [],
}) {
  const deltas = [];
  for (let i = 1; i < segments.length; i++) {
    const delta = createIntentDelta(
      segments[i - 1].aggregateIntent,
      segments[i].aggregateIntent
    );
    deltas.push(delta);
  }

  const trends = createIntentTrends(segments);

  // Calculate overall directionality
  const directionalityCounts = {
    improving: 0,
    degrading: 0,
    stable: 0,
    volatile: 0,
  };
  deltas.forEach(d => directionalityCounts[d.directionality]++);
  const overallDirectionality = Object.entries(directionalityCounts)
    .reduce((max, curr) => curr[1] > max[1] ? curr : max, ['stable', 0])[0];

  // Calculate conversation health
  const avgAlignment = segments.reduce((sum, s) => sum + s.aggregateIntent.alignment, 0) / segments.length;
  const avgResistance = segments.reduce((sum, s) => sum + s.aggregateIntent.resistance, 0) / segments.length;
  const escalationCount = escalationPoints.length;
  const resolutionCount = resolutionPoints.length;

  let conversationHealth;
  if (avgAlignment > 0.7 && avgResistance < 0.2 && resolutionCount > escalationCount) {
    conversationHealth = 'excellent';
  } else if (avgAlignment > 0.5 && avgResistance < 0.4) {
    conversationHealth = 'healthy';
  } else if (avgResistance > 0.6 || escalationCount > resolutionCount * 2) {
    conversationHealth = 'critical';
  } else {
    conversationHealth = 'concerning';
  }

  const avgSegmentDuration = segments.reduce((sum, s) => sum + s.durationMinutes, 0) / segments.length;

  return {
    chatId,
    segments,
    deltas,
    trends,
    escalationPoints,
    alignmentBreakthroughs,
    resolutionPoints,
    overallDirectionality,
    conversationHealth,
    generatedAt: new Date().toISOString(),
    segmentCount: segments.length,
    avgSegmentDuration,
  };
}

/**
 * Helper: Get default segmentation config
 * @param {boolean} isGroupChat - Whether conversation has 3+ participants
 * @returns {SegmentationConfig}
 */
export function getDefaultSegmentationConfig(isGroupChat = false) {
  return {
    inactivityThresholdMinutes: isGroupChat ? 60 : 180,  // 1 hour for groups, 3 hours for 1:1
    topicShiftThreshold: 0.3,
    topicWindowSize: 10,
    dominanceThreshold: 0.6,
    dominanceFlipSensitivity: 0.3,
    intentShiftThreshold: 0.4,
    minSegmentSize: 3,
    maxSegmentSize: 100,
    groupChatMode: isGroupChat,
    groupInactivityMultiplier: 0.5,
  };
}

/**
 * Validator: Check if object is valid ConversationSegment
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isConversationSegment(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.chatId === 'string' &&
    Array.isArray(obj.messageIds) &&
    obj.startTimestamp instanceof Date &&
    obj.endTimestamp instanceof Date &&
    typeof obj.durationMinutes === 'number'
  );
}

/**
 * Validator: Check if object is valid IntentEvolutionTimeline
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isIntentEvolutionTimeline(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.chatId === 'string' &&
    Array.isArray(obj.segments) &&
    Array.isArray(obj.deltas) &&
    typeof obj.trends === 'object' &&
    typeof obj.conversationHealth === 'string' &&
    typeof obj.generatedAt === 'string'
  );
}
