/**
 * Sentiment Compatibility Service
 * LUSAKA ROMANTIC RELATIONSHIPS EDITION
 *
 * Provides backward-compatible sentiment structures from intent-based semantic analysis.
 * Maps romantic relationship intents to sentiment for dashboard display.
 *
 * Intent to Sentiment Mapping:
 * - POSITIVE: affection, commitment, reconciliation, passion
 * - NEGATIVE: conflict, drama, uncertainty
 * - NEUTRAL: urgency
 */

/**
 * Compatibility helper: Create sentiment-like timeline from intent data
 * This allows existing dashboard components to work with new semantic engine
 * TODO: Migrate dashboard components to use intent data directly
 */
export function createSentimentTimelineFromIntents(messagesWithSemantics) {
  // Group messages by day
  const byDay = {};

  for (const msg of messagesWithSemantics) {
    const date = new Date(msg.timestamp);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!byDay[dayKey]) {
      byDay[dayKey] = {
        date: dayKey,
        messages: [],
      };
    }

    byDay[dayKey].messages.push(msg);
  }

  // Convert to timeline format
  const timeline = Object.values(byDay).map(day => {
    const messages = day.messages;

    // Map intents to sentiment-like scores
    // POSITIVE: affection, commitment, reconciliation, passion
    // NEGATIVE: conflict, drama, uncertainty
    // NEUTRAL: urgency
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    for (const msg of messages) {
      if (msg.lexical && msg.lexical.intents) {
        const intents = msg.lexical.intents;
        positiveScore += (intents.affection || 0) + (intents.commitment || 0) +
                        (intents.reconciliation || 0) + (intents.passion || 0);
        negativeScore += (intents.conflict || 0) + (intents.drama || 0) +
                        (intents.uncertainty || 0);
        neutralScore += (intents.urgency || 0);
      }
    }

    const total = positiveScore + negativeScore + neutralScore || 1;

    return {
      date: day.date,
      positiveRatio: (positiveScore / total) * 100,
      negativeRatio: (negativeScore / total) * 100,
      neutralRatio: (neutralScore / total) * 100,
      sentimentScore: ((positiveScore - negativeScore) / total) * 100,
      messageCount: messages.length,
    };
  });

  return timeline;
}

/**
 * Create sentiment-compatible object from intent analysis
 * Maps romantic relationship intents to sentiment
 */
export function createSentimentFromIntents(messages, evolution) {
  // Calculate overall sentiment from intents
  let totalAffection = 0;
  let totalCommitment = 0;
  let totalReconciliation = 0;
  let totalPassion = 0;
  let totalConflict = 0;
  let totalDrama = 0;
  let totalUncertainty = 0;
  let totalUrgency = 0;
  let count = 0;

  for (const msg of messages) {
    if (msg.lexical && msg.lexical.intents) {
      const intents = msg.lexical.intents;
      totalAffection += intents.affection || 0;
      totalCommitment += intents.commitment || 0;
      totalReconciliation += intents.reconciliation || 0;
      totalPassion += intents.passion || 0;
      totalConflict += intents.conflict || 0;
      totalDrama += intents.drama || 0;
      totalUncertainty += intents.uncertainty || 0;
      totalUrgency += intents.urgency || 0;
      count++;
    }
  }

  const avgAffection = count > 0 ? totalAffection / count : 0;
  const avgCommitment = count > 0 ? totalCommitment / count : 0;
  const avgReconciliation = count > 0 ? totalReconciliation / count : 0;
  const avgPassion = count > 0 ? totalPassion / count : 0;
  const avgConflict = count > 0 ? totalConflict / count : 0;
  const avgDrama = count > 0 ? totalDrama / count : 0;
  const avgUncertainty = count > 0 ? totalUncertainty / count : 0;
  const avgUrgency = count > 0 ? totalUrgency / count : 0;

  // Calculate percentages (map to positive/negative/neutral)
  const positive = avgAffection + avgCommitment + avgReconciliation + avgPassion;
  const negative = avgConflict + avgDrama + avgUncertainty;
  const neutral = avgUrgency;

  const total = positive + negative + neutral || 1;
  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;
  const neutralPercent = (neutral / total) * 100;

  // Determine overall sentiment
  let overallSentiment = 'neutral';
  let healthRating = 'good';

  if (evolution) {
    if (evolution.conversationHealth === 'excellent' || evolution.conversationHealth === 'healthy') {
      overallSentiment = 'positive';
      healthRating = 'excellent';
    } else if (evolution.conversationHealth === 'concerning' || evolution.conversationHealth === 'critical') {
      overallSentiment = 'concerning';
      healthRating = 'needs attention';
    }
  }

  // Top "emotions" (map from romantic relationship intents)
  const topEmotions = [];
  if (avgAffection > 0.3) topEmotions.push('love');
  if (avgPassion > 0.3) topEmotions.push('desire');
  if (avgCommitment > 0.3) topEmotions.push('trust');
  if (avgReconciliation > 0.3) topEmotions.push('forgiveness');
  if (avgConflict > 0.3) topEmotions.push('anger');
  if (avgDrama > 0.3) topEmotions.push('jealousy');
  if (avgUncertainty > 0.3) topEmotions.push('insecurity');

  // Communication health from evolution
  const communicationHealth = evolution?.conversationHealth || 'moderate';

  // Generate relationship insights
  const insights = [];
  if (evolution) {
    // Insight from relationship health
    if (evolution.conversationHealth === 'excellent') {
      insights.push('Your relationship shows strong affection and minimal conflict.');
    } else if (evolution.conversationHealth === 'healthy') {
      insights.push('Communication patterns are healthy with mutual care.');
    } else if (evolution.conversationHealth === 'moderate') {
      insights.push('The relationship is balanced but could use more positive connection.');
    } else if (evolution.conversationHealth === 'concerning') {
      insights.push('Communication shows signs of tension that need attention.');
    }

    // Insights from escalations and breakthroughs
    const escalations = evolution.escalationPoints?.length || 0;
    const breakthroughs = evolution.alignmentBreakthroughs?.length || 0;

    if (breakthroughs > escalations) {
      insights.push(`Detected ${breakthroughs} moments of connection and understanding.`);
    } else if (escalations > 0) {
      insights.push(`Identified ${escalations} conflict points that needed resolution.`);
    }

    // Insight from intent patterns
    if (avgAffection > 0.5) {
      insights.push('High affection levels show strong romantic connection.');
    }
    if (avgConflict > 0.4) {
      insights.push('Elevated conflict suggests relationship challenges to address.');
    }
    if (avgDrama > 0.3) {
      insights.push('Drama patterns detected - consider reducing outside interference.');
    }
    if (avgCommitment > 0.4) {
      insights.push('Strong commitment signals indicate long-term potential.');
    }
  }

  return {
    overallSentiment,
    communicationHealth,
    healthRating,
    positivePercent: Math.round(positivePercent),
    negativePercent: Math.round(negativePercent),
    neutralPercent: Math.round(neutralPercent),
    topEmotions: topEmotions.length > 0 ? topEmotions.slice(0, 5) : ['neutral'],
    insights: insights.slice(0, 5),
    emotionSynchrony: avgAffection > 0.3 && avgPassion > 0.3 ? 0.8 : 0.5,
    conflictResolution: avgConflict < 0.3 ? 'healthy' : 'needs attention',
    affectionLevel: avgAffection > 0.5 ? 'high' : avgAffection > 0.3 ? 'moderate' : 'low',
    toxicity: { severity: 'none', matchedPatterns: [] },
    // Include evolution data for reference
    evolutionHealth: evolution?.conversationHealth || 'unknown',
    evolutionTrajectory: evolution?.overallDirectionality || 'stable',
    // Romantic relationship intent metrics
    avgAffection,
    avgCommitment,
    avgReconciliation,
    avgPassion,
    avgConflict,
    avgDrama,
    avgUncertainty,
    avgUrgency,
  };
}

/**
 * Generate coach notes from semantic analysis (relationship-focused)
 * Provides insights for romantic relationships
 */
export function generateCoachNotesFromSemantics(data) {
  const { evolution, segments, stats } = data;

  // Generate relationship insights based on evolution data
  const notes = {
    overview: {
      summary: `Relationship shows ${evolution?.conversationHealth || 'moderate'} health with ${evolution?.overallDirectionality || 'stable'} emotional trajectory.`,
      messageRate: `You connect ${stats.avgMessagesPerDay || 0} times per day on average over ${stats.totalDays || 0} days.`,
    },
    dynamics: {
      conflicts: `Detected ${evolution?.escalationPoints?.length || 0} conflict points that needed resolution.`,
      connections: `Found ${evolution?.alignmentBreakthroughs?.length || 0} beautiful moments of connection and understanding.`,
      reconciliations: `Identified ${evolution?.resolutionPoints?.length || 0} times you made up and found peace.`,
    },
    segments: {
      count: `Your conversation flowed through ${segments?.length || 0} distinct emotional phases.`,
      avgDuration: segments && segments.length > 0
        ? `Average conversation length: ${Math.round(segments.reduce((sum, s) => sum + s.durationMinutes, 0) / segments.length)} minutes.`
        : 'No conversation pattern data available.',
    },
    trends: {
      affection: `Affection trend: ${evolution?.trends?.affectionTrend || evolution?.trends?.alignmentTrend || 'stable'}`,
      conflict: `Conflict trend: ${evolution?.trends?.conflictTrend || evolution?.trends?.resistanceTrend || 'stable'}`,
      urgency: `Attention-seeking trend: ${evolution?.trends?.urgencyTrend || 'stable'}`,
    },
  };

  return notes;
}
