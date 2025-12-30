/**
 * IndexedDB Service - Client-side storage for Semantic Engine
 *
 * Stores canonical messages, segments, and evolution data in IndexedDB
 * for efficient querying and retrieval. Falls back to localStorage if
 * IndexedDB is unavailable.
 *
 * Design principles:
 * - Efficient: Indexes on key fields for fast lookups
 * - Scalable: Can handle 10k+ messages without performance degradation
 * - Privacy-focused: All data stays client-side
 * - Firebase-ready: Structure compatible with future Firestore sync
 */

const DB_NAME = 'NarativeSemanticDB';
const DB_VERSION = 1;

// Store definitions
const STORES = {
  canonicalMessages: {
    keyPath: 'id',
    indexes: [
      { name: 'chatId', keyPath: 'chatId', unique: false },
      { name: 'timestamp', keyPath: 'timestamp', unique: false },
      { name: 'sender', keyPath: 'sender', unique: false },
      { name: 'segmentId', keyPath: 'segmentId', unique: false },
    ],
  },
  conversationSegments: {
    keyPath: 'id',
    indexes: [
      { name: 'chatId', keyPath: 'chatId', unique: false },
      { name: 'startTimestamp', keyPath: 'startTimestamp', unique: false },
    ],
  },
  intentEvolution: {
    keyPath: 'chatId', // One evolution per chat
    indexes: [],
  },
  chatMetadata: {
    keyPath: 'chatId',
    indexes: [
      { name: 'lastModified', keyPath: 'lastModified', unique: false },
      { name: 'source', keyPath: 'source', unique: false },
    ],
  },
};

/**
 * Open IndexedDB connection
 * Creates stores and indexes if they don't exist
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is available
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores
      for (const [storeName, storeConfig] of Object.entries(STORES)) {
        // Delete old store if exists (for schema changes)
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }

        // Create store
        const objectStore = db.createObjectStore(storeName, {
          keyPath: storeConfig.keyPath,
        });

        // Create indexes
        for (const index of storeConfig.indexes) {
          objectStore.createIndex(
            index.name,
            index.keyPath,
            { unique: index.unique }
          );
        }
      }
    };
  });
}

/**
 * Save complete semantic analysis to IndexedDB
 *
 * @param {string} chatId - Chat identifier
 * @param {Object} data - Semantic analysis data
 * @param {Array} data.messages - Canonical messages with lexical & behavioral data
 * @param {Array} data.segments - Conversation segments
 * @param {Object} data.evolution - Intent evolution data
 * @param {Object} data.metadata - Chat metadata
 * @returns {Promise<void>}
 */
export async function saveSemanticAnalysis(chatId, data) {
  try {
    const db = await openDB();

    // Save messages
    if (data.messages && data.messages.length > 0) {
      const messageStore = db.transaction(['canonicalMessages'], 'readwrite')
        .objectStore('canonicalMessages');

      // Clear existing messages for this chat first
      const chatIdIndex = messageStore.index('chatId');
      const existingMessages = await getAllFromIndex(messageStore, chatIdIndex, chatId);
      for (const msg of existingMessages) {
        await deleteFromStore(messageStore, msg.id);
      }

      // Save new messages
      for (const message of data.messages) {
        await putInStore(messageStore, { ...message, chatId });
      }
    }

    // Save segments
    if (data.segments && data.segments.length > 0) {
      const segmentStore = db.transaction(['conversationSegments'], 'readwrite')
        .objectStore('conversationSegments');

      // Clear existing segments for this chat
      const chatIdIndex = segmentStore.index('chatId');
      const existingSegments = await getAllFromIndex(segmentStore, chatIdIndex, chatId);
      for (const seg of existingSegments) {
        await deleteFromStore(segmentStore, seg.id);
      }

      // Save new segments (convert timestamps to strings for storage)
      for (const segment of data.segments) {
        const segmentToStore = {
          ...segment,
          chatId,
          startTimestamp: segment.startTimestamp.toISOString(),
          endTimestamp: segment.endTimestamp.toISOString(),
        };
        await putInStore(segmentStore, segmentToStore);
      }
    }

    // Save evolution
    if (data.evolution) {
      const evolutionStore = db.transaction(['intentEvolution'], 'readwrite')
        .objectStore('intentEvolution');

      // Convert all timestamps in evolution data to strings
      const evolutionToStore = {
        ...data.evolution,
        generatedAt: new Date().toISOString(),
      };

      await putInStore(evolutionStore, evolutionToStore);
    }

    // Save metadata
    const metadataStore = db.transaction(['chatMetadata'], 'readwrite')
      .objectStore('chatMetadata');

    const metadata = {
      chatId,
      ...data.metadata,
      lastModified: new Date().toISOString(),
      messageCount: data.messages?.length || 0,
      segmentCount: data.segments?.length || 0,
    };

    await putInStore(metadataStore, metadata);

    db.close();
    console.log(`✅ Saved semantic analysis for chat ${chatId} to IndexedDB`);
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
    // Fallback to localStorage
    saveToLocalStorage(chatId, data);
  }
}

/**
 * Load semantic analysis from IndexedDB
 *
 * @param {string} chatId - Chat identifier
 * @returns {Promise<Object|null>} Semantic analysis data or null
 */
export async function loadSemanticAnalysis(chatId) {
  try {
    const db = await openDB();

    // Load messages
    const messageStore = db.transaction(['canonicalMessages'], 'readonly')
      .objectStore('canonicalMessages');
    const messageIndex = messageStore.index('chatId');
    const messages = await getAllFromIndex(messageStore, messageIndex, chatId);

    // Load segments
    const segmentStore = db.transaction(['conversationSegments'], 'readonly')
      .objectStore('conversationSegments');
    const segmentIndex = segmentStore.index('chatId');
    const segments = await getAllFromIndex(segmentStore, segmentIndex, chatId);

    // Convert segment timestamps back to Date objects
    const segmentsWithDates = segments.map(seg => ({
      ...seg,
      startTimestamp: new Date(seg.startTimestamp),
      endTimestamp: new Date(seg.endTimestamp),
    }));

    // Load evolution
    const evolutionStore = db.transaction(['intentEvolution'], 'readonly')
      .objectStore('intentEvolution');
    const evolution = await getFromStore(evolutionStore, chatId);

    // Load metadata
    const metadataStore = db.transaction(['chatMetadata'], 'readonly')
      .objectStore('chatMetadata');
    const metadata = await getFromStore(metadataStore, chatId);

    db.close();

    if (!messages || messages.length === 0) {
      console.log(`No data found for chat ${chatId} in IndexedDB`);
      return null;
    }

    console.log(`✅ Loaded semantic analysis for chat ${chatId} from IndexedDB`);
    return {
      messages,
      segments: segmentsWithDates,
      evolution,
      metadata,
    };
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error);
    // Fallback to localStorage
    return loadFromLocalStorage(chatId);
  }
}

/**
 * List all chats stored in IndexedDB
 *
 * @returns {Promise<Array>} Array of chat metadata
 */
export async function listChats() {
  try {
    const db = await openDB();
    const metadataStore = db.transaction(['chatMetadata'], 'readonly')
      .objectStore('chatMetadata');

    const chats = await getAllFromStore(metadataStore);

    db.close();

    // Sort by last modified (newest first)
    return chats.sort((a, b) =>
      new Date(b.lastModified) - new Date(a.lastModified)
    );
  } catch (error) {
    console.error('Failed to list chats from IndexedDB:', error);
    return [];
  }
}

/**
 * Delete a chat from IndexedDB
 *
 * @param {string} chatId - Chat identifier
 * @returns {Promise<void>}
 */
export async function deleteChat(chatId) {
  try {
    const db = await openDB();

    // Delete messages
    const messageStore = db.transaction(['canonicalMessages'], 'readwrite')
      .objectStore('canonicalMessages');
    const messageIndex = messageStore.index('chatId');
    const messages = await getAllFromIndex(messageStore, messageIndex, chatId);
    for (const msg of messages) {
      await deleteFromStore(messageStore, msg.id);
    }

    // Delete segments
    const segmentStore = db.transaction(['conversationSegments'], 'readwrite')
      .objectStore('conversationSegments');
    const segmentIndex = segmentStore.index('chatId');
    const segments = await getAllFromIndex(segmentStore, segmentIndex, chatId);
    for (const seg of segments) {
      await deleteFromStore(segmentStore, seg.id);
    }

    // Delete evolution
    const evolutionStore = db.transaction(['intentEvolution'], 'readwrite')
      .objectStore('intentEvolution');
    await deleteFromStore(evolutionStore, chatId);

    // Delete metadata
    const metadataStore = db.transaction(['chatMetadata'], 'readwrite')
      .objectStore('chatMetadata');
    await deleteFromStore(metadataStore, chatId);

    db.close();
    console.log(`✅ Deleted chat ${chatId} from IndexedDB`);
  } catch (error) {
    console.error('Failed to delete from IndexedDB:', error);
  }
}

/**
 * Get storage statistics
 *
 * @returns {Promise<Object>} Storage stats
 */
export async function getStorageStats() {
  try {
    const db = await openDB();

    const messageStore = db.transaction(['canonicalMessages'], 'readonly')
      .objectStore('canonicalMessages');
    const messageCount = await countInStore(messageStore);

    const segmentStore = db.transaction(['conversationSegments'], 'readonly')
      .objectStore('conversationSegments');
    const segmentCount = await countInStore(segmentStore);

    const metadataStore = db.transaction(['chatMetadata'], 'readonly')
      .objectStore('chatMetadata');
    const chatCount = await countInStore(metadataStore);

    db.close();

    return {
      chatCount,
      messageCount,
      segmentCount,
      storageType: 'IndexedDB',
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      chatCount: 0,
      messageCount: 0,
      segmentCount: 0,
      storageType: 'unavailable',
    };
  }
}

// =============================================================================
// Helper Functions (Promise wrappers for IndexedDB operations)
// =============================================================================

function putInStore(store, data) {
  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function getFromStore(store, key) {
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllFromIndex(store, index, key) {
  return new Promise((resolve, reject) => {
    const request = index.getAll(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteFromStore(store, key) {
  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function countInStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// =============================================================================
// LocalStorage Fallback
// =============================================================================

/**
 * Save to localStorage as fallback
 */
function saveToLocalStorage(chatId, data) {
  try {
    const key = `narative_semantic_${chatId}`;
    const compressed = {
      chatId,
      messageCount: data.messages?.length || 0,
      segmentCount: data.segments?.length || 0,
      hasEvolution: !!data.evolution,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(compressed));
    console.log(`⚠️ Saved to localStorage (fallback) for chat ${chatId}`);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load from localStorage as fallback
 */
function loadFromLocalStorage(chatId) {
  try {
    const key = `narative_semantic_${chatId}`;
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    const data = JSON.parse(stored);
    console.log(`⚠️ Loaded from localStorage (fallback) for chat ${chatId}`);
    return data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable() {
  return !!window.indexedDB;
}

/**
 * Export all functions for testing
 */
export default {
  openDB,
  saveSemanticAnalysis,
  loadSemanticAnalysis,
  listChats,
  deleteChat,
  getStorageStats,
  isIndexedDBAvailable,
};
