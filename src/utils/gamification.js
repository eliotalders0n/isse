/**
 * Gamification Utility Functions
 * Pure functions for calculating relationship levels, compatibility scores,
 * badges, milestones, health scores, and streaks.
 */

import { calculateMessageFrequencyScore, calculateCommunicationBalance } from './analytics';
import { calculateEmotionSynchrony, detectConflictResolution, getAffectionLevel } from '../services/sentimentAnalysis';
import { ALL_BADGES } from './badgeDefinitions';

/**
 * Calculate relationship level (1-10 scale)
 * Based on frequency, positivity, engagement, and conflict resolution
 */
export const calculateRelationshipLevel = (messages, sentiment, analytics) => {
  if (!messages || messages.length === 0) {
    return {
      level: 1,
      components: { frequency: 0, positivity: 0, engagement: 0, conflictResolution: 0 },
      nextLevelProgress: 0,
      description: 'Strangers',
      title: 'Just Getting Started'
    };
  }

  const totalDays = analytics.totalDays || 1;

  // 1. Message Frequency Score (0-10)
  const frequencyScore = calculateMessageFrequencyScore(messages, totalDays);

  // 2. Positivity Score (0-10)
  const positivityScore = (sentiment.positivePercent / 100) * 10;

  // 3. Engagement Score (0-10)
  // Average of balance and response time quality
  const balanceScore = calculateCommunicationBalance({ senderStats: analytics.senderStats || {} });
  const responseScore = calculateResponseTimeScore(analytics.responseTimes || []);
  const engagementScore = (balanceScore + responseScore) / 2;

  // 4. Conflict Resolution Score (0-10)
  const conflictData = detectConflictResolution(messages);
  const conflictScore = conflictData.score * 10;

  // Weighted sum
  const rawLevel = (
    (frequencyScore * 0.25) +
    (positivityScore * 0.30) +
    (engagementScore * 0.25) +
    (conflictScore * 0.20)
  );

  // Round to nearest 0.5
  const level = Math.round(rawLevel * 2) / 2;
  const clampedLevel = Math.max(1, Math.min(10, level));

  // Calculate progress to next level
  const nextLevel = Math.ceil(clampedLevel);
  const nextLevelProgress = nextLevel > 10 ? 100 : ((clampedLevel - Math.floor(clampedLevel)) * 100);

  // Get level title and description
  const { title, description } = getLevelInfo(clampedLevel);

  return {
    level: clampedLevel,
    components: {
      frequency: Math.round(frequencyScore * 10) / 10,
      positivity: Math.round(positivityScore * 10) / 10,
      engagement: Math.round(engagementScore * 10) / 10,
      conflictResolution: Math.round(conflictScore * 10) / 10
    },
    nextLevelProgress: Math.round(nextLevelProgress),
    description,
    title
  };
};

/**
 * Calculate response time quality score (0-10)
 */
const calculateResponseTimeScore = (responseTimes) => {
  if (!responseTimes || responseTimes.length === 0) return 5;

  const avgResponseTime = responseTimes.reduce((sum, rt) => sum + rt.minutes, 0) / responseTimes.length;

  // Scoring: < 5 min = 10, 5-15 min = 9, 15-30 min = 8, 30-60 min = 7, etc.
  if (avgResponseTime < 5) return 10;
  if (avgResponseTime < 15) return 9;
  if (avgResponseTime < 30) return 8;
  if (avgResponseTime < 60) return 7;
  if (avgResponseTime < 120) return 6;
  if (avgResponseTime < 240) return 5;
  if (avgResponseTime < 480) return 4;
  return 3;
};

/**
 * Get level info based on level number
 */
const getLevelInfo = (level) => {
  const levels = [
    { max: 1.5, title: 'Just Getting Started', description: 'Casual Acquaintances' },
    { max: 2.5, title: 'Breaking the Ice', description: 'Getting to Know Each Other' },
    { max: 3.5, title: 'Building Connection', description: 'Regular Friends' },
    { max: 4.5, title: 'Growing Closer', description: 'Good Friends' },
    { max: 5.5, title: 'Active Partners', description: 'Close Friends' },
    { max: 6.5, title: 'Strong Connection', description: 'Best Friends' },
    { max: 7.5, title: 'Deep Bond', description: 'Soulmates' },
    { max: 8.5, title: 'Inseparable', description: 'Twin Flames' },
    { max: 9.5, title: 'Cosmic Connection', description: 'Infinite Bond' },
    { max: 10, title: 'Soul Sync', description: 'Eternal Connection' }
  ];

  const info = levels.find(l => level <= l.max) || levels[levels.length - 1];
  return { title: info.title, description: info.description };
};

/**
 * Calculate compatibility score (0-100)
 * Based on sentiment balance, emotion synchrony, communication balance, affection, conflict handling
 */
export const calculateCompatibilityScore = (messages, sentiment, analytics, stats) => {
  if (!messages || messages.length === 0 || !stats.senderStats) {
    return {
      score: 50,
      breakdown: {
        sentimentBalance: 50,
        emotionSynchrony: 50,
        communicationBalance: 50,
        affectionLevel: 50,
        conflictHandling: 50
      },
      tier: 'Moderate'
    };
  }

  const participants = Object.keys(stats.senderStats);

  // 1. Sentiment Balance (0-30)
  const sentimentBalance = calculateSentimentSimilarity(messages, participants, sentiment);

  // 2. Emotion Synchrony (0-25)
  const emotionSync = calculateEmotionSynchrony(messages, participants);

  // 3. Communication Balance (0-20)
  const commBalance = calculateCommunicationBalance(stats) * 2;

  // 4. Affection Level (0-15)
  const affection = getAffectionLevel(messages) * 0.15;

  // 5. Conflict Handling (0-10)
  const conflictHandling = detectConflictResolution(messages).score * 10;

  const score = Math.round(
    sentimentBalance +
    emotionSync +
    commBalance +
    affection +
    conflictHandling
  );

  const clampedScore = Math.max(0, Math.min(100, score));

  return {
    score: clampedScore,
    breakdown: {
      sentimentBalance: Math.round(sentimentBalance * 10 / 3) / 10,
      emotionSynchrony: Math.round(emotionSync * 4),
      communicationBalance: Math.round(commBalance * 5),
      affectionLevel: Math.round(affection * 100 / 15),
      conflictHandling: Math.round(conflictHandling * 10)
    },
    tier: getCompatibilityTier(clampedScore)
  };
};

/**
 * Calculate sentiment similarity between participants
 */
const calculateSentimentSimilarity = (messages, participants, sentiment) => {
  if (participants.length < 2) return 25;

  // Group messages by sender
  const messagesBySender = {};
  participants.forEach(p => {
    messagesBySender[p] = messages.filter(m => m.sender === p);
  });

  // Calculate positive percentage for each sender
  const positivePercentages = participants.map(p => {
    const senderMessages = messagesBySender[p];
    if (senderMessages.length === 0) return 0;
    const positiveCount = senderMessages.filter(m => m.sentiment === 'positive').length;
    return (positiveCount / senderMessages.length) * 100;
  });

  // Calculate similarity (lower difference = higher score)
  const difference = Math.abs(positivePercentages[0] - positivePercentages[1]);
  const similarity = Math.max(0, 30 - (difference * 0.3));

  return Math.round(similarity);
};

/**
 * Get compatibility tier based on score
 */
const getCompatibilityTier = (score) => {
  if (score >= 90) return 'Soulmates';
  if (score >= 80) return 'Excellent Match';
  if (score >= 70) return 'Highly Compatible';
  if (score >= 60) return 'Great Connection';
  if (score >= 50) return 'Good Match';
  if (score >= 40) return 'Moderate Connection';
  return 'Building Chemistry';
};

/**
 * Generate badges based on chat data
 */
export const generateBadges = (messages, sentiment, analytics, stats) => {
  const earnedBadges = [];
  const chatData = { messages, sentiment, analytics, stats };

  ALL_BADGES.forEach(badge => {
    try {
      if (badge.unlockCriteria(chatData)) {
        earnedBadges.push({
          id: badge.id,
          name: badge.name,
          category: badge.category,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          earnedDate: new Date().toISOString(),
          shareText: badge.shareText,
          colorScheme: badge.colorScheme
        });
      }
    } catch (error) {
      console.error(`Error evaluating badge ${badge.id}:`, error);
    }
  });

  return earnedBadges;
};

/**
 * Calculate weekly health scores
 */
export const calculateWeeklyHealthScores = (messages, sentiment, analytics) => {
  const communicationHealth = calculateCommunicationHealth(messages, analytics);
  const emotionalHealth = calculateEmotionalHealth(sentiment);
  const engagementHealth = calculateEngagementHealth(analytics);
  const overall = Math.round((communicationHealth + emotionalHealth + engagementHealth) / 3);

  const trend = determineTrend(overall);
  const recommendations = generateRecommendations(communicationHealth, emotionalHealth, engagementHealth);

  return {
    current: {
      communication: Math.round(communicationHealth),
      emotional: Math.round(emotionalHealth),
      engagement: Math.round(engagementHealth),
      overall
    },
    trend,
    recommendations
  };
};

/**
 * Calculate communication health (consistency, balance, response times)
 */
const calculateCommunicationHealth = (messages, analytics) => {
  if (!analytics.streaks || analytics.streaks.length === 0) return 50;

  const longestStreak = analytics.streaks[0];
  const consistencyScore = Math.min((longestStreak.days / analytics.totalDays) * 100, 100);

  const balanceScore = calculateCommunicationBalance({ senderStats: analytics.senderStats || {} }) * 10;

  const responseScore = calculateResponseTimeScore(analytics.responseTimes || []) * 10;

  return (consistencyScore * 0.4 + balanceScore * 0.3 + responseScore * 0.3);
};

/**
 * Calculate emotional health (positive/negative ratio, emotion variety)
 */
const calculateEmotionalHealth = (sentiment) => {
  const positiveRatio = sentiment.positivePercent || 50;

  const varietyScore = sentiment.topEmotions && sentiment.topEmotions.length >= 3 ? 100 : 70;

  const stabilityScore = 80; // Placeholder - would need timeline analysis

  return (positiveRatio * 0.5 + varietyScore * 0.25 + stabilityScore * 0.25);
};

/**
 * Calculate engagement health (frequency, streaks)
 */
const calculateEngagementHealth = (analytics) => {
  const frequencyScore = Math.min((analytics.avgMessagesPerDay / 50) * 100, 100);

  const streakScore = analytics.streaks && analytics.streaks[0] && analytics.streaks[0].days >= 7 ? 100 : 50;

  return (frequencyScore * 0.5 + streakScore * 0.5);
};

/**
 * Determine health trend
 */
const determineTrend = (score) => {
  if (score >= 70) return 'improving';
  if (score >= 50) return 'stable';
  return 'needs_attention';
};

/**
 * Generate health recommendations
 */
const generateRecommendations = (comm, emo, engage) => {
  const recommendations = [];

  if (comm < 60) recommendations.push('Try to maintain more consistent communication');
  else if (comm >= 80) recommendations.push('Keep up the consistent communication!');

  if (emo < 60) recommendations.push('Consider expressing more gratitude and positivity');
  else if (emo >= 80) recommendations.push('Your emotional connection is thriving!');

  if (engage < 60) recommendations.push('Engage more regularly to strengthen your bond');
  else if (engage >= 80) recommendations.push('Excellent engagement levels!');

  return recommendations;
};

/**
 * Detect milestones in the conversation
 */
export const detectMilestones = (messages, analytics, stats) => {
  const milestones = [];
  const now = new Date();

  // Message count milestones
  const messageCount = messages.length;
  const messageMilestones = [100, 500, 1000, 5000, 10000];
  messageMilestones.forEach(count => {
    if (messageCount >= count) {
      milestones.push({
        id: `messages_${count}`,
        name: `${count} Messages`,
        description: `Sent ${count} messages together`,
        achievedDate: messages[count - 1]?.timestamp || now,
        icon: 'FiMessageCircle',
        type: 'messages',
        value: count
      });
    }
  });

  // Day milestones
  const totalDays = analytics.totalDays || 0;
  const dayMilestones = [7, 30, 100, 365];
  dayMilestones.forEach(days => {
    if (totalDays >= days) {
      milestones.push({
        id: `days_${days}`,
        name: `${days} Days`,
        description: `${days} days of conversation`,
        achievedDate: now,
        icon: 'FiCalendar',
        type: 'days',
        value: days
      });
    }
  });

  // Streak milestones
  if (analytics.streaks && analytics.streaks[0]) {
    const longestStreak = analytics.streaks[0].days;
    const streakMilestones = [7, 14, 30, 60, 100];
    streakMilestones.forEach(days => {
      if (longestStreak >= days) {
        milestones.push({
          id: `streak_${days}`,
          name: `${days}-Day Streak`,
          description: `Maintained a ${days}-day conversation streak`,
          achievedDate: now,
          icon: 'FiTrendingUp',
          type: 'streak',
          value: days
        });
      }
    });
  }

  return milestones;
};

/**
 * Calculate streak data
 */
export const calculateStreakData = (messages) => {
  if (!messages || messages.length === 0) {
    return {
      current: { days: 0, startDate: null, isActive: false },
      longest: { days: 0, startDate: null, endDate: null },
      total: 0
    };
  }

  // Group messages by date
  const messagesByDate = {};
  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toDateString();
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(msg);
  });

  const dates = Object.keys(messagesByDate).sort((a, b) => new Date(a) - new Date(b));
  const totalActiveDays = dates.length;

  // Calculate current and longest streaks
  let currentStreak = { days: 0, startDate: null };
  let longestStreak = { days: 0, startDate: null, endDate: null };
  let tempStreak = { days: 1, startDate: dates[0] };

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      tempStreak.days++;
    } else {
      if (tempStreak.days > longestStreak.days) {
        longestStreak = {
          days: tempStreak.days,
          startDate: tempStreak.startDate,
          endDate: dates[i - 1]
        };
      }
      tempStreak = { days: 1, startDate: dates[i] };
    }
  }

  // Check final streak
  if (tempStreak.days > longestStreak.days) {
    longestStreak = {
      days: tempStreak.days,
      startDate: tempStreak.startDate,
      endDate: dates[dates.length - 1]
    };
  }

  // Determine if current streak is active (within last 48 hours)
  const lastMessageDate = new Date(dates[dates.length - 1]);
  const now = new Date();
  const hoursSinceLastMessage = (now - lastMessageDate) / (1000 * 60 * 60);
  const isActive = hoursSinceLastMessage <= 48;

  if (isActive) {
    currentStreak = { days: tempStreak.days, startDate: tempStreak.startDate, isActive: true };
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    total: totalActiveDays
  };
};

/**
 * Generate wrapped data (Spotify-style summary)
 */
export const generateWrappedData = (chatData, gamification) => {
  const { metadata, analytics, sentiment } = chatData;

  return {
    year: new Date().getFullYear(),
    generated: true,
    generatedAt: new Date().toISOString(),
    slides: {
      hero: {
        participants: metadata.participants,
        totalMessages: metadata.totalMessages,
        totalDays: analytics.totalDays
      },
      level: {
        level: gamification.relationshipLevel.level,
        title: gamification.relationshipLevel.title
      },
      compatibility: {
        score: gamification.compatibilityScore.score,
        tier: gamification.compatibilityScore.tier
      },
      emotions: {
        top3: sentiment.topEmotions.slice(0, 3),
        positivePercent: sentiment.positivePercent
      },
      words: {
        topWords: analytics.wordFrequency.slice(0, 5)
      },
      peakHours: {
        hours: analytics.peakHours
      },
      streak: {
        longest: gamification.streakData.longest.days,
        current: gamification.streakData.current.days
      },
      badges: {
        total: gamification.badges.length,
        featured: gamification.badges.slice(0, 3)
      },
      health: {
        overall: gamification.healthScores.current.overall,
        trend: gamification.healthScores.trend
      }
    }
  };
};
