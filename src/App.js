import { useState, useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { Box, Container, Heading, Text, VStack, Card, CardBody } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
// liquid-glass removed: revert to Chakra-only visuals
import FileUpload from './components/FileUpload';
import ParticipantSelector from './components/ParticipantSelector';
import SwipeableCardDashboard from './components/SwipeableCardDashboard';
import bgImage from './assets/3746043.jpg';
import { parseWhatsAppChat, parseJSONChat, parseGmailPDF, getStatsPerSender, getMessagesPerDay } from './utils/whatsappParser';
import {
  calculateWordFrequency,
  calculateWordFrequencyPerSender,
  findConversationStreaks,
  findSilencePeriods,
  calculateResponseTimes,
  detectPeakHours,
  calculateEngagementScore,
} from './utils/analytics';
import {
  analyzeChatSentiment,
  getSentimentTimeline,
  generateRelationshipSummary,
  calculateEmotionSynchrony,
  detectConflictResolution,
  getAffectionLevel,
  detectToxicity,
  generateAllCoachNotes,
} from './services/sentimentAnalysis';
import {
  calculateRelationshipLevel,
  calculateCompatibilityScore,
  generateBadges,
  detectMilestones,
  calculateWeeklyHealthScores,
  calculateStreakData,
} from './utils/gamification';
import {
  generateChatId,
  saveGamificationData,
  loadGamificationData,
  updateUserProfileStats,
  initializeUserProfile,
  cleanupExpiredDuoSessions,
} from './services/storageService';
import {
  getPersonalizedInsights,
  getPersonalizedSentiment,
  getCommunicationStyle,
  getPersonalizedCoachingInsights,
} from './utils/personalizedAnalytics';

function App() {
  const [chatData, setChatData] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const projectId = "ue8u3agkqw"

  Clarity.init(projectId);

  // Initialize user profile and cleanup expired sessions on mount
  useEffect(() => {
    initializeUserProfile();
    cleanupExpiredDuoSessions();
  }, []);

  const handleFileProcessed = async (fileContent, fileType = 'text') => {
    try {
      // Use appropriate parser based on file type
      let parsedData;
      if (fileType === 'json') {
        parsedData = parseJSONChat(fileContent);
      } else if (fileType === 'pdf') {
        parsedData = parseGmailPDF(fileContent);
      } else {
        parsedData = parseWhatsAppChat(fileContent);
      }

      const { messages, metadata } = parsedData;

      if (messages.length === 0) {
        throw new Error('No messages found in the file');
      }

      const senderStats = getStatsPerSender(messages);
      const messagesPerDay = getMessagesPerDay(messages);
      const wordFrequency = calculateWordFrequency(messages, 30);
      const wordFrequencyPerSender = calculateWordFrequencyPerSender(messages, 15);
      const streaks = findConversationStreaks(messages);
      const silences = findSilencePeriods(messages, 3);
      const responseTimes = calculateResponseTimes(messages);
      const peakHours = detectPeakHours(messages);
      const engagementScore = calculateEngagementScore(messages, 'week');

      const totalDays = Math.ceil(
        (messages[messages.length - 1].timestamp - messages[0].timestamp) / (1000 * 60 * 60 * 24)
      );
      const avgMessagesPerDay = Math.round(messages.length / totalDays);

      const stats = {
        senderStats,
        messagesPerDay,
        responseTimes,
        totalDays,
        avgMessagesPerDay,
      };

      const analytics = {
        wordFrequency,
        wordFrequencyPerSender,
        streaks,
        silences,
        peakHours,
        engagementScore,
        totalDays,
        avgMessagesPerDay,
      };

      console.log('📊 Step 1: Running keyword-based sentiment analysis (fast, no AI quota)...');
      // First pass: Fast keyword-based sentiment analysis for all messages
      // This analyzes ALL messages using keyword matching (no API calls, instant results)
      const messagesWithSentiment = analyzeChatSentiment(messages, false);
      const sentimentTimeline = getSentimentTimeline(messagesWithSentiment, 'day');

      console.log('🤖 Step 2: Enhancing with AI conversation-level insights (1 API call)...');
      // Second pass: AI-powered conversation insights (uses only 1 API call instead of 30+)
      // Old approach: 30+ API calls to analyze individual messages = high quota usage
      // New approach: 1 API call for conversation-level insights = 97% quota reduction
      const sentiment = await generateRelationshipSummary(messagesWithSentiment, stats, true);
      sentiment.timeline = sentimentTimeline;

      // Calculate additional sentiment metrics
      sentiment.emotionSynchrony = calculateEmotionSynchrony(messagesWithSentiment, metadata.participants);
      sentiment.conflictResolution = detectConflictResolution(messagesWithSentiment);
      sentiment.affectionLevel = getAffectionLevel(messagesWithSentiment);
      sentiment.toxicity = detectToxicity(messagesWithSentiment);

      console.log('💬 Step 3: Generating AI-enhanced coach\'s notes for all cards (1 API call)...');
      // Third pass: AI-powered coach's notes for all cards (1 API call for all cards)
      const coachNotes = await generateAllCoachNotes({
        balance: {
          participants: metadata.participants,
          messageDistribution: stats.senderStats
        },
        emotions: {
          positivePercent: sentiment.positivePercent,
          negativePercent: sentiment.negativePercent,
          neutralPercent: sentiment.neutralPercent,
          topEmotions: sentiment.topEmotions
        },
        stats: {
          totalMessages: metadata.totalMessages,
          totalDays: analytics.totalDays,
          avgMessagesPerDay: analytics.avgMessagesPerDay,
          overallSentiment: sentiment.overallSentiment
        },
        patterns: {
          peakHours: analytics.peakHours?.slice(0, 3).map(h => typeof h === 'object' ? h.hour : h),
          longestStreak: analytics.streaks?.[0]?.days || 0
        }
      });
      sentiment.coachNotes = coachNotes;

      // Generate chat ID from participants
      const chatId = generateChatId(metadata.participants);

      // Load existing gamification data (for historical tracking)
      const existingGamification = loadGamificationData(chatId);

      // Calculate gamification metrics
      const gamification = {
        relationshipLevel: calculateRelationshipLevel(messagesWithSentiment, sentiment, { ...analytics, senderStats }),
        compatibilityScore: calculateCompatibilityScore(messagesWithSentiment, sentiment, analytics, stats),
        badges: generateBadges(messagesWithSentiment, sentiment, analytics, stats),
        milestones: detectMilestones(messagesWithSentiment, analytics, stats),
        healthScores: calculateWeeklyHealthScores(messagesWithSentiment, sentiment, analytics),
        streakData: calculateStreakData(messagesWithSentiment),
        wrappedData: existingGamification?.wrappedData || null,
        unlockedInsights: existingGamification?.unlockedInsights || [],
        challengeProgress: existingGamification?.challengeProgress || {},
      };

      // Save to localStorage
      saveGamificationData(chatId, {
        chatId,
        participants: metadata.participants,
        gamification,
        lastAnalyzed: new Date().toISOString(),
        metadata: {
          totalMessages: metadata.totalMessages,
          startDate: metadata.startDate,
          endDate: metadata.endDate
        }
      });

      // Update user profile stats
      updateUserProfileStats(gamification.badges);

      // Store processed data temporarily until participant is selected
      setProcessedData({
        messages: messagesWithSentiment,
        metadata,
        stats,
        analytics,
        sentiment,
        gamification,
        chatId,
      });
    } catch (error) {
      console.error('Error processing chat:', error);
      alert('Error processing chat file: ' + error.message);
    }
  };

  const handleParticipantSelected = (participant) => {
    setSelectedParticipant(participant);

    // Calculate personalized insights
    const personalizedInsights = getPersonalizedInsights(processedData.messages, participant);
    const personalizedSentiment = getPersonalizedSentiment(processedData.messages, participant);
    const communicationStyle = getCommunicationStyle(personalizedInsights, personalizedSentiment);
    const coachingInsights = getPersonalizedCoachingInsights(personalizedInsights, personalizedSentiment);

    // Set final chat data with personalized insights
    setChatData({
      ...processedData,
      selectedParticipant: participant,
      personalizedInsights,
      personalizedSentiment,
      communicationStyle,
      coachingInsights,
    });
  };

  const MotionBox = motion(Box);
  const MotionHeading = motion(Heading);
  const MotionText = motion(Text);

  return (
    <Box
      minH="100vh"
      overflowX="hidden"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <Box position="relative" zIndex={1}>
        <AnimatePresence mode="wait">
          {!processedData ? (
            <MotionBox
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Container maxW="container.md" py={{ base: 8, md: 20 }} px={{ base: 4, md: 6 }}>
                <VStack spacing={{ base: 8, md: 10 }} align="stretch">
                  <Box w="100%" display="flex" justifyContent="center">
                    <Card bg="white" borderRadius="2xl" boxShadow="xl" w="100%">
                      <CardBody px={{ base: 6, md: 10 }} py={8} maxW="720px" mx="auto" textAlign="center">
                        <MotionHeading
                          size={{ base: "2xl", md: "3xl" }}
                          mb={4}
                          color="sand.800"
                          fontWeight="800"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Isse
                        </MotionHeading>
                        <MotionText
                          fontSize={{ base: "xl", md: "2xl" }}
                          color="sand.700"
                          mb={3}
                          fontWeight="600"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Your Relationship Coach
                        </MotionText>
                        <MotionText
                          fontSize={{ base: "md", md: "lg" }}
                          color="sand.600"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          Upload your WhatsApp chat and discover the beautiful patterns in your connection
                        </MotionText>
                      </CardBody>
                    </Card>
                  </Box>
                  <Box w="100%" display="flex" justifyContent="center">
                    <Card bg="white" borderRadius="2xl" boxShadow="lg" w="100%">
                      <CardBody maxW="720px" mx="auto" w="100%" px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
                        <FileUpload onFileProcessed={handleFileProcessed} />
                      </CardBody>
                    </Card>
                  </Box>
                </VStack>
              </Container>
            </MotionBox>
          ) : !selectedParticipant ? (
            <MotionBox
              key="selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <ParticipantSelector
                participants={processedData.metadata.participants}
                onSelectParticipant={handleParticipantSelected}
              />
            </MotionBox>
          ) : (
            <MotionBox
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SwipeableCardDashboard chatData={chatData} />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default App;
