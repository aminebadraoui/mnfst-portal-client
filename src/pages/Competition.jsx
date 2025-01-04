import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const Competition = () => {
    return (
        <Box p={8}>
            <VStack spacing={4} align="start">
                <Heading size="lg">Competition Analysis</Heading>
                <Text color="gray.600">
                    Coming soon: Analyze your competitors and track their performance.
                </Text>
            </VStack>
        </Box>
    );
};

export default Competition; 