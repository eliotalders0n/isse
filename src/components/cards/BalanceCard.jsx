import { Box, VStack, Heading, Text, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ParticipantAvatar from '../ParticipantAvatar';

const MotionBox = motion(Box);

// Get gradient for balance level
const getBalanceGradient = (percentage) => {
  const percent = parseFloat(percentage);
  if (percent >= 45 && percent <= 55) {
    return 'linear(to-r, green.400, teal.500)'; // Perfectly balanced
  } else if (percent >= 35 && percent < 45) {
    return 'linear(to-r, blue.400, cyan.500)'; // Slightly less
  } else if (percent > 55 && percent <= 65) {
    return 'linear(to-r, orange.400, yellow.500)'; // Slightly more
  } else if (percent < 35) {
    return 'linear(to-r, purple.400, indigo.500)'; // Much less
  } else {
    return 'linear(to-r, pink.400, rose.500)'; // Much more
  }
};

const BalanceCard = ({ chatData = {} }) => {
  const {
    stats = { senderStats: {} },
    metadata = { totalMessages: 1, participants: [] },
    sentiment = {},
    selectedParticipant,
    personalizedInsights
  } = chatData;

  const messageDistribution = Object.entries(stats.senderStats || {})
    .map(([sender, data]) => ({
      sender,
      messages: data.messageCount,
      percentage: ((data.messageCount / metadata.totalMessages) * 100).toFixed(1),
      isYou: sender === selectedParticipant,
    }))
    .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending

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
      <VStack spacing={{ base: 6, md: 8 }} align="center" justify="center" flex={1}>
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
            Who Says What
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500">
            Message distribution across the conversation
          </Text>
        </MotionBox>

        {/* Message Distribution */}
        <VStack spacing={{ base: 5, md: 6 }} w="100%" maxW="500px">
          {messageDistribution.map((person, idx) => (
            <MotionBox
              key={person.sender}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1, type: 'spring' }}
              w="100%"
            >
              <VStack spacing={2} w="100%">
                <HStack spacing={3} w="100%" justify="center">
                  <ParticipantAvatar
                    name={person.sender}
                    size="sm"
                    showName={false}
                  />
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    color="dark.800"
                  >
                    {person.isYou ? 'You' : person.sender}
                  </Text>
                </HStack>

                <Heading
                  fontSize={{ base: "44px", sm: "52px", md: "60px", lg: "68px" }}
                  fontWeight="black"
                  bgGradient={getBalanceGradient(person.percentage)}
                  bgClip="text"
                  letterSpacing="tighter"
                  lineHeight="1"
                  textAlign="center"
                >
                  {person.percentage}%
                </Heading>

                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  color="dark.600"
                  textAlign="center"
                  fontWeight="600"
                >
                  {person.messages.toLocaleString()} messages
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </VStack>

        {/* Bottom coaching insight */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          textAlign="center"
          maxW="400px"
        >
          <Text fontSize={{ base: "xs", sm: "sm" }} color="dark.500" lineHeight="tall">
            {getBalanceInsight()}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default BalanceCard;
