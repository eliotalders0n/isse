import {
  Box,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Get gradient based on insight type
const getGradientForType = (type) => {
  switch (type) {
    case 'positive':
      return 'linear(to-r, green.400, teal.500)';
    case 'suggestion':
      return 'linear(to-r, purple.400, pink.500)';
    case 'neutral':
      return 'linear(to-r, blue.400, indigo.500)';
    case 'growth':
      return 'linear(to-r, orange.400, yellow.500)';
    default:
      return 'linear(to-r, purple.400, pink.400)';
  }
};

const CoachingInsightsCard = ({ chatData = {} }) => {
  const { coachingInsights, selectedParticipant } = chatData;

  if (!coachingInsights || coachingInsights.length === 0) {
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
          <Text color="gray.500">No coaching insights available</Text>
        </Box>
      </Box>
    );
  }

  // Take up to 3 insights for cleaner display
  const displayInsights = coachingInsights.slice(0, 3);

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
            Coaching for You
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500">
            {selectedParticipant ? 'Personalized insights to help you grow' : 'Insights from your conversation'}
          </Text>
        </MotionBox>

        {/* Insight Words Display */}
        <VStack spacing={{ base: 6, md: 8 }} w="100%" maxW="500px">
          {displayInsights.map((insight, idx) => (
            <MotionBox
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.15, type: 'spring' }}
              w="100%"
            >
              <VStack spacing={2}>
                <Heading
                  fontSize={{ base: "32px", sm: "40px", md: "48px", lg: "52px" }}
                  fontWeight="black"
                  bgGradient={getGradientForType(insight.type)}
                  bgClip="text"
                  letterSpacing="tight"
                  lineHeight="1"
                  textAlign="center"
                >
                  {insight.title}
                </Heading>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="dark.700"
                  textAlign="center"
                  maxW={{ base: "280px", md: "350px" }}
                  lineHeight="tall"
                  fontWeight="600"
                >
                  {insight.message}
                </Text>
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
            Every conversation is a chance to grow
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default CoachingInsightsCard;
