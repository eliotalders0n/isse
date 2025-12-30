/**
 * Behavioral Semantics - Layer 3
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

/**
 * @typedef {Object} ResponseDynamics
 * @property {boolean} isResponse - Is this responding to previous message?
 * @property {string} [responseToMessageId] - ID of message being responded to
 * @property {number} [responseLatencyMinutes] - Time elapsed since previous message
 * @property {'immediate'|'quick'|'normal'|'delayed'|'very-delayed'} [responseLatencyBucket] - Latency category
 */

/**
 * @typedef {Object} TurnTakingPattern
 * @property {boolean} continuesPreviousSpeaker - Same sender as previous message
 * @property {boolean} interruptsPreviousSpeaker - Different sender mid-thought
 * @property {number} [turnDuration] - How many consecutive messages from this sender
 * @property {number} turnsInLastN - Number of turns by this sender in last N messages
 */

/**
 * @typedef {Object} MessageClustering
 * @property {boolean} isPartOfBurst - Multiple messages in short timespan
 * @property {number} [burstPosition] - Position within burst (1-based)
 * @property {number} [burstSize] - Total messages in burst
 * @property {number} [burstDurationMinutes] - How long the burst lasted
 */

/**
 * @typedef {Object} TemporalContext
 * @property {number} hourOfDay - 0-23
 * @property {number} dayOfWeek - 0-6 (Sunday=0)
 * @property {boolean} isWeekend - Saturday or Sunday
 * @property {boolean} isBusinessHours - 9am-5pm weekday
 * @property {boolean} isAfterHours - Outside business hours
 * @property {string} [timeZone] - IANA timezone (if available)
 */

/**
 * @typedef {Object} SilenceProfile
 * @property {boolean} isAfterSilence - First message after gap
 * @property {number} [silenceDurationMinutes] - Duration of preceding silence
 * @property {'brief'|'moderate'|'long'|'very-long'} [silenceSeverity] - Silence severity
 * @property {boolean} breaksConversationFlow - Silence long enough to reset context
 */

/**
 * @typedef {Object} SenderFingerprint
 * @property {number} senderMessageIndex - This sender's nth message (1-based)
 * @property {number} senderMessageFrequency - Messages per day by this sender
 * @property {number} senderAvgMessageLength - Average characters per message
 * @property {number} senderAvgResponseTime - Average response time in minutes
 * @property {number} senderBurstTendency - 0-1, how often sender sends bursts
 * @property {number} senderInitiationRate - 0-1, how often sender starts conversations
 */

/**
 * @typedef {Object} BehavioralProfile
 * @property {ResponseDynamics} response - Response dynamics
 * @property {TurnTakingPattern} turnTaking - Turn-taking patterns
 * @property {MessageClustering} clustering - Message clustering
 * @property {TemporalContext} temporal - Temporal context
 * @property {SilenceProfile} silence - Silence detection
 * @property {SenderFingerprint} senderFingerprint - Sender fingerprint
 * @property {string} analysisTimestamp - ISO 8601 timestamp
 * @property {number} [processingTimeMs] - Time taken to analyze
 */

/**
 * @typedef {Object} SenderStatistics
 * @property {number} messageCount - Total messages by this sender
 * @property {number} totalCharacters - Total characters sent
 * @property {number} avgLength - Average message length
 * @property {number} avgResponseTime - Average response time in minutes
 * @property {Date} firstMessageTime - First message timestamp
 * @property {Date} lastMessageTime - Last message timestamp
 * @property {number} burstCount - Number of bursts
 * @property {number} initiationCount - Number of conversations started
 */

/**
 * @typedef {Object} BehavioralConfig
 * @property {number} immediateThreshold - < 1 minute
 * @property {number} quickThreshold - < 5 minutes
 * @property {number} normalThreshold - < 30 minutes
 * @property {number} delayedThreshold - < 2 hours
 * @property {number} burstWindowMinutes - Time window for burst detection
 * @property {number} burstMinMessages - Minimum messages to qualify as burst
 * @property {number} silenceThresholdMinutes - Minimum gap to count as silence
 * @property {number} conversationResetMinutes - Gap long enough to reset context
 * @property {number} businessHoursStart - Hour (0-23)
 * @property {number} businessHoursEnd - Hour (0-23)
 * @property {number} lookbackMessageCount - Number of previous messages to consider
 */

/**
 * Factory: Create response dynamics
 * @param {Object} params - Response parameters
 * @returns {ResponseDynamics}
 */
export function createResponseDynamics({
  isResponse = false,
  responseToMessageId = null,
  responseLatencyMinutes = null,
  responseLatencyBucket = null,
} = {}) {
  return {
    isResponse,
    responseToMessageId,
    responseLatencyMinutes,
    responseLatencyBucket,
  };
}

/**
 * Factory: Create turn-taking pattern
 * @param {Object} params - Turn-taking parameters
 * @returns {TurnTakingPattern}
 */
export function createTurnTakingPattern({
  continuesPreviousSpeaker = false,
  interruptsPreviousSpeaker = false,
  turnDuration = null,
  turnsInLastN = 0,
} = {}) {
  return {
    continuesPreviousSpeaker,
    interruptsPreviousSpeaker,
    turnDuration,
    turnsInLastN,
  };
}

/**
 * Factory: Create message clustering
 * @param {Object} params - Clustering parameters
 * @returns {MessageClustering}
 */
export function createMessageClustering({
  isPartOfBurst = false,
  burstPosition = null,
  burstSize = null,
  burstDurationMinutes = null,
} = {}) {
  return {
    isPartOfBurst,
    burstPosition,
    burstSize,
    burstDurationMinutes,
  };
}

/**
 * Factory: Create temporal context
 * @param {Date} timestamp - Message timestamp
 * @param {string} [timeZone] - IANA timezone
 * @returns {TemporalContext}
 */
export function createTemporalContext(timestamp, timeZone = null) {
  const hourOfDay = timestamp.getHours();
  const dayOfWeek = timestamp.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isBusinessHours = !isWeekend && hourOfDay >= 9 && hourOfDay < 17;
  const isAfterHours = !isBusinessHours;

  return {
    hourOfDay,
    dayOfWeek,
    isWeekend,
    isBusinessHours,
    isAfterHours,
    timeZone,
  };
}

/**
 * Factory: Create silence profile
 * @param {Object} params - Silence parameters
 * @returns {SilenceProfile}
 */
export function createSilenceProfile({
  isAfterSilence = false,
  silenceDurationMinutes = null,
  silenceSeverity = null,
  breaksConversationFlow = false,
} = {}) {
  return {
    isAfterSilence,
    silenceDurationMinutes,
    silenceSeverity,
    breaksConversationFlow,
  };
}

/**
 * Factory: Create sender fingerprint
 * @param {Object} params - Sender parameters
 * @returns {SenderFingerprint}
 */
export function createSenderFingerprint({
  senderMessageIndex = 1,
  senderMessageFrequency = 0,
  senderAvgMessageLength = 0,
  senderAvgResponseTime = 0,
  senderBurstTendency = 0,
  senderInitiationRate = 0,
} = {}) {
  return {
    senderMessageIndex,
    senderMessageFrequency,
    senderAvgMessageLength,
    senderAvgResponseTime,
    senderBurstTendency,
    senderInitiationRate,
  };
}

/**
 * Factory: Create complete behavioral profile
 * @param {Object} params - Profile parameters
 * @returns {BehavioralProfile}
 */
export function createBehavioralProfile({
  response,
  turnTaking,
  clustering,
  temporal,
  silence,
  senderFingerprint,
  processingTimeMs,
} = {}) {
  return {
    response: response || createResponseDynamics(),
    turnTaking: turnTaking || createTurnTakingPattern(),
    clustering: clustering || createMessageClustering(),
    temporal: temporal || createTemporalContext(new Date()),
    silence: silence || createSilenceProfile(),
    senderFingerprint: senderFingerprint || createSenderFingerprint(),
    analysisTimestamp: new Date().toISOString(),
    processingTimeMs,
  };
}

/**
 * Factory: Create sender statistics
 * @param {Object} params - Statistics parameters
 * @returns {SenderStatistics}
 */
export function createSenderStatistics({
  messageCount = 0,
  totalCharacters = 0,
  avgLength = 0,
  avgResponseTime = 0,
  firstMessageTime,
  lastMessageTime,
  burstCount = 0,
  initiationCount = 0,
} = {}) {
  return {
    messageCount,
    totalCharacters,
    avgLength,
    avgResponseTime,
    firstMessageTime: firstMessageTime || new Date(),
    lastMessageTime: lastMessageTime || new Date(),
    burstCount,
    initiationCount,
  };
}

/**
 * Helper: Get default behavioral config
 * @returns {BehavioralConfig}
 */
export function getDefaultBehavioralConfig() {
  return {
    immediateThreshold: 1,        // 1 minute
    quickThreshold: 5,             // 5 minutes
    normalThreshold: 30,           // 30 minutes
    delayedThreshold: 120,         // 2 hours
    burstWindowMinutes: 5,         // 5 minutes
    burstMinMessages: 3,           // 3 messages
    silenceThresholdMinutes: 180,  // 3 hours
    conversationResetMinutes: 1440, // 24 hours
    businessHoursStart: 9,         // 9am
    businessHoursEnd: 17,          // 5pm
    lookbackMessageCount: 10,      // Last 10 messages
  };
}

/**
 * Helper: Categorize response latency
 * @param {number} latencyMinutes - Response latency in minutes
 * @param {BehavioralConfig} [config] - Configuration
 * @returns {'immediate'|'quick'|'normal'|'delayed'|'very-delayed'}
 */
export function categorizeResponseLatency(latencyMinutes, config = null) {
  const cfg = config || getDefaultBehavioralConfig();

  if (latencyMinutes < cfg.immediateThreshold) return 'immediate';
  if (latencyMinutes < cfg.quickThreshold) return 'quick';
  if (latencyMinutes < cfg.normalThreshold) return 'normal';
  if (latencyMinutes < cfg.delayedThreshold) return 'delayed';
  return 'very-delayed';
}

/**
 * Helper: Categorize silence severity
 * @param {number} silenceMinutes - Silence duration in minutes
 * @param {BehavioralConfig} [config] - Configuration
 * @returns {'brief'|'moderate'|'long'|'very-long'}
 */
export function categorizeSilence(silenceMinutes, config = null) {
  const cfg = config || getDefaultBehavioralConfig();

  if (silenceMinutes < cfg.silenceThresholdMinutes) return 'brief';
  if (silenceMinutes < cfg.silenceThresholdMinutes * 2) return 'moderate';
  if (silenceMinutes < cfg.conversationResetMinutes) return 'long';
  return 'very-long';
}

/**
 * Validator: Check if object is valid BehavioralProfile
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isBehavioralProfile(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.response === 'object' &&
    typeof obj.turnTaking === 'object' &&
    typeof obj.clustering === 'object' &&
    typeof obj.temporal === 'object' &&
    typeof obj.silence === 'object' &&
    typeof obj.senderFingerprint === 'object' &&
    typeof obj.analysisTimestamp === 'string'
  );
}
