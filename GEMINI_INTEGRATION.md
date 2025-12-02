# Gemini AI Integration Guide

## Overview

The sentiment analysis service now includes **Google Gemini AI** integration for deeper, more nuanced conversation analysis. This provides AI-powered insights that go beyond keyword matching.

## Features

### 1. **AI-Powered Message Analysis** (`analyzeWithGemini`)
Analyzes individual messages using Gemini AI to detect:
- Sentiment (positive/negative/neutral)
- Primary and secondary emotions
- Communication style
- Context (business, love, friendship, technical, etc.)
- Confidence and intensity scores
- Brief AI-generated insights

### 2. **Batch Message Analysis** (`analyzeChatWithGemini`)
- Intelligently samples messages for analysis (default: 50 messages)
- Includes rate limiting (200ms delay between requests)
- Automatic fallback to keyword-based analysis on errors
- Analyzes messages evenly distributed across the conversation

### 3. **Conversation-Level Insights** (`getGeminiConversationInsights`)
Deep psychological and relational analysis including:
- Overall relationship dynamic
- Communication health assessment
- Key strengths and areas for growth
- Emotional patterns
- Relationship stage/maturity
- Detailed AI insights

## Usage

### Basic Usage (Keyword-Based)

```javascript
// Default behavior - uses keyword matching (fast, no API calls)
const sentimentData = analyzeChatSentiment(messages);
const summary = await generateRelationshipSummary(messages, stats);
```

### AI-Enhanced Analysis

```javascript
// Enable Gemini AI for deeper analysis
const sentimentData = await analyzeChatSentiment(messages, true);
const summary = await generateRelationshipSummary(messages, stats, true);

// Access AI insights
if (summary.aiPowered) {
  console.log('Overall Dynamic:', summary.aiOverallDynamic);
  console.log('Key Strengths:', summary.aiKeyStrengths);
  console.log('Areas for Growth:', summary.aiAreasForGrowth);
  console.log('AI Insights:', summary.aiInsights);
}
```

### Analyze Single Message

```javascript
const analysis = await analyzeWithGemini("I'm so excited about our project!");

console.log(analysis.sentiment); // "positive"
console.log(analysis.primaryEmotion); // "excitement"
console.log(analysis.context); // "professional" or "project"
console.log(analysis.aiInsight); // AI-generated insight
```

### Get Conversation Insights

```javascript
const insights = await getGeminiConversationInsights(messages, stats);

console.log(insights.overallDynamic);
console.log(insights.keyStrengths);
console.log(insights.communicationHealth);
console.log(insights.healthScore);
```

## Configuration

### API Key
The API key is configured in `sentimentAnalysis.js`:

```javascript
const GEMINI_API_KEY = 'AIzaSyAhQitzL_hFAnLOu3jV83HRjG1cyw_kI8c';
```

### Model
Currently using: `gemini-2.0-flash-exp` (Gemini 2.5 Flash experimental)

### Sample Size
Default sample size for batch analysis: **50 messages**

You can customize this:
```javascript
const sentimentData = await analyzeChatWithGemini(messages, 100); // Analyze 100 messages
```

## Security Considerations

⚠️ **IMPORTANT**: The API key is currently exposed in client-side code. This is acceptable for development but **NOT recommended for production**.

### For Production:

1. **Move API calls to backend server**
   - Create a Node.js/Express backend
   - Store API key in environment variables
   - Proxy Gemini API calls through your backend

2. **Use Environment Variables**
   ```javascript
   const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
   ```

3. **Implement Rate Limiting**
   - Add rate limiting on your backend
   - Track API usage per user
   - Set quota limits

4. **Use API Key Restrictions**
   - Restrict API key to specific domains
   - Set up IP restrictions in Google Cloud Console
   - Enable API key restrictions

## Performance

### Rate Limiting
- Built-in 200ms delay between API calls
- Prevents hitting rate limits
- Ensures smooth analysis

### Intelligent Sampling
- For large conversations (>50 messages), samples messages evenly
- Maintains conversation context
- Reduces API costs

### Fallback Mechanism
- Automatic fallback to keyword-based analysis on errors
- Ensures application continues to work even if API fails
- Graceful degradation

## Cost Considerations

### Gemini 2.0 Flash Pricing (as of 2024)
- **Input**: $0.075 per 1M tokens
- **Output**: $0.30 per 1M tokens

### Estimated Costs
For a typical chat analysis:
- **50 messages** (~5,000 tokens): **~$0.001** (less than 1 cent)
- **500 messages** (~50,000 tokens): **~$0.01** (1 cent)
- **5,000 messages** (~500,000 tokens): **~$0.10** (10 cents)

💡 **Tip**: Use sampling to control costs for very large conversations.

## Response Format

### Message Analysis Response
```json
{
  "sentiment": "positive",
  "primaryEmotion": "excitement",
  "secondaryEmotions": ["joy", "pride"],
  "confidence": 0.85,
  "intensity": 0.75,
  "context": "professional",
  "communicationStyle": "supportive",
  "aiInsight": "Shows enthusiasm and pride in collaborative achievement",
  "aiPowered": true
}
```

### Conversation Insights Response
```json
{
  "overallDynamic": "Collaborative professional partnership with mutual respect",
  "conversationContext": "technical",
  "communicationHealth": "excellent",
  "healthScore": 85,
  "keyStrengths": [
    "Strong technical collaboration",
    "Mutual support and encouragement",
    "Clear communication"
  ],
  "areasForGrowth": [
    "Balance work-life discussions",
    "Express appreciation more often"
  ],
  "emotionalPatterns": "Consistent positive energy with healthy conflict resolution",
  "communicationStyle": "Predominantly supportive with assertive problem-solving",
  "relationshipStage": "Mature collaborative partnership with established trust",
  "aiInsights": [
    "Exceptional technical synergy evident in code discussions",
    "Healthy balance of questioning and supporting each other",
    "Strong foundation for long-term collaboration"
  ]
}
```

## Error Handling

The integration includes robust error handling:

```javascript
try {
  const analysis = await analyzeWithGemini(message);
  // Use AI analysis
} catch (error) {
  console.error('Gemini analysis failed:', error);
  // Automatic fallback to keyword-based analysis
  const fallbackAnalysis = analyzeSentiment(message);
}
```

## Troubleshooting

### API Key Issues
- Verify the API key is correct
- Check if the API is enabled in Google Cloud Console
- Ensure billing is enabled

### Rate Limiting
- Increase delay between requests if hitting rate limits
- Reduce sample size for large conversations
- Implement exponential backoff

### JSON Parse Errors
- The system automatically cleans markdown formatting
- Fallback to keyword analysis if JSON parsing fails
- Check Gemini response format in console logs

## Example Integration in App.js

```javascript
// In App.js handleFileProcessed function

// Option 1: Use AI for all analysis (slower but more accurate)
const messagesWithSentiment = await analyzeChatSentiment(messages, true);
const sentiment = await generateRelationshipSummary(messagesWithSentiment, stats, true);

// Option 2: Keyword-based (fast, no API calls)
const messagesWithSentiment = analyzeChatSentiment(messages);
const sentiment = await generateRelationshipSummary(messagesWithSentiment, stats);

// Option 3: Hybrid - keyword for messages, AI for summary insights
const messagesWithSentiment = analyzeChatSentiment(messages);
const sentiment = await generateRelationshipSummary(messagesWithSentiment, stats, true);
```

## Future Enhancements

Potential improvements:
- [ ] Add caching for analyzed messages
- [ ] Implement batch API calls for better performance
- [ ] Add user toggle for AI analysis in UI
- [ ] Create backend proxy for API key security
- [ ] Add support for multiple AI providers (OpenAI, Claude, etc.)
- [ ] Implement streaming responses for real-time analysis
- [ ] Add cost tracking and usage analytics
- [ ] Create AI-powered conversation search
- [ ] Generate AI summary reports

## Support

For issues or questions:
- Check Google Cloud Console for API status
- Review error logs in browser console
- Ensure API quotas are not exceeded
- Contact support if API key issues persist
