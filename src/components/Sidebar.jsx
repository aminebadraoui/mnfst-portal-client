import React, { useEffect, useCallback, useState } from 'react';
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
    Collapse,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUser,
    FaSignOutAlt,
    FaProjectDiagram,
    FaPlus,
    FaHistory,
    FaSearchDollar,
    FaFolder,
    FaChevronDown,
    FaChevronRight,
    FaSearch,
    FaPencilAlt,
    FaComments,
    FaChartLine,
    FaExclamationCircle,
    FaQuestionCircle,
    FaShoppingCart,
    FaUserCircle,
} from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import ProjectsModal from './ProjectsModal';
import useProjectStore from '../store/projectStore';
import ThemeToggle from './ThemeToggle';

const NavItem = ({ icon, children, to, onClick, indent = false, isHeader = false, rightElement, isActive = false, isExpanded = false, onToggle, isFeature = false, px }) => {
    const location = useLocation();
    const isCurrentPath = to && location.pathname.startsWith(to);
    const featureColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Flex
            as={to ? RouterLink : 'div'}
            to={to}
            align="center"
            px={px || "4"}
            py={indent ? "1" : "2"}
            cursor="pointer"
            color={isActive || isCurrentPath
                ? "accent.emphasized"
                : isFeature
                    ? "text.muted"
                    : isHeader
                        ? "text.default"
                        : "text.muted"}
            bg={isActive || isCurrentPath ? "bg.selected" : "transparent"}
            _hover={{
                bg: "bg.hover",
                color: "accent.emphasized",
            }}
            onClick={onClick}
            role="group"
            borderLeft={indent ? "1px" : "0"}
            borderLeftColor={isActive || isCurrentPath ? "accent.default" : "transparent"}
            fontSize={isFeature ? "sm" : "md"}
            fontWeight={isHeader ? "semibold" : isFeature ? "normal" : "medium"}
            transition="all 0.2s"
        >
            <Icon
                as={icon}
                mr="3"
                fontSize={isFeature ? "14" : "16"}
                color="inherit"
            />
            <Text flex="1">{children}</Text>
            {rightElement && (
                <Box ml="2">{rightElement}</Box>
            )}
        </Flex>
    );
};

const ProjectFeatures = ({ projectId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isResearchOpen, setIsResearchOpen] = useState(false);

    const researchSubItems = [
        { name: 'Pain & Frustration Analysis', path: 'pain-analysis', icon: FaExclamationCircle },
        { name: 'Question & Advice Mapping', path: 'question-advice', icon: FaQuestionCircle },
        { name: 'Pattern Detection', path: 'pattern-detection', icon: FaChartLine },
        { name: 'Popular Products Analysis', path: 'product-analysis', icon: FaShoppingCart },
        { name: 'User Avatars', path: 'avatars', icon: FaUserCircle },
    ];

    const features = [
        {
            name: 'Research Hub',
            icon: FaSearch,
            path: 'research',
            color: 'blue',
            subItems: researchSubItems
        },
        { name: 'Content Hub', icon: FaPencilAlt, path: 'content', color: 'green' },
        { name: 'Communication Hub', icon: FaComments, path: 'communication', color: 'purple' },
        { name: 'Strategy Hub', icon: FaChartLine, path: 'strategy', color: 'orange' },
    ];

    // Auto-open research submenu when in research routes, close otherwise
    useEffect(() => {
        const researchBasePath = `/projects/${projectId}/research`;
        const isInResearch = location.pathname.startsWith(researchBasePath);
        setIsResearchOpen(isInResearch);
    }, [location.pathname, projectId]);

    return (
        <VStack align="stretch" spacing={0}>
            {features.map((feature) => {
                const basePath = `/projects/${projectId}/${feature.path}`;
                const isActive = location.pathname.startsWith(basePath);
                const isResearchHub = feature.path === 'research';

                return (
                    <Box key={feature.name}>
                        <NavItem
                            icon={feature.icon}
                            to={basePath}
                            isActive={isActive}
                            isFeature={true}
                            indent={true}
                            px="6"
                            onClick={isResearchHub ? (e) => {
                                e.preventDefault();
                                setIsResearchOpen(!isResearchOpen);
                                navigate(basePath);
                            } : undefined}
                        >
                            {feature.name}
                        </NavItem>
                        {isResearchHub && isResearchOpen && (
                            <VStack align="stretch" spacing={0} mb={4}>
                                {researchSubItems.map((subItem, idx) => (
                                    <NavItem
                                        key={subItem.name}
                                        icon={subItem.icon}
                                        to={`${basePath}/${subItem.path}`}
                                        isFeature={true}
                                        indent={true}
                                        px="10"
                                    >
                                        {subItem.name}
                                    </NavItem>
                                ))}
                            </VStack>
                        )}
                    </Box>
                );
            })}
        </VStack>
    );
};

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const projects = useProjectStore((state) => state.projects);
    const fetchProjects = useProjectStore((state) => state.fetchProjects);

    const [expandedProject, setExpandedProject] = React.useState(null);

    // Fetch projects on mount
    useEffect(() => {
        const loadProjects = async () => {
            try {
                await fetchProjects();
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        };
        loadProjects();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Find current project from URL if we're in a project route
    useEffect(() => {
        const match = location.pathname.match(/\/projects\/([^/]+)/);
        if (match) {
            setExpandedProject(match[1]);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const handleProjectClick = (projectId) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
        }
    };

    return (
        <Box
            w={{ base: 'full', md: '64' }}
            h="full"
            bg="sidebar.bg"
            borderRight="1px"
            borderRightColor="sidebar.border"
            pos="fixed"
            left="0"
            top="0"
            overflowY="auto"
        >
            <VStack h="full" spacing={4} align="stretch" py={5}>
                <Flex px={4} align="center" justify="space-between">
                    <Text
                        fontSize="2xl"
                        color="accent.default"
                        fontWeight="bold"
                    >
                        MNFST
                    </Text>
                    <ThemeToggle />
                </Flex>

                <VStack spacing={2} align="stretch">
                    <NavItem icon={FaHome} to="/chat" isHeader={true}>
                        Home
                    </NavItem>
                    <Divider opacity="0.1" />
                    <Button
                        variant="ghost"
                        onClick={onOpen}
                        leftIcon={<FaPlus />}
                        justifyContent="flex-start"
                        px="4"
                        w="full"
                        color="text.muted"
                        _hover={{
                            bg: "bg.hover",
                            color: "accent.emphasized"
                        }}
                    >
                        New Project
                    </Button>
                    {projects?.map((project) => (
                        <React.Fragment key={project.id}>
                            <NavItem
                                icon={FaFolder}
                                to={`/projects/${project.id}`}
                                isActive={expandedProject === project.id}
                                onToggle={() => handleProjectClick(project.id)}
                                isExpanded={expandedProject === project.id}
                                onClick={() => handleProjectClick(project.id)}
                            >
                                {project.name}
                            </NavItem>
                            <Collapse in={expandedProject === project.id}>
                                <ProjectFeatures projectId={project.id} />
                            </Collapse>
                        </React.Fragment>
                    ))}
                    <NavItem icon={FaHome} to="/dashboard">
                        Agents Dashboard
                    </NavItem>
                    <NavItem icon={FaHistory} to="/past-runs">
                        Past Runs
                    </NavItem>
                    <NavItem icon={FaUser} to="/profile">
                        Profile
                    </NavItem>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        leftIcon={<FaSignOutAlt />}
                        justifyContent="flex-start"
                        px="4"
                        w="full"
                        mt="auto"
                        color="text.muted"
                        _hover={{
                            bg: "bg.hover",
                            color: "accent.emphasized"
                        }}
                    >
                        Logout
                    </Button>
                </VStack>
            </VStack>
            <ProjectsModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default Sidebar; 