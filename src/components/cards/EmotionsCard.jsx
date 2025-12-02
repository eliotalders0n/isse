import { Box, VStack, Heading, Text, HStack, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const MotionBox = motion(Box);

const EmotionsCard = ({ chatData }) => {
  const { sentiment } = chatData;

  const emotionData = Object.entries(sentiment.emotionBreakdown || {})
    .map(([emotion, count]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  const getEmotionalInsight = () => {
    // Use AI-enhanced coach note if available
    if (sentiment.coachNotes?.emotions) {
      return sentiment.coachNotes.emotions;
    }

    // Fallback to keyword-based insights
    if (sentiment.positivePercent > 70)
      return "Your conversations are filled with warmth and positivity.";
    if (sentiment.positivePercent > 50)
      return "You maintain a balanced and healthy emotional tone.";
    return "Consider bringing more lightness into your conversations.";
  };

  return (
    <Box
      bg="white"
      borderRadius="3xl"
      p={8}
      height="100%"
      display="flex"
      flexDirection="column"
      boxShadow="2xl"
      overflow="auto"
    >
      <VStack spacing={6} align="stretch" flex={1} justify="center">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" textAlign="center" color="gray.800" mb={2}>
            Emotional Landscape
          </Heading>
          <Text textAlign="center" color="gray.600" fontSize="lg">
            The feelings you share
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <HStack spacing={4} justify="center" bg="gradient.50" p={4} borderRadius="xl">
            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="black" color="green.500">
                {sentiment.positivePercent}%
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="semibold">
                Positive
              </Text>
            </VStack>
            <Divider orientation="vertical" h="50px" />
            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="black" color="gray.500">
                {sentiment.neutralPercent}%
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="semibold">
                Neutral
              </Text>
            </VStack>
            <Divider orientation="vertical" h="50px" />
            <VStack spacing={1}>
              <Text fontSize="3xl" fontWeight="black" color="red.500">
                {sentiment.negativePercent}%
              </Text>
              <Text fontSize="xs" color="gray.600" fontWeight="semibold">
                Negative
              </Text>
            </VStack>
          </HStack>
        </MotionBox>

        {emotionData.length > 0 && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            h="200px"
          >
            <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2} textAlign="center">
              Top Emotions
            </Text>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData}>
                <XAxis dataKey="emotion" tick={{ fill: '#4A5568', fontSize: 11 }} />
                <YAxis tick={{ fill: '#4A5568', fontSize: 11 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MotionBox>
        )}

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          bg="pink.50"
          p={4}
          borderRadius="xl"
          borderLeft="4px solid"
          borderColor="pink.500"
        >
          <Text color="gray.700" fontSize="md" lineHeight="tall">
            <strong>Coach's note:</strong> {getEmotionalInsight()}
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default EmotionsCard;
