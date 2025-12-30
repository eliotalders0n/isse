import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  HStack,
  OrderedList,
  ListItem,
  Card,
  Badge,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiChevronRight, FiChevronLeft, FiDownload, FiUpload, FiActivity, FiLock, FiHeart } from 'react-icons/fi';

const ROTATING_LINES = [
  {
    line1: "Turn your chats into clarity.",
    line2: "See how he really shows up for you."
  },
  {
    line1: "Messages don't lie.",
    line2: "Consistency, effort, and energy always show."
  },
  {
    line1: "It's not just messages.",
    line2: "It's effort, energy, and intention."
  },
  {
    line1: "Stop guessing.",
    line2: "Let the conversation show you."
  },
  {
    line1: "It's not overthinking.",
    line2: "It's reading the signs."
  },
  {
    line1: "Behind every message is a feeling.",
    line2: "Let the patterns tell you the truth."
  }
];

const RotatingInsightText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_LINES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = ROTATING_LINES[index];
  const MotionBox = motion(Box);

  return (
    <Box position="relative" minH={{ base: "60px", md: "70px" }}>
      <AnimatePresence mode="wait">
        <MotionBox
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Text
            fontSize={{ base: "25px", md: "30px" }}
            color="whiteAlpha.900"
            lineHeight="1.7"
            textAlign="center"
            fontWeight="600"
          >
            {current.line1}
            <br />
            {current.line2}
          </Text>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

const Walkthrough = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const MotionCard = motion(Card);

  const steps = [
    {
      useLogo: true,
      content: (
        <VStack spacing={4} align="stretch">
          <RotatingInsightText />
          <HStack
            px={4}
            py={2.5}
            bg="whiteAlpha.50"
            borderRadius="full"
            border="1px solid"
            borderColor="whiteAlpha.200"
            alignSelf="center"
            spacing={2}
          >
            <Icon as={FiLock} color="whiteAlpha.700" boxSize={3} />
            <Text fontSize={{ base: "12px", md: "13px" }} color="whiteAlpha.800" fontWeight="500">
              100% private • Data stays on your device
            </Text>
          </HStack>
        </VStack>
      ),
    },
    {
      title: "Export Your WhatsApp Chat",
      subtitle: "Quick & Easy Guide",
      icon: FiDownload,
      iconColor: "peach.500",
      content: (
        <VStack spacing={5} align="stretch">
          <Text fontSize={{ base: "14px", md: "16px" }} color="whiteAlpha.900" textAlign="center">
            Follow these simple steps to export your chat:
          </Text>

          <VStack spacing={4} align="stretch">
            <Box>
              <Badge colorScheme="orange" mb={3} fontSize="xs" px={3} py={1}>
                iOS (iPhone)
              </Badge>
              <OrderedList spacing={2} pl={4} color="whiteAlpha.900" fontSize={{ base: "13px", md: "15px" }}>
                <ListItem>Open WhatsApp and go to the chat you want to analyze</ListItem>
                <ListItem>Tap the contact/group name at the top</ListItem>
                <ListItem>Scroll down and tap "Export Chat"</ListItem>
                <ListItem>Choose "Without Media"</ListItem>
                <ListItem>Save the .txt or .zip file</ListItem>
              </OrderedList>
            </Box>

            <Box>
              <Badge colorScheme="green" mb={3} fontSize="xs" px={3} py={1}>
                Android
              </Badge>
              <OrderedList spacing={2} pl={4} color="whiteAlpha.900" fontSize={{ base: "13px", md: "15px" }}>
                <ListItem>Open WhatsApp and go to the chat</ListItem>
                <ListItem>Tap the three dots (⋮) at the top right</ListItem>
                <ListItem>Select "More" → "Export Chat"</ListItem>
                <ListItem>Choose "Without Media"</ListItem>
                <ListItem>Save the .txt or .zip file</ListItem>
              </OrderedList>
            </Box>
          </VStack>

          <HStack
            p={4}
            bg="whiteAlpha.100"
            borderRadius="lg"
            borderLeft="4px solid"
            borderColor="warm.400"
            backdropFilter="blur(10px)"
            spacing={3}
            align="start"
          >
            <Icon as={FiActivity} color="warm.400" boxSize={4} flexShrink={0} mt={0.5} />
            <Text fontSize={{ base: "12px", md: "13px" }} color="whiteAlpha.800" fontWeight="600">
              Tip: We also support .json and .pdf formats from other chat exporters!
            </Text>
          </HStack>
        </VStack>
      ),
    },
    {
      title: "Ready to Begin!",
      subtitle: "Upload Your Chat File",
      icon: FiUpload,
      iconColor: "warm.500",
      content: (
        <VStack spacing={6} align="stretch">
          <Text fontSize={{ base: "15px", md: "17px" }} color="whiteAlpha.900" lineHeight="1.7" textAlign="center">
            You're all set! Now just upload your chat export file and discover the beautiful story behind your conversations.
          </Text>

          <VStack spacing={3} align="stretch">
            <HStack spacing={3} p={3} bg="whiteAlpha.100" borderRadius="lg" backdropFilter="blur(10px)">
              <Icon as={FiMessageCircle} color="warm.400" boxSize={5} />
              <VStack align="start" spacing={0} flex={1}>
                <Text color="whiteAlpha.900" fontSize={{ base: "14px", md: "15px" }} fontWeight="600">
                  Supported formats
                </Text>
                <Text color="whiteAlpha.700" fontSize={{ base: "12px", md: "13px" }}>
                  .txt, .zip, .json, .pdf
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={3} p={3} bg="whiteAlpha.100" borderRadius="lg" backdropFilter="blur(10px)">
              <Icon as={FiHeart} color="rose.400" boxSize={5} />
              <VStack align="start" spacing={0} flex={1}>
                <Text color="whiteAlpha.900" fontSize={{ base: "14px", md: "15px" }} fontWeight="600">
                  Processing time
                </Text>
                <Text color="whiteAlpha.700" fontSize={{ base: "12px", md: "13px" }}>
                  Usually takes less than 60 seconds
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Text fontSize={{ base: "13px", md: "14px" }} color="whiteAlpha.700" textAlign="center" pt={2}>
            Click "Let's Go!" below to start your journey
          </Text>
        </VStack>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: 6, md: 12 }}
      px={{ base: 4, md: 8 }}
    >
      <Box maxW="900px" w="100%">
        <AnimatePresence mode="wait">
          <MotionCard
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            bg="whiteAlpha.100"
            backdropFilter="blur(30px)"
            borderRadius={{ base: "2xl", md: "3xl" }}
            p={{ base: 6, sm: 8, md: 12 }}
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
          >
            <VStack spacing={{ base: 6, md: 8 }} align="stretch">
              {/* Icon or Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {currentStepData.useLogo ? (
                  <Box
                    w={{ base: "330px", md: "330px" }}
                    h={{ base: "300px", md: "330px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                  >
                    <img
                      src="/teta-logo.png"
                      alt="TETA Logo"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                ) : (
                  <Box
                    w={{ base: "70px", md: "90px" }}
                    h={{ base: "70px", md: "90px" }}
                    bg={`${currentStepData.iconColor}`}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    boxShadow="0 8px 24px rgba(255, 133, 86, 0.4)"
                  >
                    <Icon as={currentStepData.icon} boxSize={{ base: 8, md: 10 }} color="white" />
                  </Box>
                )}
              </motion.div>

              {/* Title & Subtitle */}
              <VStack spacing={2}>
                <Heading
                  fontSize={{ base: "24px", sm: "28px", md: "36px" }}
                  bgGradient="linear(to-r, warm.400, peach.500, rose.500)"
                  bgClip="text"
                  textAlign="center"
                  fontWeight="800"
                >
                  {currentStepData.title}
                </Heading>
                <Text
                  fontSize={{ base: "14px", md: "16px" }}
                  color="whiteAlpha.700"
                  textAlign="center"
                  fontWeight="500"
                >
                  {currentStepData.subtitle}
                </Text>
              </VStack>

              {/* Content */}
              <Box py={{ base: 2, md: 4 }}>
                {currentStepData.content}
              </Box>

              {/* Progress Indicators */}
              <HStack spacing={2} justify="center" pt={4}>
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      width: currentStep === index ? 32 : 8,
                      backgroundColor: currentStep === index
                        ? 'rgba(255, 133, 86, 1)'
                        : 'rgba(255, 255, 255, 0.3)',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: '8px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </HStack>

              {/* Navigation Buttons */}
              <HStack spacing={3} pt={4} justify="space-between">
                <Button
                  variant="ghost"
                  color="whiteAlpha.700"
                  onClick={handleSkip}
                  fontSize={{ base: "sm", md: "md" }}
                  _hover={{ color: 'whiteAlpha.900', bg: 'whiteAlpha.100' }}
                >
                  Skip
                </Button>

                <HStack spacing={3}>
                  {!isFirstStep && (
                    <Button
                      leftIcon={<FiChevronLeft />}
                      variant="outline"
                      borderColor="whiteAlpha.300"
                      color="whiteAlpha.900"
                      onClick={handlePrev}
                      fontSize={{ base: "sm", md: "md" }}
                      _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.400' }}
                    >
                      Back
                    </Button>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      rightIcon={isLastStep ? null : <FiChevronRight />}
                      bgGradient="linear(to-r, warm.500, peach.500)"
                      color="white"
                      onClick={handleNext}
                      px={{ base: 6, md: 8 }}
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="bold"
                      _hover={{
                        bgGradient: 'linear(to-r, warm.600, peach.600)',
                        boxShadow: '0 8px 24px rgba(255, 133, 86, 0.4)',
                      }}
                      size={{ base: "md", md: "lg" }}
                    >
                      {isLastStep ? "Let's Go!" : "Next"}
                    </Button>
                  </motion.div>
                </HStack>
              </HStack>
            </VStack>
          </MotionCard>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Walkthrough;
