import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Progress,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const HealthScorePanel = ({ healthScores }) => {
  if (!healthScores || !healthScores.current) return null;

  const { current, trend, recommendations } = healthScores;

  const getColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'teal';
    if (score >= 40) return 'yellow';
    return 'red';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return FiTrendingUp;
    if (trend === 'needs_attention') return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'green';
    if (trend === 'needs_attention') return 'red';
    return 'gray';
  };

  const TrendIcon = getTrendIcon(trend);

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="bold">
              Relationship Health Scores
            </Text>
            <HStack>
              <TrendIcon color={getTrendColor(trend)} />
              <Badge colorScheme={getTrendColor(trend)} textTransform="capitalize">
                {trend?.replace('_', ' ') || 'stable'}
              </Badge>
            </HStack>
          </HStack>

          {/* Health Metrics */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Communication
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={`${getColor(current.communication)}.600`}>
                  {current.communication}/100
                </Text>
              </HStack>
              <Progress
                value={current.communication}
                colorScheme={getColor(current.communication)}
                borderRadius="full"
                size="md"
              />
            </Box>

            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Emotional
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={`${getColor(current.emotional)}.600`}>
                  {current.emotional}/100
                </Text>
              </HStack>
              <Progress
                value={current.emotional}
                colorScheme={getColor(current.emotional)}
                borderRadius="full"
                size="md"
              />
            </Box>

            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Engagement
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={`${getColor(current.engagement)}.600`}>
                  {current.engagement}/100
                </Text>
              </HStack>
              <Progress
                value={current.engagement}
                colorScheme={getColor(current.engagement)}
                borderRadius="full"
                size="md"
              />
            </Box>

            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Overall
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={`${getColor(current.overall)}.600`}>
                  {current.overall}/100
                </Text>
              </HStack>
              <Progress
                value={current.overall}
                colorScheme={getColor(current.overall)}
                borderRadius="full"
                size="md"
              />
            </Box>
          </SimpleGrid>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <Box bg="blue.50" p={3} borderRadius="md">
              <Text fontSize="xs" fontWeight="bold" mb={2} color="blue.800">
                💡 Recommendations
              </Text>
              <VStack align="stretch" spacing={1}>
                {recommendations.map((rec, index) => (
                  <Text key={index} fontSize="xs" color="blue.700">
                    • {rec}
                  </Text>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default HealthScorePanel;
