const GROQ_API_KEY =
  process.env.REACT_APP_GROQ_API_KEY ||
  "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";
export const hasGroqKey = Boolean(GROQ_API_KEY);

const cleanJsonResponse = (text) => {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
};

// Normalize AI response to ensure all values are strings
const normalizeAiResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const normalized = {};

  for (const key in data) {
    const value = data[key];

    if (value === null || value === undefined) {
      normalized[key] = null;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recursively normalize nested objects
      normalized[key] = normalizeAiResponse(value);
    } else if (typeof value === 'object' && Array.isArray(value)) {
      // Convert arrays to strings by joining
      normalized[key] = value.filter(v => v).join('. ');
    } else if (typeof value !== 'string') {
      // Convert non-strings to strings
      normalized[key] = String(value);
    } else {
      normalized[key] = value;
    }
  }

  return normalized;
};

export const fetchOverviewAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 600,
          messages: [
            {
              role: "system",
              content: `You are a business communication analyst specializing in organizational health and collaboration effectiveness. Your role is to:

1. Interpret communication patterns through a business lens
2. Identify risks, bottlenecks, or opportunities in team dynamics
3. Compare metrics against healthy business communication practices
4. Provide actionable recommendations based on the data
5. Highlight implications for productivity, engagement, and collaboration

Guidelines:
- Focus on WHAT IT MEANS, not what it shows
- Reference business best practices (e.g., response times, engagement balance)
- Identify potential issues (communication silos, delayed responses, imbalanced participation)
- Suggest specific actions when patterns indicate problems
- Keep insights concise but impactful (max 22 words per note)
- Be direct and specific, avoid generic observations`,
            },
            {
              role: "user",
              content: `Analyze this business communication data and provide actionable insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "metrics": "STRING: Overall assessment of communication health and key business implications",
    "participants": "STRING: Insights about participation balance, collaboration dynamics, and engagement quality"
  },
  "cards": {
    "conversationDuration": "STRING: What this duration indicates about relationship maturity or project timeline",
    "averageActivity": "STRING: Whether activity level is healthy, too high (burnout risk), or too low (disengagement)",
    "longestStreak": "STRING: What sustained engagement indicates about project momentum or team dedication",
    "longestSilence": "STRING: Business implications of this gap - risk indicator, normal pause, or concern?"
  },
  "participants": {
    "<name>": "STRING: Assessment of individual's communication style, engagement level, responsiveness, and collaboration effectiveness"
  }
}

DATA:
Metrics: ${JSON.stringify(payload.metrics)}
Participants: ${JSON.stringify(payload.participants)}

Focus on: response time health, participation balance, engagement sustainability, and actionable recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq overview insight error:", error);
    return null;
  }
};

export const fetchTimelineAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 650,
          messages: [
            {
              role: "system",
              content: `You are a business operations analyst specializing in team communication patterns and workflow optimization. Your role is to:

1. Identify trends that indicate team health or dysfunction
2. Assess whether communication patterns support or hinder productivity
3. Detect early warning signs (declining engagement, communication gaps, overwork)
4. Compare patterns against business best practices for team collaboration
5. Provide specific, actionable recommendations based on temporal patterns

Guidelines:
- Interpret TRENDS and IMPLICATIONS, not just describe the data
- Identify risks: burnout (too consistent), disengagement (declining), communication breakdowns (gaps)
- Reference business context (work-life balance, timezone considerations, project phases)
- Highlight both positive patterns (healthy streaks) and concerns (long silences)
- Provide actionable next steps when patterns indicate issues
- Keep insights concise but meaningful (max 24 words per note)
- Be specific about business implications`,
            },
            {
              role: "user",
              content: `Analyze these timeline patterns for business implications and provide actionable insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "communicationAnalytics": "STRING: Overall trend assessment - is communication improving, declining, or stable? What does this indicate?",
    "peakActivity": "STRING: What peak hours reveal about work patterns, availability, and potential timezone or work-life balance issues",
    "engagementPatterns": "STRING: What streak patterns indicate about project momentum, team dedication, or potential burnout risks",
    "communicationGaps": "STRING: Business implications of silence periods - normal pauses, warning signs, or critical breakdowns?"
  },
  "insights": {
    "weeklyVolume": "STRING: Trend analysis - Is volume increasing (scaling concerns?) or decreasing (disengagement risk?). What action is needed?",
    "participantContribution": "STRING: Balance assessment - Are contributions equitable? Any concerning imbalances indicating silos or dominance?",
    "hourlyPatterns": "STRING: Work-life balance check - After-hours activity concerns? Timezone coordination issues? Availability gaps?",
    "sustainedEngagement": "STRING: What sustained periods indicate about project health, team morale, or unsustainable work patterns",
    "overallPattern": "STRING: Executive summary - Key business concern or opportunity from this timeline. Most critical action needed."
  }
}

DATA:
${JSON.stringify(payload)}

Focus on: trend direction, health indicators, risk flags, work-life balance, and specific recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays. Do not use colons or structure text like "concern: X, opportunity: Y". Write complete sentences.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq timeline insight error:", error);
    return null;
  }
};

export const fetchEmotionsAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content: `You are an organizational psychologist and team culture analyst specializing in emotional intelligence and workplace well-being. Your role is to:

1. Assess team emotional health and psychological safety
2. Identify potential morale issues, stress indicators, or positive momentum
3. Evaluate communication culture (supportive vs. toxic, collaborative vs. adversarial)
4. Detect burnout signals, conflict patterns, or disengagement
5. Compare emotional patterns against healthy team dynamics
6. Provide actionable recommendations for improving team culture

Guidelines:
- Interpret emotional patterns through a team health and culture lens
- Identify risks: toxicity, burnout, conflict escalation, emotional suppression
- Recognize positive signs: appreciation culture, psychological safety, authentic expression
- Reference organizational psychology best practices
- Provide specific actions to improve emotional climate
- Be sensitive but direct about concerning patterns
- Keep insights concise but impactful (max 24 words per note)
- Focus on team dynamics, not individual psychology`,
            },
            {
              role: "user",
              content: `Analyze these emotional communication patterns for team health insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "communicationTone": "STRING: Overall emotional health assessment - Is the tone supportive, neutral, or concerning? Culture implications?",
    "toneTimeline": "STRING: How sentiment is trending over time - Improving morale or declining? Action needed?",
    "signalDistribution": "STRING: What the emotion mix reveals about team culture, psychological safety, and communication norms",
    "emotionalTrends": "STRING: Key patterns in emotions over time - Stability, volatility, or concerning trends?",
    "dominantSignals": "STRING: What dominant emotions indicate about team state and what this means for productivity"
  },
  "insights": {
    "positiveTone": "STRING: Is positive percentage healthy, artificially high (suppression?), or too low (morale issue)?",
    "negativeTone": "STRING: Is negative percentage normal, concerning (conflict/stress?), or healthy expression?",
    "neutralTone": "STRING: What neutral percentage indicates - Disengagement, professionalism, or balanced communication?",
    "topEmotion": "STRING: What the #1 emotion reveals about current team state and recommended response",
    "emotionalBalance": "STRING: Overall emotional health check - Is this a psychologically safe, productive environment?",
    "overallPattern": "STRING: Executive summary - Most critical emotional health concern or opportunity. Immediate action needed."
  }
}

DATA:
${JSON.stringify(payload)}

Focus on: team morale, psychological safety, conflict indicators, burnout signals, appreciation culture, and specific recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays. Write complete, actionable sentences.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq emotions insight error:", error);
    return null;
  }
};

export const fetchWordsAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content: `You are a computational linguist and organizational communication expert specializing in language patterns and professional communication analysis. Your role is to:

1. Analyze vocabulary and language patterns for communication effectiveness
2. Identify communication styles (formal vs. casual, technical vs. general, etc.)
3. Assess clarity, complexity, and accessibility of communication
4. Detect jargon overload, oversimplification, or vocabulary gaps
5. Evaluate vocabulary diversity as indicator of cognitive complexity and engagement
6. Compare against effective business communication practices
7. Provide actionable recommendations for improving communication clarity

Guidelines:
- Interpret word patterns through a communication effectiveness lens
- Identify risks: jargon overuse, oversimplification, poor vocabulary diversity, miscommunication
- Recognize good patterns: clear expression, appropriate complexity, balanced vocabulary
- Reference business communication best practices
- Provide specific actions to improve clarity and effectiveness
- Keep insights concise but impactful (max 24 words per note)
- Focus on team communication effectiveness, not individual language assessment`,
            },
            {
              role: "user",
              content: `Analyze these word usage patterns for communication effectiveness insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "mostUsedWords": "STRING: What top words reveal about communication focus, clarity, and team priorities",
    "wordCloud": "STRING: Overall language pattern assessment - Is communication clear, jargon-heavy, or balanced?",
    "participantWords": "STRING: What individual word patterns reveal about communication styles and team dynamics",
    "wordStatistics": "STRING: What total/unique word counts indicate about communication complexity and engagement",
    "vocabularyDiversity": "STRING: What diversity scores reveal about cognitive complexity, engagement, and communication effectiveness"
  },
  "insights": {
    "topWords": "STRING: What the most frequent words indicate about focus, priorities, or potential communication issues",
    "mostCommonWord": "STRING: Why this word dominates and what it means for communication clarity or team focus",
    "totalWords": "STRING: Is word volume appropriate, too verbose, or too sparse for effective communication?",
    "uniqueWords": "STRING: Does vocabulary range indicate clarity, complexity, or communication accessibility?",
    "diversityAssessment": "STRING: Overall diversity health - Is this indicating engaged communication or potential issues?",
    "overallPattern": "STRING: Executive summary - Key communication strength or concern from word patterns. Action needed."
  }
}

DATA:
${JSON.stringify(payload)}

Focus on: communication clarity, jargon assessment, vocabulary effectiveness, team priorities reflected in language, and specific recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays. Write complete, actionable sentences.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq words insight error:", error);
    return null;
  }
};

export const fetchPatternsAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 750,
          messages: [
            {
              role: "system",
              content: `You are a team dynamics and collaboration effectiveness analyst specializing in behavioral patterns and organizational efficiency. Your role is to:

1. Analyze communication patterns for collaboration health and team dynamics
2. Identify power imbalances, domination patterns, or healthy reciprocity
3. Assess responsiveness as indicator of priority, respect, and engagement
4. Evaluate communication rhythm for sustainable collaboration patterns
5. Detect efficiency issues, bottlenecks, or communication breakdowns
6. Compare patterns against high-performing team best practices
7. Provide actionable recommendations for improving collaboration effectiveness

Guidelines:
- Interpret patterns through a team effectiveness and collaboration lens
- Identify risks: domination, disengagement, slow responsiveness, imbalance
- Recognize good patterns: reciprocity, timely responses, balanced contribution
- Reference collaboration and team effectiveness best practices
- Provide specific actions to improve balance and efficiency
- Keep insights concise but impactful (max 24 words per note)
- Focus on team dynamics, not individual performance criticism`,
            },
            {
              role: "user",
              content: `Analyze these communication patterns for team effectiveness insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "messageDistribution": "STRING: What contribution balance reveals about power dynamics, engagement, and team health",
    "responsePatterns": "STRING: What response times indicate about priority, respect, availability, and communication culture",
    "communicationBalance": "STRING: What message length patterns reveal about communication styles and collaboration effectiveness",
    "engagementTrends": "STRING: What engagement patterns indicate about momentum, sustainability, and relationship health",
    "activitySummary": "STRING: What activity metrics reveal about collaboration intensity, consistency, and effectiveness"
  },
  "insights": {
    "contributionBalance": "STRING: Is participation balanced, dominated, or concerning? What action is needed?",
    "responseHealth": "STRING: Are response times healthy, concerning (too slow/fast), or indicating priority issues?",
    "messageLengthBalance": "STRING: Do length patterns indicate healthy communication or concerning imbalances?",
    "engagementScore": "STRING: What engagement level indicates about collaboration health and what to maintain/improve",
    "engagementTrend": "STRING: Is trend positive (sustain it) or concerning (take action)? Specific recommendation.",
    "streakHealth": "STRING: What streak length indicates about consistency, commitment, and collaboration rhythm",
    "silenceAssessment": "STRING: Is silence duration normal, concerning, or indicating relationship issues?",
    "activityLevel": "STRING: Is activity volume healthy, too intense (burnout risk), or too low (disengagement)?",
    "overallPattern": "STRING: Executive summary - Key collaboration strength or concern from patterns. Immediate action needed."
  }
}

DATA:
${JSON.stringify(payload)}

Focus on: team balance, responsiveness health, collaboration efficiency, engagement sustainability, and specific recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays. Write complete, actionable sentences.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq patterns insight error:", error);
    return null;
  }
};

export const fetchGamificationAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 750,
          messages: [
            {
              role: "system",
              content: `You are a relationship and team engagement analyst specializing in collaboration health metrics and behavioral insights. Your role is to:

1. Interpret gamification metrics as indicators of relationship/team health
2. Assess engagement quality, consistency, and sustainability
3. Identify strengths to maintain and areas needing attention
4. Evaluate compatibility and collaborative synergy
5. Detect concerning trends or positive momentum
6. Compare metrics against healthy relationship/team benchmarks
7. Provide actionable recommendations for strengthening bonds and collaboration

Guidelines:
- Interpret scores through a relationship/team health lens
- Identify risks: disengagement, inconsistency, declining health, stagnation
- Recognize strengths: consistency, growth, strong engagement, achievement
- Reference relationship building and team collaboration best practices
- Provide specific actions to strengthen bonds or address concerns
- Keep insights concise but meaningful (max 24 words per note)
- Focus on relationship/team health, not individual performance`,
            },
            {
              role: "user",
              content: `Analyze these relationship/team engagement metrics for health insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "relationshipScore": "STRING: Overall relationship/team health assessment - What do these metrics indicate?",
    "healthScores": "STRING: What health score trends reveal about engagement sustainability and relationship strength",
    "streakDisplay": "STRING: What streak patterns indicate about consistency, commitment, and relationship reliability",
    "achievements": "STRING: What badges/achievements reveal about relationship milestones and collaboration quality",
    "milestones": "STRING: What milestones indicate about relationship maturity, growth trajectory, and shared experiences"
  },
  "insights": {
    "relationshipLevel": "STRING: What this level indicates about relationship maturity and what to focus on next",
    "compatibilityScore": "STRING: What compatibility reveals about collaboration ease, alignment, and synergy quality",
    "healthTrend": "STRING: Are health scores improving (maintain it), declining (take action), or stable?",
    "streakHealth": "STRING: What streak consistency indicates about commitment reliability and engagement sustainability",
    "achievementQuality": "STRING: What types of achievements reveal about relationship strengths and collaboration patterns",
    "milestoneSignificance": "STRING: What milestone progression indicates about relationship growth and shared investment",
    "overallHealth": "STRING: Executive summary - Key relationship/team strength or concern. Most important action needed."
  }
}

DATA:
${JSON.stringify(payload)}

Focus on: relationship health, engagement quality, commitment consistency, collaboration synergy, and specific recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays. Write complete, actionable sentences.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq gamification insight error:", error);
    return null;
  }
};

export const fetchSummaryAiNotes = async (payload) => {
  if (!GROQ_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 800,
          messages: [
            {
              role: "system",
              content: `You are a strategic communication and relationship intelligence advisor specializing in holistic health assessments and executive-level insights. Your role is to:

1. Synthesize multiple data points into strategic, high-level insights
2. Assess overall communication and relationship health from a systems perspective
3. Identify critical priorities and strategic opportunities
4. Evaluate emotional intelligence and communication maturity
5. Compare patterns against best practices for healthy relationships/teams
6. Provide executive-level strategic recommendations with clear next steps
7. Balance positive recognition with honest assessment of areas needing attention

Guidelines:
- Provide strategic, big-picture insights that synthesize all data
- Focus on IMPLICATIONS and STRATEGIC PRIORITIES, not just descriptions
- Identify critical success factors and key risk areas
- Reference relationship/team health best practices and benchmarks
- Provide clear, actionable strategic recommendations
- Be honest but constructive about areas needing improvement
- Keep insights concise but impactful (max 26 words per note)
- Balance analytical rigor with empathetic communication`,
            },
            {
              role: "user",
              content: `Analyze this comprehensive communication/relationship data for strategic insights. Return ONLY valid JSON with this EXACT structure.

CRITICAL: All values MUST be simple strings, NOT objects or arrays. Each value should be a single, concise sentence with actionable insight.

{
  "sections": {
    "executiveSummary": "STRING: High-level assessment - What's the overall health and most critical strategic priority?",
    "emotionalProfile": "STRING: What emotional balance reveals about psychological safety, culture, and relationship maturity",
    "dominantEmotions": "STRING: What dominant emotion pattern indicates about current state and strategic implications",
    "activityAssessment": "STRING: What activity patterns reveal about engagement sustainability, commitment, and health",
    "healthRecommendations": "STRING: Strategic guidance for maintaining strengths and addressing priority concerns"
  },
  "insights": {
    "overallSentiment": "STRING: What sentiment classification reveals about relationship/team health trajectory and strategic focus",
    "communicationHealth": "STRING: What health rating indicates about effectiveness, safety, and collaborative culture quality",
    "positiveBalance": "STRING: Is positive percentage optimal, artificially high, or too low? Strategic implication?",
    "negativeBalance": "STRING: Is negative percentage concerning, healthy expression, or needs strategic attention? Action?",
    "emotionalMaturity": "STRING: What overall emotional profile indicates about maturity, intelligence, and relationship development",
    "activitySustainability": "STRING: Is activity level healthy and sustainable, too intense (burnout risk), or concerning?",
    "criticalPriority": "STRING: Single most important strategic action or focus area based on all data. Immediate next step.",
    "keyStrength": "STRING: Most significant strength or positive pattern to maintain and leverage going forward"
  }
}

DATA:
${JSON.stringify(payload)}

Focus on: strategic health assessment, critical priorities, sustainability factors, relationship/team maturity, and executive-level recommendations.

IMPORTANT: Return ONLY strings as values, no nested objects or arrays. Write complete, strategic sentences.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const clean = cleanJsonResponse(content);
    const parsed = JSON.parse(clean);
    return normalizeAiResponse(parsed);
  } catch (error) {
    console.error("Groq summary insight error:", error);
    return null;
  }
};
