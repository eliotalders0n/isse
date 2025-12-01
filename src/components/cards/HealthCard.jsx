import { Box, VStack, Heading, Text, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';

const MotionBox = motion(Box);

const HealthCard = ({ chatData }) => {
  const { sentiment, analytics } = chatData;

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
      <VStack spacing={6} align="stretch" flex={1} justify="center">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" textAlign="center" color="gray.800" mb={2}>
            Relationship Health
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Your communication vitals
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          bg="gradient"
          bgGradient="linear(to-r, green.400, teal.500)"
          p={6}
          borderRadius="2xl"
          textAlign="center"
        >
          <Text fontSize="sm" color="white" opacity={0.9} mb={2}>
            Overall Health Status
          </Text>
          <Badge
            fontSize="2xl"
            px={6}
            py={2}
            borderRadius="full"
            bg="white"
            color={
              sentiment.communicationHealth === 'healthy'
                ? 'green.600'
                : sentiment.communicationHealth === 'moderate'
                ? 'orange.600'
                : 'red.600'
            }
            fontWeight="black"
            textTransform="uppercase"
          >
            {sentiment.communicationHealth}
          </Badge>
        </MotionBox>

        <VStack spacing={4} align="stretch">
          {analytics.streaks && analytics.streaks.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              bg="purple.50"
              p={4}
              borderRadius="xl"
            >
              <HStack spacing={3} mb={2}>
                <Box as={FiTrendingUp} color="purple.600" size={24} />
                <Text fontWeight="bold" color="gray.800">
                  Longest Streak
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="black" color="purple.600">
                {analytics.streaks[0].days} days
              </Text>
              <Text fontSize="sm" color="gray.600">
                {new Date(analytics.streaks[0].startDate).toLocaleDateString()} -{' '}
                {new Date(analytics.streaks[0].endDate).toLocaleDateString()}
              </Text>
            </MotionBox>
          )}

          {analytics.peakHours && analytics.peakHours.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              bg="blue.50"
              p={4}
              borderRadius="xl"
            >
              <HStack spacing={3} mb={3}>
                <Box as={FiClock} color="blue.600" size={24} />
                <Text fontWeight="bold" color="gray.800">
                  Most Active Times
                </Text>
              </HStack>
              <HStack spacing={2} flexWrap="wrap">
                {analytics.peakHours.slice(0, 3).map((hourData, idx) => {
                  const hourValue = typeof hourData === 'object' ? hourData.hour : hourData;
                  return (
                    <Badge key={idx} colorScheme="blue" fontSize="md" px={3} py={1}>
                      {hourValue}:00
                    </Badge>
                  );
                })}
              </HStack>
            </MotionBox>
          )}
        </VStack>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          bg="green.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="green.500"
        >
          <HStack spacing={2} mb={2}>
            <Box as={FiAward} color="green.600" size={20} />
            <Text fontWeight="bold" color="gray.800">
              Coach's note
            </Text>
          </HStack>
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            Strong relationships thrive on consistent, meaningful communication. You're doing
            great!
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default HealthCard;
