import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const Avatars = () => {
    return (
        <Box p={8}>
            <VStack spacing={4} align="start">
                <Heading size="lg">Customer Avatars</Heading>
                <Text color="gray.600">
                    Coming soon: Create detailed customer personas and understand your target audience.
                </Text>
            </VStack>
        </Box>
    );
};

export default Avatars; 