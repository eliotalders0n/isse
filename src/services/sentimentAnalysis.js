/**
 * Advanced Sentiment Analysis Service
 * Deep contextual analysis for multiple domains:
 * - Business & Corporate
 * - Personal Relationships (Love, Friends, Family)
 * - Professional Projects
 * - Emotional Intelligence
 *
 * Integrates with Google Gemini AI for enhanced analysis
 *
 * SECURITY NOTE: API key is exposed in client-side code.
 * For production, move API calls to a backend server to protect the key.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  sentimentKeywords,
  contextKeywords,
  communicationPatterns,
  toxicityKeywords,
} from './sentimentKeywords.js';

// Initialize Gemini AI with fallback models
const GEMINI_API_KEY = 'AIzaSyAhQitzL_hFAnLOu3jV83HRjG1cyw_kI8c';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Model priority: Latest generation → Previous generation
// Based on https://ai.google.dev/gemini-api/docs/models/gemini
const GEMINI_MODELS = [
  'gemini-2.5-flash',               // Latest, fastest with 1M context
  'gemini-2.0-flash',               // Previous gen, stable
  'gemini-2.5-pro',                 // Most capable, slower
];

let currentModelIndex = 0;
let model = genAI.getGenerativeModel({ model: GEMINI_MODELS[0] });
let modelSwitched = false; // Track if we've already switched due to errors

/**
 * Switch to next available Gemini model
 * @returns {boolean} True if switched, false if no more models
 */
const switchToNextModel = () => {
  // Prevent multiple rapid switches
  if (modelSwitched) {
    console.log('Model switch already in progress, skipping');
    return false;
  }

  currentModelIndex++;
  if (currentModelIndex >= GEMINI_MODELS.length) {
    console.warn('All Gemini models exhausted, falling back to keyword analysis');
    return false;
  }

  modelSwitched = true;
  const newModel = GEMINI_MODELS[currentModelIndex];
  console.log(`🔄 Switching to Gemini model: ${newModel} (index ${currentModelIndex})`);
  model = genAI.getGenerativeModel({ model: newModel });

  // Reset the flag after a delay to allow retries with the new model
  setTimeout(() => {
    modelSwitched = false;
  }, 2000);

  return true;
};

/**
 * Reset model selection to first model (useful for testing or new analysis sessions)
 */
export const resetModelSelection = () => {
  currentModelIndex = 0;
  modelSwitched = false;
  model = genAI.getGenerativeModel({ model: GEMINI_MODELS[0] });
  console.log(`Reset to primary Gemini model: ${GEMINI_MODELS[0]}`);
};

/**
 * Get current model info for debugging
 * @returns {Object} Current model info
 */
export const getCurrentModelInfo = () => {
  return {
    currentModel: GEMINI_MODELS[currentModelIndex],
    currentIndex: currentModelIndex,
    availableModels: GEMINI_MODELS,
    modelSwitched,
  };
};

/**
 * Detect conversation context (business, love, friendship, etc.)
 * @param {Array} messages - Array of messages
 * @returns {Object} Context scores and primary context
 */
export const detectConversationContext = (messages) => {
  const contextScores = {};

  Object.keys(contextKeywords).forEach(context => {
    contextScores[context] = 0;
  });

  messages.forEach(msg => {
    const lowerText = msg.text.toLowerCase();

    Object.entries(contextKeywords).forEach(([context, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          contextScores[context]++;
        }
      });
    });
  });

  const totalMatches = Object.values(contextScores).reduce((a, b) => a + b, 0);

  if (totalMatches === 0) {
    return {
      primaryContext: 'personal',
      contextScores: {},
      contextPercentages: {},
    };
  }

  const contextPercentages = {};
  Object.entries(contextScores).forEach(([context, score]) => {
    contextPercentages[context] = Math.round((score / totalMatches) * 100);
  });

  const primaryContext = Object.entries(contextScores).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  return {
    primaryContext,
    contextScores,
    contextPercentages,
  };
};

/**
 * Analyze communication style and patterns
 * @param {string} text - Message text
 * @returns {Object} Communication patterns detected
 */
export const analyzeCommunicationStyle = (text) => {
  const lowerText = text.toLowerCase();
  const patterns = {};

  Object.entries(communicationPatterns).forEach(([pattern, keywords]) => {
    patterns[pattern] = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        patterns[pattern]++;
      }
    });
  });

  const dominantPattern = Object.entries(patterns)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  return {
    patterns,
    dominantPattern,
    isQuestion: text.includes('?'),
    isAssertion: text.includes('!'),
    wordCount: text.split(/\s+/).length,
  };
};

/**
 * Enhanced sentiment analysis with deeper context
 * @param {string} text - Message text
 * @returns {Object} Comprehensive sentiment analysis
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
    trust: 0,
    betrayal: 0,
    pride: 0,
    shame: 0,
  };

  // Score each emotion
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
      secondaryEmotions: [],
      emotionalComplexity: 0,
    };
  }

  // Get primary and secondary emotions
  const sortedEmotions = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  const primaryEmotion = sortedEmotions[0][0];
  const secondaryEmotions = sortedEmotions.slice(1, 3).map(([emotion]) => emotion);

  // Calculate overall sentiment
  const overallPositive = scores.joy + scores.affection + scores.gratitude +
                           scores.excitement + scores.trust + scores.pride;
  const overallNegative = scores.sadness + scores.anger + scores.anxiety +
                           scores.apology + scores.betrayal + scores.shame;

  let sentiment = 'neutral';
  if (overallPositive > overallNegative) {
    sentiment = 'positive';
  } else if (overallNegative > overallPositive) {
    sentiment = 'negative';
  }

  // Emotional complexity (how many different emotions are present)
  const emotionalComplexity = sortedEmotions.length;

  return {
    sentiment,
    scores,
    confidence: Math.min(totalScore / 5, 1),
    primaryEmotion,
    secondaryEmotions,
    emotionalComplexity,
    isComplexEmotion: emotionalComplexity >= 3, // Mixed emotions
  };
};

/**
 * Analyze a single message using Gemini AI
 * @param {string} text - Message text
 * @returns {Promise<Object>} AI-powered sentiment analysis
 */
export const analyzeWithGemini = async (text) => {
  try {
    const prompt = `Analyze the sentiment and emotion in this message. Respond with ONLY valid JSON (no markdown, no code blocks, no extra text):

Message: "${text}"

Return this exact JSON structure:
{
  "sentiment": "positive|negative|neutral",
  "primaryEmotion": "joy|sadness|anger|affection|gratitude|apology|anxiety|excitement|trust|betrayal|pride|shame",
  "secondaryEmotions": ["emotion1", "emotion2"],
  "confidence": 0.85,
  "intensity": 0.75,
  "context": "business|professional|project|love|friendship|family|technical|personal",
  "communicationStyle": "assertive|passiveAggressive|defensive|supportive|questioning|planning|agreeing|disagreeing",
  "aiInsight": "Brief insight about the message"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean up response - remove markdown code blocks if present
    const cleanText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const analysis = JSON.parse(cleanText);

    return {
      ...analysis,
      aiPowered: true,
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);

    // Check if it's a quota/rate limit error or 404 error
    const isQuotaError = error.message && (
      error.message.includes('quota') ||
      error.message.includes('429') ||
      error.message.includes('rate limit')
    );

    const isNotFoundError = error.message && (
      error.message.includes('404') ||
      error.message.includes('not found')
    );

    // Try switching models if we hit quota or model not found
    if ((isQuotaError || isNotFoundError) && currentModelIndex < GEMINI_MODELS.length - 1) {
      switchToNextModel();
    }

    // Fallback to keyword-based analysis (don't retry same message)
    return {
      ...analyzeSentiment(text),
      aiPowered: false,
      error: error.message,
      fallbackReason: isQuotaError ? 'quota_exceeded' : isNotFoundError ? 'model_not_found' : 'api_error',
    };
  }
};

/**
 * Analyze multiple messages with Gemini AI (with rate limiting)
 * @param {Array} messages - Array of messages
 * @param {number} sampleSize - Number of messages to analyze with AI (default: 30)
 * @returns {Promise<Array>} Messages with AI-enhanced analysis
 */
export const analyzeChatWithGemini = async (messages, sampleSize = 30) => {
  console.log(`🤖 Starting AI analysis for ${messages.length} messages (sampling ${Math.min(sampleSize, messages.length)})`);
  console.log(`📊 Current model: ${GEMINI_MODELS[currentModelIndex]}`);

  // If there are too many messages, sample them intelligently
  let messagesToAnalyze = messages;

  if (messages.length > sampleSize) {
    // Sample messages evenly across the conversation
    const step = Math.floor(messages.length / sampleSize);
    messagesToAnalyze = messages.filter((_, index) => index % step === 0).slice(0, sampleSize);
  }

  // Analyze sampled messages with Gemini
  const analyzedMessages = [];
  let aiSuccessCount = 0;
  let fallbackCount = 0;

  for (let i = 0; i < messagesToAnalyze.length; i++) {
    const msg = messagesToAnalyze[i];

    try {
      const geminiAnalysis = await analyzeWithGemini(msg.text);

      // Check if AI succeeded or fell back
      const isAiSuccess = geminiAnalysis.aiPowered === true;
      if (isAiSuccess) {
        aiSuccessCount++;
      } else {
        fallbackCount++;
      }

      analyzedMessages.push({
        ...msg,
        sentiment: geminiAnalysis,
        aiEnhanced: isAiSuccess,
      });

      // Progress logging every 10 messages
      if ((i + 1) % 10 === 0) {
        console.log(`📈 Progress: ${i + 1}/${messagesToAnalyze.length} (AI: ${aiSuccessCount}, Fallback: ${fallbackCount})`);
      }

      // Small delay to avoid rate limiting (only if AI is working)
      if (isAiSuccess && i < messagesToAnalyze.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error(`❌ Error analyzing message ${i}:`, error);
      // Use keyword-based analysis as fallback
      const keywordAnalysis = analyzeSentiment(msg.text);
      analyzedMessages.push({
        ...msg,
        sentiment: keywordAnalysis,
        aiEnhanced: false,
      });
      fallbackCount++;
    }
  }

  console.log(`✅ AI Analysis complete: ${aiSuccessCount} AI-powered, ${fallbackCount} keyword fallback`);

  // For non-analyzed messages, use keyword-based analysis
  const analyzedIndices = new Set(messagesToAnalyze.map(m => messages.indexOf(m)));
  const remainingMessages = messages
    .filter((_, index) => !analyzedIndices.has(index))
    .map(msg => ({
      ...msg,
      sentiment: analyzeSentiment(msg.text),
      communicationStyle: analyzeCommunicationStyle(msg.text),
      emotions: [],
      aiEnhanced: false,
    }));

  // Combine and sort by original order
  const allMessages = [...analyzedMessages, ...remainingMessages];
  allMessages.sort((a, b) => messages.indexOf(a) - messages.indexOf(b));

  return allMessages;
};

/**
 * Get conversation-level insights using Gemini AI
 * OPTIMIZED: Uses only 1 API call for entire conversation analysis
 * @param {Array} messages - Array of messages
 * @param {Object} stats - Basic statistics
 * @returns {Promise<Object|null>} AI-powered conversation insights or null on failure
 */
export const getGeminiConversationInsights = async (messages, stats) => {
  try {
    // Sample messages for context (reduced to 15 for efficiency)
    const sampleSize = Math.min(15, messages.length);
    const step = Math.floor(messages.length / sampleSize);
    const sampledMessages = messages
      .filter((_, index) => index % step === 0)
      .slice(0, sampleSize)
      .map(m => `${m.sender}: ${m.text.substring(0, 100)}`) // Limit message length
      .join('\n');

    const participants = stats.senderStats ? Object.keys(stats.senderStats) : ['Person 1', 'Person 2'];

    const prompt = `Analyze this conversation between ${participants.join(' and ')}.

Sample messages (${sampleSize} of ${messages.length}):
${sampledMessages}

Stats: ${messages.length} messages over ${stats.totalDays} days (${stats.avgMessagesPerDay}/day avg)

Provide deep insights. Return ONLY valid JSON:
{
  "overallDynamic": "Brief description of relationship dynamic",
  "conversationContext": "business|professional|project|love|friendship|family|technical|personal",
  "communicationHealth": "excellent|healthy|moderate|needs attention",
  "healthScore": 75,
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "areasForGrowth": ["area1", "area2"],
  "emotionalPatterns": "Description of emotional patterns",
  "communicationStyle": "Description of dominant communication style",
  "relationshipStage": "Description of relationship stage/maturity",
  "aiInsights": ["Deep insight 1", "Deep insight 2", "Deep insight 3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const cleanText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini conversation insights error:', error);

    // Check if it's a quota/rate limit error or 404
    const isQuotaError = error.message && (
      error.message.includes('quota') ||
      error.message.includes('429') ||
      error.message.includes('rate limit')
    );

    const isNotFoundError = error.message && (
      error.message.includes('404') ||
      error.message.includes('not found')
    );

    // Switch models if needed (for next attempt)
    if ((isQuotaError || isNotFoundError) && currentModelIndex < GEMINI_MODELS.length - 1) {
      switchToNextModel();
    }

    // Return null to fall back to keyword-based insights
    return null;
  }
};

/**
 * Analyze sentiment for all messages with enhanced context
 * @param {Array} messages - Array of parsed messages
 * @param {boolean} useAI - Whether to use Gemini AI (default: false for backward compatibility)
 * @returns {Array|Promise<Array>} Messages with comprehensive sentiment and style data
 */
export const analyzeChatSentiment = (messages, useAI = false) => {
  // Use AI-powered analysis if requested
  if (useAI) {
    return analyzeChatWithGemini(messages);
  }

  // Default keyword-based analysis
  return messages.map(message => {
    const sentiment = analyzeSentiment(message.text);
    const communicationStyle = analyzeCommunicationStyle(message.text);

    return {
      ...message,
      sentiment,
      communicationStyle,
      emotions: [
        sentiment.primaryEmotion,
        ...sentiment.secondaryEmotions
      ].filter(e => e !== 'neutral'),
    };
  });
};

/**
 * Analyze relationship dynamics and communication health
 * @param {Array} messages - Array of messages with sentiment
 * @param {Array} participants - Participant names
 * @returns {Object} Relationship dynamics analysis
 */
export const analyzeRelationshipDynamics = (messages, participants) => {
  if (!messages || messages.length === 0 || !participants || participants.length < 2) {
    return {
      communicationBalance: 50,
      emotionalReciprocity: 50,
      supportLevel: 50,
      conflictLevel: 0,
      trustLevel: 50,
    };
  }

  const [person1, person2] = participants;

  // Group messages by sender
  const person1Messages = messages.filter(m => m.sender === person1);
  const person2Messages = messages.filter(m => m.sender === person2);

  // Communication balance
  const communicationBalance = Math.round(
    (person1Messages.length / messages.length) * 100
  );

  // Emotional reciprocity (do they express similar emotions?)
  const person1Emotions = {};
  const person2Emotions = {};

  person1Messages.forEach(msg => {
    const emotion = msg.sentiment?.primaryEmotion || 'neutral';
    person1Emotions[emotion] = (person1Emotions[emotion] || 0) + 1;
  });

  person2Messages.forEach(msg => {
    const emotion = msg.sentiment?.primaryEmotion || 'neutral';
    person2Emotions[emotion] = (person2Emotions[emotion] || 0) + 1;
  });

  // Calculate emotional reciprocity
  let reciprocityScore = 0;
  const allEmotions = new Set([
    ...Object.keys(person1Emotions),
    ...Object.keys(person2Emotions)
  ]);

  allEmotions.forEach(emotion => {
    const p1Ratio = (person1Emotions[emotion] || 0) / person1Messages.length;
    const p2Ratio = (person2Emotions[emotion] || 0) / person2Messages.length;
    reciprocityScore += Math.abs(p1Ratio - p2Ratio);
  });

  const emotionalReciprocity = Math.round(
    Math.max(0, 100 - (reciprocityScore / allEmotions.size) * 100)
  );

  // Support level (how often do they use supportive language?)
  let supportCount = 0;
  messages.forEach(msg => {
    if (msg.communicationStyle?.dominantPattern === 'supportive') {
      supportCount++;
    }
  });
  const supportLevel = Math.round((supportCount / messages.length) * 100);

  // Conflict level
  let conflictCount = 0;
  messages.forEach(msg => {
    const emotions = msg.emotions || [];
    if (emotions.includes('anger') || emotions.includes('betrayal') ||
        msg.communicationStyle?.dominantPattern === 'defensive' ||
        msg.communicationStyle?.dominantPattern === 'passiveAggressive') {
      conflictCount++;
    }
  });
  const conflictLevel = Math.round((conflictCount / messages.length) * 100);

  // Trust level
  let trustCount = 0;
  messages.forEach(msg => {
    const emotions = msg.emotions || [];
    if (emotions.includes('trust') || emotions.includes('affection') ||
        emotions.includes('gratitude')) {
      trustCount++;
    }
  });
  const trustLevel = Math.round((trustCount / messages.length) * 100);

  return {
    communicationBalance,
    emotionalReciprocity,
    supportLevel,
    conflictLevel,
    trustLevel,
    messageDistribution: {
      [person1]: person1Messages.length,
      [person2]: person2Messages.length,
    },
  };
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
 * Generate comprehensive relationship summary with context awareness
 * @param {Array} messages - Array of messages (should already have sentiment analysis)
 * @param {Object} stats - Chat statistics
 * @param {boolean} useAI - Whether to use Gemini AI for enhanced conversation-level insights
 * @returns {Object|Promise<Object>} Comprehensive relationship summary
 */
export const generateRelationshipSummary = async (messages, stats, useAI = false) => {
  console.log('💭 Generating relationship summary...');

  // Get AI-powered conversation insights if requested (1 API call only)
  let aiInsights = null;
  if (useAI) {
    try {
      console.log('🤖 Requesting AI conversation insights...');
      aiInsights = await getGeminiConversationInsights(messages, stats);
      if (aiInsights) {
        console.log('✅ AI insights received successfully');
      } else {
        console.log('⚠️ AI insights unavailable, using keyword-based insights');
      }
    } catch (error) {
      console.error('❌ Failed to get AI insights:', error);
    }
  }

  // Use messages that already have sentiment analysis (no re-analysis)
  const sentimentData = messages;
  const timeline = getSentimentTimeline(sentimentData, 'week');

  // Detect conversation context
  const conversationContext = detectConversationContext(messages);

  // Analyze relationship dynamics
  const participants = stats.senderStats ? Object.keys(stats.senderStats) : [];
  const relationshipDynamics = analyzeRelationshipDynamics(sentimentData, participants);

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
    .slice(0, 5)
    .map(([emotion]) => emotion);

  // Analyze communication patterns
  const communicationPatternCounts = {};
  sentimentData.forEach(msg => {
    const pattern = msg.communicationStyle?.dominantPattern || 'neutral';
    communicationPatternCounts[pattern] = (communicationPatternCounts[pattern] || 0) + 1;
  });

  const dominantCommunicationPattern = Object.entries(communicationPatternCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  const totalDays = Math.ceil(
    (messages[messages.length - 1].timestamp - messages[0].timestamp) / (1000 * 60 * 60 * 24)
  );

  const avgMessagesPerDay = Math.round(totalMessages / totalDays);

  // Enhanced communication health assessment
  let communicationHealth = 'healthy';
  let healthScore =
    (relationshipDynamics.trustLevel * 0.3) +
    (relationshipDynamics.supportLevel * 0.2) +
    (relationshipDynamics.emotionalReciprocity * 0.2) +
    ((100 - relationshipDynamics.conflictLevel) * 0.2) +
    (overallPositivePercent * 0.1);

  if (healthScore >= 70) {
    communicationHealth = 'excellent';
  } else if (healthScore >= 55) {
    communicationHealth = 'healthy';
  } else if (healthScore >= 40) {
    communicationHealth = 'moderate';
  } else {
    communicationHealth = 'needs attention';
  }

  const emotionBreakdown = getEmotionBreakdown(sentimentData);
  const neutralPercent = Math.round(100 - overallPositivePercent - overallNegativePercent);

  // Override values with AI insights if available
  if (aiInsights) {
    communicationHealth = aiInsights.communicationHealth || communicationHealth;
    if (aiInsights.healthScore) {
      healthScore = aiInsights.healthScore;
    }
  }

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
    healthScore: Math.round(healthScore),
    avgMessagesPerDay,
    totalDays,

    // New enhanced fields
    conversationContext,
    relationshipDynamics,
    dominantCommunicationPattern,
    communicationPatternBreakdown: communicationPatternCounts,

    // AI-powered insights
    ...(aiInsights && {
      aiPowered: true,
      aiOverallDynamic: aiInsights.overallDynamic,
      aiKeyStrengths: aiInsights.keyStrengths,
      aiAreasForGrowth: aiInsights.areasForGrowth,
      aiEmotionalPatterns: aiInsights.emotionalPatterns,
      aiCommunicationStyle: aiInsights.communicationStyle,
      aiRelationshipStage: aiInsights.relationshipStage,
      aiInsights: aiInsights.aiInsights,
    }),

    insights: generateInsights({
      overallPositivePercent,
      overallNegativePercent,
      topEmotions,
      avgMessagesPerDay,
      stats,
      conversationContext,
      relationshipDynamics,
      dominantCommunicationPattern,
    }),
  };
};

/**
 * Generate context-aware textual insights
 * @param {Object} data - Analysis data including context and dynamics
 * @returns {Array} Array of insight strings
 */
const generateInsights = (data) => {
  const insights = [];
  const context = data.conversationContext?.primaryContext || 'personal';
  const dynamics = data.relationshipDynamics || {};

  // Context-specific insights
  if (context === 'business' || context === 'professional') {
    // Business/Professional insights
    if (data.overallPositivePercent > 60) {
      insights.push('💼 Your professional relationship shows strong positive collaboration.');
    }
    if (data.topEmotions.includes('pride') || data.topEmotions.includes('excitement')) {
      insights.push('🎯 There\'s shared enthusiasm around achievements and goals.');
    }
    if (dynamics.supportLevel > 60) {
      insights.push('🤝 Strong mutual support is evident in your professional communication.');
    }
    if (data.topEmotions.includes('anxiety') && data.avgMessagesPerDay > 20) {
      insights.push('⚠️ High message frequency with anxiety may indicate work stress or deadline pressure.');
    }
  } else if (context === 'project') {
    // Project-specific insights
    if (data.dominantCommunicationPattern === 'planning') {
      insights.push('📋 Your conversations are highly focused on planning and coordination.');
    }
    if (data.topEmotions.includes('excitement') && data.topEmotions.includes('anxiety')) {
      insights.push('🚀 Mixed emotions of excitement and anxiety suggest an ambitious project with challenges.');
    }
    if (dynamics.communicationBalance >= 40 && dynamics.communicationBalance <= 60) {
      insights.push('⚖️ Excellent balance in project contributions from both sides.');
    }
  } else if (context === 'love') {
    // Romantic relationship insights
    if (data.topEmotions.includes('affection') && data.overallPositivePercent > 70) {
      insights.push('💕 Strong affectionate bond with predominantly positive communication.');
    }
    if (dynamics.emotionalReciprocity > 70) {
      insights.push('💝 High emotional reciprocity - you mirror each other\'s feelings beautifully.');
    }
    if (dynamics.trustLevel > 75) {
      insights.push('🔐 Deep trust foundation evident in your conversations.');
    }
    if (data.topEmotions.includes('betrayal') || data.topEmotions.includes('shame')) {
      insights.push('💔 Some conversations show signs of hurt or betrayal that may need healing.');
    }
    if (dynamics.conflictLevel < 10 && data.avgMessagesPerDay > 20) {
      insights.push('✨ Healthy, active relationship with minimal conflict.');
    }
  } else if (context === 'friendship') {
    // Friendship insights
    if (data.topEmotions.includes('joy') && data.topEmotions.includes('excitement')) {
      insights.push('🎉 Your friendship is filled with joy and shared excitement.');
    }
    if (dynamics.supportLevel > 65) {
      insights.push('🫂 Strong supportive friendship with mutual care.');
    }
    if (data.avgMessagesPerDay < 3 && data.overallPositivePercent > 70) {
      insights.push('🌟 Quality over quantity - meaningful exchanges despite lower frequency.');
    }
  } else if (context === 'family') {
    // Family insights
    if (data.topEmotions.includes('gratitude') || data.topEmotions.includes('affection')) {
      insights.push('👨‍👩‍👧‍👦 Family bond showing appreciation and care.');
    }
    if (dynamics.conflictLevel > 25) {
      insights.push('⚠️ Some family tension present - open communication may help.');
    }
  } else if (context === 'technical') {
    // Technical/Development insights
    if (data.topEmotions.includes('excitement') && data.topEmotions.includes('pride')) {
      insights.push('💻 Enthusiastic technical collaboration with shared accomplishments.');
    }
    if (data.topEmotions.includes('anxiety') && data.avgMessagesPerDay > 30) {
      insights.push('🐛 High-intensity technical work - possible debugging or critical issue resolution.');
    }
    if (dynamics.supportLevel > 60) {
      insights.push('👨‍💻 Strong collaborative coding culture with peer support.');
    }
    if (data.dominantCommunicationPattern === 'questioning' && data.overallPositivePercent > 60) {
      insights.push('❓ Healthy technical curiosity and knowledge sharing.');
    }
    if (data.topEmotions.includes('frustration') || data.topEmotions.includes('anger')) {
      insights.push('⚡ Technical frustration present - complex bugs or architectural challenges.');
    }
    if (dynamics.emotionalReciprocity > 70 && dynamics.communicationBalance >= 40 && dynamics.communicationBalance <= 60) {
      insights.push('🤝 Excellent pair programming or collaboration dynamic.');
    }
  }

  // General sentiment insights
  if (data.overallPositivePercent > 70) {
    insights.push('😊 Overwhelmingly positive communication tone throughout.');
  } else if (data.overallNegativePercent > 30) {
    insights.push('😔 Notable negative sentiment - may benefit from addressing underlying issues.');
  }

  // Communication frequency insights
  if (data.avgMessagesPerDay > 50) {
    insights.push('📱 Very active daily communication - strong engagement.');
  } else if (data.avgMessagesPerDay < 5) {
    insights.push('📬 Lower message frequency - periodic check-ins or focused conversations.');
  }

  // Emotional insights
  if (data.topEmotions.includes('affection') && context !== 'love') {
    insights.push('❤️ Affection and care extend beyond typical relationship boundaries.');
  }

  if (data.topEmotions.includes('gratitude')) {
    insights.push('🙏 Appreciation is regularly expressed - a healthy communication pattern.');
  }

  if (data.topEmotions.includes('trust')) {
    insights.push('🤝 Trust and reliability are foundational to your conversations.');
  }

  if (data.topEmotions.includes('anxiety') || data.topEmotions.includes('apology')) {
    if (!insights.some(i => i.includes('anxiety') || i.includes('stress'))) {
      insights.push('😰 Recurring worry or apology patterns - consider addressing root causes.');
    }
  }

  // Communication pattern insights
  if (data.dominantCommunicationPattern === 'supportive') {
    insights.push('💪 Predominantly supportive communication style - very encouraging.');
  } else if (data.dominantCommunicationPattern === 'passiveAggressive') {
    insights.push('⚠️ Some passive-aggressive patterns detected - direct communication may be beneficial.');
  } else if (data.dominantCommunicationPattern === 'defensive') {
    insights.push('🛡️ Defensive communication present - vulnerability and openness may improve connection.');
  } else if (data.dominantCommunicationPattern === 'assertive') {
    insights.push('💬 Healthy assertive communication - clear and direct expression of needs.');
  }

  // Balance insights
  if (dynamics.communicationBalance) {
    const balance = Math.abs(50 - dynamics.communicationBalance);
    if (balance > 30) {
      insights.push('📊 Significant imbalance in message contribution - one person initiates more often.');
    } else if (balance < 10) {
      insights.push('⚖️ Excellent balance - both participants contribute equally.');
    }
  }

  // Relationship health insights
  if (dynamics.trustLevel && dynamics.supportLevel) {
    if (dynamics.trustLevel > 70 && dynamics.supportLevel > 70) {
      insights.push('🌟 Strong foundation of trust and mutual support.');
    }
  }

  if (dynamics.conflictLevel) {
    if (dynamics.conflictLevel < 10) {
      insights.push('☮️ Very low conflict - harmonious communication.');
    } else if (dynamics.conflictLevel > 30) {
      insights.push('⚡ Elevated conflict levels - may benefit from conflict resolution strategies.');
    }
  }

  return insights.slice(0, 8); // Return top 8 most relevant insights
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
 * @returns {Object} Emotion counts for all 12 emotions
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
      trust: 0,
      betrayal: 0,
      pride: 0,
      shame: 0,
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
    trust: 0,
    betrayal: 0,
    pride: 0,
    shame: 0,
  };

  messages.forEach(msg => {
    const sentiment = msg.sentiment || analyzeSentiment(msg.text);
    Object.entries(sentiment.scores).forEach(([emotion, score]) => {
      if (breakdown.hasOwnProperty(emotion)) {
        breakdown[emotion] += score;
      }
    });
  });

  return breakdown;
};

/**
 * Generate AI-enhanced coach's notes for specific card contexts
 * OPTIMIZED: Single API call for all coach's notes
 * @param {Object} cardContext - Context data for the specific card
 * @param {string} cardType - Type of card (balance, emotions, stats, patterns, milestones, words)
 * @returns {Promise<string>} AI-enhanced coach's note
 */
export const generateAICoachNote = async (cardContext, cardType) => {
  try {
    let promptContext = '';

    switch (cardType) {
      case 'balance':
        promptContext = `Message distribution: ${JSON.stringify(cardContext.messageDistribution)}. Participants: ${cardContext.participants.join(' & ')}.`;
        break;
      case 'emotions':
        promptContext = `Sentiment: ${cardContext.positivePercent}% positive, ${cardContext.negativePercent}% negative, ${cardContext.neutralPercent}% neutral. Top emotions: ${cardContext.topEmotions.join(', ')}.`;
        break;
      case 'stats':
        promptContext = `${cardContext.totalMessages} messages over ${cardContext.totalDays} days (${cardContext.avgMessagesPerDay}/day). Overall sentiment: ${cardContext.overallSentiment}.`;
        break;
      case 'patterns':
        promptContext = `Conversation streaks, peak activity times, and communication patterns analyzed.`;
        break;
      case 'milestones':
        promptContext = `Relationship milestones and special moments in conversation history.`;
        break;
      case 'words':
        promptContext = `Top words used: ${cardContext.topWords ? cardContext.topWords.join(', ') : 'various'}.`;
        break;
      default:
        promptContext = 'General relationship insights.';
    }

    const prompt = `You are a warm, encouraging relationship coach. Generate a brief, personalized coach's note (1-2 sentences max) for this situation:

${promptContext}

Write a supportive, insightful note that:
- Is warm and encouraging
- Provides actionable insight
- Is specific to the data
- Avoids generic advice
- Uses "you" language

Return ONLY the coach's note text, no JSON, no quotes, no formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coachNote = response.text().trim();

    return coachNote;
  } catch (error) {
    console.error(`Error generating AI coach note for ${cardType}:`, error);

    // Fallback to generic notes based on card type
    const fallbacks = {
      balance: "Communication balance shows how you both contribute to the conversation. Every dynamic is unique!",
      emotions: "Your emotional landscape reflects the authentic connection you share together.",
      stats: "Regular communication shows investment in the relationship. You're doing great!",
      patterns: "Your patterns show a natural rhythm. The best conversations flow organically.",
      milestones: "Every milestone is a testament to the time and care you invest in each other.",
      words: "The words you use most reveal what matters to you both."
    };

    return fallbacks[cardType] || "Strong relationships thrive on consistent, meaningful communication.";
  }
};

/**
 * Generate ALL AI-enhanced coach's notes in a single batch
 * ULTRA-OPTIMIZED: 1 API call for all cards
 * @param {Object} allCardContexts - Object with contexts for all cards
 * @returns {Promise<Object>} Object with coach's notes for each card type
 */
export const generateAllCoachNotes = async (allCardContexts) => {
  try {
    const prompt = `You are a warm, encouraging relationship coach. Generate brief, personalized coach's notes (1-2 sentences max) for each of these relationship insights:

1. BALANCE (Message Distribution): ${JSON.stringify(allCardContexts.balance)}
2. EMOTIONS (Sentiment): Positive ${allCardContexts.emotions.positivePercent}%, Negative ${allCardContexts.emotions.negativePercent}%, Top emotions: ${allCardContexts.emotions.topEmotions?.join(', ')}
3. STATS: ${allCardContexts.stats.totalMessages} messages over ${allCardContexts.stats.totalDays} days (${allCardContexts.stats.avgMessagesPerDay}/day avg)
4. PATTERNS: Peak hours ${allCardContexts.patterns.peakHours?.join(', ')}, Streaks ${allCardContexts.patterns.longestStreak} days
5. MILESTONES: Key moments and achievements in the conversation
6. WORDS: Top words used frequently

Return ONLY valid JSON with this exact structure:
{
  "balance": "Brief encouraging note about message balance",
  "emotions": "Brief encouraging note about emotional patterns",
  "stats": "Brief encouraging note about communication frequency",
  "patterns": "Brief encouraging note about conversation patterns",
  "milestones": "Brief encouraging note about milestones",
  "words": "Brief encouraging note about word choices"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const cleanText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error generating all coach notes:', error);

    // Return fallback notes
    return {
      balance: "Communication balance shows how you both contribute. Every dynamic is unique!",
      emotions: "Your emotional landscape reflects the authentic connection you share.",
      stats: "Regular communication shows investment in the relationship. You're doing great!",
      patterns: "Your patterns show a natural rhythm. The best conversations flow organically.",
      milestones: "Every milestone is a testament to the time and care you invest.",
      words: "The words you use most reveal what matters to you both."
    };
  }
};
