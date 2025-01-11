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
    FaBox,
} from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import ProjectsModal from './ProjectsModal';
import useProjectStore from '../store/projectStore';
import ThemeToggle from './ThemeToggle';

const NavItem = ({ icon, children, to, onClick, indent = false, isHeader = false, rightElement, isActive = false, isExpanded = false, onToggle, isFeature = false, px, level = 0 }) => {
    const location = useLocation();
    const isCurrentPath = to && location.pathname.startsWith(to);
    const featureColor = useColorModeValue('gray.600', 'gray.400');
    const bgHover = useColorModeValue('gray.100', 'gray.700');
    const bgSelected = useColorModeValue('gray.50', 'gray.800');

    return (
        <Flex
            as={to ? RouterLink : 'div'}
            to={to}
            align="center"
            px={px || (level === 0 ? "4" : level === 1 ? "6" : "8")}
            py={level === 0 ? "3" : "2"}
            cursor="pointer"
            color={isActive || isCurrentPath
                ? "accent.emphasized"
                : isFeature
                    ? "text.muted"
                    : isHeader
                        ? "text.default"
                        : "text.muted"}
            bg={isActive || isCurrentPath ? bgSelected : "transparent"}
            _hover={{
                bg: bgHover,
                color: "accent.emphasized",
            }}
            onClick={onClick}
            role="group"
            borderLeft={level > 0 ? "2px" : "0"}
            borderLeftColor={isActive || isCurrentPath ? "accent.default" : "transparent"}
            fontSize={level === 2 ? "sm" : "md"}
            fontWeight={isHeader ? "semibold" : level === 2 ? "normal" : "medium"}
            transition="all 0.2s"
            position="relative"
        >
            {icon && (
                <Icon
                    as={icon}
                    mr="3"
                    fontSize={level === 2 ? "14" : "16"}
                    color={isActive || isCurrentPath ? "accent.emphasized" : "inherit"}
                />
            )}
            <Text flex="1">{children}</Text>
            {rightElement && (
                <Icon
                    as={isExpanded ? FaChevronDown : FaChevronRight}
                    ml="2"
                    fontSize="12"
                    transition="all 0.2s"
                    transform={isExpanded ? "rotate(0deg)" : "rotate(0deg)"}
                />
            )}
        </Flex>
    );
};

const ProjectFeatures = ({ projectId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isResearchOpen, setIsResearchOpen] = useState(false);
    const bgHover = useColorModeValue('gray.100', 'gray.700');

    const researchSubItems = [
        { name: 'Pain & Frustration Analysis', path: 'pain-analysis' },
        { name: 'Question & Advice Mapping', path: 'question-advice' },
        { name: 'Pattern Detection', path: 'pattern-detection' },
        { name: 'Popular Products Analysis', path: 'product-analysis' },
        { name: 'User Avatars', path: 'avatars' },
    ];

    const features = [
        { name: 'Products & Services', icon: FaBox, path: 'products', color: 'teal' },
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

    useEffect(() => {
        const researchBasePath = `/projects/${projectId}/research`;
        const isInResearch = location.pathname.startsWith(researchBasePath);
        setIsResearchOpen(isInResearch);
    }, [location.pathname, projectId]);

    return (
        <VStack align="stretch" spacing={1}>
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
                            level={1}
                            rightElement={isResearchHub}
                            isExpanded={isResearchOpen}
                            onClick={isResearchHub ? (e) => {
                                e.preventDefault();
                                setIsResearchOpen(!isResearchOpen);
                                navigate(basePath);
                            } : undefined}
                        >
                            {feature.name}
                        </NavItem>
                        {isResearchHub && (
                            <Collapse in={isResearchOpen}>
                                <VStack align="stretch" spacing={0} pl={2}>
                                    {researchSubItems.map((subItem) => (
                                        <NavItem
                                            key={subItem.name}
                                            to={`${basePath}/${subItem.path}`}
                                            level={2}
                                        >
                                            {subItem.name}
                                        </NavItem>
                                    ))}
                                </VStack>
                            </Collapse>
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
            w={{ base: 'full', md: '280px' }}
            h="full"
            bg="sidebar.bg"
            borderRight="1px"
            borderRightColor="sidebar.border"
            pos="fixed"
            left="0"
            top="0"
            overflowY="auto"
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'gray.300',
                    borderRadius: '24px',
                },
            }}
        >
            <VStack h="full" spacing={6} align="stretch" py={5}>
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

                <VStack spacing={4} align="stretch">
                    <NavItem icon={FaHome} to="/chat" isHeader={true} level={0}>
                        Home
                    </NavItem>

                    <Box>
                        <Flex px={4} py={2} align="center">
                            <Text fontSize="sm" fontWeight="medium" color="gray.500">
                                PROJECTS
                            </Text>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onOpen}
                                ml="auto"
                                leftIcon={<FaPlus />}
                                color="gray.500"
                                _hover={{ color: "accent.emphasized" }}
                            >
                                New
                            </Button>
                        </Flex>
                        <VStack align="stretch" spacing={0}>
                            {projects.map((project) => (
                                <Box key={project.id}>
                                    <NavItem
                                        icon={FaFolder}
                                        onClick={() => handleProjectClick(project.id)}
                                        isActive={expandedProject === project.id}
                                        rightElement={true}
                                        isExpanded={expandedProject === project.id}
                                        level={0}
                                    >
                                        {project.name}
                                    </NavItem>
                                    <Collapse in={expandedProject === project.id}>
                                        <ProjectFeatures projectId={project.id} />
                                    </Collapse>
                                </Box>
                            ))}
                        </VStack>
                    </Box>

                    <Box mt="auto">
                        <Divider opacity="0.1" mb={4} />
                        <VStack spacing={2} align="stretch">
                            <NavItem to="/past-runs" level={0}>
                                Past Runs
                            </NavItem>
                            <NavItem to="/profile" level={0}>
                                Profile
                            </NavItem>
                            <NavItem icon={FaSignOutAlt} onClick={handleLogout} level={0}>
                                Logout
                            </NavItem>
                        </VStack>
                    </Box>
                </VStack>
            </VStack>
            <ProjectsModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default Sidebar; 