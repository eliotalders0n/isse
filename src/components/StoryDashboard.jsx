import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  Card,
  CardBody,
  Badge,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiTrendingUp, FiSmile, FiClock, FiZap, FiAlertTriangle, FiShield, FiStar, FiUsers, FiBookOpen } from 'react-icons/fi';
import ParticipantAvatar from './ParticipantAvatar';
import CoachMessage from './CoachMessage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionHeading = motion(Heading);

const StoryDashboard = ({ chatData }) => {
  const { messages, metadata, stats, sentiment, analytics, gamification } = chatData;

  // Prepare chart data - show all emotions
  const emotionData = Object.entries(sentiment.emotionBreakdown || {})
    .map(([emotion, count]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .filter(item => item.count > 0); // Only show emotions that exist

  const COLORS = ['#FF8556', '#FB923C', '#F43F5E', '#FDBA74', '#FFA071'];

  const messageDistribution = Object.entries(stats.senderStats || {}).map(([sender, data]) => ({
    sender,
    messages: data.messageCount,
    percentage: ((data.messageCount / metadata.totalMessages) * 100).toFixed(1),
  }));

  // Generate insights
  const getConversationInsight = () => {
    const avgPerDay = analytics.avgMessagesPerDay;
    if (avgPerDay > 100) return "You two chat quite a lot! Strong connection indicator.";
    if (avgPerDay > 50) return "Regular and consistent communication shows healthy engagement.";
    if (avgPerDay > 20) return "You maintain steady contact with each other.";
    return "Your conversations are thoughtful and intentional.";
  };

  const getEmotionalInsight = () => {
    if (sentiment.positivePercent > 70) return "Your conversations are filled with warmth and positivity.";
    if (sentiment.positivePercent > 50) return "You maintain a balanced and healthy emotional tone.";
    return "Consider bringing more lightness into your conversations.";
  };

  const getBalanceInsight = () => {
    const participants = Object.values(stats.senderStats);
    if (participants.length !== 2) return null;

    const ratio = Math.max(participants[0].messageCount, participants[1].messageCount) /
                  Math.min(participants[0].messageCount, participants[1].messageCount);

    if (ratio < 1.3) return "Beautifully balanced - you both contribute equally.";
    if (ratio < 2) return "Mostly balanced, with one person slightly more talkative.";
    return "One person tends to share more. Consider if both feel heard.";
  };

  const getResponseTimeInsight = () => {
    if (!stats.responseTimes || Object.keys(stats.responseTimes).length === 0) {
      return "Response time data is limited for this conversation.";
    }
    const avgTimes = Object.values(stats.responseTimes).map(rt => rt.avgMinutes);
    const overallAvg = avgTimes.reduce((a, b) => a + b, 0) / avgTimes.length;

    if (overallAvg < 5) return "Lightning fast responses! You're both very engaged.";
    if (overallAvg < 30) return "You both respond promptly, showing great attentiveness.";
    if (overallAvg < 120) return "Moderate response times - everyone needs space to breathe.";
    return "You take your time to respond thoughtfully.";
  };

  const getEmotionSynchronyInsight = () => {
    const score = sentiment.emotionSynchrony || 50;
    if (score > 75) return "You're emotionally in sync - you feel and express similarly.";
    if (score > 60) return "Good emotional alignment with healthy differences.";
    if (score > 40) return "You bring different emotional energies - balance and complement.";
    return "Your emotional expressions differ - embrace your unique perspectives.";
  };

  const getAffectionInsight = () => {
    const level = sentiment.affectionLevel || 0;
    if (level > 30) return "Your conversations are rich with warmth and affection.";
    if (level > 15) return "You express care and affection regularly.";
    if (level > 5) return "There's room to express more affection and appreciation.";
    return "Consider adding more warmth to your communication.";
  };

  const getToxicityInsight = () => {
    const toxicity = sentiment.toxicity || { level: 'healthy' };
    if (toxicity.level === 'healthy') return "Your communication is respectful and constructive.";
    if (toxicity.level === 'moderate') return "Mostly healthy with occasional tension - address conflicts calmly.";
    if (toxicity.level === 'needs attention') return "Some patterns need attention - focus on kindness and respect.";
    return "Communication patterns show concern - consider seeking support.";
  };

  const getConflictResolutionInsight = () => {
    const resolution = sentiment.conflictResolution || { resolutionRatio: 0.5 };
    if (resolution.resolutionRatio > 0.7) return "You handle conflicts well and find resolution together.";
    if (resolution.resolutionRatio > 0.4) return "Conflicts arise, and you're working on resolving them.";
    return "When tensions arise, make space for apologies and understanding.";
  };

  const getSilenceInsight = () => {
    if (!analytics.silences || analytics.silences.length === 0) {
      return "You maintain consistent communication with no long gaps.";
    }
    if (analytics.silences[0].days > 30) {
      return "There have been extended quiet periods - reconnection takes intention.";
    }
    return "Brief pauses in conversation are natural and healthy.";
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(180deg, #FFF5F0 0%, #FFEDD5 50%, #FFF1F2 100%)"
      position="relative"
    >
      <Container maxW="container.md" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 12, md: 16 }} align="stretch">

          {/* Section 1: Introduction with Avatars */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <VStack spacing={8}>
              <Heading
                size={{ base: 'xl', md: '2xl' }}
                color="warm.700"
                fontWeight="800"
              >
                Your Relationship Story
              </Heading>

              <HStack spacing={{ base: 6, md: 12 }} justify="center" flexWrap="wrap">
                {metadata.participants.map((participant, idx) => (
                  <MotionBox
                    key={participant}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.2, duration: 0.5 }}
                  >
                    <ParticipantAvatar name={participant} size="lg" />
                  </MotionBox>
                ))}
              </HStack>

              <Text fontSize={{ base: 'lg', md: 'xl' }} color="sand.600" maxW="600px">
                Let's explore the beautiful patterns in your connection
              </Text>
            </VStack>
          </MotionBox>

          {/* Section 2: At a Glance */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              <MotionHeading
                size={{ base: 'lg', md: 'xl' }}
                color="warm.700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                At a Glance
              </MotionHeading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {[
                  { label: 'Messages', value: metadata.totalMessages.toLocaleString(), icon: FiMessageCircle, color: 'warm' },
                  { label: 'Days', value: analytics.totalDays, icon: FiClock, color: 'peach' },
                  { label: 'Per Day', value: analytics.avgMessagesPerDay, icon: FiZap, color: 'rose' },
                  { label: 'Mood', value: sentiment.overallSentiment, icon: FiSmile, color: 'orange' },
                ].map((stat, idx) => (
                  <MotionCard
                    key={stat.label}
                    bg="white"
                    boxShadow="md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    whileHover={{ y: -4, boxShadow: 'lg' }}
                  >
                    <CardBody textAlign="center">
                      <VStack spacing={2}>
                        <Box as={stat.icon} size={24} color={`${stat.color}.500`} />
                        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="sand.800">
                          {stat.value}
                        </Text>
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="sand.600" fontWeight="medium">
                          {stat.label}
                        </Text>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </SimpleGrid>

              <CoachMessage
                message={getConversationInsight()}
                type="insight"
                icon={FiHeart}
                delay={0.3}
              />
            </VStack>
          </MotionBox>

          {/* Section 2.5: Response Times */}
          {stats.responseTimes && Object.keys(stats.responseTimes).length > 0 && (
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={6} align="stretch">
                <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                  Response Times
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {Object.entries(stats.responseTimes).map(([sender, data], idx) => (
                    <MotionCard
                      key={sender}
                      bg="white"
                      boxShadow="md"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                    >
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack spacing={3}>
                            <ParticipantAvatar name={sender} size="sm" showName={false} />
                            <Text fontWeight="bold" color="sand.800">{sender}</Text>
                          </HStack>
                          <VStack spacing={1} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="sand.600">Average Response</Text>
                              <Text fontSize="md" fontWeight="bold" color="warm.600">
                                {data.avgMinutes < 60
                                  ? `${data.avgMinutes} min`
                                  : `${Math.round(data.avgMinutes / 60)} hr`}
                              </Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="sand.600">Median Response</Text>
                              <Text fontSize="md" fontWeight="bold" color="warm.600">
                                {data.medianMinutes < 60
                                  ? `${data.medianMinutes} min`
                                  : `${Math.round(data.medianMinutes / 60)} hr`}
                              </Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </MotionCard>
                  ))}
                </SimpleGrid>

                <CoachMessage
                  message={getResponseTimeInsight()}
                  type="insight"
                  icon={FiClock}
                  delay={0.2}
                />
              </VStack>
            </MotionBox>
          )}

          {/* Section 3: Who Says What */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                Who Says What
              </Heading>

              <MotionCard
                bg="white"
                boxShadow="md"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {messageDistribution.map((person, idx) => (
                      <Box key={person.sender}>
                        <HStack justify="space-between" mb={2}>
                          <HStack spacing={3}>
                            <ParticipantAvatar name={person.sender} size="sm" showName={false} />
                            <Text fontWeight="bold" color="sand.800">{person.sender}</Text>
                          </HStack>
                          <Badge colorScheme="warm" fontSize="md" px={3}>
                            {person.percentage}%
                          </Badge>
                        </HStack>
                        <Progress
                          value={person.percentage}
                          colorScheme="warm"
                          size="lg"
                          borderRadius="full"
                          bg="warm.100"
                        />
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </MotionCard>

              {getBalanceInsight() && (
                <CoachMessage
                  message={getBalanceInsight()}
                  type="observation"
                  icon={FiTrendingUp}
                  delay={0.2}
                />
              )}

              <CoachMessage
                message="Remember, conversation balance isn't about perfect 50/50 - it's about both feeling heard and valued."
                type="insight"
                icon={FiHeart}
                delay={0.3}
              />
            </VStack>
          </MotionBox>

          {/* Section 4: Emotional Landscape */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                Emotional Landscape
              </Heading>

              <MotionCard
                bg="white"
                boxShadow="md"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CardBody>
                  <VStack spacing={6}>
                    <HStack spacing={6} justify="center" w="100%">
                      <VStack>
                        <Text fontSize="3xl" fontWeight="bold" color="green.500">
                          {sentiment.positivePercent}%
                        </Text>
                        <Text fontSize="sm" color="sand.600">Positive</Text>
                      </VStack>
                      <Divider orientation="vertical" h="60px" />
                      <VStack>
                        <Text fontSize="3xl" fontWeight="bold" color="gray.500">
                          {sentiment.neutralPercent}%
                        </Text>
                        <Text fontSize="sm" color="sand.600">Neutral</Text>
                      </VStack>
                      <Divider orientation="vertical" h="60px" />
                      <VStack>
                        <Text fontSize="3xl" fontWeight="bold" color="red.500">
                          {sentiment.negativePercent}%
                        </Text>
                        <Text fontSize="sm" color="sand.600">Negative</Text>
                      </VStack>
                    </HStack>

                    {emotionData.length > 0 && (
                      <Box w="100%" h="250px">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={emotionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                            <XAxis dataKey="emotion" tick={{ fill: '#78716C', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#78716C', fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E7E5E4',
                                borderRadius: '8px',
                              }}
                            />
                            <Bar dataKey="count" fill="#FF8556" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </MotionCard>

              <CoachMessage
                message={getEmotionalInsight()}
                type="encouragement"
                icon={FiHeart}
                delay={0.2}
              />

              <CoachMessage
                message="Your emotional expression creates the atmosphere of your connection. Both positive and challenging emotions are valid."
                type="insight"
                icon={FiSmile}
                delay={0.3}
              />
            </VStack>
          </MotionBox>

          {/* Section 4.5: Relationship Dynamics */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                Relationship Dynamics
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {/* Emotional Synchrony */}
                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: 'lg' }}
                >
                  <CardBody textAlign="center">
                    <VStack spacing={3}>
                      <Box as={FiUsers} size={32} color="warm.500" />
                      <Text fontSize="3xl" fontWeight="bold" color="warm.600">
                        {sentiment.emotionSynchrony || 50}%
                      </Text>
                      <Text fontSize="sm" color="sand.600" fontWeight="medium">
                        Emotional Synchrony
                      </Text>
                      <Text fontSize="xs" color="sand.500">
                        How aligned your emotions are
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>

                {/* Affection Level */}
                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: 'lg' }}
                >
                  <CardBody textAlign="center">
                    <VStack spacing={3}>
                      <Box as={FiHeart} size={32} color="rose.500" />
                      <Text fontSize="3xl" fontWeight="bold" color="rose.600">
                        {sentiment.affectionLevel || 0}%
                      </Text>
                      <Text fontSize="sm" color="sand.600" fontWeight="medium">
                        Affection Level
                      </Text>
                      <Text fontSize="xs" color="sand.500">
                        Warmth and care expressed
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>

                {/* Conflict Resolution */}
                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: 'lg' }}
                >
                  <CardBody textAlign="center">
                    <VStack spacing={3}>
                      <Box as={FiShield} size={32} color="green.500" />
                      <Text fontSize="3xl" fontWeight="bold" color="green.600">
                        {Math.round((sentiment.conflictResolution?.resolutionRatio || 0.5) * 100)}%
                      </Text>
                      <Text fontSize="sm" color="sand.600" fontWeight="medium">
                        Conflict Resolution
                      </Text>
                      <Text fontSize="xs" color="sand.500">
                        How well you resolve tensions
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </SimpleGrid>

              <CoachMessage
                message={getEmotionSynchronyInsight()}
                type="insight"
                icon={FiUsers}
                delay={0.2}
              />

              <CoachMessage
                message={getAffectionInsight()}
                type="encouragement"
                icon={FiHeart}
                delay={0.3}
              />

              {sentiment.conflictResolution && sentiment.conflictResolution.conflictCount > 0 && (
                <CoachMessage
                  message={getConflictResolutionInsight()}
                  type="observation"
                  icon={FiShield}
                  delay={0.4}
                />
              )}
            </VStack>
          </MotionBox>

          {/* Section 4.7: Word Patterns */}
          {analytics.wordFrequency && analytics.wordFrequency.length > 0 && (
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={6} align="stretch">
                <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                  Word Patterns
                </Heading>

                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="md" fontWeight="semibold" color="sand.700">
                        Most Used Words
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {analytics.wordFrequency.slice(0, 20).map((word, idx) => (
                          <Badge
                            key={idx}
                            colorScheme="warm"
                            fontSize={{ base: 'xs', md: 'sm' }}
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {word.word} ({word.count})
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </CardBody>
                </MotionCard>

                <CoachMessage
                  message="The words you use most reveal what matters in your relationship."
                  type="insight"
                  icon={FiBookOpen}
                  delay={0.2}
                />
              </VStack>
            </MotionBox>
          )}

          {/* Section 4.8: Communication Safety (Toxicity) */}
          {sentiment.toxicity && (
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={6} align="stretch">
                <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                  Communication Safety
                </Heading>

                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="sand.800">
                          Safety Level
                        </Text>
                        <Badge
                          colorScheme={
                            sentiment.toxicity.level === 'healthy' ? 'green' :
                            sentiment.toxicity.level === 'moderate' ? 'yellow' :
                            sentiment.toxicity.level === 'needs attention' ? 'orange' : 'red'
                          }
                          fontSize="lg"
                          px={4}
                          py={1}
                          borderRadius="full"
                        >
                          {sentiment.toxicity.level}
                        </Badge>
                      </HStack>

                      {sentiment.toxicity.toxicityPercent > 0 && (
                        <Box>
                          <Text fontSize="sm" color="sand.600" mb={2}>
                            {sentiment.toxicity.toxicityPercent}% of messages show tension patterns
                          </Text>
                          {Object.entries(sentiment.toxicity.toxicityBreakdown)
                            .filter(([_, count]) => count > 0)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([category, count], idx) => (
                              <HStack key={idx} justify="space-between" py={1}>
                                <Text fontSize="sm" color="sand.700" textTransform="capitalize">
                                  {category}
                                </Text>
                                <Badge colorScheme="orange">{count}</Badge>
                              </HStack>
                            ))}
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </MotionCard>

                <CoachMessage
                  message={getToxicityInsight()}
                  type={sentiment.toxicity.level === 'healthy' ? 'encouragement' : 'observation'}
                  icon={sentiment.toxicity.level === 'healthy' ? FiShield : FiAlertTriangle}
                  delay={0.2}
                />
              </VStack>
            </MotionBox>
          )}

          {/* Section 4.9: Silence Periods */}
          {analytics.silences && analytics.silences.length > 0 && (
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={6} align="stretch">
                <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                  Quiet Moments
                </Heading>

                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="md" fontWeight="semibold" color="sand.700" mb={2}>
                        Longest Silence Periods
                      </Text>
                      {analytics.silences.slice(0, 3).map((silence, idx) => (
                        <Box key={idx} p={3} bg="sand.50" borderRadius="md">
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm" fontWeight="bold" color="warm.600">
                              {silence.days} days
                            </Text>
                            <Badge colorScheme="gray" fontSize="xs">
                              Gap
                            </Badge>
                          </HStack>
                          <Text fontSize="xs" color="sand.500">
                            {new Date(silence.startDate).toLocaleDateString()} -{' '}
                            {new Date(silence.endDate).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </MotionCard>

                <CoachMessage
                  message={getSilenceInsight()}
                  type="observation"
                  icon={FiClock}
                  delay={0.2}
                />
              </VStack>
            </MotionBox>
          )}

          {/* Section 5: Communication Health */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                Communication Health
              </Heading>

              <MotionCard
                bg="white"
                boxShadow="md"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold" color="sand.800">
                        Overall Health
                      </Text>
                      <Badge
                        colorScheme={
                          sentiment.communicationHealth === 'healthy' ? 'green' :
                          sentiment.communicationHealth === 'moderate' ? 'orange' : 'red'
                        }
                        fontSize="lg"
                        px={4}
                        py={1}
                        borderRadius="full"
                      >
                        {sentiment.communicationHealth}
                      </Badge>
                    </HStack>

                    {analytics.streaks && analytics.streaks.length > 0 && (
                      <Box>
                        <Text fontSize="md" fontWeight="semibold" color="sand.700" mb={2}>
                          Longest Conversation Streak
                        </Text>
                        <Text fontSize="xl" color="warm.600" fontWeight="bold">
                          {analytics.streaks[0].days} days
                        </Text>
                        <Text fontSize="sm" color="sand.500">
                          {new Date(analytics.streaks[0].startDate).toLocaleDateString()} -
                          {new Date(analytics.streaks[0].endDate).toLocaleDateString()}
                        </Text>
                      </Box>
                    )}

                    {analytics.peakHours && analytics.peakHours.length > 0 && (
                      <Box>
                        <Text fontSize="md" fontWeight="semibold" color="sand.700" mb={2}>
                          Most Active Time
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {analytics.peakHours.slice(0, 3).map((hourData, idx) => {
                            const hourValue = typeof hourData === 'object' ? hourData.hour : hourData;
                            return (
                              <Badge key={idx} colorScheme="warm" fontSize="md" px={3} py={1}>
                                {hourValue}:00
                              </Badge>
                            );
                          })}
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </MotionCard>

              <CoachMessage
                message="Strong relationships thrive on consistent, meaningful communication. You're doing great!"
                type="encouragement"
                icon={FiHeart}
                delay={0.2}
              />

              <CoachMessage
                message="Consistency matters more than frequency. Regular check-ins show you prioritize the connection."
                type="insight"
                icon={FiClock}
                delay={0.3}
              />
            </VStack>
          </MotionBox>

          {/* Section 5.5: Sentiment Over Time */}
          {sentiment.timeline && sentiment.timeline.length > 0 && (
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={6} align="stretch">
                <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700">
                  Emotional Journey
                </Heading>

                <MotionCard
                  bg="white"
                  boxShadow="md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <CardBody>
                    <VStack spacing={4}>
                      <Text fontSize="md" fontWeight="semibold" color="sand.700">
                        How your sentiment has evolved over time
                      </Text>
                      <Box w="100%" h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sentiment.timeline.slice(-30)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                            <XAxis
                              dataKey="date"
                              tick={{ fill: '#78716C', fontSize: 10 }}
                              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis tick={{ fill: '#78716C', fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E7E5E4',
                                borderRadius: '8px',
                              }}
                              formatter={(value) => `${Math.round(value)}%`}
                            />
                            <Line
                              type="monotone"
                              dataKey="positiveRatio"
                              stroke="#10B981"
                              strokeWidth={2}
                              name="Positive"
                              dot={{ fill: '#10B981', r: 3 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="negativeRatio"
                              stroke="#EF4444"
                              strokeWidth={2}
                              name="Negative"
                              dot={{ fill: '#EF4444', r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </VStack>
                  </CardBody>
                </MotionCard>

                <CoachMessage
                  message="Your emotional journey shows growth and resilience. Every conversation is a step forward."
                  type="encouragement"
                  icon={FiTrendingUp}
                  delay={0.2}
                />
              </VStack>
            </MotionBox>
          )}

          {/* Section 6: Summary */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: 'lg', md: 'xl' }} color="warm.700" textAlign="center">
                Keep Growing Together
              </Heading>

              <MotionCard
                bg="linear-gradient(135deg, #FF8556 0%, #F97316 100%)"
                boxShadow="xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <CardBody py={8}>
                  <VStack spacing={4} textAlign="center">
                    <Text fontSize="2xl" color="white" fontWeight="bold">
                      {metadata.participants.join(' & ')}
                    </Text>
                    <Text fontSize="md" color="white" opacity={0.9} maxW="500px">
                      Every conversation is a chance to deepen your connection.
                      Keep being intentional, keep being present, keep being you.
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            </VStack>
          </MotionBox>

        </VStack>
      </Container>
    </Box>
  );
};

export default StoryDashboard;
