/**
 * Semantic Engine Types - Central Export
 *
 * Exports all type definitions, factory functions, and validators
 * for the multi-layered semantic analysis engine.
 *
 * Usage:
 *   import { createCanonicalMessage, createIntentVector } from '../types';
 *   import { isLexicalAnalysis, isBehavioralProfile } from '../types';
 *
 * Layers:
 *   Layer 1: Canonical transformation (canonical.js)
 *   Layer 2: Lexical analysis (lexical.js)
 *   Layer 3: Behavioral analysis (behavioral.js)
 *   Layer 4: Conversation segmentation (segmentation.js)
 *   Layer 5: Intent evolution (segmentation.js)
 *   Layer 6: Narrative synthesis (narrative.js)
 */

// Layer 1: Canonical
export {
  createCanonicalMessage,
  createMessageMetadata,
  isCanonicalMessage,
  isMessageMetadata,
  getDefaultTransformOptions,
} from './canonical.js';

// Layer 2: Lexical
export {
  createIntentVector,
  createLinguisticPatterns,
  createKeywordMatch,
  createToxicityFlags,
  createLexicalAnalysis,
  isIntentVector,
  isLexicalAnalysis,
  getZeroIntentVector,
  mergeIntentVectors,
} from './lexical.js';

// Layer 3: Behavioral
export {
  createResponseDynamics,
  createTurnTakingPattern,
  createMessageClustering,
  createTemporalContext,
  createSilenceProfile,
  createSenderFingerprint,
  createBehavioralProfile,
  createSenderStatistics,
  getDefaultBehavioralConfig,
  categorizeResponseLatency,
  categorizeSilence,
  isBehavioralProfile,
} from './behavioral.js';

// Layer 4 & 5: Segmentation & Evolution
export {
  createIntentDelta,
  createConversationSegment,
  createCriticalMoment,
  createIntentTrends,
  createIntentEvolutionTimeline,
  getDefaultSegmentationConfig,
  isConversationSegment,
  isIntentEvolutionTimeline,
} from './segmentation.js';

// Layer 6: Narrative
export {
  createSegmentNarrative,
  createConversationNarrative,
  createRiskAssessment,
  createOpportunityAssessment,
  createNarrativeSynthesis,
  createCoachingInsights,
  getDefaultNarrativeOptions,
  getDefaultAIModelConfig,
  isNarrativeSynthesis,
} from './narrative.js';

/**
 * Quick type reference for JSDoc:
 *
 * @typedef {import('./canonical.js').CanonicalMessage} CanonicalMessage
 * @typedef {import('./canonical.js').MessageMetadata} MessageMetadata
 * @typedef {import('./canonical.js').TransformOptions} TransformOptions
 *
 * @typedef {import('./lexical.js').IntentVector} IntentVector
 * @typedef {import('./lexical.js').LexicalAnalysis} LexicalAnalysis
 * @typedef {import('./lexical.js').LinguisticPatterns} LinguisticPatterns
 * @typedef {import('./lexical.js').KeywordMatch} KeywordMatch
 * @typedef {import('./lexical.js').ToxicityFlags} ToxicityFlags
 *
 * @typedef {import('./behavioral.js').BehavioralProfile} BehavioralProfile
 * @typedef {import('./behavioral.js').ResponseDynamics} ResponseDynamics
 * @typedef {import('./behavioral.js').TurnTakingPattern} TurnTakingPattern
 * @typedef {import('./behavioral.js').MessageClustering} MessageClustering
 * @typedef {import('./behavioral.js').TemporalContext} TemporalContext
 * @typedef {import('./behavioral.js').SilenceProfile} SilenceProfile
 * @typedef {import('./behavioral.js').SenderFingerprint} SenderFingerprint
 * @typedef {import('./behavioral.js').SenderStatistics} SenderStatistics
 * @typedef {import('./behavioral.js').BehavioralConfig} BehavioralConfig
 *
 * @typedef {import('./segmentation.js').ConversationSegment} ConversationSegment
 * @typedef {import('./segmentation.js').IntentDelta} IntentDelta
 * @typedef {import('./segmentation.js').CriticalMoment} CriticalMoment
 * @typedef {import('./segmentation.js').IntentTrends} IntentTrends
 * @typedef {import('./segmentation.js').IntentEvolutionTimeline} IntentEvolutionTimeline
 * @typedef {import('./segmentation.js').SegmentationConfig} SegmentationConfig
 *
 * @typedef {import('./narrative.js').NarrativeSynthesis} NarrativeSynthesis
 * @typedef {import('./narrative.js').ConversationNarrative} ConversationNarrative
 * @typedef {import('./narrative.js').SegmentNarrative} SegmentNarrative
 * @typedef {import('./narrative.js').RiskAssessment} RiskAssessment
 * @typedef {import('./narrative.js').OpportunityAssessment} OpportunityAssessment
 * @typedef {import('./narrative.js').CoachingInsights} CoachingInsights
 * @typedef {import('./narrative.js').AIModelConfig} AIModelConfig
 * @typedef {import('./narrative.js').NarrativeGenerationOptions} NarrativeGenerationOptions
 */
