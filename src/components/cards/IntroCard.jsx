import { Box, VStack, Heading, Text, Badge, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  GENDER_PRONOUNS,
  getFeelingWithPronouns,
  getDefaultFeeling
} from '../../constants/feelingMapConstants';

const MotionBox = motion(Box);

/**
 * Goal:
 * - More dramatic, more vivid (less "warm" / generic).
 * - Zambian-flavoured emotional descriptors (without stereotypes).
 * - Women-centered: "How does he feel about me?" with clearer "energy" labels.
 *
 * Notes:
 * - Uses semantic engine data (msg.lexical.intents) same as AboutYouCard
 * - Deterministic: based on the dominant intent score + intensity thresholds.
 * - Adds: intensity label + short punchline + "signals seen" line (still neutral).
 */

// Smart function to determine how the other person feels based on semantic engine analysis
const determineFeeling = (chatData, otherPerson) => {
  const { messages = [], partnerGender } = chatData;

  const otherPersonMessages = messages.filter(m => m.sender === otherPerson);
  if (otherPersonMessages.length === 0) {
    return getDefaultFeeling(partnerGender);
  }

  // Aggregate intent scores from semantic engine (same as getPersonalizedSentiment)
  const intentTotals = {
    affection: 0,
    passion: 0,
    commitment: 0,
    reconciliation: 0,
    conflict: 0,
    drama: 0,
    uncertainty: 0,
    urgency: 0
  };

  let messagesWithIntents = 0;

  otherPersonMessages.forEach(msg => {
    if (msg.lexical && msg.lexical.intents) {
      const intents = msg.lexical.intents;

      intentTotals.affection += intents.affection || 0;
      intentTotals.passion += intents.passion || 0;
      intentTotals.commitment += intents.commitment || 0;
      intentTotals.reconciliation += intents.reconciliation || 0;
      intentTotals.conflict += intents.conflict || 0;
      intentTotals.drama += intents.drama || 0;
      intentTotals.uncertainty += intents.uncertainty || 0;
      intentTotals.urgency += intents.urgency || 0;

      messagesWithIntents++;
    }
  });

  // If no messages have intent data, return default
  if (messagesWithIntents === 0) {
    return getDefaultFeeling(partnerGender);
  }

  // Find dominant intent (highest total score)
  const dominant = Object.entries(intentTotals).sort((a, b) => b[1] - a[1])[0];
  const [dominantIntent, totalScore] = dominant;

  // Calculate average score per message (this matches how the engine scores work)
  const avgScore = totalScore / messagesWithIntents;

  // Get feeling with gender-aware pronouns
  const feeling = getFeelingWithPronouns(dominantIntent, avgScore, partnerGender || 'neutral');

  // Calculate confidence based on consistency
  const confidenceLabel = messagesWithIntents >= otherPersonMessages.length * 0.8
    ? 'High'
    : messagesWithIntents >= otherPersonMessages.length * 0.5
    ? 'Medium'
    : 'Low';

  return {
    intent: dominantIntent,
    ...feeling,
    confidence: confidenceLabel,
    disclaimer: 'Based on patterns in their messages, not mind-reading.'
  };
};

const IntroCard = ({ chatData = {} }) => {
  const {
    metadata = { participants: [] },
    selectedParticipant,
    personalizedInsights
  } = chatData;

  const otherPerson =
    personalizedInsights?.otherPerson ||
    metadata.participants.find(p => p !== selectedParticipant);

  const isGroupChat = metadata.participants.length >= 3;

  const feeling = selectedParticipant && otherPerson && !isGroupChat
    ? determineFeeling(chatData, otherPerson)
    : null;

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
        {!feeling && (
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <VStack spacing={2}>
              <Heading
                fontSize={{ base: "24px", md: "32px", lg: "40px" }}
                textAlign="center"
                color="dark.900"
                fontWeight="black"
              >
                {isGroupChat ? 'Your Group Chat Story' : 'Your Relationship Story'}
              </Heading>

              {isGroupChat && (
                <Badge
                  colorScheme="gray"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {metadata.participants.length} Members
                </Badge>
              )}
            </VStack>
          </MotionBox>
        )}

        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          textAlign="center"
          width="100%"
        >
          {feeling ? (
            <VStack spacing={{ base: 3, md: 4 }} px={{ base: 2, md: 0 }}>
              <VStack spacing={{ base: 1, md: 2 }}>
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  color="dark.500"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  How {GENDER_PRONOUNS[chatData.partnerGender || 'neutral'].he}'s coming across in the chat
                </Text>

                <Heading
                  fontSize={{ base: "42px", sm: "52px", md: "64px", lg: "72px" }}
                  fontWeight="black"
                  bgGradient={feeling.bgGradient}
                  bgClip="text"
                  letterSpacing="tighter"
                  lineHeight="0.95"
                  textAlign="center"
                >
                  {feeling.word}
                </Heading>

                <HStack spacing={2} justify="center" flexWrap="wrap">
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="blackAlpha.100"
                    color="dark.700"
                    fontWeight="800"
                    fontSize="xs"
                  >
                    Intensity: {feeling.intensity}
                  </Badge>

                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="blackAlpha.100"
                    color="dark.700"
                    fontWeight="800"
                    fontSize="xs"
                  >
                    Clarity: {feeling.confidence}
                  </Badge>
                </HStack>
              </VStack>

              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="dark.700"
                maxW={{ base: "320px", md: "380px" }}
                lineHeight="tall"
                fontWeight="700"
              >
                {feeling.punchline}
              </Text>

              <VStack spacing={2}>
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  color="dark.500"
                  maxW={{ base: "320px", md: "420px" }}
                >
                  Signals seen: {feeling.signals.join(' • ')}
                </Text>

                <Text
                  fontSize="xs"
                  color="dark.400"
                  maxW={{ base: "320px", md: "420px" }}
                >
                  {feeling.disclaimer}
                </Text>
              </VStack>
            </VStack>
          ) : (
            <VStack spacing={3}>
              <Text fontSize="xl" color="dark.700" maxW="420px" lineHeight="tall" fontWeight="700">
                {isGroupChat
                  ? 'See who\'s driving the vibe, who\'s silent, and where the tension lives.'
                  : 'Let\'s read the energy: consistency, effort, tension, and how ' + GENDER_PRONOUNS[chatData.partnerGender || 'neutral'].he + ' responds to you.'}
              </Text>

              {!isGroupChat && (
                <Text fontSize="md" color="dark.500" fontWeight="600">
                  {metadata.participants.join(' & ')}
                </Text>
              )}
            </VStack>
          )}
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default IntroCard;
