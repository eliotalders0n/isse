/**
 * Personalized analytics for individual participant insights
 */

/**
 * Calculate personalized messaging patterns for a specific user
 * @param {Array} messages - Array of parsed messages
 * @param {string} userName - Name of the user to analyze
 * @returns {Object} Personalized insights about the user
 */
export const getPersonalizedInsights = (messages, userName) => {
  const userMessages = messages.filter(m => m.sender === userName);
  const otherMessages = messages.filter(m => m.sender !== userName);

  if (userMessages.length === 0) return null;

  // Get the other person's name
  const otherPerson = otherMessages.length > 0 ? otherMessages[0].sender : 'them';

  // Calculate average message length
  const avgMessageLength = Math.round(
    userMessages.reduce((sum, m) => sum + m.text.length, 0) / userMessages.length
  );

  const otherAvgLength = otherMessages.length > 0
    ? Math.round(otherMessages.reduce((sum, m) => sum + m.text.length, 0) / otherMessages.length)
    : 0;

  // Calculate message length comparison
  const lengthComparison = avgMessageLength > otherAvgLength * 1.2
    ? 'longer'
    : avgMessageLength < otherAvgLength * 0.8
    ? 'shorter'
    : 'similar';

  // Calculate conversation initiation rate
  let initiatedCount = 0;
  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currMsg = messages[i];
    const timeDiff = (currMsg.timestamp - prevMsg.timestamp) / (1000 * 60 * 60); // hours

    // Consider a new conversation if more than 4 hours gap
    if (timeDiff > 4 && currMsg.sender === userName) {
      initiatedCount++;
    }
  }

  const initiationRate = (initiatedCount / userMessages.length * 100).toFixed(1);

  // Calculate emoji usage
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const userEmojiCount = userMessages.reduce((sum, m) => {
    const matches = m.text.match(emojiRegex);
    return sum + (matches ? matches.length : 0);
  }, 0);

  const otherEmojiCount = otherMessages.reduce((sum, m) => {
    const matches = m.text.match(emojiRegex);
    return sum + (matches ? matches.length : 0);
  }, 0);

  const emojiFrequency = (userEmojiCount / userMessages.length).toFixed(2);
  const otherEmojiFrequency = otherMessages.length > 0
    ? (otherEmojiCount / otherMessages.length).toFixed(2)
    : 0;

  // Calculate question asking rate
  const questionCount = userMessages.filter(m => m.text.includes('?')).length;
  const questionRate = (questionCount / userMessages.length * 100).toFixed(1);

  // Calculate most active hours
  const hourCounts = Array(24).fill(0);
  userMessages.forEach(m => {
    hourCounts[m.timestamp.getHours()]++;
  });

  const topHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .filter(h => h.count > 0);

  // Calculate days active
  const uniqueDays = new Set(userMessages.map(m => m.timestamp.toDateString())).size;

  return {
    userName,
    otherPerson,
    totalMessages: userMessages.length,
    avgMessageLength,
    lengthComparison,
    initiationRate: parseFloat(initiationRate),
    emojiFrequency: parseFloat(emojiFrequency),
    emojiComparison: emojiFrequency > otherEmojiFrequency ? 'more' : emojiFrequency < otherEmojiFrequency ? 'less' : 'similar',
    questionRate: parseFloat(questionRate),
    topHours,
    daysActive: uniqueDays,
  };
};

/**
 * Get personalized sentiment insights for a specific user
 * @param {Array} messages - Array of messages with sentiment
 * @param {string} userName - Name of the user to analyze
 * @returns {Object} Sentiment breakdown for the user
 */
export const getPersonalizedSentiment = (messages, userName) => {
  const userMessages = messages.filter(m => m.sender === userName);

  if (userMessages.length === 0) return null;

  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  const emotionCounts = {};

  userMessages.forEach(m => {
    if (m.sentiment) {
      sentimentCounts[m.sentiment.sentiment]++;

      if (m.sentiment.detectedEmotions && m.sentiment.detectedEmotions.length > 0) {
        m.sentiment.detectedEmotions.forEach(emotion => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      }
    }
  });

  const total = userMessages.length;

  return {
    positivePercent: Math.round((sentimentCounts.positive / total) * 100),
    neutralPercent: Math.round((sentimentCounts.neutral / total) * 100),
    negativePercent: Math.round((sentimentCounts.negative / total) * 100),
    topEmotions: Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
    overallMood: sentimentCounts.positive > sentimentCounts.negative ? 'Positive' :
                 sentimentCounts.positive < sentimentCounts.negative ? 'Thoughtful' : 'Balanced',
  };
};

/**
 * Generate personalized communication style description
 * @param {Object} insights - Personalized insights object
 * @param {Object} sentiment - Personalized sentiment object
 * @returns {string} Communication style description
 */
export const getCommunicationStyle = (insights, sentiment) => {
  if (!insights || !sentiment) return 'Engaged communicator';

  const styles = [];

  // Based on message length
  if (insights.lengthComparison === 'longer') {
    styles.push('detailed');
  } else if (insights.lengthComparison === 'shorter') {
    styles.push('concise');
  }

  // Based on emoji usage
  if (insights.emojiFrequency > 0.3) {
    styles.push('expressive');
  }

  // Based on question rate
  if (insights.questionRate > 20) {
    styles.push('curious');
  }

  // Based on sentiment
  if (sentiment.positivePercent > 70) {
    styles.push('warm');
  }

  // Based on initiation
  if (insights.initiationRate > 30) {
    styles.push('proactive');
  }

  return styles.length > 0
    ? styles.slice(0, 2).join(' & ').charAt(0).toUpperCase() + styles.slice(0, 2).join(' & ').slice(1)
    : 'Engaged';
};

/**
 * Get personalized coaching insights
 * @param {Object} insights - Personalized insights object
 * @param {Object} sentiment - Personalized sentiment object
 * @returns {Array} Array of coaching messages
 */
export const getPersonalizedCoachingInsights = (insights, sentiment) => {
  if (!insights || !sentiment) return [];

  const coachingInsights = [];

  // Message frequency insight
  if (insights.totalMessages > 100) {
    coachingInsights.push({
      title: 'Active Communicator',
      message: `You've sent ${insights.totalMessages.toLocaleString()} messages! You clearly value staying connected.`,
      type: 'positive',
    });
  }

  // Message length insight
  if (insights.lengthComparison === 'longer') {
    coachingInsights.push({
      title: 'Thoughtful Expression',
      message: 'Your messages tend to be detailed and thorough. You take time to express yourself fully.',
      type: 'positive',
    });
  } else if (insights.lengthComparison === 'shorter') {
    coachingInsights.push({
      title: 'Clear & Concise',
      message: 'You communicate efficiently with concise messages. Short and sweet!',
      type: 'positive',
    });
  }

  // Emoji usage insight
  if (insights.emojiFrequency > 0.5) {
    coachingInsights.push({
      title: 'Emotionally Expressive',
      message: `You use emojis frequently (${insights.emojiFrequency} per message). This adds warmth and clarity to your texts.`,
      type: 'positive',
    });
  }

  // Question asking insight
  if (insights.questionRate > 25) {
    coachingInsights.push({
      title: 'Genuinely Curious',
      message: `${insights.questionRate}% of your messages ask questions. You show real interest in ${insights.otherPerson}'s thoughts.`,
      type: 'positive',
    });
  } else if (insights.questionRate < 10) {
    coachingInsights.push({
      title: 'Room to Explore',
      message: 'Consider asking more questions to deepen your conversations and show curiosity.',
      type: 'suggestion',
    });
  }

  // Initiation insight
  if (insights.initiationRate > 40) {
    coachingInsights.push({
      title: 'Conversation Starter',
      message: 'You often initiate conversations. Your proactive nature keeps the connection alive.',
      type: 'positive',
    });
  } else if (insights.initiationRate < 20) {
    coachingInsights.push({
      title: 'Responsive Style',
      message: 'You tend to respond rather than initiate. Both styles are valuable in different ways.',
      type: 'neutral',
    });
  }

  // Sentiment insight
  if (sentiment.positivePercent > 75) {
    coachingInsights.push({
      title: 'Positive Energy',
      message: `${sentiment.positivePercent}% of your messages carry positive sentiment. Your optimism shines through!`,
      type: 'positive',
    });
  }

  // Active hours insight
  if (insights.topHours.length > 0) {
    const mainHour = insights.topHours[0].hour;
    const timeOfDay = mainHour < 12 ? 'morning' : mainHour < 17 ? 'afternoon' : mainHour < 21 ? 'evening' : 'night';
    coachingInsights.push({
      title: 'Your Active Time',
      message: `You're most active in the ${timeOfDay} (around ${mainHour}:00). That's when you're most present.`,
      type: 'neutral',
    });
  }

  return coachingInsights.slice(0, 6); // Return top 6 insights
};
