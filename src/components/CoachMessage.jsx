import { Box, Text, Card, CardBody, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const MotionCard = motion(Card);

const CoachMessage = ({ message, type = 'insight', icon = FiHeart, delay = 0 }) => {
  const typeStyles = {
    insight: {
      bg: 'accent.50',
      borderColor: 'accent.600',
      iconColor: 'accent.600',
    },
    encouragement: {
      bg: 'accent.50',
      borderColor: 'accent.600',
      iconColor: 'accent.600',
    },
    observation: {
      bg: 'accent.50',
      borderColor: 'accent.600',
      iconColor: 'accent.600',
    },
  };

  const style = typeStyles[type] || typeStyles.insight;

  return (
    <MotionCard
      bg={style.bg}
      borderLeft="4px solid"
      borderColor={style.borderColor}
      boxShadow="sm"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
    >
      <CardBody py={4} px={5}>
        <HStack spacing={3} align="start">
          <Icon
            as={icon}
            boxSize={5}
            color={style.iconColor}
            mt={0.5}
            flexShrink={0}
          />
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="dark.700"
            lineHeight="tall"
            fontWeight="500"
          >
            {message}
          </Text>
        </HStack>
      </CardBody>
    </MotionCard>
  );
};

export default CoachMessage;
