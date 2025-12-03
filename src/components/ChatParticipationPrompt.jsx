import { Box, VStack, Heading, Text, Button, HStack, Container, Card, CardBody } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUsers, FiUser } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ChatParticipationPrompt = ({ participants, onResponse }) => {
  const isGroupChat = participants.length >= 3;

  return (
    <Container maxW="container.md" py={{ base: 12, md: 20 }} px={{ base: 4, md: 6 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bg="white" borderRadius="2xl" boxShadow="2xl">
          <CardBody p={{ base: 8, md: 10 }}>
            <VStack spacing={8} align="stretch">
              {/* Icon */}
              <Box textAlign="center">
                <Box
                  as={isGroupChat ? FiUsers : FiUser}
                  size={64}
                  color="purple.500"
                  mx="auto"
                  mb={4}
                />
                <Heading size="xl" color="gray.800" mb={3}>
                  {isGroupChat ? 'Group Chat Detected' : 'Chat Loaded'}
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  {isGroupChat
                    ? `Found ${participants.length} participants in this conversation`
                    : `Found a conversation between ${participants.join(' and ')}`}
                </Text>
              </Box>

              {/* Participant List */}
              <Box
                bg="gray.50"
                p={4}
                borderRadius="lg"
                maxH="150px"
                overflowY="auto"
              >
                <VStack align="start" spacing={2}>
                  {participants.map((participant, idx) => (
                    <HStack key={idx} spacing={2}>
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg="purple.400"
                      />
                      <Text fontSize="md" color="gray.700" fontWeight="medium">
                        {participant}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Question */}
              <Box textAlign="center" py={2}>
                <Text fontSize="xl" fontWeight="bold" color="purple.600" mb={2}>
                  Are you part of this conversation?
                </Text>
                <Text fontSize="md" color="gray.600">
                  We'll personalize insights if you're a participant
                </Text>
              </Box>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <MotionButton
                  size="lg"
                  colorScheme="purple"
                  width="100%"
                  leftIcon={<FiUser />}
                  onClick={() => onResponse(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  fontSize="lg"
                  py={7}
                >
                  Yes, I'm in this chat
                </MotionButton>

                <MotionButton
                  size="lg"
                  variant="outline"
                  colorScheme="gray"
                  width="100%"
                  onClick={() => onResponse(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  fontSize="md"
                  py={6}
                >
                  No, just analyze it
                </MotionButton>
              </VStack>

              {/* Helper Text */}
              <Text fontSize="sm" color="gray.500" textAlign="center" pt={2}>
                {isGroupChat
                  ? "Selecting 'Yes' will let you see your personal stats within the group"
                  : "Selecting 'Yes' will give you personalized coaching insights"}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>
    </Container>
  );
};

export default ChatParticipationPrompt;
