import { useState, useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { Box, Container, Heading, Text, VStack, Card, CardBody, useToast, Spinner, Progress } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
// liquid-glass removed: revert to Chakra-only visuals
import FileUpload from './components/FileUpload';
import ChatParticipationPrompt from './components/ChatParticipationPrompt';
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
  const [parsedData, setParsedData] = useState(null); // Store parsed but not analyzed data
  const [isParticipant, setIsParticipant] = useState(null); // null = not asked, true/false = response
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const projectId = "ue8u3agkqw"
  const toast = useToast();

  Clarity.init(projectId);

  // Initialize user profile and cleanup expired sessions on mount
  useEffect(() => {
    initializeUserProfile();
    cleanupExpiredDuoSessions();
  }, []);

  // Step 1: Quick file parsing only (no heavy analysis)
  const handleFileProcessed = async (fileContent, fileType = 'text') => {
    setIsProcessing(true);

    try {
      toast({
        title: '📁 Reading chat file',
        description: 'Parsing messages...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

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

      toast({
        title: '✅ Chat loaded!',
        description: `Found ${messages.length.toLocaleString()} messages from ${metadata.participants.length} participants`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
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
      });
    }
  };

  // Step 2: Full analysis (called after user responds to participation prompt)
  const runFullAnalysis = async (userIsParticipant) => {
    if (!parsedData) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setIsParticipant(userIsParticipant);

    const { messages, metadata } = parsedData;

    try {
      setProcessingProgress(10);

      // Step 2: Calculating analytics
      setProcessingStep('Analyzing conversation patterns...');
      setProcessingProgress(30);
      toast({
        title: '📊 Calculating analytics',
        description: `Found ${messages.length.toLocaleString()} messages from ${metadata.participants.length} participants`,
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

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

      setProcessingProgress(45);

      // Step 3: Sentiment analysis (keyword-based)
      setProcessingStep('Running sentiment analysis...');
      setProcessingProgress(50);
      toast({
        title: '😊 Analyzing emotions',
        description: 'Detecting sentiment and emotional patterns...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

      console.log('📊 Step 1: Running keyword-based sentiment analysis (fast, no AI quota)...');
      // First pass: Fast keyword-based sentiment analysis for all messages
      // This analyzes ALL messages using keyword matching (no API calls, instant results)
      const messagesWithSentiment = analyzeChatSentiment(messages, false);
      const sentimentTimeline = getSentimentTimeline(messagesWithSentiment, 'day');

      setProcessingProgress(60);

      // Step 4: AI enhancement
      setProcessingStep('Enhancing with AI insights...');
      setProcessingProgress(65);
      toast({
        title: '🤖 AI enhancement',
        description: 'Getting deeper conversation insights...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

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

      setProcessingProgress(75);

      // Step 5: Generating coach's notes
      setProcessingStep('Generating personalized coaching...');
      setProcessingProgress(78);
      toast({
        title: '💬 Creating coach\'s notes',
        description: 'Personalizing insights for you...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

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

      setProcessingProgress(85);

      // Step 6: Calculating achievements
      setProcessingStep('Calculating achievements and milestones...');
      setProcessingProgress(88);
      toast({
        title: '🎯 Calculating achievements',
        description: 'Finding milestones and unlocking badges...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

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

      setProcessingProgress(95);

      // Step 7: Finalizing
      setProcessingStep('Almost done...');
      setProcessingProgress(98);

      // Check if this is a group chat (3+ participants)
      const isGroupChat = metadata.participants.length >= 3;

      setProcessingProgress(100);

      if (!userIsParticipant) {
        // User is NOT a participant - show group/general insights only
        console.log('User is not a participant, showing general insights');

        toast({
          title: '✨ Analysis complete!',
          description: isGroupChat
            ? `Group chat analyzed with ${metadata.participants.length} members`
            : 'Chat analyzed successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        setIsProcessing(false);

        setChatData({
          messages: messagesWithSentiment,
          metadata,
          stats,
          analytics,
          sentiment,
          gamification,
          chatId,
          selectedParticipant: null,
          personalizedInsights: null,
          personalizedSentiment: null,
          communicationStyle: null,
          coachingInsights: null,
          isGroupChat,
        });
      } else {
        // User IS a participant - need to identify them
        console.log('User is a participant, showing participant selector');

        toast({
          title: '✨ Analysis complete!',
          description: 'Please select which participant you are',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        setIsProcessing(false);

        setProcessedData({
          messages: messagesWithSentiment,
          metadata,
          stats,
          analytics,
          sentiment,
          gamification,
          chatId,
          isGroupChat,
        });
      }
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
      });
    }
  };

  const handleParticipantSelected = (participant) => {
    setSelectedParticipant(participant);

    // Calculate personalized insights
    const personalizedInsights = getPersonalizedInsights(processedData.messages, participant);
    const personalizedSentiment = getPersonalizedSentiment(processedData.messages, participant);
    const communicationStyle = getCommunicationStyle(personalizedInsights, personalizedSentiment);
    const coachingInsights = getPersonalizedCoachingInsights(personalizedInsights, personalizedSentiment);

    toast({
      title: '🎉 Welcome!',
      description: `Showing personalized insights for ${participant}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });

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
      position="relative"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(102, 126, 234, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VStack spacing={6} p={8}>
              <Box textAlign="center">
                <Spinner
                  size="xl"
                  color="white"
                  thickness="4px"
                  speed="0.8s"
                  emptyColor="whiteAlpha.300"
                />
              </Box>
              <VStack spacing={3} maxW="400px">
                <Heading size="lg" color="white" textAlign="center">
                  {processingStep}
                </Heading>
                <Text color="whiteAlpha.900" fontSize="md" textAlign="center">
                  Analyzing your conversation...
                </Text>
                <Box w="100%" pt={2}>
                  <Progress
                    value={processingProgress}
                    size="sm"
                    colorScheme="whiteAlpha"
                    bg="whiteAlpha.300"
                    borderRadius="full"
                    hasStripe
                    isAnimated
                  />
                  <Text color="whiteAlpha.800" fontSize="sm" textAlign="center" mt={2}>
                    {processingProgress}%
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>

      <Box position="relative" zIndex={1}>
        <AnimatePresence mode="wait">
          {!parsedData && !processedData && !chatData ? (
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
          ) : parsedData && isParticipant === null ? (
            <MotionBox
              key="participation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <ChatParticipationPrompt
                participants={parsedData.metadata.participants}
                onResponse={runFullAnalysis}
              />
            </MotionBox>
          ) : processedData && !selectedParticipant ? (
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
