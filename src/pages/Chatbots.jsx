import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const Chatbots = () => {
    return (
        <Box p={8}>
            <VStack spacing={4} align="start">
                <Heading size="lg">AI Chatbots</Heading>
                <Text color="gray.600">
                    Coming soon: Create and customize AI chatbots for your business.
                </Text>
            </VStack>
        </Box>
    );
};

export default Chatbots; 