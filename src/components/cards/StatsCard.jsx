import { Box, VStack, Heading, Text, SimpleGrid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiCalendar, FiZap, FiHeart } from 'react-icons/fi';

const MotionBox = motion(Box);

const StatItem = ({ icon, label, value, color, delay }) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring' }}
  >
    <VStack
      bg={`${color}.50`}
      p={6}
      borderRadius="2xl"
      spacing={3}
      border="2px solid"
      borderColor={`${color}.200`}
    >
      <Icon as={icon} boxSize={8} color={`${color}.600`} />
      <Text fontSize="3xl" fontWeight="black" color={`${color}.700`}>
        {value}
      </Text>
      <Text fontSize="sm" color="gray.600" fontWeight="semibold">
        {label}
      </Text>
    </VStack>
  </MotionBox>
);

const StatsCard = ({ chatData }) => {
  const { metadata, analytics, sentiment } = chatData;

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
            At a Glance
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Your conversation snapshot
          </Text>
        </MotionBox>

        <SimpleGrid columns={2} spacing={4}>
          <StatItem
            icon={FiMessageCircle}
            label="Messages"
            value={metadata.totalMessages.toLocaleString()}
            color="blue"
            delay={0.2}
          />
          <StatItem
            icon={FiCalendar}
            label="Days"
            value={analytics.totalDays}
            color="purple"
            delay={0.3}
          />
          <StatItem
            icon={FiZap}
            label="Per Day"
            value={analytics.avgMessagesPerDay}
            color="orange"
            delay={0.4}
          />
          <StatItem
            icon={FiHeart}
            label="Vibe"
            value={sentiment.overallSentiment}
            color="pink"
            delay={0.5}
          />
        </SimpleGrid>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          bg="purple.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="purple.500"
        >
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            <strong>Coach's note:</strong>{' '}
            {sentiment.coachNotes?.stats || (analytics.avgMessagesPerDay > 50
              ? "You two chat quite a lot! Strong connection indicator."
              : analytics.avgMessagesPerDay > 20
              ? "Regular and consistent communication shows healthy engagement."
              : "Your conversations are thoughtful and intentional.")}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default StatsCard;
