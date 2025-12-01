import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Text,
  Badge,
  VStack,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
// liquid-glass removed: using Chakra only
import { FiBarChart2, FiTrendingUp, FiHeart, FiBook, FiGrid, FiFileText, FiAward } from 'react-icons/fi';
import OverviewTab from './tabs/OverviewTab';
import TimelineTab from './tabs/TimelineTab';
import EmotionsTab from './tabs/EmotionsTab';
import WordsTab from './tabs/WordsTab';
import PatternsTab from './tabs/PatternsTab';
import SummaryTab from './tabs/SummaryTab';
import GamificationTab from './tabs/GamificationTab';
import bgImage from '../assets/4105004.jpg';

const Dashboard = ({ chatData }) => {
  const { messages, metadata, stats, sentiment, analytics, gamification } = chatData;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const MotionBox = motion(Box);
  const MotionCard = motion(Card);
  const MotionHeading = motion(Heading);

  const tabConfig = [
    { label: 'Overview', icon: FiBarChart2, component: OverviewTab },
    { label: 'Timeline', icon: FiTrendingUp, component: TimelineTab },
    { label: 'Emotions', icon: FiHeart, component: EmotionsTab },
    { label: 'Words', icon: FiBook, component: WordsTab },
    { label: 'Patterns', icon: FiGrid, component: PatternsTab },
    { label: 'Gamify', icon: FiAward, component: GamificationTab },
    { label: 'Summary', icon: FiFileText, component: SummaryTab },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <Box
      minH="100vh"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'rgba(255, 255, 255, 0.9)',
        zIndex: 0,
      }}
    >
      <Box position="relative" zIndex={1}>
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 3, md: 6 }} pb={{ base: 24, md: 8 }}>
      <MotionBox
        as={VStack}
        spacing={{ base: 6, md: 8 }}
        align="stretch"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <MotionBox textAlign="center" variants={cardVariants}>
          <MotionHeading
            size={{ base: "lg", md: "2xl" }}
            mb={2}
            color="Black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About your relationship
          </MotionHeading>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
              {metadata.participants.join(' & ')}
            </Text>
          </motion.div>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
          <MotionCard
            bg="white"
            shadow="md"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(56, 178, 172, 0.3)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "sm", md: "md" }} color="gray.600">Total Messages</StatLabel>
                <StatNumber fontSize={{ base: "xl", md: "2xl" }} color="teal.600">{metadata.totalMessages.toLocaleString()}</StatNumber>
                <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                  {new Date(metadata.startDate).toLocaleDateString()} -{' '}
                  {new Date(metadata.endDate).toLocaleDateString()}
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>

          <MotionCard
            bg="white"
            shadow="md"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(56, 178, 172, 0.3)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "sm", md: "md" }} color="gray.600">Duration</StatLabel>
                <StatNumber fontSize={{ base: "xl", md: "2xl" }} color="teal.600">{analytics.totalDays} days</StatNumber>
                <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                  {analytics.avgMessagesPerDay} msgs/day avg
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>

          <MotionCard
            bg="white"
            shadow="md"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(56, 178, 172, 0.3)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "sm", md: "md" }} color="gray.600">Overall Mood</StatLabel>
                <StatNumber>
                  <HStack>
                    <Badge
                      colorScheme={
                        sentiment.overallSentiment === 'positive' ? 'green' :
                        sentiment.overallSentiment === 'negative' ? 'red' : 'gray'
                      }
                      fontSize={{ base: "xs", md: "md" }}
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {sentiment.overallSentiment}
                    </Badge>
                  </HStack>
                </StatNumber>
                <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                  {sentiment.positivePercent}% positive
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>

          <MotionCard
            bg="white"
            shadow="md"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(56, 178, 172, 0.3)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "sm", md: "md" }} color="gray.600">Communication</StatLabel>
                <StatNumber>
                  <Badge
                    colorScheme={
                      sentiment.communicationHealth === 'healthy' ? 'green' :
                      sentiment.communicationHealth === 'moderate' ? 'yellow' : 'red'
                    }
                    fontSize={{ base: "xs", md: "md" }}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {sentiment.communicationHealth}
                  </Badge>
                </StatNumber>
                <StatHelpText fontSize={{ base: "xs", md: "sm" }}>Overall health</StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        <MotionCard
          shadow="lg"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          bg="rgba(255, 255, 255, 0.7)"
          w="100%"
        >
          <CardBody p={{ base: 3, md: 6 }}>
            <Tabs colorScheme="teal" isLazy>
              {isMobile ? (
                <>
                  <TabPanels>
                    <TabPanel px={{ base: 2, md: 4 }}>
                      <OverviewTab
                        stats={stats}
                        metadata={metadata}
                        analytics={analytics}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <TimelineTab
                        messages={messages}
                        analytics={analytics}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <EmotionsTab
                        sentiment={sentiment}
                        messages={messages}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <WordsTab
                        analytics={analytics}
                        messages={messages}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <PatternsTab
                        stats={stats}
                        analytics={analytics}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <GamificationTab
                        stats={stats}
                        metadata={metadata}
                        analytics={analytics}
                        sentiment={sentiment}
                        gamification={gamification}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <SummaryTab
                        sentiment={sentiment}
                        stats={stats}
                        metadata={metadata}
                      />
                    </TabPanel>
                  </TabPanels>

                  <Box
                    position="fixed"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="white"
                    borderTop="1px solid"
                    borderColor="gray.200"
                    zIndex={10}
                    boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
                  >
                    <TabList
                      display="flex"
                      justifyContent="space-around"
                      px={0}
                      borderBottom="none"
                      pb="env(safe-area-inset-bottom)"
                    >
                      {tabConfig.map((tab, idx) => (
                        <Tab
                          key={idx}
                          flex={1}
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          py={3}
                          _selected={{
                            color: 'teal.600',
                            borderBottom: '3px solid',
                            borderBottomColor: 'teal.600',
                          }}
                          _focus={{ outline: 'none' }}
                          fontSize="10px"
                          gap={1}
                        >
                          <tab.icon size={24} />
                          <Text fontSize="10px" fontWeight="500">
                            {tab.label}
                          </Text>
                        </Tab>
                      ))}
                    </TabList>
                  </Box>
                </>
              ) : (
                <>
                  <TabList px={{ base: 2, md: 4 }} overflowX={{ base: "auto", md: "visible" }}>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Overview</Tab>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Timeline</Tab>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Emotions</Tab>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Words</Tab>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Patterns</Tab>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Gamify</Tab>
                    <Tab fontSize={{ base: "xs", md: "md" }}>Summary</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={{ base: 2, md: 4 }}>
                      <OverviewTab
                        stats={stats}
                        metadata={metadata}
                        analytics={analytics}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <TimelineTab
                        messages={messages}
                        analytics={analytics}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <EmotionsTab
                        sentiment={sentiment}
                        messages={messages}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <WordsTab
                        analytics={analytics}
                        messages={messages}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <PatternsTab
                        stats={stats}
                        analytics={analytics}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <GamificationTab
                        stats={stats}
                        metadata={metadata}
                        analytics={analytics}
                        sentiment={sentiment}
                        gamification={gamification}
                      />
                    </TabPanel>

                    <TabPanel px={{ base: 2, md: 4 }}>
                      <SummaryTab
                        sentiment={sentiment}
                        stats={stats}
                        metadata={metadata}
                      />
                    </TabPanel>
                  </TabPanels>
                </>
              )}
            </Tabs>
          </CardBody>
        </MotionCard>
      </MotionBox>
      </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
