import { Box, VStack, Heading, Text, SimpleGrid, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiClock, FiZap, FiTrendingUp } from 'react-icons/fi';

const MotionBox = motion(Box);

const PatternCard = ({ chatData }) => {
  const { analytics, stats } = chatData;

  const avgResponseTime = stats.responseTimes?.averageMinutes || 0;
  const peakHours = analytics.peakHours || [];

  // Determine mood based on response time
  const getResponseMood = () => {
    if (avgResponseTime < 30) return { mood: 'happy', text: 'Lightning fast!', color: 'green' };
    if (avgResponseTime < 120) return { mood: 'neutral', text: 'Pretty quick', color: 'blue' };
    return { mood: 'neutral', text: 'Taking time', color: 'orange' };
  };

  const responseMood = getResponseMood();

  return (
    <Box
      bg="white"
      borderRadius="3xl"
      p={8}
      height="100%"
      display="flex"
      flexDirection="column"
      boxShadow="2xl"
      overflow="auto"
    >
      <VStack spacing={6} align="stretch" flex={1} justify="center">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" textAlign="center" color="gray.800" mb={2}>
            Your Patterns
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            When and how you connect
          </Text>
        </MotionBox>

        <SimpleGrid columns={1} spacing={4}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            bg={`${responseMood.color}.50`}
            p={6}
            borderRadius="2xl"
            border="2px solid"
            borderColor={`${responseMood.color}.200`}
          >
            <HStack spacing={3} mb={3}>
              <Box as={FiZap} boxSize={6} color={`${responseMood.color}.600`} />
              <Text fontWeight="bold" fontSize="lg" color="gray.800">
                Response Speed
              </Text>
            </HStack>
            <Text fontSize="3xl" fontWeight="black" color={`${responseMood.color}.600`}>
              {Math.round(avgResponseTime)} min
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {responseMood.text} - Average reply time
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            bg="purple.50"
            p={6}
            borderRadius="2xl"
            border="2px solid"
            borderColor="purple.200"
          >
            <HStack spacing={3} mb={3}>
              <Box as={FiClock} boxSize={6} color="purple.600" />
              <Text fontWeight="bold" fontSize="lg" color="gray.800">
                Peak Chatting Hours
              </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap" mt={3}>
              {peakHours.slice(0, 5).map((hourData, idx) => {
                const hourValue = typeof hourData === 'object' ? hourData.hour : hourData;
                return (
                  <Badge key={idx} colorScheme="purple" fontSize="md" px={4} py={2}>
                    {hourValue}:00
                  </Badge>
                );
              })}
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={3}>
              Times when conversations flow most
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            bg="pink.50"
            p={6}
            borderRadius="2xl"
            border="2px solid"
            borderColor="pink.200"
          >
            <HStack spacing={3} mb={3}>
              <Box as={FiTrendingUp} boxSize={6} color="pink.600" />
              <Text fontWeight="bold" fontSize="lg" color="gray.800">
                Daily Average
              </Text>
            </HStack>
            <Text fontSize="3xl" fontWeight="black" color="pink.600">
              {analytics.avgMessagesPerDay}
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Messages per day on average
            </Text>
          </MotionBox>
        </SimpleGrid>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          bg="indigo.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="indigo.500"
        >
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            <strong>Coach's note:</strong> {chatData.sentiment.coachNotes?.patterns || "Your patterns show a natural rhythm. The best conversations happen when timing aligns with connection."}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default PatternCard;
