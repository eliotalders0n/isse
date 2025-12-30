/**
 * Lexical Semantic Analyzer - Layer 2
 * LUSAKA ROMANTIC RELATIONSHIPS EDITION
 *
 * Rule-based semantic extraction using keyword matching.
 * NO AI, NO NLP, pure pattern matching for deterministic results.
 *
 * Design principles:
 * - Deterministic: Same message always produces same intent scores
 * - Explainable: Every score is traceable to specific keyword matches
 * - Fast: No API calls, all computation local
 * - Domain-specific: Intent categories for romantic relationships in Lusaka
 * - Cultural: Supports English, Nyanja, Bemba, and code-switching
 */

import {
  INTENT_KEYWORDS,
  PATTERN_KEYWORDS,
  TOXICITY_KEYWORDS,
  CULTURAL_VARIANTS,
  KEYWORD_CONFIG,
} from './intentKeywords.js';

import {
  createIntentVector,
  createLinguisticPatterns,
  createKeywordMatch,
  createToxicityFlags,
  createLexicalAnalysis,
} from '../types/index.js';

// Rules version for reproducibility
const RULES_VERSION = KEYWORD_CONFIG.version;

/**
 * Analyze message for lexical semantic signals
 *
 * @param {Object} message - CanonicalMessage object
 * @param {Object} options - Analysis options
 * @returns {Object} LexicalAnalysis result
 */
export function analyzeLexical(message, options = {}) {
  const startTime = Date.now();

  const {
    culturalContext = null,
    includeMatchedKeywords = true,
    includeToxicity = true,
  } = options;

  // Ensure we have normalized text and tokens
  const normalizedText = message.normalizedText || message.text.toLowerCase();
  const tokens = message.tokens || tokenizeSimple(message.text);

  // Detect intents
  const intents = detectIntents(tokens, normalizedText, culturalContext);

  // Detect linguistic patterns
  const patterns = detectPatterns(normalizedText, tokens);

  // Get matched keywords for explainability
  const matchedKeywords = includeMatchedKeywords
    ? getMatchedKeywords(tokens, intents)
    : [];

  // Detect toxicity
  const toxicityFlags = includeToxicity
    ? detectToxicity(tokens, normalizedText)
    : createEmptyToxicityFlags();

  const processingTimeMs = Date.now() - startTime;

  return createLexicalAnalysis({
    intents,
    patterns,
    matchedKeywords,
    toxicityFlags,
    rulesVersion: RULES_VERSION,
    processingTimeMs,
  });
}

/**
 * Detect intents from tokens
 *
 * @param {Array} tokens - Tokenized message
 * @param {string} normalizedText - Normalized message text
 * @param {string} culturalContext - Cultural context (e.g., 'zambian')
 * @returns {Object} IntentVector
 */
function detectIntents(tokens, normalizedText, culturalContext) {
  // Score each intent
  const scores = {
    affection: scoreIntent(tokens, normalizedText, 'affection', culturalContext),
    conflict: scoreIntent(tokens, normalizedText, 'conflict', culturalContext),
    urgency: scoreIntent(tokens, normalizedText, 'urgency', culturalContext),
    commitment: scoreIntent(tokens, normalizedText, 'commitment', culturalContext),
    reconciliation: scoreIntent(tokens, normalizedText, 'reconciliation', culturalContext),
    uncertainty: scoreIntent(tokens, normalizedText, 'uncertainty', culturalContext),
    drama: scoreIntent(tokens, normalizedText, 'drama', culturalContext),
    passion: scoreIntent(tokens, normalizedText, 'passion', culturalContext),
  };

  // Find dominant intent
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [dominantIntent, dominantScore] = entries[0];

  // Calculate confidence
  const confidence = calculateConfidence(scores, dominantScore);

  return createIntentVector({
    ...scores,
    dominantIntent: dominantScore > 0.3 ? dominantIntent : null,
    confidence,
  });
}

/**
 * Score a single intent based on keyword matches
 *
 * @param {Array} tokens - Tokenized message
 * @param {string} normalizedText - Normalized message text
 * @param {string} intentType - Intent category
 * @param {string} culturalContext - Cultural context
 * @returns {number} Intent score (0-1)
 */
function scoreIntent(tokens, normalizedText, intentType, culturalContext) {
  let keywords = INTENT_KEYWORDS[intentType] || [];

  // Add cultural variants if applicable
  if (culturalContext && CULTURAL_VARIANTS[culturalContext]) {
    const culturalKeywords = CULTURAL_VARIANTS[culturalContext][intentType] || [];
    keywords = [...keywords, ...culturalKeywords];
  }

  // Count matches in tokens
  let tokenMatches = 0;
  for (const token of tokens) {
    for (const keyword of keywords) {
      if (token.includes(keyword.toLowerCase())) {
        tokenMatches++;
        break; // Only count each token once
      }
    }
  }

  // Count phrase matches in normalized text (for multi-word keywords)
  let phraseMatches = 0;
  for (const keyword of keywords) {
    if (keyword.includes(' ') && normalizedText.includes(keyword.toLowerCase())) {
      phraseMatches++;
    }
  }

  // Combine scores
  const totalMatches = tokenMatches + (phraseMatches * 2); // Weight phrases higher

  // Normalize to 0-1 (cap at 5 matches = 1.0)
  return Math.min(totalMatches / 5, 1.0);
}

/**
 * Calculate confidence in intent detection
 *
 * @param {Object} scores - All intent scores
 * @param {number} dominantScore - Highest intent score
 * @returns {number} Confidence (0-1)
 */
function calculateConfidence(scores, dominantScore) {
  // If no clear intent, low confidence
  if (dominantScore < 0.2) return 0.2;

  // Calculate score spread
  const scoresArray = Object.values(scores);
  const avgScore = scoresArray.reduce((sum, s) => sum + s, 0) / scoresArray.length;
  const spread = dominantScore - avgScore;

  // Higher spread = more confident in dominant intent
  // Spread of 0.3+ = high confidence
  // Spread of 0.1- = low confidence
  const spreadConfidence = Math.min(spread / 0.3, 1.0);

  // Combine dominant score and spread
  return (dominantScore * 0.6) + (spreadConfidence * 0.4);
}

/**
 * Detect linguistic patterns
 *
 * @param {string} normalizedText - Normalized message text
 * @param {Array} tokens - Tokenized message
 * @returns {Object} LinguisticPatterns
 */
function detectPatterns(normalizedText, tokens) {
  return createLinguisticPatterns({
    isQuestion: detectQuestion(normalizedText, tokens),
    isGreeting: detectGreeting(normalizedText, tokens),
    isAcknowledgment: detectAcknowledgment(normalizedText, tokens),
    hasTimeSensitivity: detectTimeSensitivity(tokens),
    hasNegation: detectNegation(tokens),
    hasHedging: detectHedging(tokens),
    hasConditional: detectConditional(tokens),
    hasEmphasis: detectEmphasis(normalizedText),
    hasEndearment: detectEndearment(tokens),
  });
}

/**
 * Detect if message is a question
 */
function detectQuestion(normalizedText, tokens) {
  // Check for question mark
  if (normalizedText.includes('?')) return true;

  // Check for question words
  const questionWords = PATTERN_KEYWORDS.questions;
  return tokens.some(token =>
    questionWords.some(qw => token.includes(qw.toLowerCase()))
  );
}

/**
 * Detect if message is an affectionate greeting
 */
function detectGreeting(normalizedText, tokens) {
  const greetingWords = PATTERN_KEYWORDS.greetings;
  return greetingWords.some(greeting =>
    normalizedText.includes(greeting.toLowerCase())
  );
}

/**
 * Detect terms of endearment
 */
function detectEndearment(tokens) {
  const endearmentWords = PATTERN_KEYWORDS.endearment;
  return tokens.some(token =>
    endearmentWords.some(end => token.includes(end.toLowerCase()))
  );
}

/**
 * Detect if message is a simple acknowledgment
 */
function detectAcknowledgment(normalizedText, tokens) {
  const ackWords = PATTERN_KEYWORDS.acknowledgments;

  // Short messages with ack words
  if (tokens.length <= 3) {
    return tokens.some(token =>
      ackWords.some(ack => token.includes(ack.toLowerCase()))
    );
  }

  return false;
}

/**
 * Detect time-sensitive language
 */
function detectTimeSensitivity(tokens) {
  const timeWords = PATTERN_KEYWORDS.timeSensitive;
  return tokens.some(token =>
    timeWords.some(tw => token.includes(tw.toLowerCase()))
  );
}

/**
 * Detect negation
 */
function detectNegation(tokens) {
  const negationWords = PATTERN_KEYWORDS.negation;
  return tokens.some(token =>
    negationWords.some(neg => token.includes(neg.toLowerCase()))
  );
}

/**
 * Detect hedging language
 */
function detectHedging(tokens) {
  const hedgeWords = PATTERN_KEYWORDS.hedging;
  return tokens.some(token =>
    hedgeWords.some(hedge => token.includes(hedge.toLowerCase()))
  );
}

/**
 * Detect conditional language
 */
function detectConditional(tokens) {
  const conditionalWords = PATTERN_KEYWORDS.conditional;
  return tokens.some(token =>
    conditionalWords.some(cond => token.includes(cond.toLowerCase()))
  );
}

/**
 * Detect emphasis markers
 */
function detectEmphasis(normalizedText) {
  // Check for exclamation marks
  if (normalizedText.includes('!')) return true;

  // Check for multiple punctuation
  if (/[!?]{2,}/.test(normalizedText)) return true;

  // Check for all caps words (more than 3 chars)
  const words = normalizedText.split(/\s+/);
  return words.some(word => word.length > 3 && word === word.toUpperCase());
}

/**
 * Get matched keywords for explainability
 *
 * @param {Array} tokens - Tokenized message
 * @param {Object} intents - Intent scores
 * @returns {Array} Array of KeywordMatch objects
 */
function getMatchedKeywords(tokens, intents) {
  const matches = [];

  for (const [intentType, score] of Object.entries(intents)) {
    // Skip metadata fields
    if (intentType === 'dominantIntent' || intentType === 'confidence') continue;
    if (score === 0) continue;

    const keywords = INTENT_KEYWORDS[intentType] || [];
    const matchedKws = [];
    const positions = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      for (const keyword of keywords) {
        if (token.includes(keyword.toLowerCase())) {
          matchedKws.push(keyword);
          positions.push(i);
          break;
        }
      }
    }

    if (matchedKws.length > 0) {
      matches.push(createKeywordMatch(intentType, matchedKws, positions));
    }
  }

  return matches;
}

/**
 * Detect toxicity in message
 *
 * @param {Array} tokens - Tokenized message
 * @param {string} normalizedText - Normalized message text
 * @returns {Object} ToxicityFlags
 */
function detectToxicity(tokens, normalizedText) {
  const hasInsults = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.insults);
  const hasAggression = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.aggression);
  const hasDismissive = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.dismissive);
  const hasManipulation = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.manipulation);
  const hasBlame = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.blame);
  const hasEmotionalAbuse = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.emotionalAbuse);
  const hasSexualPressure = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.sexualPressure);
  const hasFinancialAbuse = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.financialAbuse);
  const hasIsolation = matchesKeywords(tokens, normalizedText, TOXICITY_KEYWORDS.isolation);

  // Calculate severity
  const toxicCount = [
    hasInsults, hasAggression, hasDismissive, hasManipulation, hasBlame,
    hasEmotionalAbuse, hasSexualPressure, hasFinancialAbuse, hasIsolation
  ].filter(Boolean).length;

  // Critical abuse patterns
  const criticalFlags = [hasEmotionalAbuse, hasSexualPressure, hasIsolation];
  const hasCritical = criticalFlags.some(Boolean);

  let severity = 'none';
  if (toxicCount === 0) severity = 'none';
  else if (hasCritical) severity = 'critical';
  else if (toxicCount === 1) severity = 'low';
  else if (toxicCount <= 3) severity = 'medium';
  else severity = 'high';

  // Collect matched patterns
  const matchedPatterns = [];
  if (hasInsults) matchedPatterns.push('insults');
  if (hasAggression) matchedPatterns.push('aggression');
  if (hasDismissive) matchedPatterns.push('dismissive');
  if (hasManipulation) matchedPatterns.push('manipulation');
  if (hasBlame) matchedPatterns.push('blame');
  if (hasEmotionalAbuse) matchedPatterns.push('emotional_abuse');
  if (hasSexualPressure) matchedPatterns.push('sexual_pressure');
  if (hasFinancialAbuse) matchedPatterns.push('financial_abuse');
  if (hasIsolation) matchedPatterns.push('isolation');

  return createToxicityFlags({
    hasInsults,
    hasAggression,
    hasDismissive,
    hasManipulation,
    hasBlame,
    hasEmotionalAbuse,
    hasSexualPressure,
    hasFinancialAbuse,
    hasIsolation,
    severity,
    matchedPatterns,
  });
}

/**
 * Check if tokens/text match keywords
 */
function matchesKeywords(tokens, normalizedText, keywords) {
  // Check tokens
  for (const token of tokens) {
    for (const keyword of keywords) {
      if (token.includes(keyword.toLowerCase())) {
        return true;
      }
    }
  }

  // Check phrases in full text
  for (const keyword of keywords) {
    if (keyword.includes(' ') && normalizedText.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Create empty toxicity flags
 */
function createEmptyToxicityFlags() {
  return createToxicityFlags();
}

/**
 * Simple tokenizer (fallback if message doesn't have tokens)
 */
function tokenizeSimple(text) {
  return text
    .toLowerCase()
    .split(/[\s,;:'"()\[\]{}]+/)
    .filter(token => token.length >= 2);
}

/**
 * Batch analyze multiple messages
 *
 * @param {Array} messages - Array of CanonicalMessage objects
 * @param {Object} options - Analysis options
 * @returns {Array} Array of messages with lexical analysis
 */
export function analyzeLexicalBatch(messages, options = {}) {
  return messages.map(msg => ({
    ...msg,
    lexical: analyzeLexical(msg, options),
  }));
}

/**
 * Get aggregate intent from multiple messages
 *
 * @param {Array} messages - Messages with lexical analysis
 * @returns {Object} IntentVector with aggregated scores
 */
export function aggregateIntents(messages) {
  if (messages.length === 0) {
    return createIntentVector();
  }

  const sums = {
    alignment: 0,
    resistance: 0,
    urgency: 0,
    delegation: 0,
    closure: 0,
    uncertainty: 0,
  };

  for (const msg of messages) {
    if (msg.lexical && msg.lexical.intents) {
      sums.alignment += msg.lexical.intents.alignment;
      sums.resistance += msg.lexical.intents.resistance;
      sums.urgency += msg.lexical.intents.urgency;
      sums.delegation += msg.lexical.intents.delegation;
      sums.closure += msg.lexical.intents.closure;
      sums.uncertainty += msg.lexical.intents.uncertainty;
    }
  }

  // Average
  const count = messages.length;
  const avgScores = {
    alignment: sums.alignment / count,
    resistance: sums.resistance / count,
    urgency: sums.urgency / count,
    delegation: sums.delegation / count,
    closure: sums.closure / count,
    uncertainty: sums.uncertainty / count,
  };

  // Find dominant intent
  const entries = Object.entries(avgScores).sort((a, b) => b[1] - a[1]);
  const [dominantIntent, dominantScore] = entries[0];

  return createIntentVector({
    ...avgScores,
    dominantIntent: dominantScore > 0.3 ? dominantIntent : null,
    confidence: calculateConfidence(avgScores, dominantScore),
  });
}

/**
 * Detect cultural context from messages
 *
 * @param {Array} messages - Messages to analyze
 * @returns {string|null} Cultural context (e.g., 'zambian') or null
 */
export function detectCulturalContext(messages) {
  const zambianKeywords = CULTURAL_VARIANTS.zambian.alignment
    .concat(CULTURAL_VARIANTS.zambian.resistance)
    .concat(CULTURAL_VARIANTS.zambian.urgency)
    .concat(CULTURAL_VARIANTS.zambian.delegation)
    .concat(CULTURAL_VARIANTS.zambian.uncertainty)
    .concat(CULTURAL_VARIANTS.zambian.support);

  let zambianMatches = 0;
  const sampleSize = Math.min(100, messages.length); // Sample first 100 messages

  for (let i = 0; i < sampleSize; i++) {
    const msg = messages[i];
    const text = (msg.normalizedText || msg.text).toLowerCase();

    for (const keyword of zambianKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        zambianMatches++;
        break; // Only count once per message
      }
    }
  }

  // If 5%+ of sampled messages contain Zambian patterns
  if (zambianMatches / sampleSize >= 0.05) {
    return 'zambian';
  }

  return null;
}
