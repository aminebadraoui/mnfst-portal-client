import React from 'react';
import {
    Box,
    HStack,
    Text,
    Spinner,
} from '@chakra-ui/react';

export default function GlobalLoadingBanner({ isVisible, keyword }) {
    if (!isVisible) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={9999}
            bg="blue.50"
            borderBottom="1px"
            borderColor="blue.200"
            p={3}
        >
            <HStack spacing={3} justify="center">
                <Spinner size="sm" color="blue.500" />
                <Text color="blue.700">
                    Research for "{keyword}" processing...
                </Text>
            </HStack>
        </Box>
    );
} 