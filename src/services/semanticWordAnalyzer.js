/**
 * Semantic Word Frequency Analyzer
 *
 * Extracts word frequency from canonical messages using their pre-computed tokens.
 * This avoids re-tokenization and aligns with the semantic engine's Layer 1 architecture.
 *
 * Design principles:
 * - Use pre-computed tokens from canonical messages (Layer 1)
 * - Deterministic: same tokens always produce same frequency
 * - No re-tokenization: reuse Layer 1 work
 * - Browser-compatible: no Node.js dependencies
 */

/**
 * Common stop words to filter out
 * Same list as traditional analyzer for consistency
 */
const STOP_WORDS = new Set([
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

/**
 * Calculate word frequency from canonical messages
 *
 * @param {Array} canonicalMessages - Array of CanonicalMessage objects
 * @param {number} topN - Number of top words to return
 * @returns {Array} Array of {word, count} objects sorted by frequency
 */
export const calculateSemanticWordFrequency = (canonicalMessages, topN = 30) => {
  const wordCount = {};

  // Extract words from pre-computed tokens
  canonicalMessages.forEach((message) => {
    const tokens = message.tokens || [];

    tokens.forEach(token => {
      const word = token.toLowerCase();

      // Filter: must be > 2 chars and not a stop word
      if (word.length > 2 && !STOP_WORDS.has(word)) {
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

  canonicalMessages.forEach(message => {
    const tokens = message.tokens || [];
    tokens.forEach(token => {
      const word = token.toLowerCase();
      if (word.length > 2 && !STOP_WORDS.has(word)) {
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

/**
 * Get word count statistics from canonical messages
 *
 * @param {Array} canonicalMessages - Array of CanonicalMessage objects
 * @returns {Object} Statistics {totalWords, uniqueWords, avgWordsPerMessage}
 */
export const getWordCountStats = (canonicalMessages) => {
  const allWords = new Set();
  let totalWords = 0;

  canonicalMessages.forEach(message => {
    const tokens = message.tokens || [];
    tokens.forEach(token => {
      const word = token.toLowerCase();
      if (word.length > 2 && !STOP_WORDS.has(word)) {
        allWords.add(word);
        totalWords++;
      }
    });
  });

  const avgWordsPerMessage = canonicalMessages.length > 0
    ? Math.round(totalWords / canonicalMessages.length)
    : 0;

  return {
    totalWords,
    uniqueWords: allWords.size,
    avgWordsPerMessage,
  };
};

/**
 * Format semantic engine senderStats to include response time statistics
 * in the format expected by dashboard tabs
 *
 * @param {Object} semanticSenderStats - Sender stats from semantic engine
 * @returns {Object} Formatted stats with responseTime data
 */
export const formatSemanticSenderStats = (semanticSenderStats) => {
  const formatted = {};
  const responseTimes = {};

  for (const [sender, stats] of Object.entries(semanticSenderStats)) {
    // Format sender stats
    formatted[sender] = {
      messageCount: stats.messageCount || 0,
      avgMessageLength: Math.round(stats.avgLength || 0),
      totalCharacters: Math.round((stats.avgLength || 0) * (stats.messageCount || 0)),
      wordCount: 0, // Not directly available, but not critical
      avgWordsPerMessage: 0, // Not directly available, but not critical
    };

    // Format response times if available
    if (stats.responseTimes && stats.responseTimes.length > 0) {
      const times = stats.responseTimes.filter(t => !Number.isNaN(t));
      const sorted = [...times].sort((a, b) => a - b);

      responseTimes[sender] = {
        avgMinutes: Math.round(times.reduce((sum, t) => sum + t, 0) / times.length),
        medianMinutes: Math.round(sorted[Math.floor(sorted.length / 2)]),
        count: times.length,
      };
    }
  }

  return {
    senderStats: formatted,
    responseTimes,
  };
};
