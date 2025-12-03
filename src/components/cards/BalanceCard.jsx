import { Box, VStack, Heading, Text, HStack, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ParticipantAvatar from '../ParticipantAvatar';

const MotionBox = motion(Box);

const BalanceCard = ({ chatData = {} }) => {
  const {
    stats = { senderStats: {} },
    metadata = { totalMessages: 1, participants: [] },
    sentiment = {},
    selectedParticipant,
    personalizedInsights
  } = chatData;

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

    const participantCount = Object.keys(stats.senderStats || {}).length;
    const isGroupChat = participantCount >= 3;

    // Group chat insights
    if (isGroupChat) {
      const messageCounts = Object.values(stats.senderStats).map(s => s.messageCount);
      const maxMessages = Math.max(...messageCounts);
      const minMessages = Math.min(...messageCounts);
      const avgMessages = messageCounts.reduce((sum, count) => sum + count, 0) / participantCount;
      const variance = messageCounts.reduce((sum, count) => sum + Math.pow(count - avgMessages, 2), 0) / participantCount;
      const stdDev = Math.sqrt(variance);
      const balanceScore = avgMessages > 0 ? 100 - (stdDev / avgMessages) * 100 : 50;

      if (balanceScore >= 70) {
        return `Excellent group balance! All ${participantCount} members contribute fairly equally.`;
      } else if (balanceScore >= 50) {
        return `Moderate balance among ${participantCount} members - most are actively participating.`;
      } else {
        const ratio = maxMessages / minMessages;
        if (ratio > 5) {
          return `Some members are much more active than others. Consider engaging quieter members!`;
        }
        return `Participation varies - some members are more active than others in the group.`;
      }
    }

    // 1-on-1 chat insights
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

  const participantCount = messageDistribution.length;
  const isLargeGroup = participantCount > 5;

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
      <VStack spacing={4} align="stretch" flex={1} height="100%">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" textAlign="center" color="gray.800" mb={1}>
            Who Says What
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            Message distribution
          </Text>
        </MotionBox>

        <VStack
          spacing={isLargeGroup ? 4 : 5}
          align="stretch"
          flex={1}
          overflowY="auto"
          maxH={isLargeGroup ? "500px" : "none"}
          pr={2}
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
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
              transition={{ delay: 0.2 + Math.min(idx * 0.1, 0.5) }}
            >
              <HStack mb={2} justify="space-between">
                <HStack spacing={3} flex={1} minW={0}>
                  <ParticipantAvatar name={person.sender} size="sm" showName={false} mood={mood} />
                  <VStack align="start" spacing={0} flex={1} minW={0}>
                    <HStack spacing={2}>
                      <Text
                        fontWeight="bold"
                        fontSize={isLargeGroup ? "md" : "lg"}
                        color="gray.800"
                        noOfLines={1}
                      >
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
                <Text fontSize={isLargeGroup ? "xl" : "2xl"} fontWeight="black" color="purple.600" flexShrink={0}>
                  {person.percentage}%
                </Text>
              </HStack>
              <Progress
                value={person.percentage}
                colorScheme="purple"
                size={isLargeGroup ? "md" : "lg"}
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
          flexShrink={0}
        >
          <Text color="gray.700" fontSize={isLargeGroup ? "sm" : "md"} lineHeight="tall">
            <strong>Coach's note:</strong> {getBalanceInsight()}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default BalanceCard;
