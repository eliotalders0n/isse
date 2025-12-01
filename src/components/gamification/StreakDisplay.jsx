import {
  Card,
  CardBody,
  SimpleGrid,
  VStack,
  Text,
  Badge,
  Box,
} from '@chakra-ui/react';
import { FiTrendingUp, FiStar, FiCalendar } from 'react-icons/fi';

const StreakDisplay = ({ streakData }) => {
  if (!streakData) return null;

  const { current, longest, total } = streakData;

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="md" fontWeight="bold">
            Conversation Streaks
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {/* Current Streak */}
            <Box textAlign="center" bg="orange.50" p={4} borderRadius="md">
              <Box mb={1} color="orange.500">
                <FiTrendingUp size={36} style={{ margin: '0 auto' }} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {current.days}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Current Streak
              </Text>
              {current.isActive && (
                <Badge colorScheme="green" mt={2}>
                  Active
                </Badge>
              )}
            </Box>

            {/* Longest Streak */}
            <Box textAlign="center" bg="purple.50" p={4} borderRadius="md">
              <Box mb={1} color="purple.500">
                <FiStar size={36} style={{ margin: '0 auto' }} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {longest.days}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Longest Streak
              </Text>
              {longest.startDate && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {new Date(longest.startDate).toLocaleDateString()}
                </Text>
              )}
            </Box>

            {/* Total Active Days */}
            <Box textAlign="center" bg="teal.50" p={4} borderRadius="md">
              <Box mb={1} color="teal.500">
                <FiCalendar size={36} style={{ margin: '0 auto' }} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                {total}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Total Active Days
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default StreakDisplay;
