import { Box, Text, Card, CardBody, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

const MotionCard = motion(Card);

const CoachMessage = ({ message, type = 'insight', icon = FiHeart, delay = 0 }) => {
  const typeStyles = {
    insight: {
      bg: 'linear-gradient(135deg, rgba(255, 133, 86, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)',
      borderColor: 'warm.400',
      iconColor: 'warm.500',
    },
    encouragement: {
      bg: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(251, 113, 133, 0.1) 100%)',
      borderColor: 'peach.400',
      iconColor: 'peach.500',
    },
    observation: {
      bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(255, 133, 86, 0.1) 100%)',
      borderColor: 'rose.400',
      iconColor: 'rose.500',
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
            color="sand.700"
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
