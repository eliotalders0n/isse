import {
  Box,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Analyze user's communication traits and return descriptive words
const analyzeUserTraits = (personalizedInsights, personalizedSentiment) => {
  const traits = [];

  // Energy level based on message frequency
  const energyWord = {
    word: personalizedInsights.initiationRate > 60 ? 'Enthusiastic' :
          personalizedInsights.initiationRate > 40 ? 'Engaged' :
          personalizedInsights.initiationRate > 20 ? 'Responsive' : 'Reserved',
    bgGradient: personalizedInsights.initiationRate > 60 ? 'linear(to-r, orange.400, yellow.500)' :
                personalizedInsights.initiationRate > 40 ? 'linear(to-r, orange.300, pink.400)' :
                personalizedInsights.initiationRate > 20 ? 'linear(to-r, blue.400, teal.400)' : 'linear(to-r, purple.400, indigo.400)',
  };
  traits.push(energyWord);

  // Emotional expression based on sentiment
  const emotionWord = {
    word: personalizedSentiment.positivePercent > 70 ? 'Radiant' :
          personalizedSentiment.positivePercent > 50 ? 'Optimistic' :
          personalizedSentiment.positivePercent > 30 ? 'Balanced' : 'Reflective',
    bgGradient: personalizedSentiment.positivePercent > 70 ? 'linear(to-r, yellow.400, orange.500)' :
                personalizedSentiment.positivePercent > 50 ? 'linear(to-r, green.400, teal.400)' :
                personalizedSentiment.positivePercent > 30 ? 'linear(to-r, blue.400, purple.400)' : 'linear(to-r, purple.500, pink.500)',
  };
  traits.push(emotionWord);

  // Communication depth based on question rate
  const depthWord = {
    word: personalizedInsights.questionRate > 25 ? 'Curious' :
          personalizedInsights.questionRate > 15 ? 'Inquisitive' :
          personalizedInsights.questionRate > 5 ? 'Conversational' : 'Declarative',
    bgGradient: personalizedInsights.questionRate > 25 ? 'linear(to-r, purple.400, pink.500)' :
                personalizedInsights.questionRate > 15 ? 'linear(to-r, indigo.400, purple.400)' :
                personalizedInsights.questionRate > 5 ? 'linear(to-r, cyan.400, blue.400)' : 'linear(to-r, blue.500, indigo.500)',
  };
  traits.push(depthWord);

  // Expression style based on message length
  const expressionWord = {
    word: personalizedInsights.avgMessageLength > 150 ? 'Expressive' :
          personalizedInsights.avgMessageLength > 80 ? 'Detailed' :
          personalizedInsights.avgMessageLength > 40 ? 'Concise' : 'Brief',
    bgGradient: personalizedInsights.avgMessageLength > 150 ? 'linear(to-r, pink.400, rose.500)' :
                personalizedInsights.avgMessageLength > 80 ? 'linear(to-r, teal.400, green.400)' :
                personalizedInsights.avgMessageLength > 40 ? 'linear(to-r, blue.400, cyan.400)' : 'linear(to-r, gray.500, blue.400)',
  };
  traits.push(expressionWord);

  return traits;
};

const AboutYouCard = ({ chatData = {} }) => {
  const {
    personalizedInsights,
    personalizedSentiment,
  } = chatData;

  if (!personalizedInsights || !personalizedSentiment) {
    return (
      <Box
        bg="white"
        borderRadius="3xl"
        p={8}
        height="100%"
        display="flex"
        flexDirection="column"
        boxShadow="2xl"
      >
        <Box textAlign="center" py={12}>
          <Text color="gray.500">Personalized insights not available</Text>
        </Box>
      </Box>
    );
  }

  const traits = analyzeUserTraits(personalizedInsights, personalizedSentiment);

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
            Your Communication Story
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500">
            How you show up in conversation
          </Text>
        </MotionBox>

        {/* Trait Words Display */}
        <VStack spacing={{ base: 6, md: 8 }} w="100%" maxW="500px">
          {traits.map((trait, idx) => (
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
                  bgGradient={trait.bgGradient}
                  bgClip="text"
                  letterSpacing="tight"
                  lineHeight="1"
                  textAlign="center"
                >
                  {trait.word}
                </Heading>
              </VStack>
            </MotionBox>
          ))}
        </VStack>

        {/* Bottom text */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          textAlign="center"
        >
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500" maxW="280px">
            These words capture your unique communication essence
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default AboutYouCard;
