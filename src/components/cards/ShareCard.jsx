import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShare2, FiDownload, FiHeart } from 'react-icons/fi';

const MotionBox = motion(Box);

const ShareCard = ({ chatData }) => {
  const { metadata } = chatData;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Relationship Story - Isse',
          text: `Just discovered beautiful insights about ${metadata.participants.join(' & ')}'s connection!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback for desktop
      alert('Sharing is best experienced on mobile devices!');
    }
  };

  const handleDownload = () => {
    // This would trigger a download of insights
    alert('Download feature coming soon!');
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
    >
      <VStack spacing={6} align="stretch" flex={1} justify="center">
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          textAlign="center"
        >
          <Box
            as={FiHeart}
            w="80px"
            h="80px"
            color="pink.500"
            mx="auto"
            mb={4}
            fill="pink.500"
          />
          <Heading
            size="xl"
            bgGradient="linear(to-r, purple.600, pink.500)"
            bgClip="text"
            mb={3}
          >
            You Made It!
          </Heading>
          <Text fontSize="lg" color="gray.600" lineHeight="tall" maxW="400px" mx="auto">
            Every conversation is a chance to deepen your connection. Keep being intentional, keep
            being present.
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          bg="gradient"
          bgGradient="linear(to-r, purple.500, pink.500)"
          p={6}
          borderRadius="2xl"
          textAlign="center"
        >
          <Text fontSize="xl" fontWeight="bold" color="white" mb={2}>
            {metadata.participants.join(' & ')}
          </Text>
          <Text fontSize="md" color="whiteAlpha.900">
            {metadata.totalMessages.toLocaleString()} messages •{' '}
            {Math.ceil(
              (new Date(metadata.endDate) - new Date(metadata.startDate)) / (1000 * 60 * 60 * 24)
            )}{' '}
            days
          </Text>
        </MotionBox>

        <VStack spacing={3}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            w="100%"
          >
            <Button
              size="lg"
              w="100%"
              bgGradient="linear(to-r, purple.500, pink.500)"
              color="white"
              leftIcon={<FiShare2 />}
              onClick={handleShare}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
              fontSize="lg"
              fontWeight="bold"
              py={7}
            >
              Share Your Story
            </Button>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            w="100%"
          >
            <Button
              size="lg"
              w="100%"
              variant="outline"
              colorScheme="purple"
              leftIcon={<FiDownload />}
              onClick={handleDownload}
              fontSize="lg"
              py={7}
            >
              Save Insights
            </Button>
          </MotionBox>
        </VStack>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Made with ❤️ by Isse
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default ShareCard;
