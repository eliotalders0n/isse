/**
 * Storage Service
 * LocalStorage management (Firebase sync disabled)
 * Handles user profiles, chat data, duo sessions, and challenges
 */

import { v4 as uuidv4 } from 'uuid';

// Firebase sync disabled - all data stored in localStorage only
// import {
//   createOrGetRelationship,
//   createConversation,
//   findConversationByDateRange,
//   appendMessages,
//   loadFromFirestore as loadRelationshipFromFirestore
// } from './relationshipService';

// Storage keys prefix
const STORAGE_PREFIX = 'isse_';
const USER_PROFILE_KEY = `${STORAGE_PREFIX}user_profile`;
const CHAT_PREFIX = `${STORAGE_PREFIX}chat_`;
const DUO_PREFIX = `${STORAGE_PREFIX}duo_`;
const CHALLENGES_KEY = `${STORAGE_PREFIX}challenges`;

// Current storage version for migrations
const STORAGE_VERSION = 1;

// Maximum storage size warning threshold (4MB out of 5MB limit)
const MAX_STORAGE_SIZE = 4 * 1024 * 1024;

/**
 * Generate a unique chat ID from participants
 */
export const generateChatId = (participants) => {
  if (!participants || participants.length === 0) {
    return uuidv4();
  }

  // Sort participants alphabetically for consistency
  const sortedParticipants = [...participants].sort();

  // Create a simple hash from participants
  const participantString = sortedParticipants.join('_').toLowerCase();
  let hash = 0;

  for (let i = 0; i < participantString.length; i++) {
    const char = participantString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `chat_${Math.abs(hash).toString(36)}`;
};

/**
 * Check storage size and warn if approaching limit
 */
const checkStorageSize = () => {
  try {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    if (totalSize > MAX_STORAGE_SIZE) {
      console.warn(`Storage approaching limit: ${(totalSize / 1024 / 1024).toFixed(2)}MB / 5MB`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking storage size:', error);
    return true;
  }
};

/**
 * Safe JSON parse with error handling
 */
const safeJSONParse = (jsonString, defaultValue = null) => {
  try {
    return jsonString ? JSON.parse(jsonString) : defaultValue;
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
};

/**
 * Safe JSON stringify with error handling
 */
const safeJSONStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return null;
  }
};

/**
 * Initialize or load user profile
 */
export const initializeUserProfile = () => {
  try {
    const existingProfile = localStorage.getItem(USER_PROFILE_KEY);

    if (existingProfile) {
      const profile = safeJSONParse(existingProfile);
      // Update last active timestamp
      profile.lastActive = new Date().toISOString();
      localStorage.setItem(USER_PROFILE_KEY, safeJSONStringify(profile));
      return profile;
    }

    // Create new profile
    const newProfile = {
      version: STORAGE_VERSION,
      userId: uuidv4(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      stats: {
        totalChatsAnalyzed: 0,
        totalBadgesEarned: 0,
        wrappedGenerated: 0
      },
      preferences: {
        shareTemplate: 'vibrant',
        privacyMode: false
      }
    };

    localStorage.setItem(USER_PROFILE_KEY, safeJSONStringify(newProfile));
    return newProfile;
  } catch (error) {
    console.error('Error initializing user profile:', error);
    return null;
  }
};

/**
 * Load user profile
 */
export const loadUserProfile = () => {
  try {
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    return safeJSONParse(profile, null);
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

/**
 * Update user profile stats
 */
export const updateUserProfileStats = (badges = []) => {
  try {
    const profile = loadUserProfile() || initializeUserProfile();

    profile.stats.totalChatsAnalyzed = (profile.stats.totalChatsAnalyzed || 0) + 1;
    profile.stats.totalBadgesEarned = Math.max(
      profile.stats.totalBadgesEarned || 0,
      badges.length
    );
    profile.lastActive = new Date().toISOString();

    localStorage.setItem(USER_PROFILE_KEY, safeJSONStringify(profile));
    return profile;
  } catch (error) {
    console.error('Error updating user profile stats:', error);
    return null;
  }
};

/**
 * Save gamification data for a chat
 */
export const saveGamificationData = (chatId, data) => {
  try {
    checkStorageSize();

    const chatData = {
      version: STORAGE_VERSION,
      chatId,
      participants: data.participants || [],
      userGender: data.userGender || null,
      partnerGender: data.partnerGender || null,
      lastAnalyzed: data.lastAnalyzed || new Date().toISOString(),
      gamification: data.gamification || {},
      metadata: data.metadata || {}
    };

    const key = `${CHAT_PREFIX}${chatId}`;
    localStorage.setItem(key, safeJSONStringify(chatData));

    return chatData;
  } catch (error) {
    console.error('Error saving gamification data:', error);
    return null;
  }
};

/**
 * Load gamification data for a chat
 */
export const loadGamificationData = (chatId) => {
  try {
    const key = `${CHAT_PREFIX}${chatId}`;
    const data = localStorage.getItem(key);
    return safeJSONParse(data, null);
  } catch (error) {
    console.error('Error loading gamification data:', error);
    return null;
  }
};

/**
 * Get all saved chats
 */
export const getAllSavedChats = () => {
  try {
    const chats = [];
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(CHAT_PREFIX)) {
        const chatData = safeJSONParse(localStorage[key]);
        if (chatData) {
          chats.push(chatData);
        }
      }
    }

    // Sort by last analyzed date (most recent first)
    chats.sort((a, b) => new Date(b.lastAnalyzed) - new Date(a.lastAnalyzed));

    return chats;
  } catch (error) {
    console.error('Error getting all saved chats:', error);
    return [];
  }
};

/**
 * Delete a chat
 */
export const deleteChat = (chatId) => {
  try {
    const key = `${CHAT_PREFIX}${chatId}`;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
};

/**
 * Create a duo mode session
 */
export const createDuoSession = (chatData, gamificationData) => {
  try {
    checkStorageSize();

    const sessionId = generateSessionCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const session = {
      version: STORAGE_VERSION,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'pending', // pending, active, completed
      creator: {
        userId: loadUserProfile()?.userId,
        chatData,
        gamificationData,
        uploadedAt: new Date().toISOString()
      },
      partner: null,
      comparison: null
    };

    const key = `${DUO_PREFIX}${sessionId}`;
    localStorage.setItem(key, safeJSONStringify(session));

    return session;
  } catch (error) {
    console.error('Error creating duo session:', error);
    return null;
  }
};

/**
 * Load duo session
 */
export const loadDuoSession = (sessionId) => {
  try {
    const key = `${DUO_PREFIX}${sessionId}`;
    const session = localStorage.getItem(key);
    const parsedSession = safeJSONParse(session, null);

    if (!parsedSession) return null;

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(parsedSession.expiresAt);

    if (now > expiresAt) {
      // Session expired, delete it
      localStorage.removeItem(key);
      return null;
    }

    return parsedSession;
  } catch (error) {
    console.error('Error loading duo session:', error);
    return null;
  }
};

/**
 * Join a duo session as partner
 */
export const joinDuoSession = (sessionId, chatData, gamificationData) => {
  try {
    const session = loadDuoSession(sessionId);

    if (!session || session.status !== 'pending') {
      return null;
    }

    session.partner = {
      userId: loadUserProfile()?.userId,
      chatData,
      gamificationData,
      uploadedAt: new Date().toISOString()
    };

    session.status = 'active';

    const key = `${DUO_PREFIX}${sessionId}`;
    localStorage.setItem(key, safeJSONStringify(session));

    return session;
  } catch (error) {
    console.error('Error joining duo session:', error);
    return null;
  }
};

/**
 * Update duo session with comparison data
 */
export const updateDuoComparison = (sessionId, comparisonData) => {
  try {
    const session = loadDuoSession(sessionId);

    if (!session) return null;

    session.comparison = comparisonData;
    session.status = 'completed';

    const key = `${DUO_PREFIX}${sessionId}`;
    localStorage.setItem(key, safeJSONStringify(session));

    return session;
  } catch (error) {
    console.error('Error updating duo comparison:', error);
    return null;
  }
};

/**
 * Generate a 6-character session code
 */
const generateSessionCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Cleanup expired duo sessions
 */
export const cleanupExpiredDuoSessions = () => {
  try {
    const now = new Date();
    let cleanedCount = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(DUO_PREFIX)) {
        const session = safeJSONParse(localStorage[key]);
        if (session) {
          const expiresAt = new Date(session.expiresAt);
          if (now > expiresAt) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      }
    }

    return cleanedCount;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
};

/**
 * Save challenge progress
 */
export const saveChallengeProgress = (challengeData) => {
  try {
    const existing = loadChallengeProgress();

    const updated = {
      version: STORAGE_VERSION,
      active: challengeData.active || existing?.active || null,
      completed: [...(existing?.completed || []), ...(challengeData.completed || [])],
      streak: challengeData.streak || existing?.streak || 0
    };

    localStorage.setItem(CHALLENGES_KEY, safeJSONStringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving challenge progress:', error);
    return null;
  }
};

/**
 * Load challenge progress
 */
export const loadChallengeProgress = () => {
  try {
    const data = localStorage.getItem(CHALLENGES_KEY);
    return safeJSONParse(data, null);
  } catch (error) {
    console.error('Error loading challenge progress:', error);
    return null;
  }
};

/**
 * Clear all Isse data from localStorage
 */
export const clearAllData = () => {
  try {
    const keysToRemove = [];
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  try {
    let totalSize = 0;
    let chatCount = 0;
    let duoSessionCount = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
        totalSize += localStorage[key].length + key.length;

        if (key.startsWith(CHAT_PREFIX)) chatCount++;
        if (key.startsWith(DUO_PREFIX)) duoSessionCount++;
      }
    }

    return {
      totalSizeBytes: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      chatCount,
      duoSessionCount,
      percentageFull: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1)
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

/**
 * Export data for Firebase migration (future feature)
 */
export const exportToFirebase = () => {
  // Placeholder for future Firebase integration
  console.log('Firebase export not yet implemented');
  return {
    userProfile: loadUserProfile(),
    chats: getAllSavedChats(),
    challenges: loadChallengeProgress()
  };
};

// Firebase sync disabled - All data stored in localStorage only
// The following functions are commented out to prevent Firebase initialization errors

/**
 * Sync chat data to Firestore (DISABLED)
 *
 * Firebase sync has been disabled. All data is now stored exclusively in localStorage.
 * To re-enable:
 * 1. Uncomment the relationshipService imports at the top of this file
 * 2. Uncomment the syncToFirestore function below
 * 3. Add valid Firebase configuration to src/services/firebase.js
 */

// export async function syncToFirestore(userId, chatData) { ... }
// export const loadFromFirestore = loadRelationshipFromFirestore;
