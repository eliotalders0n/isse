import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Text,
  SimpleGrid,
  Progress,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PatternsTab = ({ stats, analytics }) => {
  const senderStats = stats.senderStats || {};
  const participants = Object.keys(senderStats);

  const messageDistribution = participants.map((sender) => ({
    name: sender,
    value: senderStats[sender].messageCount,
  }));

  const colors = ['#9F7AEA', '#B794F4', '#D6BCFA', '#E9D8FD'];

  const streaks = analytics.streaks || [];
  const silences = analytics.silences || [];
  const engagementScore = analytics.engagementScore || [];

  const avgEngagement =
    engagementScore.length > 0
      ? Math.round(
          engagementScore.reduce((sum, e) => sum + e.score, 0) / engagementScore.length
        )
      : 0;

  const recentEngagement = engagementScore.slice(-4);
  const isEngagementIncreasing =
    recentEngagement.length >= 2 &&
    recentEngagement[recentEngagement.length - 1].score >
      recentEngagement[recentEngagement.length - 2].score;

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={4}>
          Message Distribution
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={messageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {messageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {participants.map((sender, idx) => {
                  const total = messageDistribution.reduce((sum, d) => sum + d.value, 0);
                  const percentage = Math.round((senderStats[sender].messageCount / total) * 100);
                  const isBalanced = Math.abs(percentage - 50) < 10;

                  return (
                    <Box key={sender}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="bold">{sender}</Text>
                        <Badge
                          colorScheme={isBalanced ? 'green' : percentage > 50 ? 'blue' : 'orange'}
                        >
                          {percentage}%
                        </Badge>
                      </HStack>
                      <Progress
                        value={percentage}
                        colorScheme={colors[idx] === '#319795' ? 'teal' : 'cyan'}
                        borderRadius="full"
                        size="md"
                      />
                    </Box>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Response Patterns
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {Object.entries(stats.responseTimes || {}).map(([sender, times]) => (
            <Card key={sender}>
              <CardHeader pb={2}>
                <Heading size="sm">{sender}</Heading>
              </CardHeader>
              <CardBody pt={2}>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Avg Response
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="teal.600">
                      {times.avgMinutes < 60
                        ? `${times.avgMinutes}m`
                        : `${Math.round(times.avgMinutes / 60)}h`}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Median
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="teal.600">
                      {times.medianMinutes < 60
                        ? `${times.medianMinutes}m`
                        : `${Math.round(times.medianMinutes / 60)}h`}
                    </Text>
                  </Box>
                </SimpleGrid>
                <Text fontSize="xs" color="gray.500" mt={3}>
                  Based on {times.count} responses
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Communication Balance
        </Heading>
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {participants.map((sender) => {
                const avgLength = senderStats[sender].avgMessageLength;
                const maxLength = Math.max(...participants.map((p) => senderStats[p].avgMessageLength));

                return (
                  <Box key={sender}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium">{sender} - Average Message Length</Text>
                      <Text fontSize="sm" color="gray.600">
                        {avgLength} characters
                      </Text>
                    </HStack>
                    <Progress
                      value={(avgLength / maxLength) * 100}
                      colorScheme="teal"
                      borderRadius="full"
                      size="sm"
                    />
                  </Box>
                );
              })}
            </VStack>

            <Box mt={6} p={4} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontWeight="bold">
                  Balance Insight:{' '}
                </Text>
                {(() => {
                  const lengths = participants.map((p) => senderStats[p].avgMessageLength);
                  const maxLen = Math.max(...lengths);
                  const minLen = Math.min(...lengths);
                  const ratio = maxLen / minLen;

                  if (ratio < 1.3) {
                    return 'Both participants write similar length messages, showing balanced communication.';
                  } else if (ratio < 2) {
                    return 'There is some variation in message length, but overall communication is fairly balanced.';
                  } else {
                    return 'One person tends to write longer messages. This could indicate different communication styles.';
                  }
                })()}
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Engagement Trends
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" color="teal.600">
                {avgEngagement}
              </Text>
              <Text color="gray.600">Average Engagement Score</Text>
              <Badge
                mt={2}
                colorScheme={isEngagementIncreasing ? 'green' : 'orange'}
                fontSize="sm"
                px={3}
                py={1}
              >
                {isEngagementIncreasing ? '↗ Increasing' : '↘ Varying'}
              </Badge>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                    Longest Active Streak
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {streaks[0]?.days || 0} days
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                    Longest Silence
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {silences[0]?.days || 0} days
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Activity Summary
        </Heading>
        <Card>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                  {stats.totalDays}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Days
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                  {stats.avgMessagesPerDay}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Messages/Day Average
                </Text>
              </Box>
              <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                  {streaks.length}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Conversation Streaks
                </Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>
    </VStack>
  );
};

export default PatternsTab;
