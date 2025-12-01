import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import RelationshipLevelCard from '../gamification/RelationshipLevelCard';
import CompatibilityScoreCard from '../gamification/CompatibilityScoreCard';
import BadgeShowcase from '../gamification/BadgeShowcase';
import HealthScorePanel from '../gamification/HealthScorePanel';
import StreakDisplay from '../gamification/StreakDisplay';
import MilestonesTimeline from '../gamification/MilestonesTimeline';

const MotionBox = motion(Box);

const GamificationTab = ({ stats, metadata, analytics, sentiment, gamification }) => {
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });

  if (!gamification) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No gamification data available</Text>
      </Box>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionBox variants={itemVariants}>
          <Heading size={headingSize} mb={2}>
            Relationship Gamification
          </Heading>
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            Discover your relationship level, compatibility score, and unlock achievements
          </Text>
        </MotionBox>

        {/* Top Row: Level and Compatibility */}
        <MotionBox variants={itemVariants}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <RelationshipLevelCard level={gamification.relationshipLevel} />
            <CompatibilityScoreCard score={gamification.compatibilityScore} />
          </SimpleGrid>
        </MotionBox>

        {/* Health Scores */}
        <MotionBox variants={itemVariants}>
          <HealthScorePanel healthScores={gamification.healthScores} />
        </MotionBox>

        {/* Streak Display */}
        <MotionBox variants={itemVariants}>
          <StreakDisplay streakData={gamification.streakData} />
        </MotionBox>

        {/* Badges */}
        <MotionBox variants={itemVariants}>
          <Heading size="md" mb={4}>
            Achievements & Badges
          </Heading>
          <BadgeShowcase badges={gamification.badges} />
        </MotionBox>

        {/* Milestones */}
        <MotionBox variants={itemVariants}>
          <Heading size="md" mb={4}>
            Milestones Reached
          </Heading>
          <MilestonesTimeline milestones={gamification.milestones} />
        </MotionBox>
      </VStack>
    </MotionBox>
  );
};

export default GamificationTab;
