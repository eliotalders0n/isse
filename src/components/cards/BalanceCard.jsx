import { Box, VStack, Heading, Text, HStack, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ParticipantAvatar from '../ParticipantAvatar';

const MotionBox = motion(Box);

const BalanceCard = ({ chatData }) => {
  const { stats, metadata, sentiment, selectedParticipant, personalizedInsights } = chatData;

  const messageDistribution = Object.entries(stats.senderStats || {}).map(([sender, data]) => ({
    sender,
    messages: data.messageCount,
    percentage: ((data.messageCount / metadata.totalMessages) * 100).toFixed(1),
    isYou: sender === selectedParticipant,
  }));

  const getBalanceInsight = () => {
    // Use AI-enhanced coach note if available
    if (sentiment.coachNotes?.balance) {
      return sentiment.coachNotes.balance;
    }

    // Fallback to keyword-based insights
    if (!selectedParticipant || !personalizedInsights) {
      const participants = Object.values(stats.senderStats);
      if (participants.length !== 2) return "Communication balance looks good!";

      const ratio =
        Math.max(participants[0].messageCount, participants[1].messageCount) /
        Math.min(participants[0].messageCount, participants[1].messageCount);

      if (ratio < 1.3) return "Beautifully balanced - you both contribute equally.";
      if (ratio < 2) return "Mostly balanced, with one person slightly more talkative.";
      return "One person tends to share more. Consider if both feel heard.";
    }

    const yourPercentage = messageDistribution.find(d => d.isYou)?.percentage || 0;
    const otherPerson = personalizedInsights.otherPerson;

    if (yourPercentage >= 45 && yourPercentage <= 55) {
      return `Beautifully balanced - you and ${otherPerson} both contribute equally to the conversation.`;
    } else if (yourPercentage > 55) {
      return `You tend to share more (${yourPercentage}%). That's okay - everyone has their own communication style!`;
    } else {
      return `${otherPerson} tends to share more. Both styles are valid - consider what feels right for you.`;
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
      <VStack spacing={6} align="stretch" flex={1} justify="center">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" textAlign="center" color="gray.800" mb={2}>
            Who Says What
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Message distribution
          </Text>
        </MotionBox>

        <VStack spacing={6} align="stretch">
          {messageDistribution.map((person, idx) => {
            // Determine mood based on their contribution balance
            const senderData = stats.senderStats[person.sender];
            const isBalanced = parseFloat(person.percentage) > 35 && parseFloat(person.percentage) < 65;
            const mood = isBalanced ? 'happy' : parseFloat(person.percentage) > 50 ? 'happy' : 'neutral';

            return (
            <MotionBox
              key={person.sender}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.2 }}
            >
              <HStack mb={3} justify="space-between">
                <HStack spacing={3}>
                  <ParticipantAvatar name={person.sender} size="sm" showName={false} mood={mood} />
                  <VStack align="start" spacing={0}>
                    <HStack spacing={2}>
                      <Text fontWeight="bold" fontSize="lg" color="gray.800">
                        {person.isYou ? 'You' : person.sender}
                      </Text>
                      {person.isYou && (
                        <Text fontSize="xs" color="purple.500" fontWeight="semibold">
                          ({person.sender})
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {person.messages.toLocaleString()} messages
                    </Text>
                  </VStack>
                </HStack>
                <Text fontSize="2xl" fontWeight="black" color="purple.600">
                  {person.percentage}%
                </Text>
              </HStack>
              <Progress
                value={person.percentage}
                colorScheme="purple"
                size="lg"
                borderRadius="full"
                bg="purple.100"
              />
            </MotionBox>
          );
          })}
        </VStack>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          bg="blue.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="blue.500"
        >
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            <strong>Coach's note:</strong> {getBalanceInsight()}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default BalanceCard;
