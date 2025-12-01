import { Box, VStack, Heading, Text, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ParticipantAvatar from '../ParticipantAvatar';

const MotionBox = motion(Box);

const IntroCard = ({ chatData }) => {
  const { metadata, sentiment, selectedParticipant, personalizedInsights } = chatData;

  // Determine overall mood based on sentiment
  const overallMood = sentiment.positivePercent > 70 ? 'happy' :
                      sentiment.positivePercent > 40 ? 'neutral' : 'sad';

  const otherPerson = personalizedInsights?.otherPerson || metadata.participants.find(p => p !== selectedParticipant);

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
          <Heading
            size="2xl"
            textAlign="center"
            bgGradient="linear(to-r, purple.600, pink.500)"
            bgClip="text"
            fontWeight="black"
          >
            Your Relationship Story
          </Heading>
        </MotionBox>

        <HStack spacing={8} justify="center" flexWrap="wrap">
          {metadata.participants.map((participant, idx) => (
            <MotionBox
              key={participant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.2 }}
            >
              <ParticipantAvatar name={participant} size="xl" mood={overallMood} />
            </MotionBox>
          ))}
        </HStack>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          textAlign="center"
        >
          <Text fontSize="xl" color="gray.600" maxW="400px" lineHeight="tall">
            {selectedParticipant && otherPerson
              ? `Let's explore your connection with ${otherPerson}`
              : 'Discover the beautiful patterns in your connection'}
          </Text>
          <Text fontSize="md" color="gray.500" mt={4}>
            {metadata.participants.join(' & ')}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default IntroCard;
