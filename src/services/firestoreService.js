/**
 * Firestore Service
 *
 * Provides CRUD operations for Slack-related data in Firestore
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { firestore } from './firebase';

/**
 * Creates or updates a user document
 *
 * @param {string} uid - Firebase user ID
 * @param {Object} userData - User data to save
 * @returns {Promise<void>}
 */
export async function createOrUpdateUser(uid, userData) {
  const userRef = doc(firestore, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    lastActivity: serverTimestamp()
  }, { merge: true });
}

/**
 * Gets a user document
 *
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export async function getUser(uid) {
  const userRef = doc(firestore, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }

  return null;
}

/**
 * Saves a Slack analysis to Firestore
 *
 * Note: This is a local save function. The actual save is done via
 * the slackSaveAnalysis Cloud Function from App.js for security.
 * This function is kept for reference and potential future use.
 *
 * @param {string} userId - Firebase user ID
 * @param {Object} analysisData - Analysis data to save
 * @returns {Promise<string>} Analysis document ID
 */
export async function saveSlackAnalysis(userId, analysisData) {
  const analysisRef = doc(collection(firestore, 'slackAnalyses'));

  const analysisDoc = {
    userId,
    workspaceId: analysisData.workspaceId,
    channelId: analysisData.channelId,
    channelName: analysisData.channelName || 'Unknown',
    channelType: analysisData.channelType || 'channel',
    messageCount: analysisData.messageCount || 0,
    analyzedAt: serverTimestamp(),
    data: analysisData
  };

  await setDoc(analysisRef, analysisDoc);

  return analysisRef.id;
}

/**
 * Gets a specific Slack analysis
 *
 * @param {string} analysisId - Analysis document ID
 * @returns {Promise<Object|null>} Analysis data or null if not found
 */
export async function getSlackAnalysis(analysisId) {
  const analysisRef = doc(firestore, 'slackAnalyses', analysisId);
  const analysisSnap = await getDoc(analysisRef);

  if (analysisSnap.exists()) {
    return { id: analysisSnap.id, ...analysisSnap.data() };
  }

  return null;
}

/**
 * Lists user's Slack analyses
 *
 * @param {string} userId - Firebase user ID
 * @param {string} workspaceId - Optional workspace ID to filter by
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @returns {Promise<Array>} Array of analysis documents
 */
export async function listUserSlackAnalyses(userId, workspaceId = null, maxResults = 50) {
  let q = query(
    collection(firestore, 'slackAnalyses'),
    where('userId', '==', userId),
    orderBy('analyzedAt', 'desc'),
    limit(maxResults)
  );

  // Add workspace filter if provided
  if (workspaceId) {
    q = query(
      collection(firestore, 'slackAnalyses'),
      where('userId', '==', userId),
      where('workspaceId', '==', workspaceId),
      orderBy('analyzedAt', 'desc'),
      limit(maxResults)
    );
  }

  const snapshot = await getDocs(q);
  const analyses = [];

  snapshot.forEach(doc => {
    analyses.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return analyses;
}

/**
 * Deletes a Slack analysis
 *
 * @param {string} analysisId - Analysis document ID
 * @returns {Promise<void>}
 */
export async function deleteSlackAnalysis(analysisId) {
  const analysisRef = doc(firestore, 'slackAnalyses', analysisId);
  await deleteDoc(analysisRef);
}

/**
 * Gets workspace document
 *
 * @param {string} workspaceId - Slack workspace ID
 * @returns {Promise<Object|null>} Workspace data or null if not found
 */
export async function getWorkspace(workspaceId) {
  const workspaceRef = doc(firestore, 'slackWorkspaces', workspaceId);
  const workspaceSnap = await getDoc(workspaceRef);

  if (workspaceSnap.exists()) {
    return { id: workspaceSnap.id, ...workspaceSnap.data() };
  }

  return null;
}

/**
 * Lists user's connected workspaces
 *
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Array>} Array of workspace documents
 */
export async function listUserWorkspaces(userId) {
  const q = query(
    collection(firestore, 'slackWorkspaces'),
    where('authorizedUsers', 'array-contains', userId)
  );

  const snapshot = await getDocs(q);
  const workspaces = [];

  snapshot.forEach(doc => {
    workspaces.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return workspaces;
}
