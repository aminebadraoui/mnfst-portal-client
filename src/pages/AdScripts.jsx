import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const AdScripts = () => {
    return (
        <Box p={8}>
            <VStack spacing={4} align="start">
                <Heading size="lg">Ad Scripts</Heading>
                <Text color="gray.600">
                    Coming soon: Generate compelling ad copy and marketing scripts for your campaigns.
                </Text>
            </VStack>
        </Box>
    );
};

export default AdScripts; 