/**
 * Semantic Lexical Analyzer - Layer 2 (Enhanced)
 *
 * Dictionary-based semantic analysis using WordNet 3.0 for nuanced
 * intent detection. More sophisticated than keyword matching.
 *
 * Design principles:
 * - Semantic understanding over keyword matching
 * - Context-aware through word meanings
 * - Synonym and relationship awareness
 * - Deterministic but more accurate
 */

import {
  createIntentVector,
  createLinguisticPatterns,
  createKeywordMatch,
  createToxicityFlags,
  createLexicalAnalysis,
} from '../types/index.js';

import {
  getDictionary,
  detectWordIntent,
  analyzeWordsIntent,
  getSynonyms,
  hasSemanticMeaning,
  isInitialized,
} from './dictionaryService.js';

// Rules version for reproducibility
const RULES_VERSION = '2.0.0-semantic';

/**
 * Analyze message using semantic dictionary
 *
 * @param {Object} message - CanonicalMessage object
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} LexicalAnalysis result
 */
export async function analyzeSemanticLexical(message, options = {}) {
  const startTime = Date.now();

  const {
    includeMatchedKeywords = true,
    includeToxicity = true,
    fallbackToKeywords = true,
  } = options;

  // Ensure we have tokens
  const tokens = message.tokens || tokenizeSimple(message.text);
  const normalizedText = message.normalizedText || message.text.toLowerCase();

  try {
    // Try dictionary-based analysis
    const intents = await detectIntentsWithDictionary(tokens, normalizedText);
    const patterns = await detectPatternsWithDictionary(normalizedText, tokens);
    const matchedKeywords = includeMatchedKeywords
      ? await getSemanticMatches(tokens, intents)
      : [];
    const toxicityFlags = includeToxicity
      ? await detectSemanticToxicity(tokens, normalizedText)
      : createToxicityFlags();

    const processingTimeMs = Date.now() - startTime;

    return createLexicalAnalysis({
      intents,
      patterns,
      matchedKeywords,
      toxicityFlags,
      rulesVersion: RULES_VERSION,
      processingTimeMs,
    });
  } catch (error) {
    console.warn('Semantic analysis failed, using fallback:', error);

    // Fallback to keyword-based if dictionary fails
    if (fallbackToKeywords) {
      const { analyzeLexical } = await import('./lexicalAnalyzer.js');
      return analyzeLexical(message, options);
    }

    throw error;
  }
}

/**
 * Detect intents using dictionary semantic meanings
 *
 * @param {string[]} tokens - Message tokens
 * @param {string} normalizedText - Normalized text
 * @returns {Promise<Object>} IntentVector
 */
async function detectIntentsWithDictionary(tokens, normalizedText) {
  // Analyze all meaningful words
  const meaningfulTokens = tokens.filter(token => token.length >= 3);

  // Get intent scores from dictionary
  const dictionaryIntents = await analyzeWordsIntent(meaningfulTokens);

  // Boost scores based on contextual patterns
  const contextualBoost = detectContextualIntents(normalizedText, tokens);

  // Merge dictionary and contextual scores
  const mergedScores = {
    alignment: Math.min(dictionaryIntents.alignment + contextualBoost.alignment, 1.0),
    resistance: Math.min(dictionaryIntents.resistance + contextualBoost.resistance, 1.0),
    urgency: Math.min(dictionaryIntents.urgency + contextualBoost.urgency, 1.0),
    delegation: Math.min(dictionaryIntents.delegation + contextualBoost.delegation, 1.0),
    closure: Math.min(dictionaryIntents.closure + contextualBoost.closure, 1.0),
    uncertainty: Math.min(dictionaryIntents.uncertainty + contextualBoost.uncertainty, 1.0),
  };

  // Find dominant intent
  const entries = Object.entries(mergedScores).sort((a, b) => b[1] - a[1]);
  const [dominantIntent, dominantScore] = entries[0];

  // Calculate confidence based on score spread
  const avgScore = Object.values(mergedScores).reduce((sum, s) => sum + s, 0) / 6;
  const spread = dominantScore - avgScore;
  const confidence = Math.min((dominantScore * 0.6) + (spread * 0.4), 1.0);

  return createIntentVector({
    ...mergedScores,
    dominantIntent: dominantScore > 0.3 ? dominantIntent : null,
    confidence,
  });
}

/**
 * Detect contextual intent signals
 * Complements dictionary analysis with context patterns
 *
 * @param {string} normalizedText - Normalized text
 * @param {string[]} tokens - Tokens
 * @returns {Object} Intent boost scores
 */
function detectContextualIntents(normalizedText, tokens) {
  const boost = {
    alignment: 0,
    resistance: 0,
    urgency: 0,
    delegation: 0,
    closure: 0,
    uncertainty: 0,
  };

  // Alignment patterns (enhanced for corporate/business context)
  if (/\b(yes|yeah|sure|absolutely|definitely|agreed|exactly|totally|completely|approve|endorse|support|confirm)\b/.test(normalizedText)) {
    boost.alignment += 0.2;
  }
  if (/\bagree\b/.test(normalizedText)) {
    boost.alignment += 0.3;
  }
  if (/\b(makes sense|sounds good|that works|good point|let'?s? (move forward|proceed)|buy[- ]?in|on board)\b/.test(normalizedText)) {
    boost.alignment += 0.3;
  }

  // Resistance patterns (enhanced for corporate/business context)
  if (/\b(no|nope|not|don't|can't|won't|shouldn't|concern|issue|problem|blocker)\b/.test(normalizedText)) {
    boost.resistance += 0.2;
  }
  if (/\b(but|however|although|nevertheless|on the other hand|that said|challenge)\b/.test(normalizedText)) {
    boost.resistance += 0.1;
  }
  if (/\b(disagree|wrong|don't think|not sure about|pushback|escalat)\b/.test(normalizedText)) {
    boost.resistance += 0.3;
  }

  // Urgency patterns (enhanced for corporate/business context)
  if (/\b(urgent|asap|immediately|now|quick|hurry|deadline|critical|priority|time[- ]sensitive|expedite|rush)\b/.test(normalizedText)) {
    boost.urgency += 0.3;
  }
  if (/!{2,}/.test(normalizedText)) {
    boost.urgency += 0.2;
  }

  // Delegation patterns (enhanced for corporate/business context)
  if (/\b(please|could you|would you|can you|will you|you should|you need to|kindly)\b/.test(normalizedText)) {
    boost.delegation += 0.2;
  }
  if (/\b(assign|delegate|handle|take care of|responsible for|owner|ownership|action item|follow[- ]?up)\b/.test(normalizedText)) {
    boost.delegation += 0.3;
  }

  // Closure patterns (enhanced for corporate/business context)
  if (/\b(done|complete|finished|finalized|resolved|closed|wrapped up|delivered|shipped|launched|milestone)\b/.test(normalizedText)) {
    boost.closure += 0.3;
  }
  if (/\b(thank|thanks|appreciate|got it|all set|perfect|looks good)\b/.test(normalizedText)) {
    boost.closure += 0.2;
  }

  // Uncertainty patterns (enhanced for corporate/business context)
  if (normalizedText.includes('?')) {
    boost.uncertainty += 0.2;
  }
  if (/\b(maybe|perhaps|possibly|might|unsure|not sure|confused|unclear|risk|assumption|reconsider)\b/.test(normalizedText)) {
    boost.uncertainty += 0.3;
  }

  return boost;
}

/**
 * Detect linguistic patterns using dictionary
 *
 * @param {string} normalizedText - Normalized text
 * @param {string[]} tokens - Tokens
 * @returns {Promise<Object>} LinguisticPatterns
 */
async function detectPatternsWithDictionary(normalizedText, tokens) {
  return createLinguisticPatterns({
    isQuestion: normalizedText.includes('?') || await hasQuestionWords(tokens),
    isCommand: await hasCommandWords(tokens),
    isAcknowledgment: await hasAcknowledgmentWords(tokens) && tokens.length <= 3,
    hasTimeSensitivity: await hasTimeSensitiveWords(tokens),
    hasNegation: await hasNegationWords(tokens),
    hasHedging: await hasHedgingWords(tokens),
    hasConditional: await hasConditionalWords(tokens),
    hasEmphasis: /!+/.test(normalizedText) || /[A-Z]{4,}/.test(normalizedText),
  });
}

/**
 * Check if tokens contain question words
 */
async function hasQuestionWords(tokens) {
  const questionWords = ['what', 'when', 'where', 'who', 'why', 'how', 'which', 'whose'];
  return tokens.some(token => questionWords.includes(token.toLowerCase()));
}

/**
 * Check if tokens contain command words
 */
async function hasCommandWords(tokens) {
  const commandWords = ['do', 'make', 'get', 'send', 'create', 'update', 'delete', 'fix', 'change'];
  return tokens.some(token => commandWords.includes(token.toLowerCase()));
}

/**
 * Check if tokens contain acknowledgment words
 */
async function hasAcknowledgmentWords(tokens) {
  const ackWords = ['ok', 'okay', 'yes', 'yeah', 'sure', 'thanks', 'got', 'understood', 'noted'];
  return tokens.some(token => ackWords.includes(token.toLowerCase()));
}

/**
 * Check if tokens contain time-sensitive words
 */
async function hasTimeSensitiveWords(tokens) {
  const timeWords = ['urgent', 'asap', 'immediately', 'now', 'today', 'deadline', 'quick'];
  return tokens.some(token => timeWords.includes(token.toLowerCase()));
}

/**
 * Check if tokens contain negation words
 */
async function hasNegationWords(tokens) {
  const negationWords = ['not', 'no', 'never', 'none', 'nobody', "don't", "can't", "won't"];
  return tokens.some(token => negationWords.includes(token.toLowerCase()));
}

/**
 * Check if tokens contain hedging words
 */
async function hasHedgingWords(tokens) {
  const hedgeWords = ['maybe', 'perhaps', 'possibly', 'might', 'could', 'seem', 'probably'];
  return tokens.some(token => hedgeWords.includes(token.toLowerCase()));
}

/**
 * Check if tokens contain conditional words
 */
async function hasConditionalWords(tokens) {
  const conditionalWords = ['if', 'unless', 'when', 'should', 'would', 'could', 'depends'];
  return tokens.some(token => conditionalWords.includes(token.toLowerCase()));
}

/**
 * Get semantic keyword matches for explainability
 *
 * @param {string[]} tokens - Message tokens
 * @param {Object} intents - Detected intents
 * @returns {Promise<Array>} Keyword matches
 */
async function getSemanticMatches(tokens, intents) {
  const matches = [];

  // For each significant intent, record which words contributed
  for (const [intentType, score] of Object.entries(intents)) {
    if (intentType === 'dominantIntent' || intentType === 'confidence') continue;
    if (score < 0.1) continue;

    const contributingWords = [];
    const positions = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.length < 3) continue;

      const wordIntent = await detectWordIntent(token);
      if (wordIntent[intentType] > 0) {
        contributingWords.push(token);
        positions.push(i);
      }
    }

    if (contributingWords.length > 0) {
      matches.push(createKeywordMatch(intentType, contributingWords, positions));
    }
  }

  return matches;
}

/**
 * Detect toxicity using semantic meanings
 *
 * @param {string[]} tokens - Message tokens
 * @param {string} normalizedText - Normalized text
 * @returns {Promise<Object>} ToxicityFlags
 */
async function detectSemanticToxicity(tokens, normalizedText) {
  const hasInsults = await checkToxicCategory(tokens, ['insult', 'offensive', 'derogatory', 'abusive']);
  const hasAggression = await checkToxicCategory(tokens, ['aggressive', 'hostile', 'violent', 'threatening']);
  const hasDismissive = await checkToxicCategory(tokens, ['dismissive', 'contemptuous', 'disdainful']);
  const hasManipulation = await checkToxicCategory(tokens, ['manipulative', 'deceitful', 'dishonest']);
  const hasBlame = await checkToxicCategory(tokens, ['blame', 'accusatory', 'fault']);

  const toxicCount = [hasInsults, hasAggression, hasDismissive, hasManipulation, hasBlame]
    .filter(Boolean).length;

  let severity = 'none';
  if (toxicCount === 1) severity = 'low';
  else if (toxicCount === 2) severity = 'medium';
  else if (toxicCount >= 3) severity = 'high';

  const matchedPatterns = [];
  if (hasInsults) matchedPatterns.push('insults');
  if (hasAggression) matchedPatterns.push('aggression');
  if (hasDismissive) matchedPatterns.push('dismissive');
  if (hasManipulation) matchedPatterns.push('manipulation');
  if (hasBlame) matchedPatterns.push('blame');

  return createToxicityFlags({
    hasInsults,
    hasAggression,
    hasDismissive,
    hasManipulation,
    hasBlame,
    severity,
    matchedPatterns,
  });
}

/**
 * Check if tokens match toxic semantic category
 *
 * @param {string[]} tokens - Tokens to check
 * @param {string[]} semanticKeywords - Semantic meaning keywords
 * @returns {Promise<boolean>}
 */
async function checkToxicCategory(tokens, semanticKeywords) {
  for (const token of tokens) {
    if (token.length < 3) continue;

    for (const keyword of semanticKeywords) {
      if (await hasSemanticMeaning(token, [keyword])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Simple tokenizer (fallback)
 */
function tokenizeSimple(text) {
  return text
    .toLowerCase()
    .split(/[\s,;:'"()\[\]{}]+/)
    .filter(token => token.length >= 2);
}

/**
 * Batch analyze with semantic dictionary
 *
 * @param {Array} messages - Array of CanonicalMessage objects
 * @param {Object} options - Analysis options
 * @returns {Promise<Array>} Array of messages with semantic analysis
 */
export async function analyzeSemanticLexicalBatch(messages, options = {}) {
  const results = [];

  for (const msg of messages) {
    const analysis = await analyzeSemanticLexical(msg, options);
    results.push({
      ...msg,
      lexical: analysis,
    });
  }

  return results;
}

/**
 * Check if semantic analyzer is ready
 *
 * @returns {boolean}
 */
export function isSemanticAnalyzerReady() {
  return isInitialized();
}

/**
 * ============================================================================
 * SEMANTIC WORD FREQUENCY ANALYSIS
 * Uses pre-computed tokens from canonical messages (Layer 1)
 * No re-tokenization - aligns with semantic engine architecture
 * ============================================================================
 */

/**
 * Calculate word frequency from canonical messages
 *
 * @param {Array} canonicalMessages - Array of CanonicalMessage objects
 * @param {number} topN - Number of top words to return
 * @returns {Array} Array of {word, count} objects sorted by frequency
 */
export const calculateSemanticWordFrequency = (canonicalMessages, topN = 30) => {
  const wordCount = {};

  // Common stop words (same as traditional analyzer for consistency)
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
    'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
    'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
    'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
    'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
    'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
    'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
    'were', 'said', 'did', 'having', 'may', 'should', 'am', 'very', 'much',
  ]);

  // Extract words from pre-computed tokens
  canonicalMessages.forEach((message) => {
    const tokens = message.tokens || [];

    tokens.forEach(token => {
      const word = token.toLowerCase();

      // Filter: must be > 2 chars and not a stop word
      if (word.length > 2 && !stopWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
  });

  // Sort by frequency and return top N
  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
};

/**
 * Calculate word frequency per sender from canonical messages
 *
 * @param {Array} canonicalMessages - Array of CanonicalMessage objects
 * @param {number} topN - Number of top words per sender
 * @returns {Object} Object with sender names as keys and word frequency arrays as values
 */
export const calculateSemanticWordFrequencyPerSender = (canonicalMessages, topN = 15) => {
  const senderMessages = {};

  // Group messages by sender
  canonicalMessages.forEach(message => {
    const sender = message.sender;
    if (!senderMessages[sender]) {
      senderMessages[sender] = [];
    }
    senderMessages[sender].push(message);
  });

  // Calculate frequency for each sender
  const result = {};
  Object.keys(senderMessages).forEach(sender => {
    result[sender] = calculateSemanticWordFrequency(senderMessages[sender], topN);
  });

  return result;
};

/**
 * Calculate vocabulary diversity metrics from canonical messages
 *
 * @param {Array} canonicalMessages - Array of CanonicalMessage objects
 * @returns {Object} Diversity metrics {totalWords, uniqueWords, diversityRatio}
 */
export const calculateVocabularyDiversity = (canonicalMessages) => {
  const allWords = new Set();
  let totalWords = 0;

  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  ]);

  canonicalMessages.forEach(message => {
    const tokens = message.tokens || [];
    tokens.forEach(token => {
      const word = token.toLowerCase();
      if (word.length > 2 && !stopWords.has(word)) {
        allWords.add(word);
        totalWords++;
      }
    });
  });

  const uniqueWords = allWords.size;
  const diversityRatio = totalWords > 0 ? (uniqueWords / totalWords) : 0;

  return {
    totalWords,
    uniqueWords,
    diversityRatio,
    diversityPercentage: Math.round(diversityRatio * 100),
  };
};

/**
 * Calculate vocabulary diversity per sender
 *
 * @param {Array} canonicalMessages - Array of CanonicalMessage objects
 * @returns {Object} Object with sender names as keys and diversity metrics as values
 */
export const calculateVocabularyDiversityPerSender = (canonicalMessages) => {
  const senderMessages = {};

  // Group messages by sender
  canonicalMessages.forEach(message => {
    const sender = message.sender;
    if (!senderMessages[sender]) {
      senderMessages[sender] = [];
    }
    senderMessages[sender].push(message);
  });

  // Calculate diversity for each sender
  const result = {};
  Object.keys(senderMessages).forEach(sender => {
    result[sender] = calculateVocabularyDiversity(senderMessages[sender]);
  });

  return result;
};
