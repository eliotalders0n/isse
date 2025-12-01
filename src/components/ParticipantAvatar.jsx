import { Box, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Generate a consistent color based on name
const getAvatarColor = (name) => {
  const colors = [
    { bg: 'warm.400', light: 'warm.100' },
    { bg: 'peach.400', light: 'peach.100' },
    { bg: 'rose.400', light: 'rose.100' },
    { bg: 'orange.400', light: 'orange.100' },
    { bg: 'pink.400', light: 'pink.100' },
  ];

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Generate avatar URL using DiceBear API with mood support
const getAvatarUrl = (name, mood = 'neutral') => {
  const seed = encodeURIComponent(name);

  // Map mood to emoji style parameters
  const moodParams = {
    happy: '&mouth=smile&eyes=happy',
    sad: '&mouth=sad&eyes=sad',
    neutral: '&mouth=default&eyes=default',
  };

  const moodParam = moodParams[mood] || moodParams.neutral;

  // Using "avataaars" style for illustrated characters with mood
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=transparent${moodParam}`;
};

// Simple emoji representation for mood
const getMoodEmoji = (mood) => {
  const emojis = {
    happy: '😊',
    sad: '😔',
    neutral: '😐',
  };
  return emojis[mood] || emojis.neutral;
};

const ParticipantAvatar = ({ name, size = 'lg', showName = true, variant = 'illustration', mood = 'neutral' }) => {
  const colors = getAvatarColor(name);
  const avatarUrl = getAvatarUrl(name, mood);

  const sizeMap = {
    sm: { avatar: '60px', text: 'sm' },
    md: { avatar: '80px', text: 'md' },
    lg: { avatar: '120px', text: 'lg' },
    xl: { avatar: '160px', text: 'xl' },
  };

  const dimensions = sizeMap[size] || sizeMap.lg;

  return (
    <VStack spacing={3}>
      <MotionBox
        position="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Box
          position="relative"
          w={dimensions.avatar}
          h={dimensions.avatar}
          borderRadius="full"
          bg={colors.light}
          border="4px solid"
          borderColor={colors.bg}
          overflow="hidden"
          boxShadow="lg"
        >
          {variant === 'illustration' ? (
            <Box
              as="img"
              src={avatarUrl}
              alt={name}
              w="100%"
              h="100%"
              objectFit="cover"
              onError={(e) => {
                // Fallback to initials if illustration fails to load
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:${size === 'xl' ? '4rem' : size === 'lg' ? '3rem' : '2rem'};font-weight:bold;color:var(--chakra-colors-${colors.bg.replace('.', '-')})">${name.charAt(0).toUpperCase()}</div>`;
              }}
            />
          ) : variant === 'emoji' ? (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={size === 'xl' ? '6xl' : size === 'lg' ? '4xl' : size === 'md' ? '3xl' : '2xl'}
            >
              {getMoodEmoji(mood)}
            </Box>
          ) : (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={size === 'xl' ? '4xl' : size === 'lg' ? '3xl' : '2xl'}
              fontWeight="bold"
              color={colors.bg}
            >
              {name.charAt(0).toUpperCase()}
            </Box>
          )}
        </Box>

        {/* Decorative glow */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w={`calc(${dimensions.avatar} + 20px)`}
          h={`calc(${dimensions.avatar} + 20px)`}
          borderRadius="full"
          bg={colors.bg}
          opacity={0.2}
          filter="blur(20px)"
          zIndex={-1}
        />
      </MotionBox>

      {showName && (
        <Text
          fontSize={dimensions.text}
          fontWeight="bold"
          color="sand.800"
          textAlign="center"
        >
          {name}
        </Text>
      )}
    </VStack>
  );
};

export default ParticipantAvatar;
