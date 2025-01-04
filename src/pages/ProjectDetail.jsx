import React, { useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    Button,
    useColorModeValue,
    SimpleGrid,
    useDisclosure,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Spinner,
} from '@chakra-ui/react';
import { FaSearch, FaPencilAlt, FaComments, FaChartLine, FaTrash, FaChevronRight } from 'react-icons/fa';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import DeleteProjectModal from '../components/DeleteProjectModal';

const HubCard = ({ icon, title, description, to, color = "purple.500" }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            as={RouterLink}
            to={to}
            p={8}
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: color,
            }}
            transition="all 0.2s"
            position="relative"
            overflow="hidden"
        >
            <Box
                position="absolute"
                top={0}
                right={0}
                w="100px"
                h="100px"
                opacity={0.1}
                transform="translate(30%, -30%)"
            >
                <Icon as={icon} fontSize="100px" color={color} />
            </Box>
            <VStack align="start" spacing={4}>
                <Icon as={icon} fontSize="32" color={color} />
                <Box>
                    <Heading size="lg" mb={3}>{title}</Heading>
                    <Text color="gray.600" fontSize="md">{description}</Text>
                </Box>
            </VStack>
        </Box>
    );
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { projects, deleteProject, fetchProjects, isLoading } = useProjectStore();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const project = projects.find(p => p.id === projectId);

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={4} align="center">
                    <Spinner size="xl" />
                    <Text>Loading project details...</Text>
                </VStack>
            </Container>
        );
    }

    if (!project) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={4} align="center">
                    <Heading size="lg">Project Not Found</Heading>
                    <Text>The project you're looking for doesn't exist.</Text>
                    <Button as={RouterLink} to="/projects" colorScheme="purple">
                        Back to Projects
                    </Button>
                </VStack>
            </Container>
        );
    }

    const handleDelete = async () => {
        try {
            await deleteProject(projectId);
            navigate('/projects');
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Breadcrumb spacing="8px" separator={<Icon as={FaChevronRight} color="gray.500" />}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={RouterLink} to="/projects">Projects</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>{project.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <HStack justify="space-between" mt={4} mb={8}>
                        <Box>
                            <Heading size="xl" mb={2}>{project.name}</Heading>
                            <Text color="gray.600">{project.description}</Text>
                        </Box>
                        <Button
                            leftIcon={<FaTrash />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={onOpen}
                        >
                            Delete Project
                        </Button>
                    </HStack>
                </Box>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    <HubCard
                        icon={FaSearch}
                        title="Research Hub"
                        description="Analyze your market and competition through community insights and competitive intelligence"
                        to="research"
                        color="blue.500"
                    />
                    <HubCard
                        icon={FaPencilAlt}
                        title="Content Hub"
                        description="Create and manage your content across avatars, ads, social media, and email marketing"
                        to="content"
                        color="green.500"
                    />
                    <HubCard
                        icon={FaComments}
                        title="Communication Hub"
                        description="Manage your chatbots and automated communication channels"
                        to="communication"
                        color="purple.500"
                    />
                    <HubCard
                        icon={FaChartLine}
                        title="Strategy Hub"
                        description="Track metrics and optimize your marketing performance"
                        to="strategy"
                        color="orange.500"
                    />
                </SimpleGrid>
            </VStack>

            <DeleteProjectModal
                isOpen={isOpen}
                onClose={onClose}
                onDelete={handleDelete}
                projectName={project.name}
            />
        </Container>
    );
};

export default ProjectDetail; 