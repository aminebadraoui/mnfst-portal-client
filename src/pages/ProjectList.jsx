import React from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Button,
    useDisclosure,
    VStack,
    Text,
    Icon,
    HStack,
    useToast,
} from '@chakra-ui/react';
import { FaPlus, FaSearch, FaUsers, FaAd, FaChartBar, FaTrash, FaRobot, FaProjectDiagram, FaPencilAlt, FaComments, FaChartLine } from 'react-icons/fa';
import ProjectsModal from '../components/ProjectsModal';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import DeleteProjectModal from '../components/DeleteProjectModal';
import Feature from '../components/Feature';

const ProjectCard = ({ project, onDelete }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDelete = async (projectId) => {
        try {
            await onDelete(projectId);
            toast({
                title: 'Project deleted',
                description: 'Project has been deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete project',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCardClick = () => {
        navigate(`/projects/${project.id}`);
    };

    const handleLinkClick = (e) => {
        e.stopPropagation();
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onOpen();
    };

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'purple.500',
            }}
            transition="all 0.2s"
            position="relative"
            onClick={handleCardClick}
            cursor="pointer"
        >
            <Button
                position="absolute"
                top={4}
                right={4}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={handleDeleteClick}
            >
                <Icon as={FaTrash} />
            </Button>

            <VStack align="stretch" spacing={4}>
                <Heading size="md">{project.name}</Heading>
                <Text color="gray.600" noOfLines={2}>
                    {project.description}
                </Text>

                <HStack spacing={2} flexWrap="wrap" onClick={handleLinkClick}>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/research`}
                        variant="outline"
                        leftIcon={<Icon as={FaSearch} />}
                        size="sm"
                        borderRadius="full"
                        borderColor="blue.200"
                        color="blue.500"
                        bg="blue.50"
                        _hover={{
                            bg: 'blue.100',
                            borderColor: 'blue.500',
                        }}
                    >
                        Research Hub
                    </Button>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/content`}
                        variant="outline"
                        leftIcon={<Icon as={FaPencilAlt} />}
                        size="sm"
                        borderRadius="full"
                        borderColor="green.200"
                        color="green.500"
                        bg="green.50"
                        _hover={{
                            bg: 'green.100',
                            borderColor: 'green.500',
                        }}
                    >
                        Content Hub
                    </Button>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/communication`}
                        variant="outline"
                        leftIcon={<Icon as={FaComments} />}
                        size="sm"
                        borderRadius="full"
                        borderColor="purple.200"
                        color="purple.500"
                        bg="purple.50"
                        _hover={{
                            bg: 'purple.100',
                            borderColor: 'purple.500',
                        }}
                    >
                        Communication Hub
                    </Button>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/strategy`}
                        variant="outline"
                        leftIcon={<Icon as={FaChartLine} />}
                        size="sm"
                        borderRadius="full"
                        borderColor="orange.200"
                        color="orange.500"
                        bg="orange.50"
                        _hover={{
                            bg: 'orange.100',
                            borderColor: 'orange.500',
                        }}
                    >
                        Strategy Hub
                    </Button>
                </HStack>
            </VStack>

            <DeleteProjectModal
                isOpen={isOpen}
                onClose={onClose}
                project={project}
                onDelete={handleDelete}
            />
        </Box>
    );
};

const ProjectList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const projects = useProjectStore((state) => state.projects);
    const isLoading = useProjectStore((state) => state.isLoading);
    const error = useProjectStore((state) => state.error);
    const fetchProjects = useProjectStore((state) => state.fetchProjects);
    const deleteProject = useProjectStore((state) => state.deleteProject);
    const toast = useToast();

    React.useEffect(() => {
        const loadProjects = async () => {
            try {
                await fetchProjects();
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to load projects',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        loadProjects();
    }, [fetchProjects, toast]);

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <HStack justify="space-between">
                        <Heading size="lg">Projects</Heading>
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="purple"
                            onClick={onOpen}
                            isLoading={isLoading}
                        >
                            New Project
                        </Button>
                    </HStack>
                    <Box textAlign="center" py={8}>
                        Loading projects...
                    </Box>
                </VStack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <HStack justify="space-between">
                        <Heading size="lg">Projects</Heading>
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="purple"
                            onClick={onOpen}
                        >
                            New Project
                        </Button>
                    </HStack>
                    <Box textAlign="center" py={8} color="red.500">
                        Error: {error}
                    </Box>
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg">Projects</Heading>
                    {projects.length > 0 && (
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="purple"
                            onClick={onOpen}
                        >
                            New Project
                        </Button>
                    )}
                </HStack>

                {projects.length === 0 ? (
                    <Box
                        textAlign="center"
                        py={16}
                        px={8}
                        borderWidth="2px"
                        borderRadius="xl"
                        borderStyle="dashed"
                        borderColor="purple.200"
                        bg="white"
                        maxW="3xl"
                        mx="auto"
                    >
                        <VStack spacing={6}>
                            <Icon
                                as={FaProjectDiagram}
                                boxSize={16}
                                color="purple.400"
                            />
                            <VStack spacing={3}>
                                <Heading size="lg" color="gray.700">
                                    Welcome to MNFST Lab!
                                </Heading>
                                <Text fontSize="lg" color="gray.600" maxW="xl">
                                    Create your first project to start exploring insights, managing chatbots,
                                    and building your digital presence.
                                </Text>
                            </VStack>
                            <Box>
                                <Button
                                    leftIcon={<FaPlus />}
                                    colorScheme="purple"
                                    size="lg"
                                    onClick={onOpen}
                                    px={8}
                                >
                                    Create Your First Project
                                </Button>
                            </Box>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} pt={8} maxW="2xl">
                                <Feature
                                    icon={FaSearch}
                                    title="Community Insights"
                                    description="Analyze online discussions to uncover valuable insights and opportunities"
                                />
                                <Feature
                                    icon={FaRobot}
                                    title="AI Chatbots"
                                    description="Create and customize chatbots to engage with your audience"
                                />
                                <Feature
                                    icon={FaUsers}
                                    title="Customer Avatars"
                                    description="Build detailed personas to understand your target audience"
                                />
                                <Feature
                                    icon={FaAd}
                                    title="Ad Scripts"
                                    description="Generate compelling ad content optimized for your audience"
                                />
                            </SimpleGrid>
                        </VStack>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onDelete={deleteProject}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </VStack>

            <ProjectsModal isOpen={isOpen} onClose={onClose} />
        </Container>
    );
};

export default ProjectList; 