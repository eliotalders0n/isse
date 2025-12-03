import { Box, VStack, Heading, Text, SimpleGrid, Badge, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';
import ParticipantAvatar from '../ParticipantAvatar';

const MotionBox = motion(Box);

const WordsCard = ({ chatData = {} }) => {
  const {
    analytics = { wordFrequencyPerSender: {}, totalDays: 0 },
    stats = { senderStats: {} },
    sentiment = { coachNotes: {} }
  } = chatData;

  // Get top words per sender
  const topWordsBySender = analytics.wordFrequencyPerSender || {};

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
            Words You Love
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Most used expressions
          </Text>
        </MotionBox>

        <VStack spacing={6} align="stretch">
          {Object.entries(topWordsBySender).map(([sender, words], idx) => {
            // Determine mood based on message count ratio
            const senderData = stats.senderStats[sender];
            const avgWords = senderData?.messageCount / analytics.totalDays || 0;
            const mood = avgWords > 50 ? 'happy' : avgWords > 20 ? 'neutral' : 'neutral';

            return (
              <MotionBox
                key={sender}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.2 }}
                bg={idx === 0 ? 'purple.50' : 'blue.50'}
                p={5}
                borderRadius="2xl"
                border="2px solid"
                borderColor={idx === 0 ? 'purple.200' : 'blue.200'}
              >
                <HStack mb={4} spacing={3}>
                  <ParticipantAvatar name={sender} size="sm" showName={false} mood={mood} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                      {sender}
                    </Text>
                    <HStack spacing={2}>
                      <Box as={FiMessageSquare} size={14} color="gray.500" />
                      <Text fontSize="xs" color="gray.600">
                        Top expressions
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                <HStack spacing={2} flexWrap="wrap">
                  {words.slice(0, 8).map((wordData, wordIdx) => (
                    <MotionBox
                      key={wordIdx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + wordIdx * 0.05 }}
                    >
                      <Badge
                        colorScheme={idx === 0 ? 'purple' : 'blue'}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {wordData.word} ({wordData.count})
                      </Badge>
                    </MotionBox>
                  ))}
                </HStack>
              </MotionBox>
            );
          })}
        </VStack>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          bg="orange.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="orange.500"
        >
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            <strong>Coach's note:</strong> {sentiment.coachNotes?.words || "The words you use most reveal what matters to you both. These are the threads that weave your story together."}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default WordsCard;
