import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  VStack,
  HStack,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';

const OverviewTab = ({ stats, metadata, analytics }) => {
  const participants = metadata.participants || [];
  const senderStats = stats.senderStats || {};
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });

  const participantData = participants.map(sender => ({
    name: sender,
    ...senderStats[sender],
  }));

  const longestStreak = analytics.streaks?.[0];
  const longestSilence = analytics.silences?.[0];

  const totalMessages = metadata.totalMessages || 0;
  const maxMessages = Math.max(...participantData.map(p => p.messageCount || 0));

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size={headingSize} mb={4}>
          Conversation Overview
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "sm", md: "md" }}>Conversation Duration</StatLabel>
                <StatNumber fontSize={{ base: "xl", md: "2xl" }}>{stats.totalDays} days</StatNumber>
                <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                  {new Date(metadata.startDate).toLocaleDateString()} -{' '}
                  {new Date(metadata.endDate).toLocaleDateString()}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "sm", md: "md" }}>Average Activity</StatLabel>
                <StatNumber fontSize={{ base: "xl", md: "2xl" }}>{stats.avgMessagesPerDay} msgs/day</StatNumber>
                <StatHelpText fontSize={{ base: "xs", md: "sm" }}>{totalMessages.toLocaleString()} total messages</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {longestStreak && (
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel fontSize={{ base: "sm", md: "md" }}>Longest Streak</StatLabel>
                  <StatNumber fontSize={{ base: "xl", md: "2xl" }}>{longestStreak.days} days</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                    {new Date(longestStreak.startDate).toLocaleDateString()} -{' '}
                    {new Date(longestStreak.endDate).toLocaleDateString()}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          )}

          {longestSilence && (
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel fontSize={{ base: "sm", md: "md" }}>Longest Silence</StatLabel>
                  <StatNumber fontSize={{ base: "xl", md: "2xl" }}>{longestSilence.days} days</StatNumber>
                  <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                    {new Date(longestSilence.startDate).toLocaleDateString()} -{' '}
                    {new Date(longestSilence.endDate).toLocaleDateString()}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          )}
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Participant Statistics
        </Heading>
        <VStack spacing={4} align="stretch">
          {participantData.map((participant) => (
            <Card key={participant.name}>
              <CardHeader pb={2}>
                <HStack justify="space-between" flexWrap={{ base: "wrap", md: "nowrap" }}>
                  <Heading size={{ base: "xs", md: "sm" }}>{participant.name}</Heading>
                  <Badge colorScheme="teal" fontSize={{ base: "xs", md: "md" }} px={3} py={1}>
                    {participant.messageCount?.toLocaleString()} messages
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody pt={2}>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                        Share of conversation
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold">
                        {Math.round((participant.messageCount / totalMessages) * 100)}%
                      </Text>
                    </HStack>
                    <Progress
                      value={(participant.messageCount / maxMessages) * 100}
                      colorScheme="teal"
                      borderRadius="full"
                      size="sm"
                    />
                  </Box>

                  <SimpleGrid columns={3} spacing={4}>
                    <Box>
                      <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
                        Avg Length
                      </Text>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
                        {participant.avgMessageLength} chars
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
                        Avg Words
                      </Text>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
                        {participant.avgWordsPerMessage} words
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
                        Total Words
                      </Text>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
                        {participant.wordCount?.toLocaleString()}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {stats.responseTimes?.[participant.name] && (
                    <Box pt={2} borderTop="1px" borderColor="gray.200">
                      <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500" mb={1}>
                        Average Response Time
                      </Text>
                      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
                        {stats.responseTimes[participant.name].avgMinutes < 60
                          ? `${stats.responseTimes[participant.name].avgMinutes} minutes`
                          : `${Math.round(stats.responseTimes[participant.name].avgMinutes / 60)} hours`}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
                        Median: {stats.responseTimes[participant.name].medianMinutes} minutes
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default OverviewTab;
