import React from 'react';
import {
    Box,
    VStack,
    Icon,
    Text,
    Flex,
    Button,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const NavItem = ({ icon, children, to, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const activeBg = useColorModeValue('purple.50', 'purple.800');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Flex
            as={to ? RouterLink : Button}
            to={to}
            onClick={onClick}
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={isActive ? activeBg : 'transparent'}
            color={isActive ? 'purple.500' : 'inherit'}
            _hover={{
                bg: hoverBg,
            }}
            fontWeight={isActive ? "bold" : "normal"}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    as={icon}
                />
            )}
            {children}
        </Flex>
    );
};

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            w={{ base: 'full', md: '64' }}
            h="full"
            bg={bg}
            borderRight="1px"
            borderRightColor={borderColor}
            pos="fixed"
            left="0"
            top="0"
        >
            <VStack h="full" spacing={4} align="stretch" py={5}>
                <Text
                    fontSize="2xl"
                    color="purple.500"
                    fontWeight="bold"
                    textAlign="center"
                    mb={4}
                >
                    MNFST
                </Text>

                <VStack spacing={2} align="stretch">
                    <NavItem icon={FaHome} to="/dashboard">
                        Agents Dashboard
                    </NavItem>
                </VStack>

                <Divider my={4} />

                <VStack mt="auto" spacing={2} align="stretch">
                    <NavItem icon={FaUser} to="/profile">
                        Profile
                    </NavItem>
                    <NavItem icon={FaSignOutAlt} onClick={handleLogout}>
                        Logout
                    </NavItem>
                </VStack>
            </VStack>
        </Box>
    );
};

export default Sidebar; 