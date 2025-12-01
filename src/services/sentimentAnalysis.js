/**
 * Sentiment Analysis Service
 * Basic sentiment analysis using keyword matching
 * For production, integrate with OpenAI API or Hugging Face
 */

const sentimentKeywords = {
  joy: [
    'happy', 'love', 'great', 'amazing', 'wonderful', 'awesome', 'fantastic',
    'excited', 'perfect', 'beautiful', 'thank', 'thanks', 'haha', 'lol', 'lmao',
    'yay', 'nice', 'good', 'best', 'excellent', 'lovely', 'fun', 'enjoy',
    'celebration', 'celebrate', 'congratulations', 'proud', '😊', '😄', '😁',
    '❤️', '💕', '💖', '😍', '🥰', '😘', '🎉', '🎊', '👏',
  ],
  sadness: [
    'sad', 'sorry', 'miss', 'missed', 'cry', 'crying', 'hurt', 'pain',
    'lost', 'alone', 'lonely', 'depressed', 'upset', 'disappointed', 'terrible',
    'awful', 'worst', 'sucks', 'unfortunate', 'regret', 'wish', '😢', '😭',
    '😔', '☹️', '😞', '💔',
  ],
  anger: [
    'angry', 'mad', 'hate', 'annoyed', 'annoying', 'frustrated', 'stupid',
    'idiot', 'damn', 'wtf', 'ridiculous', 'unacceptable', 'disgusting',
    'furious', 'pissed', 'irritated', 'sick of', 'fed up', '😠', '😡', '🤬',
  ],
  affection: [
    'love you', 'miss you', 'thinking of you', 'care about', 'adore',
    'sweetheart', 'darling', 'honey', 'baby', 'babe', 'dear', 'treasure',
    'precious', 'forever', 'always', 'kiss', 'hug', 'cuddle', '💑', '💏',
    '👫', '🫂', '😘', '😻', '💝',
  ],
  gratitude: [
    'thank you', 'thanks', 'appreciate', 'grateful', 'thankful', 'blessing',
    'blessed', 'lucky', 'fortunate', 'kind', 'kindness', 'helpful',
    'support', 'thank god', '🙏',
  ],
  apology: [
    'sorry', 'apologize', 'apology', 'my bad', 'forgive', 'mistake',
    'my fault', 'regret', 'didnt mean', "didn't mean",
  ],
  anxiety: [
    'worried', 'worry', 'nervous', 'anxious', 'stress', 'stressed',
    'overwhelmed', 'scared', 'afraid', 'fear', 'concern', 'concerned',
    'panic', 'tense', '😰', '😨', '😱',
  ],
  excitement: [
    'excited', 'cant wait', "can't wait", 'looking forward', 'thrilled',
    'pumped', 'hyped', 'omg', 'wow', 'amazing news', 'incredible', '🤩', '😃',
  ],
};

const toxicityKeywords = {
  insults: [
    'idiot', 'stupid', 'dumb', 'moron', 'loser', 'pathetic', 'worthless',
    'useless', 'incompetent', 'failure', 'trash', 'garbage', 'disgusting',
  ],
  aggression: [
    'hate you', 'hate this', 'shut up', 'leave me alone', 'go away',
    'kill', 'die', 'dead', 'hurt you', 'destroy', 'ruin', 'screw you',
  ],
  dismissive: [
    'whatever', 'don\'t care', 'dont care', 'who cares', 'so what',
    'your problem', 'not my problem', 'deal with it', 'get over it',
  ],
  manipulation: [
    'always', 'never', 'you always', 'you never', 'typical', 'just like you',
    'should have known', 'knew it', 'told you so',
  ],
  blame: [
    'your fault', 'you did', 'you made me', 'because of you', 'you ruined',
    'blame you', 'you caused', 'you always do',
  ],
};

/**
 * Analyze sentiment of a single message
 * @param {string} text - Message text
 * @returns {Object} Sentiment scores
 */
export const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  const scores = {
    joy: 0,
    sadness: 0,
    anger: 0,
    affection: 0,
    gratitude: 0,
    apology: 0,
    anxiety: 0,
    excitement: 0,
  };

  Object.entries(sentimentKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        scores[emotion]++;
      }
    });
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  if (totalScore === 0) {
    return {
      sentiment: 'neutral',
      scores,
      confidence: 0,
      primaryEmotion: 'neutral',
    };
  }

  const primaryEmotion = Object.entries(scores).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  const overallPositive = scores.joy + scores.affection + scores.gratitude + scores.excitement;
  const overallNegative = scores.sadness + scores.anger + scores.anxiety + scores.apology;

  let sentiment = 'neutral';
  if (overallPositive > overallNegative) {
    sentiment = 'positive';
  } else if (overallNegative > overallPositive) {
    sentiment = 'negative';
  }

  return {
    sentiment,
    scores,
    confidence: Math.min(totalScore / 5, 1),
    primaryEmotion,
  };
};

/**
 * Analyze sentiment for all messages
 * @param {Array} messages - Array of parsed messages
 * @returns {Array} Messages with sentiment data
 */
export const analyzeChatSentiment = (messages) => {
  return messages.map(message => ({
    ...message,
    sentiment: analyzeSentiment(message.text),
  }));
};

/**
 * Get sentiment timeline aggregated by period
 * @param {Array} messages - Array of messages with sentiment
 * @param {string} period - 'day' or 'week'
 * @returns {Array} Sentiment scores over time
 */
export const getSentimentTimeline = (messages, period = 'day') => {
  const grouped = {};

  messages.forEach(message => {
    const date = message.timestamp;
    let key;

    if (period === 'day') {
      key = date.toLocaleDateString();
    } else {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toLocaleDateString();
    }

    if (!grouped[key]) {
      grouped[key] = {
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
        emotions: {
          joy: 0,
          sadness: 0,
          anger: 0,
          affection: 0,
          gratitude: 0,
          apology: 0,
          anxiety: 0,
          excitement: 0,
        },
      };
    }

    const sentiment = message.sentiment || analyzeSentiment(message.text);
    grouped[key][sentiment.sentiment]++;
    grouped[key].total++;

    Object.entries(sentiment.scores).forEach(([emotion, score]) => {
      grouped[key].emotions[emotion] += score;
    });
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      positiveRatio: data.total > 0 ? (data.positive / data.total) * 100 : 0,
      negativeRatio: data.total > 0 ? (data.negative / data.total) * 100 : 0,
      neutralRatio: data.total > 0 ? (data.neutral / data.total) * 100 : 0,
      sentimentScore: data.total > 0 ?
        ((data.positive - data.negative) / data.total) * 100 : 0,
      ...data.emotions,
      messageCount: data.total,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Generate relationship summary based on sentiment and patterns
 * @param {Array} messages - Array of messages
 * @param {Object} stats - Chat statistics
 * @returns {Object} Relationship summary
 */
export const generateRelationshipSummary = (messages, stats) => {
  const sentimentData = analyzeChatSentiment(messages);
  const timeline = getSentimentTimeline(sentimentData, 'week');

  const totalPositive = timeline.reduce((sum, t) => sum + (t.positiveRatio * t.messageCount / 100), 0);
  const totalNegative = timeline.reduce((sum, t) => sum + (t.negativeRatio * t.messageCount / 100), 0);
  const totalMessages = messages.length;

  const overallPositivePercent = Math.round((totalPositive / totalMessages) * 100);
  const overallNegativePercent = Math.round((totalNegative / totalMessages) * 100);

  const mostPositivePeriod = [...timeline].sort((a, b) => b.positiveRatio - a.positiveRatio)[0];
  const mostNegativePeriod = [...timeline].sort((a, b) => b.negativeRatio - a.negativeRatio)[0];

  const dominantEmotions = {};
  sentimentData.forEach(msg => {
    const primary = msg.sentiment.primaryEmotion;
    dominantEmotions[primary] = (dominantEmotions[primary] || 0) + 1;
  });

  const topEmotions = Object.entries(dominantEmotions)
    .filter(([emotion]) => emotion !== 'neutral')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion);

  const totalDays = Math.ceil(
    (messages[messages.length - 1].timestamp - messages[0].timestamp) / (1000 * 60 * 60 * 24)
  );

  const avgMessagesPerDay = Math.round(totalMessages / totalDays);

  let communicationHealth = 'healthy';
  if (overallNegativePercent > 30) {
    communicationHealth = 'needs attention';
  } else if (overallNegativePercent > 20) {
    communicationHealth = 'moderate';
  }

  const emotionBreakdown = getEmotionBreakdown(sentimentData);
  const neutralPercent = Math.round(100 - overallPositivePercent - overallNegativePercent);

  return {
    overallSentiment: overallPositivePercent > overallNegativePercent ? 'positive' :
                      overallNegativePercent > overallPositivePercent ? 'negative' : 'neutral',
    positivePercent: overallPositivePercent,
    negativePercent: overallNegativePercent,
    neutralPercent: neutralPercent < 0 ? 0 : neutralPercent,
    mostPositivePeriod: mostPositivePeriod?.date,
    mostNegativePeriod: mostNegativePeriod?.date,
    topEmotions,
    emotionBreakdown,
    communicationHealth,
    avgMessagesPerDay,
    totalDays,
    insights: generateInsights({
      overallPositivePercent,
      overallNegativePercent,
      topEmotions,
      avgMessagesPerDay,
      stats,
    }),
  };
};

/**
 * Generate textual insights
 */
const generateInsights = (data) => {
  const insights = [];

  if (data.overallPositivePercent > 60) {
    insights.push('Your communication shows strong positive sentiment overall.');
  } else if (data.overallNegativePercent > 30) {
    insights.push('There are notable periods of tension in your communication.');
  }

  if (data.avgMessagesPerDay > 50) {
    insights.push('You maintain very active daily communication.');
  } else if (data.avgMessagesPerDay < 5) {
    insights.push('Your communication frequency is relatively low.');
  }

  if (data.topEmotions.includes('affection')) {
    insights.push('Affection and care are prominent themes in your messages.');
  }

  if (data.topEmotions.includes('gratitude')) {
    insights.push('You frequently express appreciation and gratitude.');
  }

  if (data.topEmotions.includes('anxiety') || data.topEmotions.includes('apology')) {
    insights.push('Consider whether there are recurring concerns that need addressing.');
  }

  const balance = Math.abs(data.stats?.senderStats?.messageBalance || 0);
  if (balance > 30) {
    insights.push('There is a notable imbalance in message initiation.');
  } else if (balance < 10) {
    insights.push('Both participants contribute equally to the conversation.');
  }

  return insights;
};

/**
 * Calculate emotion synchrony between participants (0-100)
 * Measures how similarly participants express emotions
 * @param {Array} messages - Array of messages with sentiment data
 * @param {Array} participants - Array of participant names
 * @returns {number} Synchrony score from 0-100
 */
export const calculateEmotionSynchrony = (messages, participants) => {
  if (!messages || messages.length === 0 || !participants || participants.length < 2) {
    return 50; // Default neutral score
  }

  // Group messages by sender
  const messagesBySender = {};
  participants.forEach(p => {
    messagesBySender[p] = messages.filter(m => m.sender === p);
  });

  // Calculate emotion distribution for each sender
  const emotionDistributions = {};
  participants.forEach(sender => {
    const senderMessages = messagesBySender[sender];
    const emotionCounts = {
      joy: 0,
      sadness: 0,
      anger: 0,
      affection: 0,
      gratitude: 0,
      apology: 0,
      anxiety: 0,
      excitement: 0,
      neutral: 0
    };

    senderMessages.forEach(msg => {
      const emotions = msg.emotions || [];
      if (emotions.length === 0) {
        emotionCounts.neutral++;
      } else {
        emotions.forEach(emotion => {
          if (emotionCounts.hasOwnProperty(emotion)) {
            emotionCounts[emotion]++;
          }
        });
      }
    });

    // Convert to percentages
    const total = senderMessages.length || 1;
    emotionDistributions[sender] = {};
    Object.keys(emotionCounts).forEach(emotion => {
      emotionDistributions[sender][emotion] = (emotionCounts[emotion] / total) * 100;
    });
  });

  // Calculate similarity between distributions
  const [sender1, sender2] = participants;
  if (!emotionDistributions[sender1] || !emotionDistributions[sender2]) {
    return 50;
  }

  // Calculate cosine similarity or simple difference
  let totalDifference = 0;
  const emotions = Object.keys(emotionDistributions[sender1]);

  emotions.forEach(emotion => {
    const diff = Math.abs(
      emotionDistributions[sender1][emotion] - emotionDistributions[sender2][emotion]
    );
    totalDifference += diff;
  });

  // Average difference per emotion
  const avgDifference = totalDifference / emotions.length;

  // Convert to 0-100 scale (lower difference = higher score)
  // Max difference is 100, so score = 100 - difference
  const synchronyScore = Math.max(0, Math.min(100, 100 - avgDifference));

  return Math.round(synchronyScore);
};

/**
 * Detect conflict resolution patterns
 * Looks for negative emotions followed by apologies/gratitude
 * @param {Array} messages - Array of messages with sentiment data
 * @returns {Object} { score: 0-1, patterns: [], resolutionRatio: 0-1 }
 */
export const detectConflictResolution = (messages) => {
  if (!messages || messages.length === 0) {
    return { score: 0.5, patterns: [], resolutionRatio: 0.5 };
  }

  let conflictCount = 0;
  let resolutionCount = 0;
  const patterns = [];

  // Look for anger/anxiety followed by apology/gratitude within next 5 messages
  for (let i = 0; i < messages.length - 1; i++) {
    const msg = messages[i];
    const emotions = msg.emotions || [];

    // Check if this is a conflict message
    if (emotions.includes('anger') || emotions.includes('anxiety')) {
      conflictCount++;

      // Look ahead for resolution
      for (let j = i + 1; j < Math.min(i + 6, messages.length); j++) {
        const futureMsg = messages[j];
        const futureEmotions = futureMsg.emotions || [];

        if (futureEmotions.includes('apology') || futureEmotions.includes('gratitude')) {
          resolutionCount++;
          patterns.push({
            conflictIndex: i,
            resolutionIndex: j,
            timeDiff: Math.abs(futureMsg.timestamp - msg.timestamp) / (1000 * 60) // minutes
          });
          break;
        }
      }
    }
  }

  const resolutionRatio = conflictCount > 0 ? resolutionCount / conflictCount : 0.5;
  const score = Math.min(1, resolutionRatio * 1.5); // Boost the score slightly

  return {
    score,
    patterns,
    resolutionRatio,
    conflictCount,
    resolutionCount
  };
};

/**
 * Get affection level (0-100)
 * Measures frequency of affectionate language and emojis
 * @param {Array} messages - Array of messages
 * @returns {number} Affection level from 0-100
 */
export const getAffectionLevel = (messages) => {
  if (!messages || messages.length === 0) return 0;

  const affectionKeywords = [
    'love', 'miss', 'care', 'adore', 'treasure', 'cherish',
    'sweetheart', 'darling', 'honey', 'babe', 'baby',
    'hug', 'kiss', 'cuddle', 'embrace'
  ];

  const affectionEmojis = ['❤️', '💕', '💖', '💗', '💓', '💞', '💝', '😘', '😍', '🥰', '😻', '💑', '💏'];

  let affectionCount = 0;

  messages.forEach(msg => {
    const text = msg.text.toLowerCase();
    const emotions = msg.emotions || [];

    // Check for affection emotion
    if (emotions.includes('affection')) {
      affectionCount++;
    }

    // Check for affection keywords
    if (affectionKeywords.some(keyword => text.includes(keyword))) {
      affectionCount += 0.5; // Half weight for keywords
    }

    // Check for affection emojis
    if (affectionEmojis.some(emoji => msg.text.includes(emoji))) {
      affectionCount += 0.5; // Half weight for emojis
    }
  });

  // Calculate as percentage of total messages, capped at 100
  const affectionPercent = (affectionCount / messages.length) * 100;

  return Math.round(Math.min(100, affectionPercent * 2)); // Multiply by 2 to make it easier to reach higher scores
};

/**
 * Detect toxicity in messages
 * @param {Array} messages - Array of messages
 * @returns {Object} Toxicity analysis with score, breakdown, and patterns
 */
export const detectToxicity = (messages) => {
  if (!messages || messages.length === 0) {
    return {
      toxicityScore: 0,
      toxicMessageCount: 0,
      toxicityBreakdown: {},
      toxicityPercent: 0,
      level: 'healthy',
      patterns: []
    };
  }

  const toxicityBreakdown = {
    insults: 0,
    aggression: 0,
    dismissive: 0,
    manipulation: 0,
    blame: 0,
  };

  let toxicMessageCount = 0;
  const patterns = [];

  messages.forEach((msg, idx) => {
    const text = msg.text.toLowerCase();
    let isToxic = false;
    const foundCategories = [];

    Object.entries(toxicityKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          toxicityBreakdown[category]++;
          isToxic = true;
          if (!foundCategories.includes(category)) {
            foundCategories.push(category);
          }
        }
      });
    });

    if (isToxic) {
      toxicMessageCount++;
      patterns.push({
        messageIndex: idx,
        sender: msg.sender,
        categories: foundCategories,
        timestamp: msg.timestamp
      });
    }
  });

  const toxicityPercent = (toxicMessageCount / messages.length) * 100;

  // Calculate overall toxicity score (0-100, lower is better)
  const toxicityScore = Math.round(toxicityPercent);

  // Determine toxicity level
  let level = 'healthy';
  if (toxicityScore > 10) {
    level = 'concerning';
  } else if (toxicityScore > 5) {
    level = 'needs attention';
  } else if (toxicityScore > 2) {
    level = 'moderate';
  }

  return {
    toxicityScore,
    toxicMessageCount,
    toxicityBreakdown,
    toxicityPercent: Math.round(toxicityPercent * 10) / 10,
    level,
    patterns: patterns.slice(0, 10) // Return top 10 patterns
  };
};

/**
 * Get emotion breakdown with counts
 * Returns all emotions with their counts (not just primary)
 * @param {Array} messages - Array of messages with sentiment data
 * @returns {Object} Emotion counts for all 8 emotions
 */
export const getEmotionBreakdown = (messages) => {
  if (!messages || messages.length === 0) {
    return {
      joy: 0,
      sadness: 0,
      anger: 0,
      affection: 0,
      gratitude: 0,
      apology: 0,
      anxiety: 0,
      excitement: 0,
    };
  }

  const breakdown = {
    joy: 0,
    sadness: 0,
    anger: 0,
    affection: 0,
    gratitude: 0,
    apology: 0,
    anxiety: 0,
    excitement: 0,
  };

  messages.forEach(msg => {
    const sentiment = msg.sentiment || analyzeSentiment(msg.text);
    Object.entries(sentiment.scores).forEach(([emotion, score]) => {
      breakdown[emotion] += score;
    });
  });

  return breakdown;
};
