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
    Collapse,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
} from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import ProjectsModal from './ProjectsModal';
import useProjectStore from '../store/projectStore';

const NavItem = ({ icon, children, to, onClick, indent = false, isHeader = false, rightElement, isActive = false, isExpanded = false, onToggle, isFeature = false }) => {
    const bg = useColorModeValue('gray.100', 'gray.700');
    const location = useLocation();
    const isCurrentPath = to && location.pathname.startsWith(to);
    const featureColor = useColorModeValue('gray.600', 'gray.400');
    const projectColor = useColorModeValue('gray.700', 'gray.200');

    return (
        <Flex
            as={to ? RouterLink : 'div'}
            to={to}
            align="center"
            px={isFeature ? "8" : indent ? "6" : "4"}
            py={isFeature ? "1.5" : "2"}
            cursor="pointer"
            color={isActive || isCurrentPath
                ? "purple.500"
                : isFeature
                    ? featureColor
                    : isHeader
                        ? projectColor
                        : "gray.700"}
            bg={isActive || isCurrentPath ? "purple.50" : "transparent"}
            _hover={{
                bg: isFeature ? 'purple.50' : bg,
                color: "purple.500",
            }}
            onClick={onClick}
            role="group"
            borderLeft={isFeature ? "1px" : "0"}
            borderLeftColor={isActive || isCurrentPath ? "purple.500" : "transparent"}
            fontSize={isFeature ? "sm" : "md"}
            fontWeight={isHeader ? "semibold" : isFeature ? "normal" : "medium"}
        >
            <Icon
                as={icon}
                mr="3"
                fontSize={isFeature ? "14" : "16"}
                color={isActive || isCurrentPath ? "purple.500" : "inherit"}
            />
            <Text flex="1">{children}</Text>
            {rightElement && (
                <Box ml="2">{rightElement}</Box>
            )}
            {onToggle && (
                <Icon
                    as={isExpanded ? FaChevronDown : FaChevronRight}
                    ml="2"
                    fontSize="12"
                    transition="all 0.2s"
                />
            )}
        </Flex>
    );
};

const ProjectFeatures = ({ projectId }) => {
    const location = useLocation();
    const features = [
        { name: 'Research Hub', icon: FaSearch, path: 'research', color: 'blue' },
        { name: 'Content Hub', icon: FaPencilAlt, path: 'content', color: 'green' },
        { name: 'Communication Hub', icon: FaComments, path: 'communication', color: 'purple' },
        { name: 'Strategy Hub', icon: FaChartLine, path: 'strategy', color: 'orange' },
    ];

    return (
        <VStack spacing={0.5} align="stretch" mt={0.5} mb={1}>
            {features.map((feature) => (
                <NavItem
                    key={feature.path}
                    icon={feature.icon}
                    to={`/projects/${projectId}/${feature.path}`}
                    isActive={location.pathname.includes(feature.path)}
                    isFeature={true}
                >
                    {feature.name}
                </NavItem>
            ))}
        </VStack>
    );
};

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const projects = useProjectStore((state) => state.projects);
    const location = useLocation();
    const [expandedProject, setExpandedProject] = React.useState(null);

    // Find current project from URL if we're in a project route
    React.useEffect(() => {
        const match = location.pathname.match(/\/projects\/([^/]+)/);
        if (match) {
            setExpandedProject(match[1]);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
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
                        <React.Fragment key={project.id}>
                            <NavItem
                                icon={FaFolder}
                                to={`/projects/${project.id}`}
                                indent={true}
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