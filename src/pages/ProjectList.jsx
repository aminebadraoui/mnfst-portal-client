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
import { FaPlus, FaSearch, FaUsers, FaAd, FaChartBar, FaTrash } from 'react-icons/fa';
import ProjectsModal from '../components/ProjectsModal';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';

const ProjectCard = ({ project, onDelete }) => {
    const toast = useToast();
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.stopPropagation();
        try {
            onDelete(project.id);
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
                description: 'Failed to delete project',
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
        e.stopPropagation(); // Prevent card navigation when clicking links
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
                onClick={handleDelete}
            >
                <Icon as={FaTrash} />
            </Button>

            <VStack align="stretch" spacing={4}>
                <Heading size="md">{project.name}</Heading>
                <Text color="gray.600" noOfLines={2}>
                    {project.description}
                </Text>

                <SimpleGrid columns={2} spacing={4} onClick={handleLinkClick}>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/market-research`}
                        variant="ghost"
                        leftIcon={<Icon as={FaSearch} />}
                        size="sm"
                    >
                        Market Research
                    </Button>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/competition`}
                        variant="ghost"
                        leftIcon={<Icon as={FaChartBar} />}
                        size="sm"
                    >
                        Competition
                    </Button>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/avatars`}
                        variant="ghost"
                        leftIcon={<Icon as={FaUsers} />}
                        size="sm"
                    >
                        Avatars
                    </Button>
                    <Button
                        as={RouterLink}
                        to={`/projects/${project.id}/ad-scripts`}
                        variant="ghost"
                        leftIcon={<Icon as={FaAd} />}
                        size="sm"
                    >
                        Ad Scripts
                    </Button>
                </SimpleGrid>
            </VStack>
        </Box>
    );
};

const ProjectList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const projects = useProjectStore((state) => state.projects);
    const deleteProject = useProjectStore((state) => state.deleteProject);

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

                {projects.length === 0 ? (
                    <Box
                        textAlign="center"
                        py={8}
                        borderWidth="1px"
                        borderRadius="lg"
                        borderStyle="dashed"
                    >
                        <Text color="gray.600">
                            No projects yet. Create your first project to get started.
                        </Text>
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