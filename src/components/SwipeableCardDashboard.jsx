import { useState } from 'react';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import IntroCard from './cards/IntroCard';
import StatsCard from './cards/StatsCard';
import AboutYouCard from './cards/AboutYouCard';
import CoachingInsightsCard from './cards/CoachingInsightsCard';
import BalanceCard from './cards/BalanceCard';
import EmotionsCard from './cards/EmotionsCard';
import WordsCard from './cards/WordsCard';
import PatternsCard from './cards/PatternsCard';
import HealthCard from './cards/HealthCard';
import MilestonesCard from './cards/MilestonesCard';
import ShareCard from './cards/ShareCard';

const MotionBox = motion(Box);

const SwipeableCardDashboard = ({ chatData }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(0);

  const cards = [
    { id: 'intro', component: IntroCard },
    { id: 'stats', component: StatsCard },
    { id: 'aboutyou', component: AboutYouCard },
    { id: 'coaching', component: CoachingInsightsCard },
    { id: 'balance', component: BalanceCard },
    { id: 'emotions', component: EmotionsCard },
    { id: 'words', component: WordsCard },
    { id: 'patterns', component: PatternsCard },
    { id: 'health', component: HealthCard },
    { id: 'milestones', component: MilestonesCard },
    { id: 'share', component: ShareCard },
  ];

  const totalCards = cards.length;

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    if (newDirection === 1 && currentCard < totalCards - 1) {
      setDirection(1);
      setCurrentCard(currentCard + 1);
    } else if (newDirection === -1 && currentCard > 0) {
      setDirection(-1);
      setCurrentCard(currentCard - 1);
    }
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const CurrentCardComponent = cards[currentCard].component;

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      {/* Progress Indicator */}
      <Box position="absolute" top={4} left={0} right={0} px={6} zIndex={10}>
        <HStack spacing={2} justify="center" mb={2}>
          {cards.map((_, idx) => (
            <Box
              key={idx}
              h="3px"
              flex={1}
              maxW="60px"
              bg={idx <= currentCard ? 'white' : 'whiteAlpha.400'}
              borderRadius="full"
              transition="all 0.3s"
            />
          ))}
        </HStack>
      </Box>

      {/* Card Container */}
      <Box
        position="relative"
        width="100%"
        maxW="500px"
        height={{ base: '85vh', md: '700px' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <AnimatePresence initial={false} custom={direction}>
          <MotionBox
            key={currentCard}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            position="absolute"
            width="100%"
            height="100%"
          >
            <CurrentCardComponent chatData={chatData} />
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Navigation Buttons (Desktop) */}
      <Box
        display={{ base: 'none', md: 'block' }}
        position="absolute"
        left={4}
        top="50%"
        transform="translateY(-50%)"
      >
        <IconButton
          icon={<FiChevronLeft />}
          onClick={() => paginate(-1)}
          isDisabled={currentCard === 0}
          colorScheme="whiteAlpha"
          variant="ghost"
          size="lg"
          fontSize="2xl"
          color="white"
          _hover={{ bg: 'whiteAlpha.300' }}
        />
      </Box>
      <Box
        display={{ base: 'none', md: 'block' }}
        position="absolute"
        right={4}
        top="50%"
        transform="translateY(-50%)"
      >
        <IconButton
          icon={<FiChevronRight />}
          onClick={() => paginate(1)}
          isDisabled={currentCard === totalCards - 1}
          colorScheme="whiteAlpha"
          variant="ghost"
          size="lg"
          fontSize="2xl"
          color="white"
          _hover={{ bg: 'whiteAlpha.300' }}
        />
      </Box>

      {/* Swipe Hint for Mobile */}
      {currentCard === 0 && (
        <Box
          position="absolute"
          bottom={8}
          left={0}
          right={0}
          textAlign="center"
          color="whiteAlpha.700"
          fontSize="sm"
          display={{ base: 'block', md: 'none' }}
        >
          Swipe to explore →
        </Box>
      )}
    </Box>
  );
};

export default SwipeableCardDashboard;
