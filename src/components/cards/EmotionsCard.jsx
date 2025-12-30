import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Get gradient for each emotion type
const getEmotionGradient = (emotion) => {
  const emotionLower = emotion.toLowerCase();

  // Positive emotions
  if (['joy', 'love', 'gratitude', 'affection', 'happiness', 'excitement'].includes(emotionLower)) {
    return 'linear(to-r, pink.400, rose.500)';
  }
  if (['trust', 'commitment'].includes(emotionLower)) {
    return 'linear(to-r, blue.400, indigo.500)';
  }

  // Negative emotions
  if (['sadness', 'grief', 'disappointment'].includes(emotionLower)) {
    return 'linear(to-r, blue.500, purple.600)';
  }
  if (['anger', 'frustration', 'conflict'].includes(emotionLower)) {
    return 'linear(to-r, red.400, orange.500)';
  }
  if (['anxiety', 'worry', 'fear', 'insecurity'].includes(emotionLower)) {
    return 'linear(to-r, purple.400, pink.500)';
  }

  // Mixed/Complex emotions
  if (['desire', 'passion'].includes(emotionLower)) {
    return 'linear(to-r, red.500, pink.600)';
  }
  if (['forgiveness', 'reconciliation'].includes(emotionLower)) {
    return 'linear(to-r, green.400, teal.500)';
  }
  if (['jealousy', 'drama'].includes(emotionLower)) {
    return 'linear(to-r, orange.400, red.500)';
  }

  // Neutral
  return 'linear(to-r, gray.500, blue.400)';
};

const EmotionsCard = ({ chatData = {} }) => {
  const {
    sentiment = {
      emotionBreakdown: {},
      positivePercent: 0,
      neutralPercent: 0,
      negativePercent: 0,
      coachNotes: {}
    }
  } = chatData;

  // Safe number conversion to handle NaN
  const safePercent = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : Math.round(num);
  };

  const positivePercent = safePercent(sentiment.positivePercent);
  const neutralPercent = safePercent(sentiment.neutralPercent);
  const negativePercent = safePercent(sentiment.negativePercent);

  // Get top 3 emotions for display
  const topEmotions = Object.entries(sentiment.emotionBreakdown || {})
    .map(([emotion, count]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
      gradient: getEmotionGradient(emotion)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const getEmotionalInsight = () => {
    // Use AI-enhanced coach note if available
    if (sentiment.coachNotes?.emotions) {
      return sentiment.coachNotes.emotions;
    }

    // Fallback to keyword-based insights
    if (positivePercent > 70)
      return "Your conversations are filled with warmth and positivity.";
    if (positivePercent > 50)
      return "You maintain a balanced and healthy emotional tone.";
    return "Consider bringing more lightness into your conversations.";
  };

  return (
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
            Emotional Landscape
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500">
            The feelings flowing through your messages
          </Text>
        </MotionBox>

        {/* Top Emotions Display */}
        {topEmotions.length > 0 && (
          <VStack spacing={{ base: 6, md: 8 }} w="100%" maxW="500px">
            {topEmotions.map((emotion, idx) => (
              <MotionBox
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.15, type: 'spring' }}
                w="100%"
              >
                <VStack spacing={1}>
                  <Heading
                    fontSize={{ base: "36px", sm: "44px", md: "52px", lg: "56px" }}
                    fontWeight="black"
                    bgGradient={emotion.gradient}
                    bgClip="text"
                    letterSpacing="tight"
                    lineHeight="1"
                    textAlign="center"
                  >
                    {emotion.emotion}
                  </Heading>
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }}
                    color="dark.600"
                    fontWeight="600"
                  >
                    {emotion.count} {emotion.count === 1 ? 'time' : 'times'}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </VStack>
        )}

        {/* Overall Sentiment Display */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          textAlign="center"
          w="100%"
          maxW="400px"
        >
          <VStack spacing={3}>
            <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.600" fontWeight="700" textTransform="uppercase" letterSpacing="wide">
              Overall Vibe
            </Text>
            <VStack spacing={2} w="100%">
              {positivePercent > 0 && (
                <VStack spacing={0} w="100%">
                  <Heading
                    fontSize={{ base: "28px", sm: "32px", md: "36px" }}
                    fontWeight="black"
                    bgGradient="linear(to-r, green.400, teal.500)"
                    bgClip="text"
                  >
                    {positivePercent}% Positive
                  </Heading>
                </VStack>
              )}
              {negativePercent > 0 && (
                <Text fontSize={{ base: "sm", md: "md" }} color="dark.600" fontWeight="600">
                  {negativePercent}% Complex • {neutralPercent}% Neutral
                </Text>
              )}
            </VStack>
          </VStack>
        </MotionBox>

        {/* Bottom coaching insight */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          textAlign="center"
          maxW="350px"
        >
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500" lineHeight="tall">
            {getEmotionalInsight()}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default EmotionsCard;
