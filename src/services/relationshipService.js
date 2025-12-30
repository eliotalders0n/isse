/**
 * Relationship Service
 *
 * Manages Firebase Firestore operations for relationship tracking and incremental message appending
 */

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  orderBy,
  arrayUnion,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { firestore } from './firebase';
import { generateChatId } from './storageService';

/**
 * Hash function for message identity
 * Creates a deterministic hash from timestamp + sender + text (first 50 chars)
 */
function hashMessage(timestamp, sender, text) {
  const key = `${timestamp}_${sender}_${text.substring(0, 50)}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

/**
 * Remove undefined values from an object (Firestore doesn't allow undefined)
 * Recursively cleans nested objects and arrays
 */
function removeUndefined(obj) {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item)).filter(item => item !== undefined);
  }

  if (typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = removeUndefined(obj[key]);
        if (value !== undefined) {
          cleaned[key] = value;
        }
      }
    }
    return cleaned;
  }

  return obj;
}

/**
 * Create or retrieve a relationship
 *
 * @param {string} userId - Firebase Auth user ID
 * @param {string[]} participants - Array of participant names
 * @param {string} source - 'whatsapp' | 'gmail' | 'slack'
 * @returns {Promise<Object>} Relationship data with ID
 */
export async function createOrGetRelationship(userId, participants, source) {
  const sortedParticipants = [...participants].sort();
  const relationshipId = generateChatId(sortedParticipants);

  console.log(`🔍 Checking relationship: ${relationshipId}`);
  console.log(`   For user: ${userId}`);

  const docRef = doc(firestore, 'relationships', relationshipId);

  try {
    const docSnap = await getDoc(docRef);
    console.log(`   Document exists: ${docSnap.exists()}`);

    if (!docSnap.exists()) {
      // Create new relationship
      console.log(`📝 Creating new relationship document...`);
      console.log(`   userId: ${userId}`);
      console.log(`   participants: ${sortedParticipants.join(', ')}`);
      console.log(`   source: ${source}`);

      await setDoc(docRef, {
        userId,
        participants: sortedParticipants,
        source,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        lastMessageTimestamp: null,
        conversationCount: 0,
        aggregateMetrics: {},
        timelineEvents: []
      });

      console.log(`✅ Created new relationship: ${relationshipId}`);
      return { id: relationshipId, participants: sortedParticipants, conversationCount: 0 };
    }

    console.log(`✅ Found existing relationship: ${relationshipId}`);
    return { id: relationshipId, ...docSnap.data() };
  } catch (error) {
    console.error(`❌ Error in createOrGetRelationship:`, error);
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);
    throw error;
  }
}

/**
 * Detect new messages vs duplicates
 *
 * @param {string[]} existingHashes - Array of message hashes already in Firestore
 * @param {Object[]} newMessages - Array of message objects
 * @returns {Object[]} Filtered array of only new (non-duplicate) messages
 */
export function detectNewMessages(existingHashes, newMessages) {
  const newHashes = newMessages.map(msg =>
    hashMessage(msg.timestamp, msg.sender, msg.text)
  );

  return newMessages.filter((msg, idx) =>
    !existingHashes.includes(newHashes[idx])
  );
}

/**
 * Get all conversations for a relationship
 *
 * @param {string} relationshipId - Relationship ID
 * @returns {Promise<Object[]>} Array of conversation documents, sorted by uploadedAt desc
 */
export async function getConversationsForRelationship(relationshipId) {
  try {
    const conversationsRef = collection(firestore, `relationships/${relationshipId}/conversations`);
    const q = query(conversationsRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Append new messages to an existing conversation
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} conversationId - Conversation ID
 * @param {Object[]} newMessages - Array of new message objects
 * @returns {Promise<Object>} Result with appended count
 */
export async function appendMessages(relationshipId, conversationId, newMessages) {
  const conversationRef = doc(firestore, `relationships/${relationshipId}/conversations/${conversationId}`);
  const conversationSnap = await getDoc(conversationRef);

  if (!conversationSnap.exists()) {
    throw new Error('Conversation not found');
  }

  const existingData = conversationSnap.data();
  const existingHashes = existingData.messageHashes || [];

  // Filter to only truly new messages
  const uniqueNewMessages = detectNewMessages(existingHashes, newMessages);

  if (uniqueNewMessages.length === 0) {
    console.log('No new messages to append');
    return { appended: 0, message: 'No new messages found' };
  }

  // Generate hashes for new messages
  const newMessageHashes = uniqueNewMessages.map(msg =>
    hashMessage(msg.timestamp, msg.sender, msg.text)
  );

  // Update conversation (Note: Full recalculation of segments/evolution should be done in App.js after appending)
  await updateDoc(conversationRef, {
    messageCount: (existingData.messageCount || 0) + uniqueNewMessages.length,
    messageHashes: arrayUnion(...newMessageHashes),
    lastUpdated: serverTimestamp()
  });

  // Update relationship lastMessageTimestamp
  const lastMessage = uniqueNewMessages[uniqueNewMessages.length - 1];
  const relationshipRef = doc(firestore, 'relationships', relationshipId);
  await updateDoc(relationshipRef, {
    lastUpdated: serverTimestamp(),
    lastMessageTimestamp: lastMessage.timestamp instanceof Date
      ? lastMessage.timestamp.toISOString()
      : lastMessage.timestamp
  });

  console.log(`✅ Appended ${uniqueNewMessages.length} new messages to conversation ${conversationId}`);

  return {
    appended: uniqueNewMessages.length,
    newMessages: uniqueNewMessages
  };
}

/**
 * Create a new conversation
 *
 * @param {string} relationshipId - Relationship ID
 * @param {Object} conversationData - Full conversation data (messages, metadata, analytics, etc.)
 * @returns {Promise<string>} Conversation ID
 */
export async function createConversation(relationshipId, conversationData) {
  const conversationId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const conversationRef = doc(firestore, `relationships/${relationshipId}/conversations/${conversationId}`);

  // Generate message hashes for duplicate detection
  const messageHashes = conversationData.messages.map(msg =>
    hashMessage(msg.timestamp, msg.sender, msg.text)
  );

  // Prepare conversation document (remove undefined values - Firestore doesn't allow them)
  const conversationDoc = removeUndefined({
    uploadedAt: serverTimestamp(),
    source: conversationData.metadata?.source || 'unknown',
    messageCount: conversationData.messages.length,
    startDate: conversationData.metadata?.startDate || null,
    endDate: conversationData.metadata?.endDate || null,
    messageHashes,
    segments: conversationData.segments || [],
    evolution: conversationData.evolution || {},
    gamification: conversationData.gamification || {},
    sentiment: conversationData.sentiment || {},
    analytics: conversationData.analytics || {},
    metadata: conversationData.metadata || {}
  });

  await setDoc(conversationRef, conversationDoc);

  // Update relationship metadata
  const relationshipRef = doc(firestore, 'relationships', relationshipId);
  await updateDoc(relationshipRef, {
    conversationCount: increment(1),
    lastUpdated: serverTimestamp(),
    lastMessageTimestamp: conversationData.metadata?.endDate || new Date().toISOString()
  });

  console.log(`✅ Created new conversation: ${conversationId} with ${conversationData.messages.length} messages`);

  return conversationId;
}

/**
 * Load full relationship data from Firestore (including all conversations)
 *
 * @param {string} userId - Firebase Auth user ID (for security check)
 * @param {string} relationshipId - Relationship ID
 * @returns {Promise<Object|null>} Relationship data with conversations array
 */
export async function loadFromFirestore(userId, relationshipId) {
  try {
    const relationshipRef = doc(firestore, 'relationships', relationshipId);
    const relationshipSnap = await getDoc(relationshipRef);

    if (!relationshipSnap.exists()) {
      console.log(`Relationship not found: ${relationshipId}`);
      return null;
    }

    const relationshipData = relationshipSnap.data();

    // Security check: ensure relationship belongs to this user
    if (relationshipData.userId !== userId) {
      console.error('Security violation: User does not own this relationship');
      return null;
    }

    // Load all conversations for this relationship
    const conversations = await getConversationsForRelationship(relationshipId);

    return {
      id: relationshipId,
      ...relationshipData,
      conversations
    };
  } catch (error) {
    console.error('Error loading relationship from Firestore:', error);
    return null;
  }
}

/**
 * Check if a conversation already exists based on message timestamp range
 * Used to determine if we should append or create new conversation
 *
 * @param {string} relationshipId - Relationship ID
 * @param {Date} newEndDate - End date of new upload
 * @returns {Promise<Object|null>} Existing conversation if found, null otherwise
 */
export async function findConversationByDateRange(relationshipId, newEndDate) {
  try {
    const conversations = await getConversationsForRelationship(relationshipId);

    // Find conversation where new upload's endDate matches or is slightly after existing endDate
    // (Allowing for small discrepancies due to re-exports)
    const matchingConversation = conversations.find(conv => {
      if (!conv.endDate) return false;

      const existingEndDate = new Date(conv.endDate);
      const timeDiff = Math.abs(newEndDate - existingEndDate);

      // Match if within 7 days (re-export tolerance)
      return timeDiff < 7 * 24 * 60 * 60 * 1000;
    });

    return matchingConversation || null;
  } catch (error) {
    console.error('Error finding conversation by date range:', error);
    return null;
  }
}
