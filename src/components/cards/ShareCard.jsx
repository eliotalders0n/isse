import { Box, VStack, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShare2, FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { getFeelingWithPronouns } from '../../constants/feelingMapConstants';

const MotionBox = motion(Box);

// Summary card component for export - Modern word cloud
const SummaryCard = ({ chatData, cardRef }) => {
  const {
    metadata = { participants: [], totalMessages: 0 },
    selectedParticipant,
    personalizedInsights,
    partnerGender,
    messages = []
  } = chatData;

  const otherPerson = personalizedInsights?.otherPerson || metadata.participants.find(p => p !== selectedParticipant);
  const isGroupChat = metadata.participants.length >= 3;

  // Collect all feelings/emotions with their intensities
  const allFeelings = [];

  if (!isGroupChat && messages.length > 0 && otherPerson) {
    const otherMessages = messages.filter(m => m.sender === otherPerson);
    const intentTotals = {
      affection: 0,
      passion: 0,
      commitment: 0,
      reconciliation: 0,
      conflict: 0,
      drama: 0,
      uncertainty: 0,
      urgency: 0
    };

    let messagesWithIntents = 0;
    otherMessages.forEach(msg => {
      if (msg.lexical?.intents) {
        Object.keys(intentTotals).forEach(intent => {
          intentTotals[intent] += msg.lexical.intents[intent] || 0;
        });
        messagesWithIntents++;
      }
    });

    // Get feelings for each intent type
    if (messagesWithIntents > 0) {
      Object.entries(intentTotals).forEach(([intent, total]) => {
        const avgScore = total / messagesWithIntents;
        if (avgScore > 0.01) { // Only include meaningful scores
          const feeling = getFeelingWithPronouns(intent, avgScore, partnerGender || 'neutral');
          allFeelings.push({
            word: feeling.word,
            score: avgScore,
            intensity: feeling.intensity
          });
        }
      });
    }
  }

  // Sort by score - highest first
  allFeelings.sort((a, b) => b.score - a.score);

  // Top 3 feelings with different sizes
  const primaryFeeling = allFeelings[0] || { word: 'Connected', score: 1 };
  const secondaryFeelings = allFeelings.slice(1, 4);
  const tertiaryFeelings = allFeelings.slice(4, 8);

  return (
    <Box
      ref={cardRef}
      position="absolute"
      left="-9999px"
      top="0"
      w="1080px"
      h="1080px"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      display="flex"
      flexDirection="column"
    >
      {/* Decorative circles in background */}
      <Box position="absolute" top="10%" left="5%" w="300px" h="300px" borderRadius="full" bg="whiteAlpha.100" filter="blur(60px)" />
      <Box position="absolute" bottom="15%" right="8%" w="400px" h="400px" borderRadius="full" bg="whiteAlpha.100" filter="blur(80px)" />

      {/* Content */}
      <VStack spacing={0} h="100%" justify="space-between" p={16} position="relative" zIndex={1}>
        {/* Header */}
        <VStack spacing={4} w="100%">
          <Heading fontSize="48px" color="white" fontWeight="black" letterSpacing="tight">
            Teta
          </Heading>
          <Text fontSize="28px" color="white" fontWeight="700" opacity={0.95}>
            {metadata.participants.join(' & ')}
          </Text>
        </VStack>

        {/* Feelings Layout - Layered Typography */}
        <VStack spacing={0} align="center" flex={1} justify="center" w="100%" px={12}>
          {/* Primary Feeling - Huge and centered */}
          <Heading
            fontSize="140px"
            fontWeight="black"
            color="white"
            lineHeight="1"
            textAlign="center"
            textShadow="0 8px 32px rgba(0,0,0,0.2)"
            letterSpacing="-0.02em"
            mb={8}
          >
            {primaryFeeling.word}
          </Heading>

          {/* Secondary Feelings - Medium size, horizontal layout */}
          {secondaryFeelings.length > 0 && (
            <VStack spacing={6} w="100%" mb={6}>
              {secondaryFeelings.map((feeling, idx) => (
                <Text
                  key={idx}
                  fontSize={`${56 - idx * 8}px`}
                  fontWeight="bold"
                  color="white"
                  opacity={0.85 - idx * 0.1}
                  textAlign="center"
                  letterSpacing="-0.01em"
                >
                  {feeling.word}
                </Text>
              ))}
            </VStack>
          )}

          {/* Tertiary Feelings - Small, scattered horizontally */}
          {tertiaryFeelings.length > 0 && (
            <Box w="100%" textAlign="center">
              <Text
                fontSize="28px"
                fontWeight="600"
                color="white"
                opacity={0.6}
                letterSpacing="0.02em"
              >
                {tertiaryFeelings.map(f => f.word).join(' • ')}
              </Text>
            </Box>
          )}
        </VStack>

        {/* Footer */}
        <VStack spacing={6} w="100%">
          {/* Stats box */}
          <Box
            bg="rgba(255, 255, 255, 0.15)"
            backdropFilter="blur(10px)"
            p={8}
            borderRadius="3xl"
            w="100%"
            textAlign="center"
            border="1px solid"
            borderColor="whiteAlpha.300"
          >
            <Text fontSize="72px" fontWeight="black" color="white" lineHeight="1">
              {metadata.totalMessages?.toLocaleString()}
            </Text>
            <Text fontSize="24px" color="white" fontWeight="600" mt={3} opacity={0.9}>
              Messages Analyzed
            </Text>
          </Box>

          {/* Branding */}
          <VStack spacing={2}>
            <Text fontSize="20px" color="white" fontWeight="700" opacity={0.9}>
              Powered by Appfusion Studio Limited
            </Text>
            <Text fontSize="16px" color="white" opacity={0.7} fontWeight="500">
              Understanding your conversations
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

const ShareCard = ({ chatData = {} }) => {
  const {
    metadata = {
      participants: [],
      totalMessages: 0,
      startDate: new Date(),
      endDate: new Date()
    }
  } = chatData;

  const summaryCardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Relationship Story - Teta',
          text: `Just discovered beautiful insights about ${metadata.participants.join(' & ')}'s connection!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback for desktop
      alert('Sharing is best experienced on mobile devices!');
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Wait for next frame to ensure ref is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!summaryCardRef.current) {
        throw new Error('Summary card not found');
      }

      // Generate canvas from the summary card
      const canvas = await html2canvas(summaryCardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `Teta-${metadata.participants.join('-').replace(/\s/g, '_')}-${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: 'Summary saved!',
          description: 'Your relationship summary has been downloaded',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }, 'image/png');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Download failed',
        description: 'Could not generate summary. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Hidden summary card for export */}
      <SummaryCard chatData={chatData} cardRef={summaryCardRef} />

      {/* Visible share card */}
      <Box
        bg="white"
        borderRadius="3xl"
        p={{ base: 6, md: 8 }}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        boxShadow="2xl"
      >
        <VStack spacing={{ base: 8, md: 10 }} align="center" justify="center" flex={1}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            textAlign="center"
          >
            <Heading
              fontSize={{ base: "20px", md: "24px", lg: "28px" }}
              color="dark.900"
              fontWeight="800"
              mb={2}
            >
              You Made It!
            </Heading>
            <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500">
              Your conversation story awaits
            </Text>
          </MotionBox>

          {/* Big gradient heading */}
          <VStack spacing={{ base: 6, md: 8 }} w="100%" maxW="500px">
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              w="100%"
            >
              <VStack spacing={3}>
                <Heading
                  fontSize={{ base: "48px", sm: "56px", md: "64px", lg: "72px" }}
                  fontWeight="black"
                  bgGradient="linear(to-r, purple.400, pink.500)"
                  bgClip="text"
                  letterSpacing="tighter"
                  lineHeight="1"
                  textAlign="center"
                >
                  Share
                </Heading>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="dark.700"
                  textAlign="center"
                  maxW="350px"
                  lineHeight="tall"
                  fontWeight="600"
                >
                  Every conversation is a chance to grow. Keep being intentional, keep being present.
                </Text>
              </VStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              w="100%"
            >
              <VStack spacing={2} bg="dark.900" p={6} borderRadius="2xl">
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="white">
                  {metadata.participants.join(' & ')}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color="whiteAlpha.900" fontWeight="600">
                  {metadata.totalMessages?.toLocaleString()} messages analyzed
                </Text>
              </VStack>
            </MotionBox>
          </VStack>

          {/* Action buttons */}
          <VStack spacing={3} w="100%" maxW="400px">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              w="100%"
            >
              <Button
                size="lg"
                w="100%"
                bg="accent.600"
                color="white"
                leftIcon={<FiShare2 />}
                onClick={handleShare}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl', bg: 'accent.700' }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                py={7}
                borderRadius="xl"
              >
                Share Your Story
              </Button>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              w="100%"
            >
              <Button
                size="lg"
                w="100%"
                variant="outline"
                colorScheme="purple"
                leftIcon={<FiDownload />}
                onClick={handleDownload}
                isLoading={isGenerating}
                loadingText="Generating..."
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                py={7}
                borderRadius="xl"
              >
                Save as Image
              </Button>
            </MotionBox>
          </VStack>

          {/* Bottom text */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            textAlign="center"
          >
            <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500">
              Made with love by Teta
            </Text>
          </MotionBox>
        </VStack>
      </Box>
    </>
  );
};

export default ShareCard;
