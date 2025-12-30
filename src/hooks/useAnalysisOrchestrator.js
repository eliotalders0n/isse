import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { parseWhatsAppChat, parseJSONChat, parseGmailPDF, getMessagesPerDay } from '../utils/whatsappParser';
import {
  findConversationStreaks,
  findSilencePeriods,
  detectPeakHours,
  calculateEngagementScore,
} from '../utils/analytics';
import {
  calculateSemanticWordFrequency,
  calculateSemanticWordFrequencyPerSender,
  formatSemanticSenderStats,
} from '../services/semanticWordAnalyzer';
import {
  calculateRelationshipLevel,
  calculateCompatibilityScore,
  generateBadges,
  detectMilestones,
  calculateWeeklyHealthScores,
  calculateStreakData,
} from '../utils/gamification';
import {
  generateChatId,
  saveGamificationData,
  loadGamificationData,
  updateUserProfileStats,
} from '../services/storageService';
import {
  createSentimentTimelineFromIntents,
  createSentimentFromIntents,
  generateCoachNotesFromSemantics,
} from '../services/sentimentCompatibility';

/**
 * Align sentiment values with gamification scores for consistency
 * Ensures Overall Mood and Communication Health reflect relationship quality
 */
const alignSentimentWithGamification = (sentiment, gamification) => {
  const relationshipLevel = gamification.relationshipLevel?.level || 1;
  const compatibilityScore = gamification.compatibilityScore?.score || 50;

  // Calculate adjusted health score based on gamification
  // Weight: 60% compatibility, 40% relationship level (normalized to 0-100)
  const gamificationHealth = (compatibilityScore * 0.6) + ((relationshipLevel / 10) * 100 * 0.4);

  // Determine communication health based on combined metrics
  let communicationHealth = sentiment.communicationHealth;
  if (gamificationHealth >= 80) {
    communicationHealth = 'excellent';
  } else if (gamificationHealth >= 65) {
    communicationHealth = 'healthy';
  } else if (gamificationHealth >= 45) {
    communicationHealth = 'moderate';
  } else if (gamificationHealth >= 30) {
    communicationHealth = 'needs attention';
  } else {
    communicationHealth = 'critical';
  }

  // Determine overall sentiment based on compatibility and positive percentage
  // High compatibility (>=70) should reflect in positive sentiment
  let overallSentiment = sentiment.overallSentiment;
  const positivePercent = sentiment.positivePercent || 0;

  if (compatibilityScore >= 85 && positivePercent >= 50) {
    overallSentiment = 'excellent';
  } else if (compatibilityScore >= 70 && positivePercent >= 45) {
    overallSentiment = 'positive';
  } else if (compatibilityScore >= 55 || positivePercent >= 40) {
    overallSentiment = 'moderate';
  } else if (compatibilityScore >= 40 || positivePercent >= 30) {
    overallSentiment = 'concerning';
  } else {
    overallSentiment = 'critical';
  }

  return {
    ...sentiment,
    overallSentiment,
    communicationHealth,
    healthScore: Math.round(gamificationHealth),
    // Store original values for reference
    _original: {
      overallSentiment: sentiment.overallSentiment,
      communicationHealth: sentiment.communicationHealth,
      healthScore: sentiment.healthScore
    },
    // Store gamification alignment info
    _alignment: {
      relationshipLevel,
      compatibilityScore,
      gamificationHealth: Math.round(gamificationHealth)
    }
  };
};

/**
 * useAnalysisOrchestrator Hook
 *
 * Orchestrates the entire chat analysis pipeline from file upload to dashboard display.
 * Handles:
 * - File parsing (WhatsApp/Gmail/JSON/PDF)
 * - Semantic analysis (Layers 1-6)
 * - Gamification calculations
 * - localStorage persistence
 *
 * @param {Object} user - Authenticated user object (or null) - currently unused
 * @returns {Object} - Analysis state and handlers
 */
export const useAnalysisOrchestrator = (user) => {
  const [chatData, setChatData] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isParticipant, setIsParticipant] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const toast = useToast();

  /**
   * Handle file upload and quick parsing
   */
  const handleFileProcessed = async (fileContent, fileType = 'text') => {
    setIsProcessing(true);

    try {
      // Use appropriate parser based on file type
      let parsed;
      if (fileType === 'json') {
        parsed = parseJSONChat(fileContent);
      } else if (fileType === 'pdf') {
        parsed = parseGmailPDF(fileContent);
      } else {
        parsed = parseWhatsAppChat(fileContent);
      }

      const { messages, metadata } = parsed;

      if (messages.length === 0) {
        throw new Error('No messages found in the file');
      }

      // Store parsed data and show participation prompt
      setParsedData({ messages, metadata, fileType });
      setIsProcessing(false);
    } catch (error) {
      console.error('Error parsing chat:', error);
      setIsProcessing(false);

      toast({
        title: '❌ Error reading file',
        description: error.message || 'Failed to parse your chat. Please check the file format.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          bg: 'black',
          color: 'white',
        },
        style: {
          bg: 'black',
          color: 'white',
        },
      });
    }
  };

  /**
   * Run full semantic analysis pipeline (Layers 1-6)
   */
  const runFullAnalysis = async (userIsParticipant = false) => {
    if (!parsedData) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setIsParticipant(userIsParticipant);

    const { messages, metadata } = parsedData;

    try {
      // Validate messages array
      if (!messages || messages.length === 0) {
        throw new Error('No messages to analyze');
      }

      // Ensure all messages have valid timestamps
      const baseDate = new Date();
      const messagesWithTimestamps = messages.map((msg, index) => {
        if (!msg.timestamp || (msg.timestamp instanceof Date && isNaN(msg.timestamp.getTime()))) {
          console.warn('Message missing or has invalid timestamp, using fallback:', msg);
          return {
            ...msg,
            timestamp: new Date(baseDate.getTime() - (messages.length - index) * 60000)
          };
        }
        return msg;
      });

      setProcessingProgress(10);

      // Step 2: Calculating basic non-semantic analytics
      setProcessingStep('Analyzing conversation patterns...');
      setProcessingProgress(30);

      const messagesPerDay = getMessagesPerDay(messagesWithTimestamps);
      const streaks = findConversationStreaks(messagesWithTimestamps);
      const silences = findSilencePeriods(messagesWithTimestamps, 3);
      const peakHours = detectPeakHours(messagesWithTimestamps);
      const engagementScore = calculateEngagementScore(messagesWithTimestamps, 'week');

      const totalDays = Math.ceil(
        (messagesWithTimestamps[messagesWithTimestamps.length - 1].timestamp - messagesWithTimestamps[0].timestamp) / (1000 * 60 * 60 * 24)
      );
      const avgMessagesPerDay = Math.round(messagesWithTimestamps.length / totalDays);

      setProcessingProgress(45);

      // Step 3: Semantic Analysis (Layers 1-3)
      setProcessingStep('Running semantic analysis...');
      setProcessingProgress(50);

      console.log('🧠 NEW: Running deterministic semantic analysis (Layers 1-3)...');
      console.log('  → Layer 1: Transforming to canonical messages');
      console.log('  → Layer 2: Intent detection (alignment, resistance, urgency, delegation, closure, uncertainty)');
      console.log('  → Layer 3: Behavioral profiling (response times, turn-taking, bursts, silences)');

      // Import semantic engine services
      const { transformToCanonical } = await import('../services/canonicalTransformer.js');

      // Layer 1: Transform to canonical format
      const canonicalMessages = transformToCanonical(messagesWithTimestamps, metadata);

      console.log(`✅ Transformed ${canonicalMessages.length} messages to canonical format`);

      // Calculate semantic word frequency from canonical tokens
      console.log('📊 Calculating semantic word frequency from canonical tokens...');
      const wordFrequency = calculateSemanticWordFrequency(canonicalMessages, 30);
      const wordFrequencyPerSender = calculateSemanticWordFrequencyPerSender(canonicalMessages, 15);
      console.log(`✅ Analyzed ${wordFrequency.length} unique words across all senders`);

      // Layers 2-3: Offload to Web Worker for parallel processing
      console.log(`⏱️ Starting worker analysis for ${canonicalMessages.length} messages (timeout: 3 minutes)`);
      const worker = new Worker(new URL('../workers/semanticAnalysisWorker.js', import.meta.url));

      const semanticResult = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error('❌ Worker timeout - analysis took longer than 3 minutes');
          worker.terminate();
          reject(new Error('Semantic analysis timeout after 3 minutes. Try with a smaller chat file.'));
        }, 180000); // Increased from 60s to 180s (3 minutes)

        worker.onmessage = (e) => {
          const { type, progress, status, result, error } = e.data;

          if (type === 'PROGRESS') {
            setProcessingProgress(50 + (progress * 25));
            setProcessingStep(status);
          } else if (type === 'COMPLETE') {
            clearTimeout(timeout);
            worker.terminate();
            resolve(result);
          } else if (type === 'ERROR') {
            clearTimeout(timeout);
            worker.terminate();
            reject(new Error(error));
          }
        };

        worker.onerror = (error) => {
          clearTimeout(timeout);
          worker.terminate();
          reject(error);
        };

        // Start semantic analysis
        const participants = metadata.participants || [];
        const sortedParticipants = [...participants].sort();
        const chatId = sortedParticipants.join('_').replace(/[^a-zA-Z0-9_]/g, '');

        worker.postMessage({
          type: 'ANALYZE_SEMANTIC',
          data: {
            messages: canonicalMessages,
            chatId,
          },
        });
      });

      const messagesWithSemantics = semanticResult.messages;
      const segments = semanticResult.segments || [];
      const evolution = semanticResult.evolution || null;

      console.log(`✅ Semantic analysis complete:`);
      console.log(`  → Cultural context: ${semanticResult.metadata.culturalContext || 'international'}`);
      console.log(`  → Participants: ${Object.keys(semanticResult.metadata.senderStats).join(', ')}`);
      console.log(`  → Segments: ${segments.length} conversation segments detected`);
      console.log(`  → Evolution: ${evolution ? `${evolution.escalationPoints.length} escalations, ${evolution.alignmentBreakthroughs.length} breakthroughs` : 'N/A'}`);

      // Format semantic sender stats for dashboard tabs
      console.log('📊 Formatting semantic sender stats for dashboard...');
      const { senderStats, responseTimes } = formatSemanticSenderStats(semanticResult.metadata.senderStats);
      console.log(`✅ Formatted stats for ${Object.keys(senderStats).length} participants`);
      console.log(`   Sender stats:`, Object.keys(senderStats).map(sender =>
        `${sender}: ${senderStats[sender].messageCount} messages`
      ).join(', '));

      // Create sentiment-compatible timeline
      const sentimentTimeline = createSentimentTimelineFromIntents(messagesWithSemantics);

      // Add backward-compatible sentiment structure
      const messagesWithSentiment = messagesWithSemantics.map(msg => {
        let primaryEmotion = 'neutral';
        let primaryPattern = 'informational';

        if (msg.lexical && msg.lexical.intents) {
          const intents = msg.lexical.intents;

          if (intents.dominantIntent) {
            const intentEmotionMap = {
              alignment: 'joy',
              closure: 'gratitude',
              resistance: 'anger',
              urgency: 'anxiety',
              uncertainty: 'sadness',
              delegation: 'neutral',
            };
            primaryEmotion = intentEmotionMap[intents.dominantIntent] || 'neutral';
          }

          if (msg.lexical.patterns) {
            if (msg.lexical.patterns.isQuestion) primaryPattern = 'questioning';
            else if (msg.lexical.patterns.isCommand) primaryPattern = 'directive';
            else if (msg.lexical.patterns.isAcknowledgment) primaryPattern = 'supportive';
          }
        }

        return {
          ...msg,
          sentiment: {
            primaryEmotion,
            score: msg.lexical?.intents?.confidence || 0,
          },
          communicationStyle: {
            dominantPattern: primaryPattern,
          },
        };
      });

      // Normalize metadata/stats/analytics
      const semanticMetadata = {
        ...metadata,
        ...(semanticResult.metadata?.conversationMetadata || {}),
        senderStats,
        culturalContext: semanticResult.metadata?.culturalContext || metadata.culturalContext,
      };

      const semanticStats = {
        senderStats,
        responseTimes,
        messagesPerDay,
        totalDays,
        avgMessagesPerDay,
      };

      const semanticAnalytics = {
        wordFrequency,
        wordFrequencyPerSender,
        streaks,
        silences,
        peakHours,
        engagementScore,
        totalDays,
        avgMessagesPerDay,
        senderStats,
        culturalContext: semanticResult.metadata?.culturalContext || metadata.culturalContext,
      };

      setProcessingProgress(75);

      // Step 4: Create sentiment summary
      setProcessingStep('Generating sentiment summary...');
      console.log('📊 Creating sentiment summary from intent data...');

      const sentiment = createSentimentFromIntents(messagesWithSentiment, evolution);
      sentiment.timeline = sentimentTimeline;

      setProcessingProgress(80);

      // Step 5: Optional Layer 6 - Narrative Synthesis
      setProcessingStep('Generating AI insights...');
      setProcessingProgress(85);

      console.log('🤖 Layer 6: Generating narrative synthesis (optional, Groq-powered)...');
      let narrative = null;
      try {
        const { generateNarrativeSynthesis } = await import('../services/narrativeSynthesis.js');
        narrative = await generateNarrativeSynthesis(evolution, segments, {
          includeRecommendations: true,
          focusOnActionable: true,
        });
        console.log('✅ Narrative synthesis complete');
      } catch (error) {
        console.warn('⚠️ Narrative synthesis skipped:', error.message);
      }

      setProcessingProgress(90);

      // Step 6: Generate coach notes
      setProcessingStep('Generating coaching insights...');
      console.log('💬 Generating deterministic coach notes from semantic data...');

      const coachNotes = generateCoachNotesFromSemantics({
        evolution,
        segments,
        stats: {
          totalMessages: semanticMetadata.totalMessages,
          totalDays: semanticAnalytics.totalDays,
          avgMessagesPerDay: semanticAnalytics.avgMessagesPerDay,
          overallSentiment: sentiment.overallSentiment
        },
        patterns: {
          peakHours: semanticAnalytics.peakHours?.slice(0, 3).map(h => typeof h === 'object' ? h.hour : h),
          longestStreak: semanticAnalytics.streaks?.[0]?.days || 0
        }
      });
      sentiment.coachNotes = coachNotes;
      sentiment.narrative = narrative;

      setProcessingProgress(92);

      // Step 7: Calculate gamification (uses 100% semantic engine data)
      setProcessingStep('Calculating achievements and milestones...');
      setProcessingProgress(95);

      console.log('🎮 Calculating gamification from semantic data...');
      console.log('  → Messages: semantic messages with intent→emotion mapping');
      console.log('  → Sentiment: derived from Layer 2 intents');
      console.log('  → Analytics: semantic word frequency + behavioral stats');
      console.log('  → Stats: Layer 3 behavioral analysis (response times, patterns)');

      const chatId = generateChatId(semanticMetadata.participants);
      const existingGamification = loadGamificationData(chatId);

      const gamification = {
        relationshipLevel: calculateRelationshipLevel(messagesWithSentiment, sentiment, { ...semanticAnalytics, senderStats: semanticStats.senderStats }),
        compatibilityScore: calculateCompatibilityScore(messagesWithSentiment, sentiment, semanticAnalytics, semanticStats),
        badges: generateBadges(messagesWithSentiment, sentiment, semanticAnalytics, semanticStats),
        milestones: detectMilestones(messagesWithSentiment, semanticAnalytics, semanticStats),
        healthScores: calculateWeeklyHealthScores(messagesWithSentiment, sentiment, semanticAnalytics),
        streakData: calculateStreakData(messagesWithSentiment),
        wrappedData: existingGamification?.wrappedData || null,
        unlockedInsights: existingGamification?.unlockedInsights || [],
        challengeProgress: existingGamification?.challengeProgress || {},
      };

      console.log('✅ Gamification calculated from semantic engine data');

      // Align sentiment with gamification scores for consistency
      const adjustedSentiment = alignSentimentWithGamification(sentiment, gamification);
      console.log('🔄 Aligned sentiment with gamification:', {
        original: { mood: sentiment.overallSentiment, health: sentiment.communicationHealth },
        adjusted: { mood: adjustedSentiment.overallSentiment, health: adjustedSentiment.communicationHealth }
      });

      // Save to localStorage
      saveGamificationData(chatId, {
        chatId,
        participants: semanticMetadata.participants,
        gamification,
        lastAnalyzed: new Date().toISOString(),
        metadata: {
          totalMessages: semanticMetadata.totalMessages,
          startDate: semanticMetadata.startDate,
          endDate: semanticMetadata.endDate
        }
      });

      // Update user profile stats
      updateUserProfileStats(gamification.badges);

      setProcessingProgress(95);

      // Step 8: Finalize
      setProcessingStep('Almost done...');
      setProcessingProgress(98);

      const isGroupChat = (semanticMetadata.participants || []).length >= 3;

      setProcessingProgress(100);

      // Show success toast
      toast({
        title: '✨ Analysis Complete',
        description: `Analyzed ${messagesWithTimestamps.length.toLocaleString()} messages · ${semanticAnalytics.totalDays} days · ${adjustedSentiment.overallSentiment} sentiment`,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          bg: 'black',
          color: 'white',
        },
        style: {
          bg: 'black',
          color: 'white',
        },
      });

      setIsProcessing(false);

      const finalChatData = {
        messages: messagesWithSentiment,
        metadata: semanticMetadata,
        stats: semanticStats,
        analytics: semanticAnalytics,
        sentiment: adjustedSentiment,
        gamification,
        chatId,
        isGroupChat,
        segments,
        evolution,
      };

      // Debug: Log final data structure for BalanceCard
      console.log('📋 Final chatData structure:');
      console.log(`   Total messages: ${finalChatData.metadata.totalMessages}`);
      console.log(`   Sender stats:`, Object.keys(finalChatData.stats.senderStats).map(sender =>
        `${sender}: ${finalChatData.stats.senderStats[sender].messageCount} msgs`
      ).join(', '));

      setChatData(finalChatData);

      console.log('✅ Analysis complete - saved to localStorage only');

    } catch (error) {
      console.error('Error processing chat:', error);
      setIsProcessing(false);

      toast({
        title: '❌ Error processing chat',
        description: error.message || 'Failed to analyze your chat. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          bg: 'black',
          color: 'white',
        },
        style: {
          bg: 'black',
          color: 'white',
        },
      });
    }
  };

  return {
    chatData,
    parsedData,
    isParticipant,
    isProcessing,
    processingStep,
    processingProgress,
    handleFileProcessed,
    runFullAnalysis,
  };
};
