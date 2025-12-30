/**
 * Canonical Message Transformer - Layer 1
 *
 * Transforms parsed messages from any source (WhatsApp, Gmail, Slack, JSON)
 * into a universal CanonicalMessage format.
 *
 * Design principles:
 * - Deterministic: Same input always produces same output
 * - Immutable: Once created, canonical messages never change
 * - Single responsibility: Only preprocessing and normalization
 * - Source-agnostic: Works with any message source
 */

import { createCanonicalMessage, getDefaultTransformOptions } from '../types/index.js';

/**
 * Transform messages to canonical format
 *
 * @param {Array} messages - Array of parsed messages {date, time, timestamp, sender, text}
 * @param {Object} metadata - Message metadata {source, participants, startDate, endDate}
 * @param {Object} options - Transformation options
 * @returns {import('../types').CanonicalMessage[]} Array of CanonicalMessage objects
 */
export function transformToCanonical(messages, metadata, options = {}) {
  const {
    aggressiveNormalization = false,
    customTokenizer = null,
    preserveEmoji = true,
    minWordLength = 2,
  } = options;

  return messages.map((msg, idx) => {
    // Generate deterministic ID
    const id = generateMessageId(msg, idx);

    // Normalize text
    const normalizedText = normalizeText(msg.text, aggressiveNormalization);

    // Tokenize
    const tokens = customTokenizer
      ? customTokenizer(msg.text)
      : tokenize(normalizedText, preserveEmoji, minWordLength);

    // Count metrics
    const characterCount = msg.text.length;
    const wordCount = tokens.filter(t => t.length >= minWordLength).length;

    return createCanonicalMessage({
      // Core identity
      id,
      timestamp: ensureDate(msg.timestamp),
      sender: cleanSender(msg.sender),
      text: msg.text,

      // Source metadata
      source: metadata.source || 'unknown',
      sourceMessageId: msg.id || null,
      threadId: metadata.threadId || metadata.channelName || null,

      // Preprocessing
      normalizedText,
      tokens,
      characterCount,
      wordCount,

      // Contextual position
      conversationPosition: idx,
      segmentId: null, // Assigned during segmentation (Layer 4)

      // Computed layers (populated by later layers)
      lexical: null,
      behavioral: null,
    });
  });
}

/**
 * Generate deterministic message ID
 *
 * Creates a consistent ID from sender, timestamp, and text.
 * Same message content always produces same ID.
 *
 * @param {Object} message - Message object
 * @param {number} index - Message position (fallback)
 * @returns {string} Deterministic message ID
 */
export function generateMessageId(message, index) {
  const timestamp = ensureDate(message.timestamp).getTime();
  const sender = (message.sender || 'unknown').toLowerCase();
  const textPrefix = (message.text || '').substring(0, 50); // First 50 chars

  // Create hash string
  const hashInput = `${sender}_${timestamp}_${textPrefix}`;

  // Simple hash function (32-bit)
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to base-36 string and add prefix
  return `msg_${Math.abs(hash).toString(36)}_${index}`;
}

/**
 * Normalize text for analysis
 *
 * @param {string} text - Original message text
 * @param {boolean} aggressive - Whether to use aggressive normalization
 * @returns {string} Normalized text
 */
export function normalizeText(text, aggressive = false) {
  if (!text) return '';

  let normalized = text.toLowerCase();

  if (aggressive) {
    // Remove URLs
    normalized = normalized.replace(/https?:\/\/\S+/g, '[url]');

    // Remove email addresses
    normalized = normalized.replace(/\S+@\S+\.\S+/g, '[email]');

    // Remove phone numbers
    normalized = normalized.replace(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g, '[phone]');

    // Collapse multiple spaces
    normalized = normalized.replace(/\s+/g, ' ');

    // Remove special characters (keep basic punctuation)
    normalized = normalized.replace(/[^a-z0-9\s.,!?'"@#-]/g, '');
  }

  return normalized.trim();
}

/**
 * Tokenize text into words
 *
 * @param {string} text - Text to tokenize
 * @param {boolean} preserveEmoji - Whether to keep emoji as tokens
 * @param {number} minLength - Minimum word length to include
 * @returns {Array} Array of tokens
 */
export function tokenize(text, preserveEmoji = true, minLength = 2) {
  if (!text) return [];

  // Split on whitespace and punctuation (but keep some punctuation)
  let tokens = text
    .toLowerCase()
    .split(/[\s,;:'"()\[\]{}]+/)
    .filter(token => token.length >= minLength);

  // Remove punctuation from ends of tokens
  tokens = tokens.map(token => token.replace(/^[^\w]+|[^\w]+$/g, ''));

  // Filter out empty tokens
  tokens = tokens.filter(token => token.length >= minLength);

  // Remove stop words (very common words with little meaning)
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'can', 'could', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  ]);

  tokens = tokens.filter(token => !stopWords.has(token));

  return tokens;
}

/**
 * Clean sender name
 *
 * Removes system prefixes and normalizes sender identifiers.
 *
 * @param {string} sender - Raw sender name
 * @returns {string} Cleaned sender name
 */
export function cleanSender(sender) {
  if (!sender) return 'unknown';

  // Remove WhatsApp prefixes
  let cleaned = sender.replace(/^~/, '');

  // Remove email domains (keep local part)
  cleaned = cleaned.replace(/@.*$/, '');

  // Remove extra whitespace
  cleaned = cleaned.trim();

  // Normalize case (keep original case for display)
  return cleaned;
}

/**
 * Ensure timestamp is a Date object
 *
 * @param {Date|string|number} timestamp - Timestamp in any format
 * @returns {Date} Date object
 */
export function ensureDate(timestamp) {
  if (timestamp instanceof Date) {
    return timestamp;
  }

  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Fallback to current time
  console.warn('Invalid timestamp, using current time:', timestamp);
  return new Date();
}

/**
 * Batch transform with progress tracking
 *
 * For large message sets, this provides progress callbacks.
 *
 * @param {Array} messages - Messages to transform
 * @param {Object} metadata - Message metadata
 * @param {Function} onProgress - Progress callback (current, total)
 * @param {Object} options - Transformation options
 * @returns {Array} Array of CanonicalMessage objects
 */
export function transformToCanonicalWithProgress(messages, metadata, onProgress, options = {}) {
  const batchSize = 100;
  const total = messages.length;
  const canonicalMessages = [];

  for (let i = 0; i < total; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    const canonicalBatch = transformToCanonical(batch, metadata, options);
    canonicalMessages.push(...canonicalBatch);

    if (onProgress) {
      onProgress(Math.min(i + batchSize, total), total);
    }
  }

  return canonicalMessages;
}

/**
 * Validate canonical message
 *
 * Ensures a canonical message has all required fields.
 *
 * @param {Object} canonicalMessage - Message to validate
 * @returns {boolean} True if valid
 */
export function validateCanonicalMessage(canonicalMessage) {
  const required = ['id', 'timestamp', 'sender', 'text', 'normalizedText', 'tokens', 'wordCount'];

  for (const field of required) {
    if (canonicalMessage[field] === undefined || canonicalMessage[field] === null) {
      console.error(`Missing required field: ${field}`, canonicalMessage);
      return false;
    }
  }

  // Validate types
  if (!(canonicalMessage.timestamp instanceof Date)) {
    console.error('timestamp must be a Date object', canonicalMessage);
    return false;
  }

  if (!Array.isArray(canonicalMessage.tokens)) {
    console.error('tokens must be an array', canonicalMessage);
    return false;
  }

  if (typeof canonicalMessage.wordCount !== 'number') {
    console.error('wordCount must be a number', canonicalMessage);
    return false;
  }

  return true;
}

/**
 * Calculate transformation statistics
 *
 * @param {Array} originalMessages - Original messages
 * @param {Array} canonicalMessages - Transformed messages
 * @returns {Object} Transformation statistics
 */
export function getTransformationStats(originalMessages, canonicalMessages) {
  return {
    originalCount: originalMessages.length,
    canonicalCount: canonicalMessages.length,
    avgTokensPerMessage: canonicalMessages.reduce((sum, msg) => sum + msg.tokens.length, 0) / canonicalMessages.length,
    avgWordsPerMessage: canonicalMessages.reduce((sum, msg) => sum + msg.wordCount, 0) / canonicalMessages.length,
    avgCharactersPerMessage: canonicalMessages.reduce((sum, msg) => sum + msg.characterCount, 0) / canonicalMessages.length,
    uniqueSenders: new Set(canonicalMessages.map(msg => msg.sender)).size,
    timeSpan: {
      start: canonicalMessages[0]?.timestamp,
      end: canonicalMessages[canonicalMessages.length - 1]?.timestamp,
      durationDays: canonicalMessages.length > 0
        ? (canonicalMessages[canonicalMessages.length - 1].timestamp - canonicalMessages[0].timestamp) / (1000 * 60 * 60 * 24)
        : 0,
    },
  };
}
