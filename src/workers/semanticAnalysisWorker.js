/**
 * Semantic Analysis Web Worker
 *
 * Offloads heavy semantic analysis to a background thread to keep UI responsive.
 * Processes Layers 2-5 of the semantic engine:
 * - Layer 2: Lexical analysis (intent detection)
 * - Layer 3: Behavioral profiling
 * - Layer 4: Conversation segmentation
 * - Layer 5: Intent evolution tracking
 */

/* eslint-disable no-restricted-globals */

import { analyzeLexicalBatch } from '../services/lexicalAnalyzer.js';
import { analyzeBehavioralBatch } from '../services/behavioralAnalyzer.js';
import { segmentConversation } from '../services/conversationSegmenter.js';
import { calculateIntentEvolution } from '../services/intentEvolutionEngine.js';

/**
 * Send progress update to main thread
 */
function sendProgress(progress, status) {
  self.postMessage({
    type: 'PROGRESS',
    progress, // 0-1
    status,
  });
}

/**
 * Send error to main thread
 */
function sendError(error) {
  self.postMessage({
    type: 'ERROR',
    error: error.message || 'Unknown error in semantic analysis',
  });
}

/**
 * Send completion result to main thread
 */
function sendComplete(result) {
  self.postMessage({
    type: 'COMPLETE',
    result,
  });
}

/**
 * Main message handler
 */
self.onmessage = async function (e) {
  const { type, data } = e.data;

  if (type === 'ANALYZE_SEMANTIC') {
    try {
      const { messages, chatId } = data;

      // Validate input
      if (!messages || messages.length === 0) {
        throw new Error('No messages provided for semantic analysis');
      }

      const startTime = Date.now();
      console.log(`[Worker] Processing ${messages.length} messages`);

      // Layer 2: Lexical Analysis (Intent Detection)
      sendProgress(0.1, 'Detecting communication intents...');
      console.log('[Worker] Starting Layer 2: Lexical analysis');
      const layer2Start = Date.now();

      const messagesWithLexical = analyzeLexicalBatch(messages, {
        includeMatchedKeywords: false, // Reduce memory usage
        includeToxicity: true,
      });

      console.log(`[Worker] Layer 2 complete in ${((Date.now() - layer2Start) / 1000).toFixed(1)}s`);
      sendProgress(0.4, 'Analyzing behavioral patterns...');

      // Layer 3: Behavioral Analysis
      console.log('[Worker] Starting Layer 3: Behavioral analysis');
      const layer3Start = Date.now();

      const messagesWithBehavioral = analyzeBehavioralBatch(messagesWithLexical, {
        totalMessages: messages.length,
        participants: [...new Set(messages.map(m => m.sender))],
      });

      console.log(`[Worker] Layer 3 complete in ${((Date.now() - layer3Start) / 1000).toFixed(1)}s`);
      sendProgress(0.7, 'Segmenting conversation phases...');

      // Layer 4: Conversation Segmentation
      console.log('[Worker] Starting Layer 4: Segmentation');
      const layer4Start = Date.now();

      const segments = segmentConversation(messagesWithBehavioral, {
        minSegmentSize: 5,
        intentShiftThreshold: 0.3,
      });

      console.log(`[Worker] Layer 4 complete in ${((Date.now() - layer4Start) / 1000).toFixed(1)}s`);
      sendProgress(0.85, 'Tracking intent evolution...');

      // Layer 5: Intent Evolution Timeline
      console.log('[Worker] Starting Layer 5: Intent evolution');
      const layer5Start = Date.now();
      let evolution = null;
      try {
        evolution = calculateIntentEvolution(segments, chatId);
        console.log(`[Worker] Layer 5 complete in ${((Date.now() - layer5Start) / 1000).toFixed(1)}s`);
      } catch (error) {
        console.warn('[Worker] Layer 5 skipped:', error.message);
      }

      sendProgress(0.95, 'Finalizing semantic analysis...');

      // Extract metadata from messages
      const senderStats = {};
      const participants = [...new Set(messages.map(m => m.sender))];

      participants.forEach(sender => {
        const senderMessages = messagesWithBehavioral.filter(m => m.sender === sender);

        // Calculate average message length
        const totalLength = senderMessages.reduce((sum, m) => sum + (m.text?.length || 0), 0);
        const avgLength = senderMessages.length > 0 ? totalLength / senderMessages.length : 0;

        // Collect response times
        const responseTimes = senderMessages
          .filter(m => m.behavioral?.responseDynamics?.latency)
          .map(m => m.behavioral.responseDynamics.latency);

        senderStats[sender] = {
          messageCount: senderMessages.length, // Changed from totalMessages
          avgLength: avgLength, // Added for formatSemanticSenderStats
          responseTimes: responseTimes, // Changed from avgResponseTime
          messageRate: senderMessages.length / messages.length,
        };
      });

      // Extract cultural context from lexical analysis
      const culturalContext = messagesWithLexical[0]?.lexical?.culturalContext || 'international';

      // Build result
      const result = {
        messages: messagesWithBehavioral,
        segments,
        evolution,
        metadata: {
          culturalContext,
          senderStats,
          conversationMetadata: {
            totalMessages: messages.length,
            participants,
            startDate: messages[0]?.date,
            endDate: messages[messages.length - 1]?.date,
          },
        },
      };

      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Worker] ✅ All layers complete in ${totalTime}s`);
      console.log(`[Worker] Sender stats:`, Object.keys(senderStats).map(sender =>
        `${sender}: ${senderStats[sender].messageCount} messages`
      ).join(', '));
      sendProgress(1.0, 'Semantic analysis complete');

      sendComplete(result);
    } catch (error) {
      console.error('[Worker] Semantic analysis error:', error);
      sendError(error);
    }
  }
};

// Handle worker errors
self.onerror = function (error) {
  console.error('[Worker] Uncaught error:', error);
  sendError(error);
};
