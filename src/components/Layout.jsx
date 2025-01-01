import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const bg = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={bg}>
            <Sidebar />
            <Box ml={{ base: 0, md: '64' }} p="4">
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 