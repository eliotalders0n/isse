/**
 * Relationship Analysis Service
 *
 * Calculates longitudinal metrics across multiple conversations
 * Tracks relationship trajectory, repair capacity, and alignment evolution
 */

/**
 * Calculate Alignment Consistency Score (0-100)
 * Measures stability of alignment across conversations
 * High score = stable alignment, low score = volatile alignment
 *
 * @param {Object[]} conversations - Array of conversation documents
 * @returns {Object} Consistency score with interpretation
 */
export function calculateAlignmentConsistency(conversations) {
  if (!conversations || conversations.length < 2) {
    return {
      score: 0,
      mean: 0,
      stdDev: 0,
      interpretation: 'insufficient_data',
      message: 'Need at least 2 conversations to calculate consistency'
    };
  }

  // Extract alignment scores from each conversation
  const alignmentScores = conversations.map(conv => {
    const avg = conv.evolution?.trends?.alignmentTrend?.average;
    return avg !== undefined ? avg : 0;
  });

  // Calculate mean
  const mean = alignmentScores.reduce((a, b) => a + b, 0) / alignmentScores.length;

  // Calculate variance
  const variance = alignmentScores.reduce((sum, score) =>
    sum + Math.pow(score - mean, 2), 0
  ) / alignmentScores.length;

  // Calculate standard deviation
  const stdDev = Math.sqrt(variance);

  // High consistency = low std dev
  // Score: 100 - (stdDev * 100) to convert to 0-100 scale
  const consistencyScore = Math.max(0, 100 - (stdDev * 100));

  return {
    score: Math.round(consistencyScore),
    mean: Math.round(mean * 100),
    stdDev: Math.round(stdDev * 100),
    interpretation: consistencyScore > 70 ? 'stable' : consistencyScore > 40 ? 'moderate' : 'volatile'
  };
}

/**
 * Calculate Communication Load Index
 * Intent-aware: who initiates alignment, asks questions, follows up
 *
 * @param {Object[]} conversations - Array of conversation documents
 * @returns {Object} Load indexes per participant with interpretation
 */
export function calculateCommunicationLoadIndex(conversations) {
  if (!conversations || conversations.length === 0) {
    return {
      loadIndexes: {},
      interpretation: 'insufficient_data'
    };
  }

  const participantLoads = {};

  conversations.forEach(conv => {
    const messages = conv.messages || [];

    messages.forEach(msg => {
      if (!msg.sender) return;

      if (!participantLoads[msg.sender]) {
        participantLoads[msg.sender] = {
          alignmentInitiation: 0,
          questionAsking: 0,
          followUps: 0,
          totalMessages: 0
        };
      }

      participantLoads[msg.sender].totalMessages++;

      // Intent-aware scoring
      const intents = msg.lexical?.intents || {};

      if (intents.alignment > 0.5) {
        participantLoads[msg.sender].alignmentInitiation++;
      }

      if (intents.uncertainty > 0.5 || (msg.text && msg.text.includes('?'))) {
        participantLoads[msg.sender].questionAsking++;
      }

      if (intents.delegation > 0.3) {
        participantLoads[msg.sender].followUps++;
      }
    });
  });

  // Calculate load ratios
  const participants = Object.keys(participantLoads);
  const loadIndexes = {};

  participants.forEach(participant => {
    const load = participantLoads[participant];
    loadIndexes[participant] =
      (load.alignmentInitiation * 1.5) +
      (load.questionAsking * 1.2) +
      (load.followUps * 1.0);
  });

  // Calculate balance interpretation
  const interpretation = calculateLoadBalance(loadIndexes);

  return {
    loadIndexes,
    participantLoads,
    interpretation
  };
}

/**
 * Helper: Calculate load balance between participants
 */
function calculateLoadBalance(loadIndexes) {
  const participants = Object.keys(loadIndexes);

  if (participants.length < 2) {
    return 'single_participant';
  }

  const loads = Object.values(loadIndexes);
  const min = Math.min(...loads);
  const max = Math.max(...loads);

  if (max === 0) return 'no_data';

  const ratio = min / max;

  if (ratio > 0.8) return 'balanced';
  if (ratio > 0.5) return 'slightly_imbalanced';
  return 'imbalanced';
}

/**
 * Calculate Repair Rate (0-100)
 * Percentage of escalations followed by breakthroughs
 * Within same chat OR within 7 days across chats
 *
 * @param {Object[]} conversations - Array of conversation documents
 * @returns {Object} Repair rate with details
 */
export function calculateRepairRate(conversations) {
  if (!conversations || conversations.length === 0) {
    return {
      score: 100,
      totalEscalations: 0,
      repairedCount: 0,
      unrepairedCount: 0,
      repairs: [],
      interpretation: 'no_data'
    };
  }

  const escalations = [];
  const breakthroughs = [];

  // Collect all escalations and breakthroughs with timestamps
  conversations.forEach(conv => {
    const convEscalations = conv.evolution?.escalationPoints || [];
    const convBreakthroughs = conv.evolution?.alignmentBreakthroughs || [];

    convEscalations.forEach(escalation => {
      escalations.push({
        timestamp: new Date(escalation.timestamp || escalation.segmentStartTime).getTime(),
        conversationId: conv.id,
        severity: escalation.severity || 'medium',
        segmentId: escalation.segmentId
      });
    });

    convBreakthroughs.forEach(breakthrough => {
      breakthroughs.push({
        timestamp: new Date(breakthrough.timestamp || breakthrough.segmentStartTime).getTime(),
        conversationId: conv.id,
        severity: breakthrough.severity || 'medium',
        segmentId: breakthrough.segmentId
      });
    });
  });

  if (escalations.length === 0) {
    return {
      score: 100,
      totalEscalations: 0,
      repairedCount: 0,
      unrepairedCount: 0,
      repairs: [],
      interpretation: 'excellent'
    };
  }

  // Match escalations with breakthroughs
  let repairedCount = 0;
  const repairs = [];

  escalations.forEach(escalation => {
    // Look for breakthrough within same conversation OR within 7 days
    const matchingBreakthrough = breakthroughs.find(bt =>
      (bt.conversationId === escalation.conversationId && bt.timestamp > escalation.timestamp) ||
      (bt.timestamp > escalation.timestamp &&
       (bt.timestamp - escalation.timestamp) < 7 * 24 * 60 * 60 * 1000) // 7 days in ms
    );

    if (matchingBreakthrough) {
      repairedCount++;
      repairs.push({
        escalation,
        breakthrough: matchingBreakthrough,
        timeTaken: matchingBreakthrough.timestamp - escalation.timestamp,
        sameConversation: matchingBreakthrough.conversationId === escalation.conversationId
      });
    }
  });

  const repairRate = (repairedCount / escalations.length) * 100;

  return {
    score: Math.round(repairRate),
    totalEscalations: escalations.length,
    repairedCount,
    unrepairedCount: escalations.length - repairedCount,
    repairs,
    interpretation: repairRate > 70 ? 'excellent' : repairRate > 40 ? 'moderate' : 'poor'
  };
}

/**
 * Detect Latent Tension (0-100)
 * Detects polite language + delays + reduced initiative
 * Compares recent conversation vs historical baseline
 *
 * @param {Object[]} conversations - Array of conversation documents (sorted by uploadedAt desc)
 * @returns {Object} Tension score with signals
 */
export function detectLatentTension(conversations) {
  if (!conversations || conversations.length < 2) {
    return {
      score: 0,
      signals: [],
      interpretation: 'insufficient_data'
    };
  }

  // Compare most recent vs historical baseline
  const recentConversation = conversations[0];
  const historicalConversations = conversations.slice(1);

  const signals = [];
  let tensionScore = 0;

  // Signal 1: High closure but low alignment (polite avoidance)
  const recentClosureScore = recentConversation.evolution?.trends?.closureTrend?.average || 0;
  const recentAlignmentScore = recentConversation.evolution?.trends?.alignmentTrend?.average || 0;

  if (recentClosureScore > 0.6 && recentAlignmentScore < 0.4) {
    signals.push('Polite avoidance detected: high closure, low alignment');
    tensionScore += 30;
  }

  // Signal 2: Increased response times
  const recentAvgResponseTime = recentConversation.analytics?.responseTimes?.overall?.average || 0;
  const historicalAvgResponseTime = historicalConversations.reduce((sum, conv) =>
    sum + (conv.analytics?.responseTimes?.overall?.average || 0), 0
  ) / historicalConversations.length;

  if (historicalAvgResponseTime > 0 && recentAvgResponseTime > historicalAvgResponseTime * 1.5) {
    signals.push('Response delays increased by 50%');
    tensionScore += 25;
  }

  // Signal 3: Decreased message frequency
  const recentMessageCount = recentConversation.messageCount || 0;
  const historicalAvgMessageCount = historicalConversations.reduce((sum, conv) =>
    sum + (conv.messageCount || 0), 0
  ) / historicalConversations.length;

  if (historicalAvgMessageCount > 0 && recentMessageCount < historicalAvgMessageCount * 0.7) {
    signals.push('Message frequency decreased by 30%');
    tensionScore += 20;
  }

  // Signal 4: Low uncertainty (not asking questions = disengagement)
  const recentUncertaintyScore = recentConversation.evolution?.trends?.uncertaintyTrend?.average || 0;

  if (recentUncertaintyScore < 0.2) {
    signals.push('Low question-asking: possible disengagement');
    tensionScore += 15;
  }

  // Signal 5: Neutral sentiment masking (sentiment is neutral but resistance is high)
  const recentSentiment = recentConversation.sentiment?.overallSentiment || 'neutral';
  const recentResistanceScore = recentConversation.evolution?.trends?.resistanceTrend?.average || 0;

  if (recentSentiment === 'neutral' && recentResistanceScore > 0.4) {
    signals.push('Neutral sentiment masking underlying resistance');
    tensionScore += 10;
  }

  return {
    score: Math.min(100, tensionScore),
    signals,
    interpretation: tensionScore > 60 ? 'high_tension' : tensionScore > 30 ? 'moderate_tension' : 'low_tension'
  };
}

/**
 * Generate comprehensive longitudinal insights
 * Combines all metrics into a single relationship health assessment
 *
 * @param {Object} relationshipData - Full relationship data with conversations array
 * @returns {Object} Complete longitudinal insights
 */
export function generateLongitudinalInsights(relationshipData) {
  if (!relationshipData || !relationshipData.conversations || relationshipData.conversations.length === 0) {
    return {
      error: 'No conversation data available',
      conversationCount: 0
    };
  }

  const { conversations } = relationshipData;

  // Calculate all metrics
  const alignmentConsistency = calculateAlignmentConsistency(conversations);
  const communicationLoad = calculateCommunicationLoadIndex(conversations);
  const repairRate = calculateRepairRate(conversations);
  const latentTension = detectLatentTension(conversations);

  // Overall trajectory
  const firstConversation = conversations[conversations.length - 1];
  const latestConversation = conversations[0];

  const firstAlignment = firstConversation.evolution?.trends?.alignmentTrend?.average || 0;
  const latestAlignment = latestConversation.evolution?.trends?.alignmentTrend?.average || 0;
  const alignmentDelta = latestAlignment - firstAlignment;

  const overallTrajectory = alignmentDelta > 0.1 ? 'improving' :
                            alignmentDelta < -0.1 ? 'degrading' : 'stable';

  return {
    alignmentConsistency,
    communicationLoad,
    repairRate,
    latentTension,
    overallTrajectory,
    conversationCount: conversations.length,
    timeSpan: {
      start: firstConversation.startDate || firstConversation.uploadedAt,
      end: latestConversation.endDate || latestConversation.uploadedAt
    },
    alignmentDelta: Math.round(alignmentDelta * 100)
  };
}
