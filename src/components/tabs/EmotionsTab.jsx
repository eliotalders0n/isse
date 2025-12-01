import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  Text,
  SimpleGrid,
  Badge,
  Progress,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const EmotionsTab = ({ sentiment, messages }) => {
  const timeline = sentiment.timeline || [];
  const chartHeight = useBreakpointValue({ base: 250, md: 300 });
  const xAxisHeight = useBreakpointValue({ base: 60, md: 80 });
  const axisFontSize = useBreakpointValue({ base: 10, md: 12 });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const percentFontSize = useBreakpointValue({ base: "2xl", md: "3xl" });

  const emotionCounts = {
    joy: 0,
    sadness: 0,
    anger: 0,
    affection: 0,
    gratitude: 0,
    apology: 0,
    anxiety: 0,
    excitement: 0,
  };

  messages.forEach((msg) => {
    if (msg.sentiment && msg.sentiment.primaryEmotion) {
      emotionCounts[msg.sentiment.primaryEmotion]++;
    }
  });

  const emotionData = Object.entries(emotionCounts)
    .filter(([emotion]) => emotion !== 'neutral')
    .map(([emotion, count]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
      percentage: Math.round((count / messages.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const sentimentOverTime = timeline.map((t) => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    positive: Math.round(t.positiveRatio),
    negative: Math.round(t.negativeRatio),
    neutral: Math.round(t.neutralRatio),
    score: Math.round(t.sentimentScore),
  }));

  const emotionsOverTime = timeline.map((t) => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    joy: t.joy || 0,
    sadness: t.sadness || 0,
    anger: t.anger || 0,
    affection: t.affection || 0,
    gratitude: t.gratitude || 0,
    excitement: t.excitement || 0,
  }));

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size={headingSize} mb={4}>
          Overall Sentiment
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card bg="green.50" borderColor="green.200" borderWidth={1}>
            <CardBody textAlign="center">
              <Text fontSize={percentFontSize} fontWeight="bold" color="green.600">
                {sentiment.positivePercent}%
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">Positive</Text>
            </CardBody>
          </Card>
          <Card bg="red.50" borderColor="red.200" borderWidth={1}>
            <CardBody textAlign="center">
              <Text fontSize={percentFontSize} fontWeight="bold" color="red.600">
                {sentiment.negativePercent}%
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">Negative</Text>
            </CardBody>
          </Card>
          <Card bg="gray.50" borderColor="gray.200" borderWidth={1}>
            <CardBody textAlign="center">
              <Text fontSize={percentFontSize} fontWeight="bold" color="gray.600">
                {100 - sentiment.positivePercent - sentiment.negativePercent}%
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">Neutral</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Sentiment Timeline
        </Heading>
        <Card>
          <CardBody>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={sentimentOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: axisFontSize }}
                  angle={-45}
                  textAnchor="end"
                  height={xAxisHeight}
                />
                <YAxis tick={{ fontSize: axisFontSize }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: axisFontSize }} />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#48BB78"
                  fill="#48BB78"
                  name="Positive"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="#A0AEC0"
                  fill="#A0AEC0"
                  name="Neutral"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#F56565"
                  fill="#F56565"
                  name="Negative"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Emotion Distribution
        </Heading>
        <Card>
          <CardBody>
            <VStack spacing={3} align="stretch">
              {emotionData.map((emotion) => (
                <Box key={emotion.emotion}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">{emotion.emotion}</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                      {emotion.count} messages ({emotion.percentage}%)
                    </Text>
                  </Box>
                  <Progress
                    value={emotion.percentage}
                    colorScheme={
                      emotion.emotion === 'Joy' || emotion.emotion === 'Affection'
                        ? 'green'
                        : emotion.emotion === 'Sadness' || emotion.emotion === 'Anxiety'
                        ? 'blue'
                        : emotion.emotion === 'Anger'
                        ? 'red'
                        : 'purple'
                    }
                    borderRadius="full"
                    size="sm"
                  />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Emotions Over Time
        </Heading>
        <Card>
          <CardBody>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={emotionsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: axisFontSize }}
                  angle={-45}
                  textAnchor="end"
                  height={xAxisHeight}
                />
                <YAxis tick={{ fontSize: axisFontSize }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: axisFontSize }} />
                <Line type="monotone" dataKey="joy" stroke="#48BB78" name="Joy" />
                <Line type="monotone" dataKey="affection" stroke="#ED64A6" name="Affection" />
                <Line type="monotone" dataKey="excitement" stroke="#38B2AC" name="Excitement" />
                <Line type="monotone" dataKey="sadness" stroke="#4299E1" name="Sadness" />
                <Line type="monotone" dataKey="anger" stroke="#F56565" name="Anger" />
                <Line type="monotone" dataKey="gratitude" stroke="#9F7AEA" name="Gratitude" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Box>

      {sentiment.topEmotions && sentiment.topEmotions.length > 0 && (
        <Box>
          <Heading size={headingSize} mb={4}>
            Dominant Emotions
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {sentiment.topEmotions.map((emotion, idx) => (
              <Card key={emotion}>
                <CardBody textAlign="center">
                  <Badge
                    colorScheme={
                      emotion === 'joy' || emotion === 'affection'
                        ? 'green'
                        : emotion === 'sadness'
                        ? 'blue'
                        : emotion === 'anger'
                        ? 'red'
                        : 'purple'
                    }
                    fontSize={{ base: "sm", md: "lg" }}
                    px={4}
                    py={2}
                    borderRadius="full"
                  >
                    #{idx + 1}
                  </Badge>
                  <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mt={3} textTransform="capitalize">
                    {emotion}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default EmotionsTab;
