/**
 * Narrative Synthesis - Layer 6 (AI-Optional)
 *
 * AI-assisted interpretation of deterministic semantic analysis.
 * This layer is OPTIONAL and REGENERABLE - it interprets the
 * deterministic data from Layers 1-5 using AI.
 *
 * Design principles:
 * - Optional: Can be skipped or regenerated at any time
 * - Based on deterministic data: Uses segments & evolution from Layer 5
 * - Regenerable: Same input always produces similar insights
 * - Explainable: AI insights reference specific segments/deltas
 */

// Groq API configuration
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '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';
const hasGroqKey = Boolean(GROQ_API_KEY);

const cleanJsonResponse = (text) => {
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
};

/**
 * Generate AI-powered narrative synthesis from semantic analysis
 *
 * @param {Object} evolution - Intent evolution data from Layer 5
 * @param {Array} segments - Conversation segments from Layer 4
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Narrative synthesis
 */
export async function generateNarrativeSynthesis(evolution, segments, options = {}) {
  const {
    model = 'llama-3.1-8b-instant',
    includeRecommendations = true,
    includeSegmentSummaries = true,
    focusOnActionable = true,
  } = options;

  // Check if Groq key is available
  if (!hasGroqKey) {
    console.warn('Groq API key not available, skipping narrative synthesis');
    return createEmptyNarrative('Groq API key not configured');
  }

  try {
    // Validate inputs
    if (!evolution || !segments || segments.length === 0) {
      return createEmptyNarrative('No evolution data available');
    }

    // Prepare segment summaries for AI
    const segmentSummaries = segments.map((seg, idx) => ({
      segmentNumber: idx + 1,
      duration: Math.round(seg.durationMinutes),
      messageCount: seg.messageIds.length,
      dominantIntent: seg.aggregateIntent.dominantIntent,
      intentScores: {
        alignment: Math.round(seg.aggregateIntent.alignment * 100),
        resistance: Math.round(seg.aggregateIntent.resistance * 100),
        urgency: Math.round(seg.aggregateIntent.urgency * 100),
        closure: Math.round(seg.aggregateIntent.closure * 100),
      },
      hasEscalation: seg.hasEscalation,
      hasBreakthrough: seg.hasBreakthrough,
      hasResolution: seg.hasResolution,
      boundaryType: seg.boundaryType,
    }));

    // Prepare critical moments
    const criticalMoments = [
      ...evolution.escalationPoints.map(e => ({
        type: 'Escalation',
        severity: e.severity,
        reason: e.reason,
      })),
      ...evolution.alignmentBreakthroughs.map(b => ({
        type: 'Breakthrough',
        severity: b.severity,
        reason: b.reason,
      })),
      ...evolution.resolutionPoints.map(r => ({
        type: 'Resolution',
        severity: r.severity,
        reason: r.reason,
      })),
    ];

    // Build prompt for AI
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildNarrativePrompt({
      segmentCount: segments.length,
      segmentSummaries: segmentSummaries.slice(0, 10), // First 10 segments
      trends: evolution.trends,
      conversationHealth: evolution.conversationHealth,
      overallDirectionality: evolution.overallDirectionality,
      criticalMoments: criticalMoments.slice(0, 5), // Top 5 moments
      includeRecommendations,
      focusOnActionable,
    });

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return createEmptyNarrative(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return createEmptyNarrative('No response from AI');
    }

    // Parse AI response
    const parsed = parseAIResponse(content);

    // Return structured narrative
    return {
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      modelUsed: model,
      canRegenerate: true,
      executiveSummary: parsed.executiveSummary,
      keyDynamics: parsed.keyDynamics,
      recommendedActions: parsed.recommendedActions,
      segmentHighlights: includeSegmentSummaries ? parsed.segmentHighlights : [],
      basedOnSegments: segments.map(s => s.id),
      basedOnEvolution: evolution.chatId,
      confidence: calculateConfidence(evolution),
    };
  } catch (error) {
    console.error('Failed to generate narrative synthesis:', error);
    return createEmptyNarrative(`Error: ${error.message}`);
  }
}

/**
 * Build system prompt for AI
 */
function buildSystemPrompt() {
  return `You are a strategic conversation and intent analyst specializing in workplace communication dynamics and relationship intelligence. Your role is to:

1. Synthesize conversation intent patterns into actionable strategic insights
2. Identify critical inflection points and their business implications
3. Assess conversation health trajectories and communication effectiveness
4. Detect escalation risks, breakthrough opportunities, and resolution patterns
5. Provide executive-level recommendations based on intent evolution data
6. Compare patterns against healthy communication and collaboration best practices

Guidelines:
- Focus on STRATEGIC IMPLICATIONS of intent shifts, not just descriptions
- Reference specific segment numbers and critical moments in your analysis
- Identify both risks (escalations) and opportunities (breakthroughs)
- Provide concrete, actionable recommendations grounded in the data
- Be direct about concerning patterns while recognizing positive dynamics
- Keep insights concise but impactful (max 26 words per point)
- Balance analytical rigor with accessible language`;
}

/**
 * Build user prompt for AI narrative generation
 */
function buildNarrativePrompt(data) {
  const {
    segmentCount,
    segmentSummaries,
    trends,
    conversationHealth,
    overallDirectionality,
    criticalMoments,
    includeRecommendations,
    focusOnActionable,
  } = data;

  return `Analyze this conversation's intent evolution and provide actionable insights.

CONVERSATION OVERVIEW:
- Total segments: ${segmentCount}
- Overall health: ${conversationHealth}
- Trajectory: ${overallDirectionality}

INTENT TRENDS:
${Object.entries(trends).map(([intent, trend]) => `- ${intent}: ${trend}`).join('\n')}

SEGMENT SUMMARIES (showing first 10):
${segmentSummaries.map(seg => `
Segment ${seg.segmentNumber} (${seg.messageCount} messages, ${seg.duration} min):
  - Dominant intent: ${seg.dominantIntent || 'none'}
  - Alignment: ${seg.intentScores.alignment}%, Resistance: ${seg.intentScores.resistance}%
  - Urgency: ${seg.intentScores.urgency}%, Closure: ${seg.intentScores.closure}%
  - Flags: ${[
    seg.hasEscalation && 'escalation',
    seg.hasBreakthrough && 'breakthrough',
    seg.hasResolution && 'resolution',
  ].filter(Boolean).join(', ') || 'none'}
  - Boundary: ${seg.boundaryType}
`).join('\n')}

CRITICAL MOMENTS (showing top 5):
${criticalMoments.map((m, idx) => `${idx + 1}. ${m.type} (${m.severity}): ${m.reason}`).join('\n')}

TASK:
Provide a structured analysis. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays.

{
  "executiveSummary": "STRING: 2-3 sentences summarizing conversation progression, overall dynamics, and health trajectory",
  "keyDynamics": "STRING: First key dynamic - be specific, reference segment numbers. Second key dynamic. Third key dynamic.",
  "recommendedActions": ${includeRecommendations ? `"STRING: First actionable recommendation. Second actionable recommendation. Third actionable recommendation."` : `""`}
}

GUIDELINES:
- ${focusOnActionable ? 'Focus on actionable insights, not descriptive observations' : 'Balance description with insights'}
- Reference specific segment numbers when making points (e.g., "Segment 3 shows...")
- Avoid generic advice - be specific to this conversation's patterns
- Highlight intent shifts and their implications
- Keep language professional but accessible
- For keyDynamics and recommendedActions, separate items with periods, NOT numbered lists

IMPORTANT: Return ONLY valid JSON. Write complete, strategic sentences.`;
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(response) {
  try {
    // Clean and parse JSON response
    const cleaned = cleanJsonResponse(response);
    const data = JSON.parse(cleaned);

    // Split string values into arrays where needed
    const keyDynamics = data.keyDynamics
      ? data.keyDynamics.split(/\.\s+/).filter(s => s.trim()).map(s => s.trim())
      : [];

    const recommendedActions = data.recommendedActions
      ? data.recommendedActions.split(/\.\s+/).filter(s => s.trim()).map(s => s.trim())
      : [];

    return {
      executiveSummary: data.executiveSummary || 'Unable to generate summary from AI response.',
      keyDynamics: keyDynamics.length > 0 ? keyDynamics : [
        'Conversation shows mixed intent patterns',
        'Multiple segments detected',
        'Intent evolution tracked',
      ],
      recommendedActions: recommendedActions.length > 0 ? recommendedActions : [
        'Review critical moments',
        'Monitor intent trends',
        'Address escalation points',
      ],
      segmentHighlights: [],
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      executiveSummary: 'Unable to parse AI response.',
      keyDynamics: [
        'Conversation shows mixed intent patterns',
        'Multiple segments detected',
        'Intent evolution tracked',
      ],
      recommendedActions: [
        'Review critical moments',
        'Monitor intent trends',
        'Address escalation points',
      ],
      segmentHighlights: [],
    };
  }
}

/**
 * Calculate confidence in narrative synthesis
 */
function calculateConfidence(evolution) {
  // Confidence based on data quality
  const hasSegments = evolution.segments && evolution.segments.length > 0;
  const hasDeltas = evolution.deltas && evolution.deltas.length > 0;
  const hasCriticalMoments = (evolution.escalationPoints?.length || 0) +
                             (evolution.alignmentBreakthroughs?.length || 0) > 0;

  let confidence = 0.5; // Start with 50%

  if (hasSegments) confidence += 0.2;
  if (hasDeltas) confidence += 0.2;
  if (hasCriticalMoments) confidence += 0.1;

  return Math.min(confidence, 1.0);
}

/**
 * Create empty narrative for error cases
 */
function createEmptyNarrative(reason) {
  return {
    aiGenerated: false,
    generatedAt: new Date().toISOString(),
    modelUsed: 'none',
    canRegenerate: false,
    executiveSummary: `Narrative synthesis unavailable: ${reason}`,
    keyDynamics: [],
    recommendedActions: [],
    segmentHighlights: [],
    basedOnSegments: [],
    basedOnEvolution: null,
    confidence: 0,
  };
}

/**
 * Regenerate narrative from stored evolution data
 * Useful for getting fresh insights or using a different model
 *
 * @param {Object} storedEvolution - Previously stored evolution data
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} New narrative synthesis
 */
export async function regenerateNarrative(storedEvolution, options = {}) {
  console.log('🔄 Regenerating narrative synthesis...');
  return generateNarrativeSynthesis(
    storedEvolution.evolution,
    storedEvolution.segments,
    options
  );
}

/**
 * Export narrative synthesis to JSON
 */
export function exportNarrative(narrative) {
  return {
    ...narrative,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };
}

/**
 * Export all functions
 */
export default {
  generateNarrativeSynthesis,
  regenerateNarrative,
  exportNarrative,
};
