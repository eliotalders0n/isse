import {
  Box,
  VStack,
  Heading,
  Text,
  Card as ChakraCard,
  CardBody,
  Badge,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiStar,
  FiInfo,
  FiCheckCircle,
} from 'react-icons/fi';

const MotionCard = motion(ChakraCard);

const CoachingInsightsCard = ({ chatData }) => {
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

  const getIconForType = (type) => {
    switch (type) {
      case 'positive':
        return FiHeart;
      case 'suggestion':
        return FiInfo;
      case 'neutral':
        return FiStar;
      default:
        return FiCheckCircle;
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'positive':
        return 'green';
      case 'suggestion':
        return 'orange';
      case 'neutral':
        return 'blue';
      default:
        return 'warm';
    }
  };

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
      <VStack spacing={6} align="stretch" h="100%" overflowY="auto">
        {/* Header */}
        <Box textAlign="center">
          <Heading
            size="xl"
            bgGradient="linear(to-r, warm.500, peach.500)"
            bgClip="text"
            fontWeight="800"
            mb={2}
          >
            Your Insights
          </Heading>
          <Text fontSize="md" color="sand.600">
            Personalized coaching for you, {selectedParticipant}
          </Text>
        </Box>

        <Divider />

        {/* Coaching Insights */}
        <VStack spacing={4} align="stretch" flex={1}>
          {coachingInsights.map((insight, idx) => {
            const Icon = getIconForType(insight.type);
            const colorScheme = getColorForType(insight.type);

            return (
              <MotionCard
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                borderLeft="4px solid"
                borderColor={`${colorScheme}.400`}
                whileHover={{ scale: 1.02, boxShadow: 'lg' }}
              >
                <CardBody p={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box as={Icon} size={18} color={`${colorScheme}.500`} />
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={`${colorScheme}.600`}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        {insight.title}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="sand.700" lineHeight="tall">
                      {insight.message}
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            );
          })}
        </VStack>

        {/* Bottom Message */}
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          p={4}
          borderRadius="lg"
          textAlign="center"
        >
          <Text fontSize="sm" color="white" fontWeight="medium">
            Every conversation is a chance to grow. Keep being you! 💜
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CoachingInsightsCard;
