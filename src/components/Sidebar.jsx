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
    HStack,
    useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaProjectDiagram, FaPlus, FaHistory, FaSearchDollar, FaFolder } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import ProjectsModal from './ProjectsModal';
import useProjectStore from '../store/projectStore';

const NavItem = ({ icon, children, to, onClick, rightElement, indent = false, isHeader = false }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const activeBg = useColorModeValue('purple.50', 'purple.800');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Flex
            as={to ? RouterLink : 'div'}
            to={to}
            onClick={onClick}
            align="center"
            p="4"
            pl={indent ? "8" : "4"}
            mx="4"
            borderRadius="lg"
            role="group"
            cursor={to || onClick ? "pointer" : "default"}
            bg={isActive ? activeBg : 'transparent'}
            color={isActive ? 'purple.500' : isHeader ? 'gray.500' : 'inherit'}
            _hover={{
                bg: (to || onClick) ? hoverBg : 'transparent',
                color: (to || onClick) ? 'purple.500' : isHeader ? 'gray.500' : 'inherit',
            }}
            fontWeight={isActive ? "bold" : isHeader ? "medium" : "normal"}
        >
            <HStack width="100%" justify="space-between">
                <HStack>
                    {icon && (
                        <Icon
                            fontSize="16"
                            as={icon}
                            color={isActive ? 'purple.500' : isHeader ? 'gray.500' : 'inherit'}
                            _groupHover={{
                                color: (to || onClick) ? 'purple.500' : isHeader ? 'gray.500' : 'inherit',
                            }}
                        />
                    )}
                    <Text
                        _groupHover={{
                            color: (to || onClick) ? 'purple.500' : isHeader ? 'gray.500' : 'inherit',
                        }}
                    >
                        {children}
                    </Text>
                </HStack>
                {rightElement}
            </HStack>
        </Flex>
    );
};

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const projects = useProjectStore((state) => state.projects);

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
            overflowY="auto"
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
                    <NavItem
                        icon={FaProjectDiagram}
                        to="/projects"
                        rightElement={
                            <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="purple"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onOpen();
                                }}
                                p={1}
                            >
                                <Icon as={FaPlus} fontSize="12" />
                            </Button>
                        }
                        isHeader={true}
                    >
                        Projects
                    </NavItem>
                    {projects.map((project) => (
                        <NavItem
                            key={project.id}
                            icon={FaFolder}
                            to={`/projects/${project.id}`}
                            indent={true}
                        >
                            {project.name}
                        </NavItem>
                    ))}
                    <NavItem
                        icon={FaHistory}
                        to="/past-runs"
                        isHeader={true}
                    >
                        Past Runs
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

            <ProjectsModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default Sidebar; 