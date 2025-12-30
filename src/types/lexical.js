/**
 * Lexical Semantic Analysis - Layer 2
 * LUSAKA ROMANTIC RELATIONSHIPS EDITION
 *
 * Rule-based semantic extraction using keyword matching.
 * NO AI, NO NLP, pure pattern matching for deterministic results.
 *
 * Design principles:
 * - Deterministic: Same message always produces same intent scores
 * - Explainable: Every score is traceable to specific keyword matches
 * - Domain-specific: Intent categories tailored for romantic relationships in Lusaka
 * - Multi-intent: Multiple intents can be active simultaneously
 * - Cultural: Supports English, Nyanja, Bemba, and code-switching
 */

/**
 * @typedef {Object} IntentVector
 * @property {number} affection - Love, care, romance, flirting, sweet talk (0-1)
 * @property {number} conflict - Arguments, fights, jealousy, anger (0-1)
 * @property {number} urgency - Relationship pressure, need for attention, "where are you" (0-1)
 * @property {number} commitment - Promises, future plans, marriage, lobola (0-1)
 * @property {number} reconciliation - Apologies, making up, forgiveness (0-1)
 * @property {number} uncertainty - Trust issues, suspicion, insecurity (0-1)
 * @property {number} drama - Gossip, side chicks/guys, third-party interference (0-1)
 * @property {number} passion - Intense desire, longing, sexual attraction (0-1)
 * @property {string|null} dominantIntent - Most prominent intent ('affection'|'conflict'|'urgency'|'commitment'|'reconciliation'|'uncertainty'|'drama'|'passion')
 * @property {number} confidence - Overall confidence in intent detection (0-1)
 */

/**
 * @typedef {Object} LinguisticPatterns
 * @property {boolean} isQuestion - Contains question words or question mark
 * @property {boolean} isGreeting - Affectionate greetings (morning babe, hi love)
 * @property {boolean} isAcknowledgment - Simple acknowledgments (ok, got it, eeya)
 * @property {boolean} hasTimeSensitivity - Time-related keywords (now, manje, waiting)
 * @property {boolean} hasNegation - Negation words (not, don't, ayi, kulibe)
 * @property {boolean} hasHedging - Uncertainty markers (maybe, kanshi, ninshi)
 * @property {boolean} hasConditional - Conditional language (if, unless, depends)
 * @property {boolean} hasEmphasis - Emphasis markers (!, sana, so much)
 * @property {boolean} hasEndearment - Terms of endearment (babe, wangu, mwandi)
 */

/**
 * @typedef {Object} KeywordMatch
 * @property {string} intent - Intent name ('affection'|'conflict'|'urgency'|'commitment'|'reconciliation'|'uncertainty'|'drama'|'passion')
 * @property {string[]} keywords - Specific words that matched
 * @property {number[]} positions - Token positions where matches occurred
 */

/**
 * @typedef {Object} ToxicityFlags
 * @property {boolean} hasInsults - Insult keywords detected
 * @property {boolean} hasAggression - Aggressive language/threats detected
 * @property {boolean} hasDismissive - Dismissive patterns detected
 * @property {boolean} hasManipulation - Manipulative/gaslighting language detected
 * @property {boolean} hasBlame - Blame-oriented language detected
 * @property {boolean} hasEmotionalAbuse - Emotional abuse patterns detected
 * @property {boolean} hasSexualPressure - Sexual coercion/pressure detected
 * @property {boolean} hasFinancialAbuse - Financial control/abuse detected
 * @property {boolean} hasIsolation - Isolation tactics detected
 * @property {'none'|'low'|'medium'|'high'|'critical'} severity - Severity level
 * @property {string[]} matchedPatterns - Specific toxic patterns matched
 */

/**
 * @typedef {Object} LexicalAnalysis
 * @property {IntentVector} intents - Intent detection (primary output)
 * @property {LinguisticPatterns} patterns - Linguistic patterns
 * @property {KeywordMatch[]} matchedKeywords - Explainability
 * @property {ToxicityFlags} toxicityFlags - Safety
 * @property {string} analysisTimestamp - ISO 8601 timestamp
 * @property {string} rulesVersion - Semantic rules version (e.g., "1.0.0")
 * @property {number} [processingTimeMs] - Time taken to analyze (for benchmarking)
 */

/**
 * Factory: Create an intent vector
 * @param {Object} params - Intent scores (all default to 0)
 * @returns {IntentVector}
 */
export function createIntentVector({
  affection = 0,
  conflict = 0,
  urgency = 0,
  commitment = 0,
  reconciliation = 0,
  uncertainty = 0,
  drama = 0,
  passion = 0,
  dominantIntent = null,
  confidence = 0,
} = {}) {
  // Normalize scores to 0-1 range
  const normalize = (val) => Math.max(0, Math.min(1, val));

  const normalized = {
    affection: normalize(affection),
    conflict: normalize(conflict),
    urgency: normalize(urgency),
    commitment: normalize(commitment),
    reconciliation: normalize(reconciliation),
    uncertainty: normalize(uncertainty),
    drama: normalize(drama),
    passion: normalize(passion),
  };

  // Auto-calculate dominant intent if not provided
  let dominant = dominantIntent;
  if (!dominant) {
    const entries = Object.entries(normalized);
    const maxEntry = entries.reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    , ['none', 0]);
    dominant = maxEntry[1] > 0.2 ? maxEntry[0] : null;
  }

  return {
    ...normalized,
    dominantIntent: dominant,
    confidence: normalize(confidence),
  };
}

/**
 * Factory: Create linguistic patterns
 * @param {Object} params - Pattern flags (all default to false)
 * @returns {LinguisticPatterns}
 */
export function createLinguisticPatterns({
  isQuestion = false,
  isGreeting = false,
  isAcknowledgment = false,
  hasTimeSensitivity = false,
  hasNegation = false,
  hasHedging = false,
  hasConditional = false,
  hasEmphasis = false,
  hasEndearment = false,
} = {}) {
  return {
    isQuestion,
    isGreeting,
    isAcknowledgment,
    hasTimeSensitivity,
    hasNegation,
    hasHedging,
    hasConditional,
    hasEmphasis,
    hasEndearment,
  };
}

/**
 * Factory: Create keyword match
 * @param {string} intent - Intent name
 * @param {string[]} keywords - Matched keywords
 * @param {number[]} positions - Token positions
 * @returns {KeywordMatch}
 */
export function createKeywordMatch(intent, keywords, positions) {
  return {
    intent,
    keywords: [...keywords],
    positions: [...positions],
  };
}

/**
 * Factory: Create toxicity flags
 * @param {Object} params - Toxicity parameters
 * @returns {ToxicityFlags}
 */
export function createToxicityFlags({
  hasInsults = false,
  hasAggression = false,
  hasDismissive = false,
  hasManipulation = false,
  hasBlame = false,
  hasEmotionalAbuse = false,
  hasSexualPressure = false,
  hasFinancialAbuse = false,
  hasIsolation = false,
  severity = 'none',
  matchedPatterns = [],
} = {}) {
  // Auto-calculate severity if not provided
  let calcSeverity = severity;
  if (severity === 'none') {
    const flags = [
      hasInsults, hasAggression, hasDismissive, hasManipulation, hasBlame,
      hasEmotionalAbuse, hasSexualPressure, hasFinancialAbuse, hasIsolation
    ];
    const count = flags.filter(Boolean).length;

    // Critical abuse patterns
    const criticalFlags = [hasEmotionalAbuse, hasSexualPressure, hasIsolation];
    const hasCritical = criticalFlags.some(Boolean);

    if (count === 0) calcSeverity = 'none';
    else if (hasCritical) calcSeverity = 'critical';
    else if (count === 1) calcSeverity = 'low';
    else if (count <= 3) calcSeverity = 'medium';
    else calcSeverity = 'high';
  }

  return {
    hasInsults,
    hasAggression,
    hasDismissive,
    hasManipulation,
    hasBlame,
    hasEmotionalAbuse,
    hasSexualPressure,
    hasFinancialAbuse,
    hasIsolation,
    severity: calcSeverity,
    matchedPatterns: [...matchedPatterns],
  };
}

/**
 * Factory: Create complete lexical analysis
 * @param {Object} params - Analysis parameters
 * @returns {LexicalAnalysis}
 */
export function createLexicalAnalysis({
  intents,
  patterns,
  matchedKeywords = [],
  toxicityFlags,
  rulesVersion = '1.0.0',
  processingTimeMs,
} = {}) {
  return {
    intents: intents || createIntentVector(),
    patterns: patterns || createLinguisticPatterns(),
    matchedKeywords: [...matchedKeywords],
    toxicityFlags: toxicityFlags || createToxicityFlags(),
    analysisTimestamp: new Date().toISOString(),
    rulesVersion,
    processingTimeMs,
  };
}

/**
 * Validator: Check if object is valid IntentVector
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isIntentVector(obj) {
  if (!obj || typeof obj !== 'object') return false;

  const requiredIntents = ['affection', 'conflict', 'urgency', 'commitment', 'reconciliation', 'uncertainty', 'drama', 'passion'];
  const hasAllIntents = requiredIntents.every(intent =>
    typeof obj[intent] === 'number' && obj[intent] >= 0 && obj[intent] <= 1
  );

  return (
    hasAllIntents &&
    (obj.dominantIntent === null || typeof obj.dominantIntent === 'string') &&
    typeof obj.confidence === 'number' &&
    obj.confidence >= 0 &&
    obj.confidence <= 1
  );
}

/**
 * Validator: Check if object is valid LexicalAnalysis
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isLexicalAnalysis(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    isIntentVector(obj.intents) &&
    typeof obj.patterns === 'object' &&
    Array.isArray(obj.matchedKeywords) &&
    typeof obj.toxicityFlags === 'object' &&
    typeof obj.analysisTimestamp === 'string' &&
    typeof obj.rulesVersion === 'string'
  );
}

/**
 * Helper: Get zero intent vector (all intents at 0)
 * @returns {IntentVector}
 */
export function getZeroIntentVector() {
  return createIntentVector({
    affection: 0,
    conflict: 0,
    urgency: 0,
    commitment: 0,
    reconciliation: 0,
    uncertainty: 0,
    drama: 0,
    passion: 0,
    dominantIntent: null,
    confidence: 0,
  });
}

/**
 * Helper: Merge multiple intent vectors (averaging)
 * @param {IntentVector[]} vectors - Intent vectors to merge
 * @returns {IntentVector}
 */
export function mergeIntentVectors(vectors) {
  if (!vectors || vectors.length === 0) {
    return getZeroIntentVector();
  }

  const sum = vectors.reduce((acc, vec) => ({
    affection: acc.affection + vec.affection,
    conflict: acc.conflict + vec.conflict,
    urgency: acc.urgency + vec.urgency,
    commitment: acc.commitment + vec.commitment,
    reconciliation: acc.reconciliation + vec.reconciliation,
    uncertainty: acc.uncertainty + vec.uncertainty,
    drama: acc.drama + vec.drama,
    passion: acc.passion + vec.passion,
    confidence: acc.confidence + vec.confidence,
  }), {
    affection: 0,
    conflict: 0,
    urgency: 0,
    commitment: 0,
    reconciliation: 0,
    uncertainty: 0,
    drama: 0,
    passion: 0,
    confidence: 0,
  });

  const count = vectors.length;
  return createIntentVector({
    affection: sum.affection / count,
    conflict: sum.conflict / count,
    urgency: sum.urgency / count,
    commitment: sum.commitment / count,
    reconciliation: sum.reconciliation / count,
    uncertainty: sum.uncertainty / count,
    drama: sum.drama / count,
    passion: sum.passion / count,
    confidence: sum.confidence / count,
  });
}
