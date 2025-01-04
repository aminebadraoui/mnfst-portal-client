import React from 'react';
import { Box, Icon, Text, VStack, HStack } from '@chakra-ui/react';

const Feature = ({ icon, title, description }) => {
    return (
        <Box
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            borderColor="purple.100"
            bg="white"
            _hover={{
                transform: 'translateY(-2px)',
                shadow: 'md',
                borderColor: 'purple.200',
            }}
            transition="all 0.2s"
        >
            <HStack spacing={4} align="flex-start">
                <Box
                    p={2}
                    bg="purple.50"
                    borderRadius="md"
                    color="purple.500"
                >
                    <Icon as={icon} boxSize={5} />
                </Box>
                <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold" fontSize="md" color="gray.700">
                        {title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        {description}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
};

export default Feature; 