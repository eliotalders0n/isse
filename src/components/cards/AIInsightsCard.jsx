import {
    Box,
    VStack,
    Heading,
    Text,
    HStack,
    Badge,
    Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCpu, FiZap, FiTarget, FiTrendingUp } from 'react-icons/fi';

const MotionBox = motion(Box);

const AIInsightsCard = ({ chatData }) => {
    const { sentiment } = chatData;

    // If no AI insights, don't render this card
    if (!sentiment?.aiPowered || !sentiment?.aiInsights) {
        return null;
    }

    return (
        <Box
            bg="white"
            borderRadius="3xl"
            p={8}
            height="100%"
            display="flex"
            flexDirection="column"
            boxShadow="2xl"
            overflowY="auto"
        >
            <VStack spacing={6} align="stretch" h="100%">
                {/* Header */}
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    textAlign="center"
                >
                    <HStack justify="center" spacing={2} mb={2}>
                        <Box as={FiCpu} size={28} color="purple.500" />
                        <Heading
                            size="xl"
                            bgGradient="linear(to-r, purple.500, pink.500)"
                            bgClip="text"
                            fontWeight="800"
                        >
                            AI Insights
                        </Heading>
                    </HStack>
                    <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                        Powered by Google Gemini
                    </Badge>
                    <Text fontSize="md" color="gray.600" mt={2}>
                        Deep analysis of your relationship dynamic
                    </Text>
                </MotionBox>

                <Divider />

                {/* AI Overall Dynamic */}
                {sentiment.aiOverallDynamic && (
                    <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        bg="gradient"
                        bgGradient="linear(to-r, purple.500, pink.500)"
                        p={5}
                        borderRadius="xl"
                    >
                        <HStack spacing={2} mb={2}>
                            <Box as={FiZap} color="white" size={20} />
                            <Text fontWeight="bold" color="white" fontSize="lg">
                                Relationship Dynamic
                            </Text>
                        </HStack>
                        <Text color="white" fontSize="md" lineHeight="tall">
                            {sentiment.aiOverallDynamic}
                        </Text>
                    </MotionBox>
                )}

                {/* Communication Style */}
                {sentiment.aiCommunicationStyle && (
                    <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        bg="blue.50"
                        p={4}
                        borderRadius="xl"
                        borderLeft="4px solid"
                        borderColor="blue.500"
                    >
                        <HStack spacing={2} mb={2}>
                            <Box as={FiTarget} color="blue.600" size={20} />
                            <Text fontWeight="bold" color="gray.800">
                                Communication Style
                            </Text>
                        </HStack>
                        <Text color="gray.700" fontSize="sm" lineHeight="tall">
                            {sentiment.aiCommunicationStyle}
                        </Text>
                    </MotionBox>
                )}

                {/* Emotional Patterns */}
                {sentiment.aiEmotionalPatterns && (
                    <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        bg="pink.50"
                        p={4}
                        borderRadius="xl"
                        borderLeft="4px solid"
                        borderColor="pink.500"
                    >
                        <HStack spacing={2} mb={2}>
                            <Box as={FiTrendingUp} color="pink.600" size={20} />
                            <Text fontWeight="bold" color="gray.800">
                                Emotional Patterns
                            </Text>
                        </HStack>
                        <Text color="gray.700" fontSize="sm" lineHeight="tall">
                            {sentiment.aiEmotionalPatterns}
                        </Text>
                    </MotionBox>
                )}

                {/* Relationship Stage */}
                {sentiment.aiRelationshipStage && (
                    <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        bg="purple.50"
                        p={4}
                        borderRadius="xl"
                        borderLeft="4px solid"
                        borderColor="purple.500"
                    >
                        <Text fontWeight="bold" color="gray.800" mb={1}>
                            Relationship Stage
                        </Text>
                        <Text color="gray.700" fontSize="sm" lineHeight="tall">
                            {sentiment.aiRelationshipStage}
                        </Text>
                    </MotionBox>
                )}

                {/* Deep AI Insights */}
                {sentiment.aiInsights && sentiment.aiInsights.length > 0 && (
                    <VStack spacing={3} align="stretch">
                        <Text fontWeight="bold" color="gray.800" fontSize="lg">
                            💡 Deep Insights
                        </Text>
                        {sentiment.aiInsights.map((insight, idx) => (
                            <MotionBox
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                bg="gradient"
                                bgGradient="linear(to-br, gray.50, purple.50)"
                                p={4}
                                borderRadius="lg"
                                borderLeft="3px solid"
                                borderColor="purple.400"
                            >
                                <HStack align="start" spacing={2}>
                                    <Text color="purple.500" fontWeight="bold" fontSize="lg">
                                        •
                                    </Text>
                                    <Text color="gray.700" fontSize="sm" lineHeight="tall" flex={1}>
                                        {insight}
                                    </Text>
                                </HStack>
                            </MotionBox>
                        ))}
                    </VStack>
                )}

                {/* Footer */}
                <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    p={4}
                    borderRadius="lg"
                    textAlign="center"
                    mt="auto"
                >
                    <Text fontSize="sm" color="white" fontWeight="medium">
                        AI insights are generated based on conversation patterns and context 🤖✨
                    </Text>
                </MotionBox>
            </VStack>
        </Box>
    );
};

export default AIInsightsCard;
