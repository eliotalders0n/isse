/**
 * Conversation Segmenter - Layer 4
 *
 * Segments conversations into atomic analysis units. NEVER analyze
 * entire conversations as one blob - segments are the foundation
 * for intent evolution tracking.
 *
 * Design principles:
 * - Atomic: Each segment is independently analyzable
 * - Boundary-driven: Segments created based on clear boundaries
 * - Context-preserving: Segments maintain enough context for analysis
 * - Deterministic: Same messages always produce same segments
 */

import {
  createIntentDelta,
  createConversationSegment,
  getDefaultSegmentationConfig,
  createIntentVector,
  getZeroIntentVector,
} from '../types/index.js';

// Default configuration
const DEFAULT_CONFIG = getDefaultSegmentationConfig();

/**
 * Segment conversation into atomic units
 *
 * @param {Array} canonicalMessages - Messages with lexical & behavioral analysis
 * @param {Object} config - Configuration overrides
 * @returns {Array} Array of ConversationSegment objects
 */
export function segmentConversation(canonicalMessages, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (canonicalMessages.length === 0) {
    return [];
  }

  // Detect if this is a group chat
  const participants = new Set(canonicalMessages.map(m => m.sender));
  if (participants.size >= 3) {
    cfg.groupChatMode = true;
    cfg.inactivityThresholdMinutes *= cfg.groupInactivityMultiplier;
  }

  const segments = [];
  let currentSegment = {
    messages: [],
    startMessageId: null,
  };

  for (let i = 0; i < canonicalMessages.length; i++) {
    const msg = canonicalMessages[i];
    const prevMsg = canonicalMessages[i - 1];

    // Check if we should create a boundary
    const shouldSegment = currentSegment.messages.length > 0 && (
      detectInactivityBoundary(msg, prevMsg, cfg) ||
      detectTopicShiftBoundary(msg, currentSegment.messages, cfg) ||
      detectDominanceFlipBoundary(msg, currentSegment.messages, cfg) ||
      detectIntentReversalBoundary(msg, currentSegment.messages, cfg) ||
      currentSegment.messages.length >= cfg.maxSegmentSize
    );

    if (shouldSegment) {
      // Finalize current segment
      if (currentSegment.messages.length >= cfg.minSegmentSize) {
        segments.push(finalizeSegment(currentSegment, canonicalMessages));
      }

      // Start new segment
      currentSegment = {
        messages: [],
        startMessageId: msg.id,
      };
    }

    // Add message to current segment
    if (!currentSegment.startMessageId) {
      currentSegment.startMessageId = msg.id;
    }
    currentSegment.messages.push(msg);
  }

  // Finalize last segment
  if (currentSegment.messages.length >= cfg.minSegmentSize) {
    segments.push(finalizeSegment(currentSegment, canonicalMessages));
  } else if (currentSegment.messages.length > 0 && segments.length > 0) {
    // Merge small final segment with previous segment
    const lastSegment = segments[segments.length - 1];
    lastSegment.messages = [...(lastSegment.messages || []), ...currentSegment.messages];
    lastSegment.endMessageId = currentSegment.messages[currentSegment.messages.length - 1].id;
    lastSegment.messageIds = lastSegment.messageIds || lastSegment.messages.map(m => m.id);
    lastSegment.messageIds.push(...currentSegment.messages.map(m => m.id));
    segments[segments.length - 1] = finalizeSegment({ messages: lastSegment.messages }, canonicalMessages);
  }

  return segments;
}

/**
 * Detect inactivity boundary
 */
function detectInactivityBoundary(msg, prevMsg, config) {
  if (!prevMsg) return false;

  const gapMinutes = (msg.timestamp - prevMsg.timestamp) / (1000 * 60);
  return gapMinutes >= config.inactivityThresholdMinutes;
}

/**
 * Detect topic shift boundary
 */
function detectTopicShiftBoundary(msg, segmentMessages, config) {
  if (segmentMessages.length < config.topicWindowSize) return false;

  // Get recent messages from segment
  const recentMessages = segmentMessages.slice(-config.topicWindowSize);

  // Calculate keyword overlap
  const msgTokens = new Set(msg.tokens || []);
  const recentTokens = new Set();

  for (const recentMsg of recentMessages) {
    for (const token of (recentMsg.tokens || [])) {
      recentTokens.add(token);
    }
  }

  // Calculate Jaccard similarity
  const intersection = new Set([...msgTokens].filter(t => recentTokens.has(t)));
  const union = new Set([...msgTokens, ...recentTokens]);

  const similarity = union.size > 0 ? intersection.size / union.size : 0;

  // Topic shift if similarity drops below threshold
  return similarity < config.topicShiftThreshold;
}

/**
 * Detect speaker dominance flip boundary
 */
function detectDominanceFlipBoundary(msg, segmentMessages, config) {
  if (segmentMessages.length < 5) return false;

  // Calculate current dominant speaker
  const senderCounts = {};
  for (const segMsg of segmentMessages) {
    senderCounts[segMsg.sender] = (senderCounts[segMsg.sender] || 0) + 1;
  }

  const sortedSenders = Object.entries(senderCounts).sort((a, b) => b[1] - a[1]);
  if (sortedSenders.length === 0) return false;

  const [dominantSender, dominantCount] = sortedSenders[0];
  const dominanceRatio = dominantCount / segmentMessages.length;

  // Check if current message is from a different sender who might take over
  if (msg.sender === dominantSender) return false;

  // If dominance is weak and new speaker appears, consider boundary
  return dominanceRatio < config.dominanceThreshold;
}

/**
 * Detect intent reversal boundary
 */
function detectIntentReversalBoundary(msg, segmentMessages, config) {
  if (segmentMessages.length < 3) return false;
  if (!msg.lexical || !msg.lexical.intents) return false;

  // Calculate average intent of segment
  const avgIntent = aggregateSegmentIntent(segmentMessages);
  const msgIntent = msg.lexical.intents;

  // Calculate intent delta
  const delta = calculateIntentDelta(avgIntent, msgIntent);

  // Check if there's a significant reversal
  // e.g., segment is high alignment, new message is high resistance
  const isReversal = (
    (avgIntent.alignment > 0.5 && msgIntent.resistance > 0.5) ||
    (avgIntent.resistance > 0.5 && msgIntent.alignment > 0.5) ||
    (avgIntent.closure > 0.5 && msgIntent.uncertainty > 0.5)
  );

  return isReversal && delta.shiftMagnitude > config.intentShiftThreshold;
}

/**
 * Finalize a segment
 */
function finalizeSegment(rawSegment, allMessages) {
  const messages = rawSegment.messages;

  if (messages.length === 0) {
    throw new Error('Cannot finalize empty segment');
  }

  // Generate segment ID
  const id = generateSegmentId(messages[0].id, messages[messages.length - 1].id);

  // Temporal bounds
  const startTimestamp = messages[0].timestamp;
  const endTimestamp = messages[messages.length - 1].timestamp;
  const durationMinutes = (endTimestamp - startTimestamp) / (1000 * 60);

  // Aggregate intent
  const aggregateIntent = aggregateSegmentIntent(messages);

  // Calculate intent evolution within segment
  const intentEvolution = calculateInternalIntentEvolution(messages);

  // Participation analysis
  const participants = [...new Set(messages.map(m => m.sender))];
  const messageCountBySender = {};
  for (const msg of messages) {
    messageCountBySender[msg.sender] = (messageCountBySender[msg.sender] || 0) + 1;
  }

  const sortedSenders = Object.entries(messageCountBySender).sort((a, b) => b[1] - a[1]);
  const dominantSpeaker = sortedSenders.length > 0 ? sortedSenders[0][0] : null;

  // Participation balance (0-1, higher = more balanced)
  const participationBalance = calculateParticipationBalance(messageCountBySender);

  // Segment characteristics
  const avgMessageLength = messages.reduce((sum, m) => {
    const len = m.characterCount || (typeof m.text === 'string' ? m.text.length : 0);
    return sum + len;
  }, 0) / messages.length;

  // Response times (from behavioral data)
  const responseTimes = messages
    .filter(m => m.behavioral && m.behavioral.response.isResponse && m.behavioral.response.responseLatencyMinutes !== null)
    .map(m => m.behavioral.response.responseLatencyMinutes);
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
    : 0;

  const messageFrequency = messages.length / Math.max(durationMinutes / 60, 0.1); // Messages per hour

  // Segment health indicators
  const hasResolution = detectResolution(messages);
  const hasEscalation = detectEscalation(messages, aggregateIntent);
  const hasBreakthrough = detectBreakthrough(messages, aggregateIntent);
  const alignmentScore = calculateAlignmentScore(aggregateIntent);

  // Topic coherence
  const topicCoherence = calculateTopicCoherence(messages);
  const dominantKeywords = extractDominantKeywords(messages, 10);

  // Determine boundary type (why this segment was created)
  const boundaryType = determineBoundaryType(messages[0], messages, allMessages);

  return createConversationSegment({
    id,
    chatId: allMessages[0]?.chatId || 'unknown', // Get from context if available
    startMessageId: messages[0].id,
    endMessageId: messages[messages.length - 1].id,
    messageIds: messages.map(m => m.id),
    startTimestamp,
    endTimestamp,
    boundaryType,
    boundaryConfidence: 0.8, // Could be calculated based on signal strength
    aggregateIntent,
    intentEvolution,
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
  });
}

/**
 * Generate deterministic segment ID
 */
function generateSegmentId(startMessageId, endMessageId) {
  const hashInput = `${startMessageId}_${endMessageId}`;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `seg_${Math.abs(hash).toString(36)}`;
}

/**
 * Aggregate intent from messages
 */
function aggregateSegmentIntent(messages) {
  const sums = {
    alignment: 0,
    resistance: 0,
    urgency: 0,
    delegation: 0,
    closure: 0,
    uncertainty: 0,
  };

  let count = 0;

  for (const msg of messages) {
    if (msg.lexical && msg.lexical.intents) {
      sums.alignment += msg.lexical.intents.alignment;
      sums.resistance += msg.lexical.intents.resistance;
      sums.urgency += msg.lexical.intents.urgency;
      sums.delegation += msg.lexical.intents.delegation;
      sums.closure += msg.lexical.intents.closure;
      sums.uncertainty += msg.lexical.intents.uncertainty;
      count++;
    }
  }

  if (count === 0) {
    return getZeroIntentVector();
  }

  // Average
  const avgIntent = {
    alignment: sums.alignment / count,
    resistance: sums.resistance / count,
    urgency: sums.urgency / count,
    delegation: sums.delegation / count,
    closure: sums.closure / count,
    uncertainty: sums.uncertainty / count,
  };

  // Find dominant intent
  const entries = Object.entries(avgIntent).sort((a, b) => b[1] - a[1]);
  const [dominantIntent, dominantScore] = entries[0];

  return createIntentVector({
    ...avgIntent,
    dominantIntent: dominantScore > 0.3 ? dominantIntent : null,
    confidence: dominantScore,
  });
}

/**
 * Calculate intent evolution within segment
 */
function calculateInternalIntentEvolution(messages) {
  if (messages.length < 2) {
    return createIntentDelta(getZeroIntentVector(), getZeroIntentVector());
  }

  // Compare first half to second half
  const midpoint = Math.floor(messages.length / 2);
  const firstHalf = messages.slice(0, midpoint);
  const secondHalf = messages.slice(midpoint);

  const firstIntent = aggregateSegmentIntent(firstHalf);
  const secondIntent = aggregateSegmentIntent(secondHalf);

  return calculateIntentDelta(firstIntent, secondIntent);
}

/**
 * Calculate intent delta
 */
function calculateIntentDelta(fromIntent, toIntent) {
  return createIntentDelta(fromIntent, toIntent);
}

/**
 * Calculate participation balance
 */
function calculateParticipationBalance(messageCountBySender) {
  const counts = Object.values(messageCountBySender);
  if (counts.length <= 1) return 1.0;

  const total = counts.reduce((sum, c) => sum + c, 0);
  const avg = total / counts.length;

  // Calculate variance
  const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
  const stdDev = Math.sqrt(variance);

  // Normalize to 0-1 (lower variance = higher balance)
  const coefficientOfVariation = stdDev / avg;
  return Math.max(0, 1 - coefficientOfVariation);
}

/**
 * Detect resolution in segment
 */
function detectResolution(messages) {
  // Check if closure intent increases toward end
  if (messages.length < 3) return false;

  const lastThird = messages.slice(-Math.ceil(messages.length / 3));
  const closureCount = lastThird.filter(m =>
    m.lexical && m.lexical.intents && m.lexical.intents.closure > 0.5
  ).length;

  return closureCount >= 2;
}

/**
 * Detect escalation in segment
 */
function detectEscalation(messages, aggregateIntent) {
  // High resistance or urgency indicates escalation
  return aggregateIntent.resistance > 0.5 || aggregateIntent.urgency > 0.6;
}

/**
 * Detect breakthrough in segment
 */
function detectBreakthrough(messages, aggregateIntent) {
  // High alignment or closure indicates breakthrough
  return aggregateIntent.alignment > 0.6 || aggregateIntent.closure > 0.5;
}

/**
 * Calculate alignment score
 */
function calculateAlignmentScore(aggregateIntent) {
  // Positive: alignment, closure
  // Negative: resistance, uncertainty
  const positive = aggregateIntent.alignment + aggregateIntent.closure;
  const negative = aggregateIntent.resistance + aggregateIntent.uncertainty;
  const total = positive + negative || 1;

  return positive / total;
}

/**
 * Calculate topic coherence
 */
function calculateTopicCoherence(messages) {
  if (messages.length < 2) return 1.0;

  // Calculate pairwise keyword overlap
  let totalSimilarity = 0;
  let pairs = 0;

  for (let i = 1; i < messages.length; i++) {
    const tokens1 = new Set(messages[i - 1].tokens || []);
    const tokens2 = new Set(messages[i].tokens || []);

    const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
    const union = new Set([...tokens1, ...tokens2]);

    if (union.size > 0) {
      totalSimilarity += intersection.size / union.size;
      pairs++;
    }
  }

  return pairs > 0 ? totalSimilarity / pairs : 0;
}

/**
 * Extract dominant keywords from segment
 */
function extractDominantKeywords(messages, topN = 10) {
  const tokenCounts = {};

  for (const msg of messages) {
    for (const token of (msg.tokens || [])) {
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    }
  }

  return Object.entries(tokenCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([token]) => token);
}

/**
 * Determine boundary type
 */
function determineBoundaryType(firstMsg, segmentMessages, allMessages) {
  // Find previous segment's last message
  const msgIndex = allMessages.findIndex(m => m.id === firstMsg.id);
  if (msgIndex === 0) return 'manual'; // First segment

  const prevMsg = allMessages[msgIndex - 1];
  const gapMinutes = (firstMsg.timestamp - prevMsg.timestamp) / (1000 * 60);

  if (gapMinutes >= 120) return 'inactivity';

  // Check for topic shift
  const firstMsgTokens = new Set(firstMsg.tokens || []);
  const prevMsgTokens = new Set(prevMsg.tokens || []);
  const intersection = new Set([...firstMsgTokens].filter(t => prevMsgTokens.has(t)));
  const union = new Set([...firstMsgTokens, ...prevMsgTokens]);
  const similarity = union.size > 0 ? intersection.size / union.size : 0;

  if (similarity < 0.2) return 'topic-shift';

  // Check for intent reversal
  if (firstMsg.lexical && prevMsg.lexical) {
    const delta = calculateIntentDelta(prevMsg.lexical.intents, firstMsg.lexical.intents);
    if (delta.shiftMagnitude > 0.4) return 'intent-reversal';
  }

  return 'speaker-dominance-flip';
}

/**
 * Get segmentation statistics
 */
export function getSegmentationStats(segments) {
  if (segments.length === 0) {
    return {
      totalSegments: 0,
      avgSegmentSize: 0,
      avgSegmentDuration: 0,
      boundaryTypeDistribution: {},
      shortestSegment: null,
      longestSegment: null,
    };
  }

  const boundaryTypeDistribution = {};
  for (const seg of segments) {
    boundaryTypeDistribution[seg.boundaryType] = (boundaryTypeDistribution[seg.boundaryType] || 0) + 1;
  }

  const avgSegmentSize = segments.reduce((sum, s) => sum + s.messageIds.length, 0) / segments.length;
  const avgSegmentDuration = segments.reduce((sum, s) => sum + s.durationMinutes, 0) / segments.length;

  const sortedBySize = [...segments].sort((a, b) => a.messageIds.length - b.messageIds.length);
  const sortedByDuration = [...segments].sort((a, b) => a.durationMinutes - b.durationMinutes);

  return {
    totalSegments: segments.length,
    avgSegmentSize,
    avgSegmentDuration,
    boundaryTypeDistribution,
    shortestSegment: {
      id: sortedBySize[0].id,
      messageCount: sortedBySize[0].messageIds.length,
      durationMinutes: sortedBySize[0].durationMinutes,
    },
    longestSegment: {
      id: sortedBySize[sortedBySize.length - 1].id,
      messageCount: sortedBySize[sortedBySize.length - 1].messageIds.length,
      durationMinutes: sortedBySize[sortedBySize.length - 1].durationMinutes,
    },
  };
}

/**
 * Export configuration for customization
 */
export const SegmentationConfig = DEFAULT_CONFIG;
