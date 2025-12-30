import { useState, useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import { Box, Grid, Heading, Text, VStack, Card, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
// liquid-glass removed: revert to Chakra-only visuals
import FileUpload from './components/FileUpload';
import ChatParticipationPrompt from './components/ChatParticipationPrompt';
import ParticipantSelector from './components/ParticipantSelector';
import SwipeableCardDashboard from './components/SwipeableCardDashboard';
import Walkthrough from './components/Walkthrough';
import { useAnalysisOrchestrator } from './hooks/useAnalysisOrchestrator';
import {
  initializeUserProfile,
  cleanupExpiredDuoSessions,
} from './services/storageService';
import {
  getPersonalizedInsights,
  getPersonalizedSentiment,
  getCommunicationStyle,
  getPersonalizedCoachingInsights,
} from './utils/personalizedAnalytics';
import {
  getParticipantToast,
  getProcessingMessage
} from './constants/toastMessagesConstants';

function App() {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [partnerGender, setPartnerGender] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [finalChatData, setFinalChatData] = useState(null);
  const [walkthroughCompleted, setWalkthroughCompleted] = useState(
    () => localStorage.getItem('isse_walkthrough_completed') === 'true'
  );
  const projectId = "ue8u3agkqw"
  const toast = useToast();

  // Use the semantic analysis orchestrator (no user auth yet, pass null)
  const {
    chatData,
    parsedData,
    isParticipant,
    isProcessing,
    processingStep,
    processingProgress,
    handleFileProcessed,
    runFullAnalysis,
  } = useAnalysisOrchestrator(null); // null = no user authentication yet

  Clarity.init(projectId);

  // Initialize user profile and cleanup expired sessions on mount
  useEffect(() => {
    initializeUserProfile();
    cleanupExpiredDuoSessions();
  }, []);

  // When chatData is ready and user is a participant, store it for participant selection
  useEffect(() => {
    if (chatData && isParticipant && !selectedParticipant) {
      setProcessedData(chatData);
    }
  }, [chatData, isParticipant, selectedParticipant]);

  const handleWalkthroughComplete = () => {
    localStorage.setItem('isse_walkthrough_completed', 'true');
    setWalkthroughCompleted(true);
  };

  const handleParticipantSelected = (selectionData) => {
    // Handle both old format (string) and new format (object) for backwards compatibility
    const participant = typeof selectionData === 'string'
      ? selectionData
      : selectionData.participant;
    const uGender = selectionData.userGender || null;
    const pGender = selectionData.partnerGender || null;

    setSelectedParticipant(participant);
    setUserGender(uGender);
    setPartnerGender(pGender);

    // Calculate personalized insights
    const personalizedInsights = getPersonalizedInsights(processedData.messages, participant);
    const personalizedSentiment = getPersonalizedSentiment(processedData.messages, participant);
    const communicationStyle = getCommunicationStyle(personalizedInsights, personalizedSentiment);
    const coachingInsights = getPersonalizedCoachingInsights(personalizedInsights, personalizedSentiment);

    // Gender-aware toast message
    const toastConfig = getParticipantToast(uGender);
    toast({
      title: toastConfig.title,
      description: toastConfig.description,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });

    // Set final chat data with personalized insights and gender preferences
    setFinalChatData({
      ...processedData,
      selectedParticipant: participant,
      userGender: uGender,
      partnerGender: pGender,
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
      w="100%"
      overflowX="hidden"
      position="relative"
      bg="linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    >
      {/* Animated Vector Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        overflow="hidden"
        zIndex={0}
        pointerEvents="none"
      >
        {/* Gradient Orbs - Optimized for Mobile */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,133,86,0.2) 0%, rgba(255,133,86,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            top: '40%',
            right: '5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '20%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(45px)',
          }}
        />

        {/* Geometric Vector Shapes - Hidden on Mobile for Performance */}
        <Box
          as="svg"
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          opacity={{ base: 0.04, md: 0.06, lg: 0.08 }}
          display={{ base: 'none', md: 'block' }}
        >
          {/* Animated Circles */}
          <motion.circle
            cx="15%"
            cy="20%"
            r="120"
            fill="none"
            stroke="rgba(255,133,86,0.6)"
            strokeWidth="2"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="85%"
            cy="70%"
            r="150"
            fill="none"
            stroke="rgba(249,115,22,0.5)"
            strokeWidth="2"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated Polygons */}
          <motion.polygon
            points="80,20 120,80 40,80"
            fill="none"
            stroke="rgba(244,63,94,0.4)"
            strokeWidth="2"
            transform="translate(70%, 15%)"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.polygon
            points="0,50 25,0 75,0 100,50 75,100 25,100"
            fill="none"
            stroke="rgba(255,133,86,0.3)"
            strokeWidth="2"
            transform="translate(10%, 60%) scale(1.5)"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          />

          {/* Decorative Lines */}
          <motion.line
            x1="0%"
            y1="30%"
            x2="40%"
            y2="30%"
            stroke="rgba(255,133,86,0.2)"
            strokeWidth="1"
            strokeDasharray="5,5"
            animate={{ x2: ["40%", "50%", "40%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line
            x1="60%"
            y1="80%"
            x2="100%"
            y2="80%"
            stroke="rgba(249,115,22,0.2)"
            strokeWidth="1"
            strokeDasharray="5,5"
            animate={{ x1: ["60%", "50%", "60%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </Box>

        {/* Floating Dots - Reduced on Mobile */}
        <Box display={{ base: 'none', sm: 'block' }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              style={{
                position: 'absolute',
                left: `${10 + i * 10}%`,
                top: `${20 + (i % 3) * 20}%`,
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: i % 3 === 0 ? 'rgba(255,133,86,0.6)' : i % 3 === 1 ? 'rgba(249,115,22,0.5)' : 'rgba(244,63,94,0.4)',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Loading Overlay with Modern Design */}
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
              background: 'linear-gradient(135deg, rgba(15,12,41,0.98) 0%, rgba(48,43,99,0.98) 100%)',
              backdropFilter: 'blur(20px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <VStack spacing={{ base: 6, md: 8 }} maxW="500px" w="100%">
              <Box position="relative" w="80px" h="80px">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '3px solid rgba(255,133,86,0.3)',
                    borderTop: '3px solid rgba(255,133,86,1)',
                    borderRadius: '50%',
                  }}
                />
              </Box>
              <VStack spacing={{ base: 3, md: 4 }} w="100%" px={{ base: 4, md: 0 }}>
                <Heading
                  fontSize={{ base: "18px", sm: "20px", md: "24px" }}
                  bgGradient="linear(to-r, warm.500, peach.500, rose.500)"
                  bgClip="text"
                  textAlign="center"
                >
                  {processingStep}
                </Heading>
                <Text
                  color="whiteAlpha.900"
                  fontSize={{ base: "14px", md: "16px" }}
                  textAlign="center"
                >
                  {getProcessingMessage(userGender)}
                </Text>
                <Box w="100%" pt={{ base: 2, md: 3 }}>
                  <Box
                    position="relative"
                    w="100%"
                    h={{ base: "6px", md: "8px" }}
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <motion.div
                      animate={{
                        width: `${processingProgress}%`,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #FF8556, #F97316, #F43F5E)',
                        borderRadius: '9999px',
                      }}
                    />
                  </Box>
                  <Text
                    color="warm.400"
                    fontSize={{ base: "12px", md: "14px" }}
                    textAlign="center"
                    mt={{ base: 2, md: 3 }}
                    fontWeight="600"
                  >
                    {processingProgress}%
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Box position="relative" zIndex={1}>
        <AnimatePresence mode="wait">
          {!walkthroughCompleted ? (
            <MotionBox
              key="walkthrough"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Walkthrough onComplete={handleWalkthroughComplete} />
            </MotionBox>
          ) : !parsedData && !chatData && !finalChatData ? (
            <MotionBox
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box
                minH="100vh"
                display="flex"
                alignItems="center"
                py={{ base: 6, md: 12, lg: 16 }}
                px={{ base: 4, sm: 6, md: 8, lg: 12 }}
              >
                <Box
                  maxW="1600px"
                  mx="auto"
                  w="100%"
                >
                  <Grid
                    templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                    gap={{ base: 6, sm: 8, md: 12, lg: 16 }}
                    alignItems={{ base: 'stretch', lg: 'center' }}
                  >
                    {/* LEFT COLUMN: Intro with Modern Typography */}
                    <VStack
                      align={{ base: 'center', lg: 'flex-start' }}
                      spacing={{ base: 5, md: 6, lg: 8 }}
                      textAlign={{ base: 'center', lg: 'left' }}
                      order={{ base: 1, lg: 1 }}
                    >
                      <MotionHeading
                        fontSize={{ base: "48px", sm: "56px", md: "64px", lg: "72px" }}
                        bgGradient="linear(to-r, warm.400, peach.500, rose.500)"
                        bgClip="text"
                        fontWeight="900"
                        letterSpacing="tight"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        TETA
                      </MotionHeading>
                      <MotionHeading
                        fontSize={{ base: "18px", sm: "20px", md: "24px", lg: "28px" }}
                        color="whiteAlpha.900"
                        fontWeight="600"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        Your Relationship Bestie
                      </MotionHeading>
                      <MotionText
                        fontSize={{ base: "14px", sm: "15px", md: "16px", lg: "18px" }}
                        color="whiteAlpha.800"
                        lineHeight="1.7"
                        maxW={{ base: "100%", sm: "400px", lg: "90%" }}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        Ever wonder what your conversations really say about your connection?
                        Find out now!
                      </MotionText>

                      {/* Feature Pills */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        style={{ width: '100%' }}
                      >
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap={{ base: 2, md: 3 }}
                          justifyContent={{ base: 'center', lg: 'flex-start' }}
                        >
                          {['Understand Your Vibes', 'See Communication Patterns', 'Strengthen Your Bond'].map((feature, i) => (
                            <Box
                              key={i}
                              px={{ base: 3, sm: 4, md: 5 }}
                              py={{ base: 1.5, md: 2.5 }}
                              borderRadius="full"
                              bg="whiteAlpha.100"
                              backdropFilter="blur(10px)"
                              border="1px solid"
                              borderColor="whiteAlpha.200"
                              fontSize={{ base: "11px", sm: "12px", md: "13px" }}
                              color="whiteAlpha.900"
                              fontWeight="600"
                              whiteSpace="nowrap"
                            >
                              {feature}
                            </Box>
                          ))}
                        </Box>
                      </motion.div>
                    </VStack>

                    {/* RIGHT COLUMN: Upload Card with Glassmorphism */}
                    <Box
                      w="100%"
                      order={{ base: 2, lg: 2 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 0, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <Card
                          bg="whiteAlpha.100"
                          backdropFilter="blur(20px)"
                          borderRadius={{ base: "2xl", md: "3xl" }}
                          p={{ base: 6, sm: 7, md: 9, lg: 12 }}
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                          _hover={{
                            boxShadow: "0 12px 40px 0 rgba(255, 133, 86, 0.2)",
                            borderColor: "whiteAlpha.300",
                          }}
                          transition="all 0.3s ease"
                          w="100%"
                          maxW={{ base: "100%", lg: "700px" }}
                          mx={{ base: "auto", lg: 0 }}
                        >
                          <FileUpload onFileProcessed={handleFileProcessed} />
                        </Card>
                      </motion.div>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </MotionBox>
          ) : parsedData && isParticipant === null ? (
            <MotionBox
              key="participation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <ChatParticipationPrompt
                participants={parsedData.metadata.participants}
                onResponse={runFullAnalysis}
              />
            </MotionBox>
          ) : processedData && isParticipant && !selectedParticipant ? (
            <MotionBox
              key="selector"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
              <SwipeableCardDashboard chatData={finalChatData || chatData} />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default App;
