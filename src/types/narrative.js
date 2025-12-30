/**
 * Narrative Synthesis - Layer 6
 *
 * AI-generated insights based on deterministic Layers 1-5.
 * OPTIONAL and REGENERABLE - not a dependency for analysis.
 *
 * Design principles:
 * - AI-assisted, not AI-dependent: All underlying data is deterministic
 * - Regenerable: Can be recreated anytime without reprocessing messages
 * - Clearly labeled: Users know what's AI-generated vs computed
 * - Explainable: AI insights link back to source segments and data
 */

/**
 * @typedef {'escalation'|'disengagement'|'misalignment'|'stagnation'|'burnout'|'communication-breakdown'} RiskType
 */

/**
 * @typedef {'breakthrough'|'consensus'|'closure'|'collaboration'|'innovation'|'learning'} OpportunityType
 */

/**
 * @typedef {'building'|'maintaining'|'declining'|'volatile'} ConversationArc
 */

/**
 * @typedef {Object} SegmentNarrative
 * @property {string} segmentId - Segment ID
 * @property {Date} timestamp - Segment timestamp
 * @property {string} summary - 1-2 sentence segment summary
 * @property {string} dominantTheme - Main topic or theme
 * @property {string} emotionalTone - Tone characterization
 * @property {boolean} progressMade - Did conversation advance?
 * @property {string[]} conflictsIntroduced - New issues that emerged
 * @property {string[]} conflictsResolved - Issues that were resolved
 */

/**
 * @typedef {Object} ConversationNarrative
 * @property {string} initialState - How conversation began
 * @property {number} initialAlignment - Starting alignment score
 * @property {SegmentNarrative[]} segmentNarratives - Journey through segments
 * @property {string} finalState - How conversation concluded
 * @property {number} finalAlignment - Ending alignment score
 * @property {ConversationArc} conversationArc - Overall arc
 * @property {string[]} turningPoints - Key moments that changed trajectory
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {RiskType} type - Risk type
 * @property {'low'|'medium'|'high'|'critical'} severity - Severity level
 * @property {string} description - Risk description
 * @property {string[]} evidence - Segment IDs or intent data supporting this risk
 * @property {string} suggestedMitigation - Mitigation strategy
 * @property {number} likelihood - 0-1, probability of this risk materializing
 */

/**
 * @typedef {Object} OpportunityAssessment
 * @property {OpportunityType} type - Opportunity type
 * @property {'low'|'medium'|'high'} potential - Potential level
 * @property {string} description - Opportunity description
 * @property {string[]} evidence - Segment IDs or intent data supporting this opportunity
 * @property {string} suggestedAction - Suggested action
 * @property {number} likelihood - 0-1, probability of success
 */

/**
 * @typedef {Object} NarrativeSynthesis
 * @property {true} aiGenerated - Always true, marks AI content
 * @property {string} generatedAt - ISO 8601 timestamp
 * @property {string} modelUsed - e.g., "gemini-2.5-flash"
 * @property {true} canRegenerate - Always true, can be recreated
 * @property {string} executiveSummary - 2-3 sentence overview
 * @property {string[]} keyDynamics - 3-5 bullet points
 * @property {string[]} recommendedActions - 3-5 actionable recommendations
 * @property {ConversationNarrative} conversationNarrative - Detailed interpretation
 * @property {RiskAssessment[]} risks - Risk assessment
 * @property {OpportunityAssessment[]} opportunities - Opportunity assessment
 * @property {string[]} basedOnSegments - Segment IDs used for synthesis
 * @property {Object} basedOnEvolution - Intent evolution timeline
 * @property {Object[]} basedOnCriticalMoments - Critical moments
 * @property {number} confidence - 0-1, AI's confidence in insights
 * @property {'excellent'|'good'|'fair'|'poor'} dataQuality - Data quality rating
 * @property {string[]} limitations - Known limitations or caveats
 */

/**
 * @typedef {Object} CoachingInsights
 * @property {string} balanceNote - Communication balance insight
 * @property {string} emotionsNote - Emotional patterns insight
 * @property {string} statsNote - Statistical patterns insight
 * @property {string} patternsNote - Behavioral patterns insight
 * @property {string} milestonesNote - Achievement highlights
 * @property {string} wordsNote - Language usage insight
 * @property {string} generatedAt - ISO 8601 timestamp
 * @property {string} modelUsed - Model name
 * @property {Object} basedOnData - Source data references
 */

/**
 * @typedef {Object} AIModelConfig
 * @property {string} modelName - e.g., "gemini-2.5-flash"
 * @property {number} temperature - 0-1, randomness in generation
 * @property {number} maxTokens - Maximum response length
 * @property {string[]} fallbackModels - Models to try if primary fails
 * @property {number} rateLimitDelay - Milliseconds between requests
 */

/**
 * @typedef {Object} NarrativeGenerationOptions
 * @property {boolean} includeExecutiveSummary - Generate executive summary
 * @property {boolean} includeDetailedNarrative - Generate detailed narrative
 * @property {boolean} includeRiskAssessment - Generate risk assessment
 * @property {boolean} includeOpportunityAssessment - Generate opportunity assessment
 * @property {'professional'|'casual'|'academic'} [tonePreference] - Tone preference
 * @property {'alignment'|'progress'|'relationships'|'outcomes'} [focusArea] - Focus area
 * @property {'zambian'|'international'} [culturalContext] - Cultural context
 * @property {number} maxSummaryLength - Max summary characters
 * @property {number} maxNarrativeLength - Max narrative characters
 * @property {string[]} [segmentIds] - Specific segments to focus on
 * @property {boolean} includeAllSegments - Include all segments or just critical moments
 */

/**
 * Factory: Create segment narrative
 * @param {Object} params - Segment narrative parameters
 * @returns {SegmentNarrative}
 */
export function createSegmentNarrative({
  segmentId,
  timestamp,
  summary = '',
  dominantTheme = '',
  emotionalTone = 'neutral',
  progressMade = false,
  conflictsIntroduced = [],
  conflictsResolved = [],
}) {
  return {
    segmentId,
    timestamp,
    summary,
    dominantTheme,
    emotionalTone,
    progressMade,
    conflictsIntroduced,
    conflictsResolved,
  };
}

/**
 * Factory: Create conversation narrative
 * @param {Object} params - Narrative parameters
 * @returns {ConversationNarrative}
 */
export function createConversationNarrative({
  initialState = '',
  initialAlignment = 0.5,
  segmentNarratives = [],
  finalState = '',
  finalAlignment = 0.5,
  conversationArc = 'maintaining',
  turningPoints = [],
}) {
  return {
    initialState,
    initialAlignment,
    segmentNarratives,
    finalState,
    finalAlignment,
    conversationArc,
    turningPoints,
  };
}

/**
 * Factory: Create risk assessment
 * @param {Object} params - Risk parameters
 * @returns {RiskAssessment}
 */
export function createRiskAssessment({
  type,
  severity = 'medium',
  description = '',
  evidence = [],
  suggestedMitigation = '',
  likelihood = 0.5,
}) {
  return {
    type,
    severity,
    description,
    evidence,
    suggestedMitigation,
    likelihood,
  };
}

/**
 * Factory: Create opportunity assessment
 * @param {Object} params - Opportunity parameters
 * @returns {OpportunityAssessment}
 */
export function createOpportunityAssessment({
  type,
  potential = 'medium',
  description = '',
  evidence = [],
  suggestedAction = '',
  likelihood = 0.5,
}) {
  return {
    type,
    potential,
    description,
    evidence,
    suggestedAction,
    likelihood,
  };
}

/**
 * Factory: Create narrative synthesis
 * @param {Object} params - Narrative parameters
 * @returns {NarrativeSynthesis}
 */
export function createNarrativeSynthesis({
  modelUsed = 'unknown',
  executiveSummary = '',
  keyDynamics = [],
  recommendedActions = [],
  conversationNarrative,
  risks = [],
  opportunities = [],
  basedOnSegments = [],
  basedOnEvolution,
  basedOnCriticalMoments = [],
  confidence = 0.8,
  dataQuality = 'good',
  limitations = [],
}) {
  return {
    aiGenerated: true,
    generatedAt: new Date().toISOString(),
    modelUsed,
    canRegenerate: true,
    executiveSummary,
    keyDynamics,
    recommendedActions,
    conversationNarrative: conversationNarrative || createConversationNarrative({}),
    risks,
    opportunities,
    basedOnSegments,
    basedOnEvolution,
    basedOnCriticalMoments,
    confidence,
    dataQuality,
    limitations,
  };
}

/**
 * Factory: Create coaching insights
 * @param {Object} params - Coaching parameters
 * @returns {CoachingInsights}
 */
export function createCoachingInsights({
  balanceNote = '',
  emotionsNote = '',
  statsNote = '',
  patternsNote = '',
  milestonesNote = '',
  wordsNote = '',
  modelUsed = 'deterministic',
  basedOnData = {},
}) {
  return {
    balanceNote,
    emotionsNote,
    statsNote,
    patternsNote,
    milestonesNote,
    wordsNote,
    generatedAt: new Date().toISOString(),
    modelUsed,
    basedOnData: {
      segments: basedOnData.segments || [],
      intents: basedOnData.intents || {},
      criticalMoments: basedOnData.criticalMoments || [],
    },
  };
}

/**
 * Helper: Get default narrative generation options
 * @returns {NarrativeGenerationOptions}
 */
export function getDefaultNarrativeOptions() {
  return {
    includeExecutiveSummary: true,
    includeDetailedNarrative: true,
    includeRiskAssessment: true,
    includeOpportunityAssessment: true,
    tonePreference: 'professional',
    focusArea: 'alignment',
    culturalContext: 'international',
    maxSummaryLength: 500,
    maxNarrativeLength: 2000,
    includeAllSegments: false,
  };
}

/**
 * Helper: Get default AI model config
 * @returns {AIModelConfig}
 */
export function getDefaultAIModelConfig() {
  return {
    modelName: 'gemini-2.5-flash',
    temperature: 0.7,
    maxTokens: 2000,
    fallbackModels: ['gemini-flash', 'gpt-4o-mini'],
    rateLimitDelay: 1000,
  };
}

/**
 * Validator: Check if object is valid NarrativeSynthesis
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isNarrativeSynthesis(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    obj.aiGenerated === true &&
    obj.canRegenerate === true &&
    typeof obj.generatedAt === 'string' &&
    typeof obj.modelUsed === 'string' &&
    typeof obj.executiveSummary === 'string' &&
    Array.isArray(obj.keyDynamics) &&
    Array.isArray(obj.recommendedActions)
  );
}
