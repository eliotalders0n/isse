import { Box, VStack, Heading, Text, HStack, SimpleGrid, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ParticipantAvatar from '../ParticipantAvatar';

const MotionBox = motion(Box);

const IntroCard = ({ chatData = {} }) => {
  const {
    metadata = { participants: [] },
    sentiment = { positivePercent: 50 },
    selectedParticipant,
    personalizedInsights
  } = chatData;

  // Determine overall mood based on sentiment
  const overallMood = sentiment.positivePercent > 70 ? 'happy' :
                      sentiment.positivePercent > 40 ? 'neutral' : 'sad';

  const otherPerson = personalizedInsights?.otherPerson || metadata.participants.find(p => p !== selectedParticipant);
  const isGroupChat = metadata.participants.length >= 3;

  return (
    <Box
      bg="white"
      borderRadius="3xl"
      p={8}
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      boxShadow="2xl"
    >
      <VStack spacing={8} align="center" justify="center" flex={1}>
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <VStack spacing={2}>
            <Heading
              size="2xl"
              textAlign="center"
              bgGradient="linear(to-r, purple.600, pink.500)"
              bgClip="text"
              fontWeight="black"
            >
              {isGroupChat ? 'Your Group Chat Story' : 'Your Relationship Story'}
            </Heading>
            {isGroupChat && (
              <Badge
                colorScheme="purple"
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

        {/* Show avatars in grid layout for groups, horizontal for 1-on-1 */}
        {isGroupChat ? (
          <SimpleGrid
            columns={metadata.participants.length <= 4 ? 2 : 3}
            spacing={6}
            justify="center"
            maxW="500px"
          >
            {metadata.participants.map((participant, idx) => (
              <MotionBox
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1, type: 'spring' }}
              >
                <VStack spacing={2}>
                  <ParticipantAvatar name={participant} size="lg" mood={overallMood} />
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    fontWeight="600"
                    textAlign="center"
                    noOfLines={1}
                    maxW="120px"
                  >
                    {participant}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        ) : (
          <HStack spacing={8} justify="center" flexWrap="wrap">
            {metadata.participants.map((participant, idx) => (
              <MotionBox
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.2, type: 'spring' }}
              >
                <ParticipantAvatar name={participant} size="xl" mood={overallMood} />
              </MotionBox>
            ))}
          </HStack>
        )}

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          textAlign="center"
        >
          <Text fontSize="xl" color="gray.600" maxW="400px" lineHeight="tall">
            {isGroupChat
              ? 'Discover the dynamics and patterns in your group conversations'
              : selectedParticipant && otherPerson
              ? `Let's explore your connection with ${otherPerson}`
              : 'Discover the beautiful patterns in your connection'}
          </Text>
          {!isGroupChat && (
            <Text fontSize="md" color="gray.500" mt={4}>
              {metadata.participants.join(' & ')}
            </Text>
          )}
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default IntroCard;
