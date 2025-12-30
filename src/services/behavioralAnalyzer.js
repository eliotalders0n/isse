/**
 * Behavioral Semantic Analyzer - Layer 3
 *
 * Interaction-based semantic signals derived from message position,
 * timing, and conversational patterns. NO CONTENT ANALYSIS - all
 * metrics are based on timestamps, sender patterns, and message structure.
 *
 * Design principles:
 * - Content-agnostic: Derived from metadata, not message text
 * - Deterministic: Same interaction pattern = same behavioral profile
 * - Context-rich: Captures conversational dynamics
 */

import {
  createResponseDynamics,
  createTurnTakingPattern,
  createMessageClustering,
  createTemporalContext,
  createSilenceProfile,
  createSenderFingerprint,
  createBehavioralProfile,
  createSenderStatistics,
  getDefaultBehavioralConfig,
  categorizeResponseLatency,
  categorizeSilence,
} from '../types/index.js';

// Default configuration
const DEFAULT_CONFIG = getDefaultBehavioralConfig();

/**
 * Analyze behavioral patterns for a message
 *
 * @param {Object} message - CanonicalMessage object
 * @param {Object} context - BehavioralContext
 * @param {Object} config - Configuration overrides
 * @returns {Object} BehavioralProfile
 */
export function analyzeBehavioral(message, context, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const {
    previousMessage,
    previousMessages = [],
    senderStats = {},
    conversationStartTime,
    conversationMetadata = {},
  } = context;

  // Response dynamics
  const response = analyzeResponseDynamics(
    message,
    previousMessage,
    cfg
  );

  // Turn-taking
  const turnTaking = analyzeTurnTaking(
    message,
    previousMessage,
    previousMessages,
    cfg
  );

  // Message clustering
  const clustering = analyzeClustering(
    message,
    previousMessages,
    cfg
  );

  // Temporal context
  const temporal = analyzeTemporalContext(
    message,
    cfg
  );

  // Silence detection
  const silence = analyzeSilence(
    message,
    previousMessage,
    cfg
  );

  // Sender fingerprint
  const senderFingerprint = analyzeSenderFingerprint(
    message,
    senderStats,
    conversationMetadata
  );

  return createBehavioralProfile({
    response,
    turnTaking,
    clustering,
    temporal,
    silence,
    senderFingerprint,
  });
}

/**
 * Analyze response dynamics
 */
function analyzeResponseDynamics(message, previousMessage, config) {
  if (!previousMessage) {
    return createResponseDynamics();
  }

  // Different sender = potential response
  const isDifferentSender = message.sender !== previousMessage.sender;

  // Calculate latency
  const latencyMs = message.timestamp - previousMessage.timestamp;
  const latencyMinutes = latencyMs / (1000 * 60);

  // Determine if this is a response (within 30 minutes, different sender)
  const isResponse = isDifferentSender && latencyMinutes < config.normalThreshold;

  // Classify latency
  let latencyBucket = null;
  if (isResponse) {
    latencyBucket = categorizeResponseLatency(latencyMinutes, config);
  }

  return createResponseDynamics({
    isResponse,
    responseToMessageId: isResponse ? previousMessage.id : null,
    responseLatencyMinutes: latencyMinutes,
    responseLatencyBucket: latencyBucket,
  });
}

/**
 * Analyze turn-taking patterns
 */
function analyzeTurnTaking(message, previousMessage, previousMessages, config) {
  const continuesPreviousSpeaker = previousMessage
    ? message.sender === previousMessage.sender
    : false;

  const interruptsPreviousSpeaker = previousMessage
    ? message.sender !== previousMessage.sender
    : false;

  // Calculate turn duration (consecutive messages from same sender)
  let turnDuration = 1;
  for (let i = previousMessages.length - 1; i >= 0; i--) {
    if (previousMessages[i].sender === message.sender) {
      turnDuration++;
    } else {
      break;
    }
  }

  // Count turns by this sender in last N messages
  const lookback = previousMessages.slice(-config.lookbackMessageCount);
  const turnsInLastN = lookback.filter(m => m.sender === message.sender).length + 1;

  return createTurnTakingPattern({
    continuesPreviousSpeaker,
    interruptsPreviousSpeaker,
    turnDuration: continuesPreviousSpeaker ? turnDuration : 1,
    turnsInLastN,
  });
}

/**
 * Analyze message clustering (bursts)
 */
function analyzeClustering(message, previousMessages, config) {
  // Find recent messages from same sender within burst window
  const burstWindowMs = config.burstWindowMinutes * 60 * 1000;
  const recentBurstMessages = previousMessages.filter(m =>
    m.sender === message.sender &&
    (message.timestamp - m.timestamp) < burstWindowMs
  );

  const isPartOfBurst = recentBurstMessages.length >= (config.burstMinMessages - 1);

  if (!isPartOfBurst) {
    return createMessageClustering();
  }

  // Calculate burst metrics
  const burstMessages = [...recentBurstMessages, message];
  const burstPosition = burstMessages.length;
  const burstSize = burstMessages.length;
  const burstStart = burstMessages[0].timestamp;
  const burstEnd = message.timestamp;
  const burstDurationMinutes = (burstEnd - burstStart) / (1000 * 60);

  return createMessageClustering({
    isPartOfBurst: true,
    burstPosition,
    burstSize,
    burstDurationMinutes,
  });
}

/**
 * Analyze temporal context
 */
function analyzeTemporalContext(message, config) {
  return createTemporalContext(message.timestamp);
}

/**
 * Analyze silence and gaps
 */
function analyzeSilence(message, previousMessage, config) {
  if (!previousMessage) {
    return createSilenceProfile();
  }

  const gapMs = message.timestamp - previousMessage.timestamp;
  const gapMinutes = gapMs / (1000 * 60);

  const isAfterSilence = gapMinutes >= config.silenceThresholdMinutes;

  if (!isAfterSilence) {
    return createSilenceProfile({
      isAfterSilence: false,
      silenceDurationMinutes: gapMinutes,
    });
  }

  // Classify silence severity
  const silenceSeverity = categorizeSilence(gapMinutes, config);

  // Long gaps break conversation flow (reset context)
  const breaksConversationFlow = gapMinutes >= config.conversationResetMinutes;

  return createSilenceProfile({
    isAfterSilence: true,
    silenceDurationMinutes: gapMinutes,
    silenceSeverity,
    breaksConversationFlow,
  });
}

/**
 * Analyze sender behavioral fingerprint
 */
function analyzeSenderFingerprint(message, senderStats, conversationMetadata) {
  const stats = senderStats[message.sender] || {
    messageCount: 0,
    totalCharacters: 0,
    avgLength: 0,
    avgResponseTime: 0,
    firstMessageTime: message.timestamp,
    lastMessageTime: message.timestamp,
    burstCount: 0,
    initiationCount: 0,
  };

  const senderMessageIndex = stats.messageCount + 1;

  // Calculate frequency (messages per day)
  const conversationDurationMs = stats.lastMessageTime - stats.firstMessageTime;
  const conversationDurationDays = Math.max(conversationDurationMs / (1000 * 60 * 60 * 24), 1);
  const senderMessageFrequency = stats.messageCount / conversationDurationDays;

  // Burst tendency (ratio of messages in bursts)
  const senderBurstTendency = stats.messageCount > 0
    ? stats.burstCount / stats.messageCount
    : 0;

  // Initiation rate (ratio of conversations started)
  const senderInitiationRate = stats.messageCount > 0
    ? stats.initiationCount / stats.messageCount
    : 0;

  return createSenderFingerprint({
    senderMessageIndex,
    senderMessageFrequency,
    senderAvgMessageLength: stats.avgLength,
    senderAvgResponseTime: stats.avgResponseTime,
    senderBurstTendency,
    senderInitiationRate,
  });
}

/**
 * Calculate sender statistics from messages
 *
 * @param {Array} messages - Array of CanonicalMessage objects
 * @returns {Object} Sender statistics keyed by sender
 */
export function calculateSenderStats(messages) {
  const stats = {};
  const tempStats = {}; // Temporary storage for intermediate calculations

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const sender = msg.sender;

    if (!tempStats[sender]) {
      tempStats[sender] = {
        messageCount: 0,
        totalCharacters: 0,
        avgLength: 0,
        avgResponseTime: 0,
        firstMessageTime: msg.timestamp,
        lastMessageTime: msg.timestamp,
        burstCount: 0,
        initiationCount: 0,
        responseTimes: [],
      };
    }

    const senderStats = tempStats[sender];

    senderStats.messageCount++;
    senderStats.totalCharacters += msg.characterCount;
    senderStats.lastMessageTime = msg.timestamp;

    // Check if this is a response (different sender within 30 min)
    if (i > 0) {
      const prevMsg = messages[i - 1];
      if (prevMsg.sender !== sender) {
        const latencyMinutes = (msg.timestamp - prevMsg.timestamp) / (1000 * 60);
        if (latencyMinutes < 30) {
          senderStats.responseTimes.push(latencyMinutes);
        }
      }
    }

    // Check if this is part of a burst
    if (i > 0) {
      const recentSameMessages = [];
      for (let j = i - 1; j >= 0 && j >= i - 5; j--) {
        if (messages[j].sender === sender) {
          recentSameMessages.push(messages[j]);
        }
      }

      if (recentSameMessages.length >= 2) {
        const timeSinceFirst = msg.timestamp - recentSameMessages[recentSameMessages.length - 1].timestamp;
        if (timeSinceFirst < 5 * 60 * 1000) { // 5 minutes
          senderStats.burstCount++;
        }
      }
    }

    // Check if this initiates conversation (after 2+ hour gap)
    if (i > 0) {
      const prevMsg = messages[i - 1];
      const gap = msg.timestamp - prevMsg.timestamp;
      if (gap >= 2 * 60 * 60 * 1000) { // 2 hours
        senderStats.initiationCount++;
      }
    } else {
      // First message initiates conversation
      senderStats.initiationCount = 1;
    }
  }

  // Calculate averages and create typed statistics
  for (const sender in tempStats) {
    const senderTempStats = tempStats[sender];
    senderTempStats.avgLength = senderTempStats.totalCharacters / senderTempStats.messageCount;
    senderTempStats.avgResponseTime = senderTempStats.responseTimes.length > 0
      ? senderTempStats.responseTimes.reduce((sum, t) => sum + t, 0) / senderTempStats.responseTimes.length
      : 0;

    // Convert to typed SenderStatistics
    stats[sender] = createSenderStatistics({
      messageCount: senderTempStats.messageCount,
      totalCharacters: senderTempStats.totalCharacters,
      avgLength: senderTempStats.avgLength,
      avgResponseTime: senderTempStats.avgResponseTime,
      firstMessageTime: senderTempStats.firstMessageTime,
      lastMessageTime: senderTempStats.lastMessageTime,
      burstCount: senderTempStats.burstCount,
      initiationCount: senderTempStats.initiationCount,
    });
  }

  return stats;
}

/**
 * Batch analyze multiple messages
 *
 * @param {Array} messages - Array of CanonicalMessage objects
 * @param {Object} conversationMetadata - Conversation metadata
 * @param {Object} config - Configuration overrides
 * @returns {Array} Array of messages with behavioral analysis
 */
export function analyzeBehavioralBatch(messages, conversationMetadata = {}, config = {}) {
  if (messages.length === 0) return [];

  // Calculate sender stats once
  const senderStats = calculateSenderStats(messages);
  const conversationStartTime = messages[0].timestamp;

  return messages.map((msg, idx) => {
    const context = {
      previousMessage: idx > 0 ? messages[idx - 1] : null,
      previousMessages: messages.slice(Math.max(0, idx - 10), idx),
      senderStats,
      conversationStartTime,
      conversationMetadata,
    };

    return {
      ...msg,
      behavioral: analyzeBehavioral(msg, context, config),
    };
  });
}

/**
 * Get conversation-level behavioral metrics
 *
 * @param {Array} messages - Messages with behavioral analysis
 * @returns {Object} Conversation behavioral summary
 */
export function getConversationBehavioralSummary(messages) {
  if (messages.length === 0) {
    return {
      totalMessages: 0,
      avgResponseTime: 0,
      burstRate: 0,
      silenceCount: 0,
      avgSilenceDuration: 0,
      afterHoursRate: 0,
      weekendRate: 0,
    };
  }

  let totalResponseTime = 0;
  let responseCount = 0;
  let burstCount = 0;
  let silenceCount = 0;
  let totalSilenceDuration = 0;
  let afterHoursCount = 0;
  let weekendCount = 0;

  for (const msg of messages) {
    const behavioral = msg.behavioral;

    if (behavioral.response.isResponse && behavioral.response.responseLatencyMinutes !== null) {
      totalResponseTime += behavioral.response.responseLatencyMinutes;
      responseCount++;
    }

    if (behavioral.clustering.isPartOfBurst) {
      burstCount++;
    }

    if (behavioral.silence.isAfterSilence) {
      silenceCount++;
      totalSilenceDuration += behavioral.silence.silenceDurationMinutes;
    }

    if (behavioral.temporal.isAfterHours) {
      afterHoursCount++;
    }

    if (behavioral.temporal.isWeekend) {
      weekendCount++;
    }
  }

  return {
    totalMessages: messages.length,
    avgResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
    burstRate: burstCount / messages.length,
    silenceCount,
    avgSilenceDuration: silenceCount > 0 ? totalSilenceDuration / silenceCount : 0,
    afterHoursRate: afterHoursCount / messages.length,
    weekendRate: weekendCount / messages.length,
  };
}

/**
 * Export default configuration for testing/customization
 */
export const BehavioralConfig = DEFAULT_CONFIG;
