import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card as ChakraCard,
  CardBody,
  Badge,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMessageSquare,
  FiSmile,
  FiClock,
  FiHelpCircle,
  FiTrendingUp,
} from 'react-icons/fi';

const MotionBox = motion(Box);

const AboutYouCard = ({ chatData }) => {
  const {
    personalizedInsights,
    personalizedSentiment,
    communicationStyle,
    selectedParticipant,
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

  const { otherPerson } = personalizedInsights;

  // Format active hours
  const activeHoursText = personalizedInsights.topHours && personalizedInsights.topHours.length > 0
    ? personalizedInsights.topHours.map(h => `${h.hour}:00`).join(', ')
    : 'Various times';

  return (
    <Box
      bg="white"
      borderRadius="3xl"
      p={8}
      height="100%"
      display="flex"
      flexDirection="column"
      boxShadow="2xl"
      overflow="hidden"
    >
      <VStack spacing={6} align="stretch" h="100%" overflowY="auto" overflowX="hidden" pr={2}>
        {/* Header */}
        <Box textAlign="center">
          <Heading
            size="xl"
            bgGradient="linear(to-r, warm.500, peach.500)"
            bgClip="text"
            fontWeight="800"
            mb={2}
          >
            About You
          </Heading>
          <Text fontSize="md" color="sand.600">
            Your personal communication insights
          </Text>
        </Box>

        <Divider />

        {/* Communication Style Badge */}
        <Box textAlign="center">
          <Text fontSize="sm" color="sand.500" mb={2}>Your Communication Style</Text>
          <Badge
            fontSize="lg"
            px={4}
            py={2}
            borderRadius="full"
            colorScheme="warm"
            textTransform="none"
          >
            {communicationStyle}
          </Badge>
        </Box>

        {/* Quick Stats Grid */}
        <SimpleGrid columns={2} spacing={3}>
          <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ChakraCard
              bg="warm.50"
              borderRadius="xl"
              border="2px solid"
              borderColor="warm.200"
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <Box as={FiMessageSquare} size={24} color="warm.500" />
                  <Text fontSize="2xl" fontWeight="bold" color="sand.800">
                    {personalizedInsights.totalMessages.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="sand.600" textAlign="center">
                    Messages Sent
                  </Text>
                </VStack>
              </CardBody>
            </ChakraCard>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ChakraCard
              bg="peach.50"
              borderRadius="xl"
              border="2px solid"
              borderColor="peach.200"
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <Box as={FiSmile} size={24} color="peach.500" />
                  <Text fontSize="2xl" fontWeight="bold" color="sand.800">
                    {personalizedSentiment.positivePercent}%
                  </Text>
                  <Text fontSize="xs" color="sand.600" textAlign="center">
                    Positive Vibe
                  </Text>
                </VStack>
              </CardBody>
            </ChakraCard>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ChakraCard
              bg="rose.50"
              borderRadius="xl"
              border="2px solid"
              borderColor="rose.200"
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <Box as={FiHelpCircle} size={24} color="rose.500" />
                  <Text fontSize="2xl" fontWeight="bold" color="sand.800">
                    {personalizedInsights.questionRate}%
                  </Text>
                  <Text fontSize="xs" color="sand.600" textAlign="center">
                    Ask Questions
                  </Text>
                </VStack>
              </CardBody>
            </ChakraCard>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <ChakraCard
              bg="orange.50"
              borderRadius="xl"
              border="2px solid"
              borderColor="orange.200"
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <Box as={FiTrendingUp} size={24} color="orange.500" />
                  <Text fontSize="2xl" fontWeight="bold" color="sand.800">
                    {personalizedInsights.initiationRate.toFixed(0)}%
                  </Text>
                  <Text fontSize="xs" color="sand.600" textAlign="center">
                    Start Chats
                  </Text>
                </VStack>
              </CardBody>
            </ChakraCard>
          </MotionBox>
        </SimpleGrid>

        {/* Additional Insights */}
        <VStack spacing={3} align="stretch" flex={1}>
          <ChakraCard bg="white" borderRadius="lg" boxShadow="sm">
            <CardBody p={4}>
              <HStack spacing={3}>
                <Box as={FiClock} size={20} color="warm.500" />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="sand.500" fontWeight="semibold">
                    Most Active
                  </Text>
                  <Text fontSize="sm" color="sand.700" fontWeight="bold">
                    {activeHoursText}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </ChakraCard>

          <ChakraCard bg="white" borderRadius="lg" boxShadow="sm">
            <CardBody p={4}>
              <HStack spacing={3}>
                <Box as={FiMessageSquare} size={20} color="warm.500" />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="sand.500" fontWeight="semibold">
                    Message Length
                  </Text>
                  <Text fontSize="sm" color="sand.700" fontWeight="bold">
                    {personalizedInsights.avgMessageLength} characters ({personalizedInsights.lengthComparison})
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </ChakraCard>

          <ChakraCard bg="white" borderRadius="lg" boxShadow="sm">
            <CardBody p={4}>
              <HStack spacing={3}>
                <Box as={FiSmile} size={20} color="warm.500" />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="sand.500" fontWeight="semibold">
                    Emoji Usage
                  </Text>
                  <Text fontSize="sm" color="sand.700" fontWeight="bold">
                    {personalizedInsights.emojiFrequency} per message ({personalizedInsights.emojiComparison} than {otherPerson})
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </ChakraCard>
        </VStack>

        {/* Bottom Insight */}
        <Box
          bg="linear-gradient(135deg, #FF8556 0%, #F97316 100%)"
          p={4}
          borderRadius="lg"
          textAlign="center"
        >
          <Text fontSize="sm" color="white" fontWeight="medium">
            You've been active for {personalizedInsights.daysActive} days in this conversation!
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default AboutYouCard;
