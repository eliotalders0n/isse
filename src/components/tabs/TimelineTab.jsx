import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  Text,
  SimpleGrid,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const TimelineTab = ({ messages, analytics }) => {
  const peakHoursData = analytics.peakHours || [];
  const chartHeight = useBreakpointValue({ base: 250, md: 300 });
  const peakHoursHeight = useBreakpointValue({ base: 200, md: 250 });
  const axisFontSize = useBreakpointValue({ base: 10, md: 12 });
  const xAxisHeight = useBreakpointValue({ base: 60, md: 80 });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });

  const groupMessagesByWeek = (messages) => {
    const weeks = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = format(weekStart, 'MMM d, yyyy');

      if (!weeks[weekKey]) {
        weeks[weekKey] = { week: weekKey, count: 0, participants: {} };
      }
      weeks[weekKey].count++;
      weeks[weekKey].participants[msg.sender] =
        (weeks[weekKey].participants[msg.sender] || 0) + 1;
    });

    return Object.values(weeks);
  };

  const weeklyData = groupMessagesByWeek(messages);

  const participants = [...new Set(messages.map((m) => m.sender))];
  const colors = ['#9F7AEA', '#B794F4', '#D6BCFA', '#E9D8FD'];

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size={headingSize} mb={4}>
          Messages Over Time
        </Heading>
        <Card>
          <CardBody>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: axisFontSize }}
                  angle={-45}
                  textAnchor="end"
                  height={xAxisHeight}
                />
                <YAxis tick={{ fontSize: axisFontSize }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: axisFontSize }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#9F7AEA"
                  strokeWidth={2}
                  name="Messages"
                  dot={{ fill: '#9F7AEA', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Weekly Activity by Participant
        </Heading>
        <Card>
          <CardBody>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: axisFontSize }}
                  angle={-45}
                  textAnchor="end"
                  height={xAxisHeight}
                />
                <YAxis tick={{ fontSize: axisFontSize }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: axisFontSize }} />
                {participants.map((participant, idx) => (
                  <Bar
                    key={participant}
                    dataKey={`participants.${participant}`}
                    fill={colors[idx % colors.length]}
                    name={participant}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Peak Activity Hours
        </Heading>
        <Card>
          <CardBody>
            <ResponsiveContainer width="100%" height={peakHoursHeight}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: axisFontSize }} />
                <YAxis tick={{ fontSize: axisFontSize }} />
                <Tooltip />
                <Bar dataKey="count" fill="#38B2AC" name="Messages" />
              </BarChart>
            </ResponsiveContainer>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mt={4} textAlign="center">
              Most active hours:{' '}
              {peakHoursData
                .slice()
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((h) => `${h.label}`)
                .join(', ')}
            </Text>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Conversation Streaks
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {analytics.streaks?.slice(0, 6).map((streak, idx) => (
            <Card key={idx}>
              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <Badge colorScheme="green" alignSelf="flex-start" fontSize={{ base: "xs", md: "md" }} px={2}>
                    {streak.days} days
                  </Badge>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    {new Date(streak.startDate).toLocaleDateString()} -{' '}
                    {new Date(streak.endDate).toLocaleDateString()}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {analytics.silences && analytics.silences.length > 0 && (
        <Box>
          <Heading size={headingSize} mb={4}>
            Silence Periods (3+ days)
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {analytics.silences.slice(0, 6).map((silence, idx) => (
              <Card key={idx} borderColor="orange.200" borderWidth={1}>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    <Badge colorScheme="orange" alignSelf="flex-start" fontSize={{ base: "xs", md: "md" }} px={2}>
                      {silence.days} days silent
                    </Badge>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                      {new Date(silence.startDate).toLocaleDateString()} -{' '}
                      {new Date(silence.endDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default TimelineTab;
