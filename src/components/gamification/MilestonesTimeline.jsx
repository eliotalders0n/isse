import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import * as FiIcons from 'react-icons/fi';

const MilestonesTimeline = ({ milestones }) => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  if (!milestones || milestones.length === 0) {
    return (
      <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
        <Box mb={2} color="gray.400">
          <FiIcons.FiTarget size={48} style={{ margin: '0 auto' }} />
        </Box>
        <Text color="gray.600">No milestones reached yet</Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Keep the conversation going!
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={columns} spacing={4}>
      {milestones.map((milestone, index) => {
        // Get the icon component dynamically
        const IconComponent = FiIcons[milestone.icon];

        return (
          <Card key={milestone.id} borderLeftWidth="4px" borderLeftColor="teal.400">
            <CardBody>
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Box color="teal.500">
                    {IconComponent && <IconComponent size={24} />}
                  </Box>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="bold">
                      {milestone.name}
                    </Text>
                    <Badge colorScheme="teal" fontSize="xx-small">
                      {milestone.type}
                    </Badge>
                  </VStack>
                </HStack>
                <Text fontSize="xs" color="gray.600">
                  {milestone.description}
                </Text>
                {milestone.achievedDate && (
                  <Text fontSize="xs" color="gray.500">
                    Achieved: {new Date(milestone.achievedDate).toLocaleDateString()}
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};

export default MilestonesTimeline;
