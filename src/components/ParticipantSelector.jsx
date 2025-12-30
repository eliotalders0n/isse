import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  HStack,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import ParticipantAvatar from './ParticipantAvatar';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Gender Selection UI Component
const GenderSelectionUI = ({ title, subtitle, onSelect, onSkip }) => (
  <VStack spacing={6} align="stretch">
    <VStack spacing={3} textAlign="center">
      <Heading size={{ base: 'xl', md: '2xl' }} color="white" fontWeight="800">
        {title}
      </Heading>
      <Text fontSize={{ base: 'md', md: 'lg' }} color="dark.300" maxW="500px">
        {subtitle}
      </Text>
    </VStack>

    <VStack spacing={3} maxW="400px" w="100%" mx="auto" mt={4}>
      <Button
        size="lg"
        w="100%"
        bg="white"
        color="dark.800"
        fontWeight="bold"
        _hover={{ bg: 'gray.100', transform: 'scale(1.02)' }}
        _active={{ transform: 'scale(0.98)' }}
        onClick={() => onSelect('male')}
      >
        Male
      </Button>
      <Button
        size="lg"
        w="100%"
        bg="white"
        color="dark.800"
        fontWeight="bold"
        _hover={{ bg: 'gray.100', transform: 'scale(1.02)' }}
        _active={{ transform: 'scale(0.98)' }}
        onClick={() => onSelect('female')}
      >
        Female
      </Button>
      <Button
        size="sm"
        variant="ghost"
        color="dark.400"
        _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
        onClick={onSkip}
        mt={2}
      >
        Skip
      </Button>
    </VStack>

    <Text fontSize="xs" color="dark.400" textAlign="center" mt={4}>
      You can skip and we'll use gender-neutral language
    </Text>
  </VStack>
);

const ParticipantSelector = ({ participants, onSelectParticipant }) => {
  const [phase, setPhase] = useState('participant'); // 'participant' | 'user-gender' | 'partner-gender'
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [partnerName, setPartnerName] = useState(null);

  // Calculate other person's name when participant is selected
  useEffect(() => {
    if (selectedParticipant && participants.length === 2) {
      const other = participants.find(p => p !== selectedParticipant);
      setPartnerName(other);
    }
  }, [selectedParticipant, participants]);

  // Handle participant selection
  const handleParticipantClick = (participant) => {
    setSelectedParticipant(participant);

    // For 1-on-1 chats, proceed to gender selection
    if (participants.length === 2) {
      setPhase('user-gender');
    } else {
      // For group chats, skip gender selection and return immediately
      onSelectParticipant({ participant });
    }
  };

  // Handle user gender selection
  const handleUserGenderSelect = (gender) => {
    setUserGender(gender);
    setPhase('partner-gender');
  };

  const handleUserGenderSkip = () => {
    setUserGender(null);
    setPhase('partner-gender');
  };

  // Handle partner gender selection
  const handlePartnerGenderSelect = (gender) => {
    onSelectParticipant({
      participant: selectedParticipant,
      userGender,
      partnerGender: gender
    });
  };

  const handlePartnerGenderSkip = () => {
    onSelectParticipant({
      participant: selectedParticipant,
      userGender,
      partnerGender: null
    });
  };

  return (
    <Box
      minH="100vh"
      bg="dark.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="container.md" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <MotionBox
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {phase === 'participant' && (
            <VStack spacing={8} align="stretch">
              <VStack spacing={4} textAlign="center">
                <Heading
                  size={{ base: 'xl', md: '2xl' }}
                  color="white"
                  fontWeight="800"
                >
                  One More Thing...
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} color="white">
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
                    onClick={() => handleParticipantClick(participant)}
                  >
                    <CardBody py={6}>
                      <HStack spacing={6} justify="space-between">
                        <HStack spacing={4}>
                          <ParticipantAvatar name={participant} size="md" showName={false} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xl" fontWeight="bold" color="dark.800">
                              {participant}
                            </Text>
                            <Text fontSize="sm" color="accent.600">
                              This is me
                            </Text>
                          </VStack>
                        </HStack>
                        <Box as={FiUser} size={24} color="accent.600" />
                      </HStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </VStack>

              <Text fontSize="sm" color="dark.400" textAlign="center" mt={4}>
                We'll show you personalized insights about your communication style
              </Text>
            </VStack>
          )}

          {phase === 'user-gender' && (
            <GenderSelectionUI
              title="Your Gender?"
              subtitle="This helps us personalize how we speak to you"
              onSelect={handleUserGenderSelect}
              onSkip={handleUserGenderSkip}
            />
          )}

          {phase === 'partner-gender' && (
            <GenderSelectionUI
              title={`How about ${partnerName}?`}
              subtitle="This helps us describe their communication style"
              onSelect={handlePartnerGenderSelect}
              onSkip={handlePartnerGenderSkip}
            />
          )}
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ParticipantSelector;
