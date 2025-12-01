import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import ParticipantAvatar from './ParticipantAvatar';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const ParticipantSelector = ({ participants, onSelectParticipant }) => {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(180deg, #FFF5F0 0%, #FFEDD5 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="container.md" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={8} align="stretch">
            <VStack spacing={4} textAlign="center">
              <Heading
                size={{ base: 'xl', md: '2xl' }}
                color="warm.700"
                fontWeight="800"
              >
                One More Thing...
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="sand.600">
                Which one are you? This helps us personalize your insights.
              </Text>
            </VStack>

            <VStack spacing={4}>
              {participants.map((participant, idx) => (
                <MotionCard
                  key={participant}
                  w="100%"
                  bg="white"
                  boxShadow="md"
                  cursor="pointer"
                  initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: 'lg' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectParticipant(participant)}
                >
                  <CardBody py={6}>
                    <HStack spacing={6} justify="space-between">
                      <HStack spacing={4}>
                        <ParticipantAvatar name={participant} size="md" showName={false} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xl" fontWeight="bold" color="sand.800">
                            {participant}
                          </Text>
                          <Text fontSize="sm" color="sand.500">
                            This is me
                          </Text>
                        </VStack>
                      </HStack>
                      <Box as={FiUser} size={24} color="warm.400" />
                    </HStack>
                  </CardBody>
                </MotionCard>
              ))}
            </VStack>

            <Text fontSize="sm" color="sand.500" textAlign="center" mt={4}>
              We'll show you personalized insights about your communication style
            </Text>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ParticipantSelector;
