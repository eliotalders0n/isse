/**
 * Canonical Message Model - Layer 1
 *
 * Universal message representation used throughout the semantic engine.
 * Once created, this structure is immutable and serves as the foundation
 * for all higher-layer analysis.
 *
 * Design principles:
 * - Deterministic: Same input always produces same canonical message
 * - Immutable: Never modified after creation
 * - Self-contained: All preprocessing done once at creation time
 */

/**
 * @typedef {Object} CanonicalMessage
 * @property {string} id - Deterministic hash from (sender + timestamp + text)
 * @property {Date} timestamp - Message timestamp
 * @property {string} sender - Participant identifier
 * @property {string} text - Original message text
 * @property {'whatsapp' | 'gmail' | 'slack' | 'json'} source - Message source
 * @property {string} [sourceMessageId] - Original message ID from source system
 * @property {string} [threadId] - Thread/channel identifier (for Slack/Gmail)
 * @property {string} normalizedText - Lowercased, punctuation-normalized
 * @property {string[]} tokens - Tokenized for analysis
 * @property {number} characterCount - Length in characters
 * @property {number} wordCount - Length in words
 * @property {number} conversationPosition - Index in full conversation (0-based)
 * @property {string} [segmentId] - Assigned during segmentation (Layer 4)
 * @property {Object} [lexical] - Layer 2: Intent detection
 * @property {Object} [behavioral] - Layer 3: Interaction patterns
 */

/**
 * @typedef {Object} MessageMetadata
 * @property {number} totalMessages - Total message count
 * @property {string[]} participants - List of participants
 * @property {Date} startDate - First message timestamp
 * @property {Date} endDate - Last message timestamp
 * @property {'whatsapp' | 'gmail' | 'slack' | 'json'} source - Data source
 * @property {string} [conversationId] - Conversation identifier
 * @property {string} [channelName] - Channel/thread name
 * @property {string} [workspaceId] - Workspace identifier (Slack)
 */

/**
 * @typedef {Object} TransformOptions
 * @property {boolean} [aggressiveNormalization] - Whether to perform aggressive text normalization
 * @property {Function} [customTokenizer] - Custom tokenizer function (text => tokens[])
 * @property {boolean} [preserveEmoji] - Whether to preserve emoji in tokens
 * @property {number} [minWordLength] - Minimum word length to include in tokens
 */

/**
 * Factory: Create a canonical message
 * @param {Object} params - Message parameters
 * @param {string} params.id - Message ID
 * @param {Date} params.timestamp - Timestamp
 * @param {string} params.sender - Sender name
 * @param {string} params.text - Message text
 * @param {'whatsapp' | 'gmail' | 'slack' | 'json'} params.source - Source type
 * @param {string} params.normalizedText - Normalized text
 * @param {string[]} params.tokens - Token array
 * @param {number} params.characterCount - Character count
 * @param {number} params.wordCount - Word count
 * @param {number} params.conversationPosition - Position in conversation
 * @param {Object} [options] - Optional fields
 * @returns {CanonicalMessage}
 */
export function createCanonicalMessage({
  id,
  timestamp,
  sender,
  text,
  source,
  normalizedText,
  tokens,
  characterCount,
  wordCount,
  conversationPosition,
  ...options
}) {
  return Object.freeze({
    // Core identity
    id,
    timestamp,
    sender,
    text,

    // Source metadata
    source,
    sourceMessageId: options.sourceMessageId,
    threadId: options.threadId,

    // Preprocessing
    normalizedText,
    tokens,
    characterCount,
    wordCount,

    // Contextual position
    conversationPosition,
    segmentId: options.segmentId,

    // Computed layers (populated progressively)
    lexical: options.lexical,
    behavioral: options.behavioral,
  });
}

/**
 * Factory: Create message metadata
 * @param {Object} params - Metadata parameters
 * @returns {MessageMetadata}
 */
export function createMessageMetadata({
  totalMessages,
  participants,
  startDate,
  endDate,
  source,
  conversationId,
  channelName,
  workspaceId,
}) {
  return {
    totalMessages,
    participants,
    startDate,
    endDate,
    source,
    conversationId,
    channelName,
    workspaceId,
  };
}

/**
 * Validator: Check if object is a valid CanonicalMessage
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isCanonicalMessage(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    obj.timestamp instanceof Date &&
    typeof obj.sender === 'string' &&
    typeof obj.text === 'string' &&
    ['whatsapp', 'gmail', 'slack', 'json'].includes(obj.source) &&
    typeof obj.normalizedText === 'string' &&
    Array.isArray(obj.tokens) &&
    typeof obj.characterCount === 'number' &&
    typeof obj.wordCount === 'number' &&
    typeof obj.conversationPosition === 'number'
  );
}

/**
 * Validator: Check if object is valid MessageMetadata
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export function isMessageMetadata(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.totalMessages === 'number' &&
    Array.isArray(obj.participants) &&
    obj.startDate instanceof Date &&
    obj.endDate instanceof Date &&
    ['whatsapp', 'gmail', 'slack', 'json'].includes(obj.source)
  );
}

/**
 * Helper: Get default transform options
 * @returns {TransformOptions}
 */
export function getDefaultTransformOptions() {
  return {
    aggressiveNormalization: false,
    customTokenizer: null,
    preserveEmoji: true,
    minWordLength: 2,
  };
}
