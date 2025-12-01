import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge as ChakraBadge,
  Card,
  CardBody,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { BADGE_CATEGORIES } from '../../utils/badgeDefinitions';

const MotionCard = motion(Card);

const BadgeCard = ({ badge, index }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'purple';
      case 'epic': return 'pink';
      case 'rare': return 'blue';
      case 'uncommon': return 'green';
      default: return 'gray';
    }
  };

  // Get the icon component dynamically
  const IconComponent = FiIcons[badge.icon];

  return (
    <MotionCard
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -5 }}
      cursor="pointer"
      bg={badge.colorScheme ? `${badge.colorScheme}.50` : 'white'}
      borderWidth="2px"
      borderColor={`${badge.colorScheme || 'gray'}.200`}
    >
      <CardBody p={4}>
        <Tooltip label={badge.description} hasArrow>
          <VStack spacing={2}>
            <Box color={`${badge.colorScheme || 'gray'}.500`}>
              {IconComponent && <IconComponent size={32} />}
            </Box>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="bold"
              textAlign="center"
              noOfLines={1}
            >
              {badge.name}
            </Text>
            <ChakraBadge
              colorScheme={getRarityColor(badge.rarity)}
              fontSize="xx-small"
              textTransform="capitalize"
            >
              {badge.rarity}
            </ChakraBadge>
          </VStack>
        </Tooltip>
      </CardBody>
    </MotionCard>
  );
};

const BadgeShowcase = ({ badges }) => {
  const columns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5 });

  if (!badges || badges.length === 0) {
    return (
      <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
        <Box mb={2} color="gray.400">
          <FiIcons.FiAward size={48} style={{ margin: '0 auto' }} />
        </Box>
        <Text color="gray.600">No badges earned yet</Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Keep chatting to unlock achievements!
        </Text>
      </Box>
    );
  }

  // Group badges by category
  const badgesByCategory = badges.reduce((acc, badge) => {
    const category = badge.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(badge);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    switch (category) {
      case BADGE_CATEGORIES.POSITIVE: return <FiIcons.FiSun size={16} style={{ display: 'inline', marginRight: '8px' }} />;
      case BADGE_CATEGORIES.FUNNY: return <FiIcons.FiSmile size={16} style={{ display: 'inline', marginRight: '8px' }} />;
      case BADGE_CATEGORIES.SPICY: return <FiIcons.FiTrendingUp size={16} style={{ display: 'inline', marginRight: '8px' }} />;
      case BADGE_CATEGORIES.MILESTONE: return <FiIcons.FiTarget size={16} style={{ display: 'inline', marginRight: '8px' }} />;
      case BADGE_CATEGORIES.ENGAGEMENT: return <FiIcons.FiZap size={16} style={{ display: 'inline', marginRight: '8px' }} />;
      default: return <FiIcons.FiAward size={16} style={{ display: 'inline', marginRight: '8px' }} />;
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case BADGE_CATEGORIES.POSITIVE: return 'Positive Badges';
      case BADGE_CATEGORIES.FUNNY: return 'Funny Badges';
      case BADGE_CATEGORIES.SPICY: return 'Spicy Badges';
      case BADGE_CATEGORIES.MILESTONE: return 'Milestone Badges';
      case BADGE_CATEGORIES.ENGAGEMENT: return 'Engagement Badges';
      default: return 'Other Badges';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Summary */}
      <Box textAlign="center" bg="teal.50" p={4} borderRadius="md">
        <HStack justify="center" spacing={4}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="teal.600">
              {badges.length}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Badges Earned
            </Text>
          </Box>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {badges.filter(b => b.rarity === 'rare' || b.rarity === 'epic' || b.rarity === 'legendary').length}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Rare+
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Badges by Category */}
      {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
        <Box key={category}>
          <HStack mb={3}>
            <Box color="gray.600">
              {getCategoryIcon(category)}
            </Box>
            <Text fontSize="md" fontWeight="bold" color="gray.700">
              {getCategoryTitle(category)} ({categoryBadges.length})
            </Text>
          </HStack>
          <SimpleGrid columns={columns} spacing={3}>
            {categoryBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
};

export default BadgeShowcase;
