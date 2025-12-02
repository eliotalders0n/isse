import { Box, VStack, Heading, Text, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiStar, FiTrendingUp } from 'react-icons/fi';

const MotionBox = motion(Box);

const MilestonesCard = ({ chatData }) => {
  const { metadata, analytics, sentiment, gamification } = chatData;

  const milestones = [
    {
      icon: FiHeart,
      title: 'First Message',
      value: new Date(metadata.startDate).toLocaleDateString(),
      color: 'pink',
      description: 'Where it all began',
    },
    {
      icon: FiStar,
      title: 'Total Messages',
      value: metadata.totalMessages.toLocaleString(),
      color: 'purple',
      description: `${Math.floor(metadata.totalMessages / 1000)}K+ exchanges`,
    },
    {
      icon: FiTrendingUp,
      title: 'Longest Streak',
      value: analytics.streaks?.[0]?.days ? `${analytics.streaks[0].days} days` : 'N/A',
      color: 'blue',
      description: 'Consecutive days chatting',
    },
    {
      icon: FiAward,
      title: 'Relationship Level',
      value: gamification?.relationshipLevel?.level || 'Strong',
      color: 'green',
      description: 'Based on connection quality',
    },
  ];

  // Determine overall mood
  const overallMood = sentiment.positivePercent > 70 ? 'happy' :
                      sentiment.positivePercent > 40 ? 'neutral' : 'sad';

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
            Your Milestones
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Moments that matter
          </Text>
        </MotionBox>

        <VStack spacing={4} align="stretch">
          {milestones.map((milestone, idx) => (
            <MotionBox
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
              bg={`${milestone.color}.50`}
              p={5}
              borderRadius="2xl"
              border="2px solid"
              borderColor={`${milestone.color}.200`}
            >
              <HStack spacing={4}>
                <Box
                  bg={`${milestone.color}.100`}
                  p={3}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={`${milestone.color}.300`}
                >
                  <Box as={milestone.icon} boxSize={6} color={`${milestone.color}.600`} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                    {milestone.title}
                  </Text>
                  <Text fontSize="2xl" fontWeight="black" color={`${milestone.color}.700`}>
                    {milestone.value}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {milestone.description}
                  </Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </VStack>

        {gamification?.badges && gamification.badges.length > 0 && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            bg="gradient"
            bgGradient="linear(to-r, yellow.50, orange.50)"
            p={4}
            borderRadius="xl"
            border="2px solid"
            borderColor="yellow.200"
          >
            <HStack mb={2} spacing={2}>
              <Box as={FiAward} color="yellow.600" size={20} />
              <Text fontWeight="bold" color="gray.800" fontSize="md">
                Badges Earned
              </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap">
              {gamification.badges.slice(0, 4).map((badge, idx) => (
                <Badge key={idx} colorScheme="yellow" fontSize="xs" px={2} py={1}>
                  {badge.name}
                </Badge>
              ))}
            </HStack>
          </MotionBox>
        )}

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          bg="teal.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="teal.500"
        >
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            <strong>Coach's note:</strong> {chatData.sentiment.coachNotes?.milestones || "Every milestone is a testament to the time and care you've invested in this connection. Celebrate these wins!"}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default MilestonesCard;
