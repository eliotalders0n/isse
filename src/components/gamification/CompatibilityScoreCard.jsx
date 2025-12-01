import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  CircularProgress,
  CircularProgressLabel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const CompatibilityScoreCard = ({ score, compact = false }) => {
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl" });
  const tierSize = useBreakpointValue({ base: "md", md: "lg" });

  if (!score) return null;

  const { score: scoreValue, breakdown, tier } = score;

  // Get color based on score
  const getColor = (val) => {
    if (val >= 90) return 'green';
    if (val >= 80) return 'teal';
    if (val >= 70) return 'blue';
    if (val >= 60) return 'cyan';
    if (val >= 50) return 'yellow';
    if (val >= 40) return 'orange';
    return 'red';
  };

  const color = getColor(scoreValue);

  if (compact) {
    return (
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Compatibility Score
              </Text>
              <CircularProgress
                value={scoreValue}
                color={`${color}.400`}
                size="60px"
                thickness="8px"
              >
                <CircularProgressLabel fontSize="md" fontWeight="bold">
                  {scoreValue}
                </CircularProgressLabel>
              </CircularProgress>
            </HStack>
            <Text fontSize="md" fontWeight="bold">
              {tier}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <MotionCard
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <CardBody>
        <VStack align="stretch" spacing={6}>
          {/* Score Display */}
          <Box textAlign="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={4}>
              Compatibility Score
            </Text>
            <CircularProgress
              value={scoreValue}
              color={`${color}.400`}
              size={{ base: "140px", md: "180px" }}
              thickness="10px"
              mb={4}
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Heading size={headingSize} color={`${color}.500`}>
                    {scoreValue}
                  </Heading>
                  <Text fontSize="xs" color="gray.500">
                    out of 100
                  </Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>
            <Heading size={tierSize} color={`${color}.600`}>
              {tier}
            </Heading>
          </Box>

          {/* Breakdown */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={3} color="gray.600">
              Compatibility Breakdown
            </Text>
            <VStack spacing={3} align="stretch">
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs">Sentiment Balance</Text>
                  <Text fontSize="xs" fontWeight="bold">
                    {Math.round(breakdown.sentimentBalance)}%
                  </Text>
                </HStack>
                <Progress
                  value={breakdown.sentimentBalance}
                  colorScheme="purple"
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs">Emotion Synchrony</Text>
                  <Text fontSize="xs" fontWeight="bold">
                    {Math.round(breakdown.emotionSynchrony)}%
                  </Text>
                </HStack>
                <Progress
                  value={breakdown.emotionSynchrony}
                  colorScheme="pink"
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs">Communication Balance</Text>
                  <Text fontSize="xs" fontWeight="bold">
                    {Math.round(breakdown.communicationBalance)}%
                  </Text>
                </HStack>
                <Progress
                  value={breakdown.communicationBalance}
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs">Affection Level</Text>
                  <Text fontSize="xs" fontWeight="bold">
                    {Math.round(breakdown.affectionLevel)}%
                  </Text>
                </HStack>
                <Progress
                  value={breakdown.affectionLevel}
                  colorScheme="red"
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs">Conflict Handling</Text>
                  <Text fontSize="xs" fontWeight="bold">
                    {Math.round(breakdown.conflictHandling)}%
                  </Text>
                </HStack>
                <Progress
                  value={breakdown.conflictHandling}
                  colorScheme="orange"
                  size="sm"
                  borderRadius="full"
                />
              </Box>
            </VStack>
          </Box>

          {/* What This Means */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Text fontSize="xs" fontWeight="medium" mb={2} color="gray.700">
              What This Means
            </Text>
            <Text fontSize="xs" color="gray.600">
              {scoreValue >= 80 && "You have exceptional compatibility! Your communication styles, emotional patterns, and interaction balance align beautifully."}
              {scoreValue >= 60 && scoreValue < 80 && "You have good compatibility with room to grow. You share many positive patterns and understand each other well."}
              {scoreValue >= 40 && scoreValue < 60 && "Your compatibility shows potential. Focus on balanced communication and emotional understanding."}
              {scoreValue < 40 && "There's room for improvement in your communication patterns. Consider working on balance and emotional alignment."}
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default CompatibilityScoreCard;
