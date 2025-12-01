import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const RelationshipLevelCard = ({ level, compact = false }) => {
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl" });
  const titleSize = useBreakpointValue({ base: "lg", md: "xl" });

  if (!level) return null;

  const { level: levelNumber, title, description, components, nextLevelProgress } = level;

  // Get gradient based on level
  const getGradient = (lvl) => {
    if (lvl >= 9) return 'linear(to-r, purple.400, pink.400)';
    if (lvl >= 7) return 'linear(to-r, teal.400, blue.400)';
    if (lvl >= 5) return 'linear(to-r, green.400, teal.400)';
    if (lvl >= 3) return 'linear(to-r, yellow.400, orange.400)';
    return 'linear(to-r, gray.400, gray.500)';
  };

  if (compact) {
    return (
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Relationship Level
              </Text>
              <Badge
                fontSize="lg"
                px={3}
                py={1}
                borderRadius="full"
                bgGradient={getGradient(levelNumber)}
                color="white"
              >
                {levelNumber}
              </Badge>
            </HStack>
            <Text fontSize="md" fontWeight="bold">
              {title}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {description}
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
          {/* Level Display */}
          <Box textAlign="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
              Relationship Level
            </Text>
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              bgGradient={getGradient(levelNumber)}
              borderRadius="full"
              w={{ base: "120px", md: "150px" }}
              h={{ base: "120px", md: "150px" }}
              mb={3}
              boxShadow="lg"
            >
              <Heading size={headingSize} color="white">
                {levelNumber}
              </Heading>
            </Box>
            <Heading size={titleSize} mb={1}>
              {title}
            </Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
              {description}
            </Text>
          </Box>

          {/* Progress to Next Level */}
          {levelNumber < 10 && (
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">
                  Progress to Level {Math.ceil(levelNumber)}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="teal.500">
                  {nextLevelProgress}%
                </Text>
              </HStack>
              <Progress
                value={nextLevelProgress}
                colorScheme="teal"
                borderRadius="full"
                size="sm"
              />
            </Box>
          )}

          {/* Components Breakdown */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={3} color="gray.600">
              Level Components
            </Text>
            <SimpleGrid columns={2} spacing={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Frequency</StatLabel>
                <StatNumber fontSize="lg">{components.frequency}/10</StatNumber>
                <StatHelpText>
                  <Progress
                    value={components.frequency * 10}
                    size="xs"
                    colorScheme="blue"
                    borderRadius="full"
                  />
                </StatHelpText>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Positivity</StatLabel>
                <StatNumber fontSize="lg">{components.positivity}/10</StatNumber>
                <StatHelpText>
                  <Progress
                    value={components.positivity * 10}
                    size="xs"
                    colorScheme="green"
                    borderRadius="full"
                  />
                </StatHelpText>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Engagement</StatLabel>
                <StatNumber fontSize="lg">{components.engagement}/10</StatNumber>
                <StatHelpText>
                  <Progress
                    value={components.engagement * 10}
                    size="xs"
                    colorScheme="purple"
                    borderRadius="full"
                  />
                </StatHelpText>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Resolution</StatLabel>
                <StatNumber fontSize="lg">{components.conflictResolution}/10</StatNumber>
                <StatHelpText>
                  <Progress
                    value={components.conflictResolution * 10}
                    size="xs"
                    colorScheme="orange"
                    borderRadius="full"
                  />
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default RelationshipLevelCard;
