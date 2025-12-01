import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  Text,
  SimpleGrid,
  Badge,
  Wrap,
  WrapItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WordsTab = ({ analytics }) => {
  const wordFrequency = analytics.wordFrequency || [];
  const wordFrequencyPerSender = analytics.wordFrequencyPerSender || {};
  const chartHeight = useBreakpointValue({ base: 300, md: 400 });
  const axisFontSize = useBreakpointValue({ base: 10, md: 12 });
  const headingSize = useBreakpointValue({ base: "sm", md: "md" });
  const wordCloudHeight = useBreakpointValue({ base: "250px", md: "300px" });
  const yAxisWidth = useBreakpointValue({ base: 70, md: 100 });

  const topWords = wordFrequency.slice(0, 20);

  const getWordSize = (count, maxCount) => {
    const minSize = 14;
    const maxSize = 48;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  const maxCount = wordFrequency[0]?.count || 1;

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size={headingSize} mb={4}>
          Most Used Words
        </Heading>
        <Card>
          <CardBody overflowX="auto">
            <ResponsiveContainer width="100%" height={chartHeight} minWidth={250}>
              <BarChart data={topWords} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: axisFontSize }} />
                <YAxis dataKey="word" type="category" width={yAxisWidth} tick={{ fontSize: axisFontSize }} />
                <Tooltip />
                <Bar dataKey="count" fill="#9F7AEA" name="Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Word Cloud
        </Heading>
        <Card>
          <CardBody minH={wordCloudHeight} display="flex" alignItems="center" justifyContent="center">
            <Wrap spacing={{ base: 2, md: 4 }} justify="center" align="center">
              {wordFrequency.slice(0, 50).map((word) => (
                <WrapItem key={word.word}>
                  <Text
                    fontSize={`${getWordSize(word.count, maxCount)}px`}
                    fontWeight="bold"
                    color="purple.600"
                    opacity={0.6 + (word.count / maxCount) * 0.4}
                    _hover={{ opacity: 1, transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                    cursor="default"
                  >
                    {word.word}
                  </Text>
                </WrapItem>
              ))}
            </Wrap>
          </CardBody>
        </Card>
      </Box>

      <Box>
        <Heading size={headingSize} mb={4}>
          Top Words by Participant
        </Heading>
        <Tabs colorScheme="purple" variant="soft-rounded">
          <TabList overflowX="auto" pb={2}>
            {Object.keys(wordFrequencyPerSender).map((sender) => (
              <Tab key={sender} fontSize={{ base: "xs", md: "md" }}>{sender}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {Object.entries(wordFrequencyPerSender).map(([sender, words]) => (
              <TabPanel key={sender} px={0}>
                <Card>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
                      {words.map((word, idx) => (
                        <Box
                          key={word.word}
                          p={3}
                          bg="gray.50"
                          borderRadius="md"
                          borderWidth={1}
                          borderColor="gray.200"
                        >
                          <Badge colorScheme="purple" fontSize={{ base: "xs", md: "xs" }} mb={1}>
                            #{idx + 1}
                          </Badge>
                          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                            {word.word}
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                            {word.count} times
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Word Statistics
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                {wordFrequency.reduce((sum, w) => sum + w.count, 0).toLocaleString()}
              </Text>
              <Text color="gray.600">Total Words (excl. stop words)</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                {wordFrequency.length.toLocaleString()}
              </Text>
              <Text color="gray.600">Unique Words</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                {wordFrequency[0]?.word || 'N/A'}
              </Text>
              <Text color="gray.600">Most Common Word</Text>
              <Text fontSize="sm" color="gray.500">
                Used {wordFrequency[0]?.count || 0} times
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Vocabulary Diversity
        </Heading>
        <Card>
          <CardBody>
            {Object.entries(wordFrequencyPerSender).map(([sender, words]) => {
              const totalWords = words.reduce((sum, w) => sum + w.count, 0);
              const uniqueWords = words.length;
              const diversity = Math.round((uniqueWords / totalWords) * 100);

              return (
                <Box key={sender} mb={4} pb={4} borderBottom="1px" borderColor="gray.200" _last={{ mb: 0, pb: 0, borderBottom: 'none' }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Text fontWeight="bold">{sender}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {uniqueWords} unique words from {totalWords} total
                    </Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box flex={1}>
                      <Box
                        h="30px"
                        bg="teal.500"
                        borderRadius="md"
                        width={`${Math.min(diversity * 2, 100)}%`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="sm" fontWeight="bold" color="white">
                          {diversity}% diversity
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </CardBody>
        </Card>
      </Box>
    </VStack>
  );
};

export default WordsTab;
