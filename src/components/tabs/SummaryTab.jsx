import { useRef } from 'react';
import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Text,
  SimpleGrid,
  Badge,
  List,
  ListItem,
  ListIcon,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { FiCheckCircle, FiInfo, FiHeart, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ShareOptions from '../ShareOptions';

const SummaryTab = ({ sentiment, stats, metadata }) => {
  const participants = metadata.participants || [];
  const summaryRef = useRef(null);

  const MotionCard = motion(Card);
  const MotionBadge = motion(Badge);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getCommunicationHealthColor = (health) => {
    switch (health) {
      case 'healthy':
        return 'green';
      case 'moderate':
        return 'yellow';
      default:
        return 'red';
    }
  };

  const getSentimentColor = (sentimentType) => {
    switch (sentimentType) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <VStack spacing={6} align="stretch" ref={summaryRef}>
        <MotionCard
          bg="gradient-to-r"
          bgGradient="linear(to-r, purple.500, purple.700)"
          color="white"
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(159, 122, 234, 0.5)' }}
        >
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Heading size="lg">Your Relationship Summary</Heading>
            <Text fontSize="lg" opacity={0.9}>
              {participants.join(' & ')}
            </Text>
            <HStack spacing={4} flexWrap="wrap">
              <MotionBadge
                colorScheme={getSentimentColor(sentiment.overallSentiment)}
                fontSize="md"
                px={3}
                py={1}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {sentiment.overallSentiment.toUpperCase()} Overall Sentiment
              </MotionBadge>
              <MotionBadge
                colorScheme={getCommunicationHealthColor(sentiment.communicationHealth)}
                fontSize="md"
                px={3}
                py={1}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {sentiment.communicationHealth.toUpperCase()} Communication
              </MotionBadge>
            </HStack>
          </VStack>
        </CardBody>
      </MotionCard>

      <Box>
        <Heading size="md" mb={4}>
          Key Insights
        </Heading>
        <Card>
          <CardBody>
            <List spacing={3}>
              {sentiment.insights?.map((insight, idx) => (
                <ListItem key={idx} display="flex" alignItems="flex-start">
                  <ListIcon as={FiCheckCircle} color="purple.500" mt={1} />
                  <Text>{insight}</Text>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Emotional Profile
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Card borderColor="green.200" borderWidth={2}>
            <CardHeader pb={2}>
              <HStack>
                <FiHeart color="var(--chakra-colors-green-500)" />
                <Heading size="sm">Positive Moments</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <Text fontSize="3xl" fontWeight="bold" color="green.600" mb={2}>
                {sentiment.positivePercent}%
              </Text>
              <Text fontSize="sm" color="gray.600">
                of your conversations show positive sentiment
              </Text>
              {sentiment.mostPositivePeriod && (
                <Box mt={3} p={2} bg="green.50" borderRadius="md">
                  <Text fontSize="xs" color="gray.600">
                    Most positive period:
                  </Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {new Date(sentiment.mostPositivePeriod).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </Box>
              )}
            </CardBody>
          </Card>

          <Card borderColor="orange.200" borderWidth={2}>
            <CardHeader pb={2}>
              <HStack>
                <FiInfo color="var(--chakra-colors-orange-500)" />
                <Heading size="sm">Areas of Tension</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <Text fontSize="3xl" fontWeight="bold" color="orange.600" mb={2}>
                {sentiment.negativePercent}%
              </Text>
              <Text fontSize="sm" color="gray.600">
                of conversations show negative sentiment
              </Text>
              {sentiment.mostNegativePeriod && (
                <Box mt={3} p={2} bg="orange.50" borderRadius="md">
                  <Text fontSize="xs" color="gray.600">
                    Most challenging period:
                  </Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {new Date(sentiment.mostNegativePeriod).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </Box>
              )}
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Dominant Emotions
        </Heading>
        <Card>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {sentiment.topEmotions?.map((emotion, idx) => (
                <Box
                  key={emotion}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  textAlign="center"
                  borderWidth={2}
                  borderColor={idx === 0 ? 'purple.300' : 'gray.200'}
                >
                  <Badge
                    colorScheme={idx === 0 ? 'purple' : idx === 1 ? 'purple' : 'purple'}
                    fontSize="lg"
                    px={3}
                    py={1}
                    mb={2}
                  >
                    #{idx + 1}
                  </Badge>
                  <Text fontSize="xl" fontWeight="bold" textTransform="capitalize">
                    {emotion}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Activity Overview
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Card>
            <CardHeader pb={2}>
              <HStack>
                <FiCalendar color="var(--chakra-colors-purple-500)" />
                <Heading size="sm">Conversation Duration</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {sentiment.totalDays} days
              </Text>
              <Text fontSize="sm" color="gray.600" mt={2}>
                From {new Date(metadata.startDate).toLocaleDateString()} to{' '}
                {new Date(metadata.endDate).toLocaleDateString()}
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader pb={2}>
              <HStack>
                <FiTrendingUp color="var(--chakra-colors-purple-500)" />
                <Heading size="sm">Daily Activity</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {sentiment.avgMessagesPerDay} msgs/day
              </Text>
              <Text fontSize="sm" color="gray.600" mt={2}>
                Total: {metadata.totalMessages.toLocaleString()} messages
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Divider />

      <Card bg="blue.50" borderColor="blue.200" borderWidth={1}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Heading size="sm" color="blue.800">
              Communication Health Assessment
            </Heading>
            <Text color="gray.700">
              {(() => {
                switch (sentiment.communicationHealth) {
                  case 'healthy':
                    return 'Your communication shows strong positive patterns with balanced emotional expression. Continue fostering open and supportive dialogue.';
                  case 'moderate':
                    return 'Your communication is generally positive with some areas that could benefit from attention. Consider addressing recurring concerns and maintaining consistent engagement.';
                  default:
                    return 'Your communication shows signs of tension that may benefit from attention. Consider having open conversations about recurring concerns and working together to improve dialogue patterns.';
                }
              })()}
            </Text>
            {sentiment.communicationHealth !== 'healthy' && (
              <Box mt={2} p={3} bg="white" borderRadius="md">
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Recommendations:
                </Text>
                <List spacing={2} fontSize="sm">
                  <ListItem display="flex" alignItems="flex-start">
                    <ListIcon as={FiCheckCircle} color="blue.500" mt={1} />
                    Schedule regular check-ins to discuss feelings and concerns
                  </ListItem>
                  <ListItem display="flex" alignItems="flex-start">
                    <ListIcon as={FiCheckCircle} color="blue.500" mt={1} />
                    Practice active listening and validate each other's emotions
                  </ListItem>
                  <ListItem display="flex" alignItems="flex-start">
                    <ListIcon as={FiCheckCircle} color="blue.500" mt={1} />
                    Celebrate positive moments and express gratitude more often
                  </ListItem>
                </List>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      <Card bg="purple.50" borderColor="purple.200" borderWidth={1}>
        <CardBody>
          <VStack spacing={2} align="stretch">
            <Heading size="sm" color="purple.800">
              About This Analysis
            </Heading>
            <Text fontSize="sm" color="gray.700">
              This summary is generated using sentiment analysis and conversation pattern detection.
              It analyzes {metadata.totalMessages.toLocaleString()} messages over{' '}
              {sentiment.totalDays} days to identify emotional trends, communication balance, and
              relationship dynamics.
            </Text>
            <Text fontSize="xs" color="gray.600" fontStyle="italic" mt={2}>
              Note: This is an automated analysis based on keyword and pattern matching. For deeper
              relationship insights, consider professional counseling or therapy.
            </Text>
          </VStack>
        </CardBody>
      </Card>

      <Divider />

      <Card bg="teal.50" borderColor="teal.200" borderWidth={1}>
        <CardBody>
          <ShareOptions
            summaryRef={summaryRef}
            metadata={metadata}
            sentiment={sentiment}
          />
        </CardBody>
      </Card>
    </VStack>
    </motion.div>
  );
};

export default SummaryTab;
