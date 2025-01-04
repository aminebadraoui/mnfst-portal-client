import React from 'react';
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
} from '@chakra-ui/react';
import { FaSearch, FaUsers, FaAd, FaChartBar, FaRobot, FaTrash } from 'react-icons/fa';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import DeleteProjectModal from '../components/DeleteProjectModal';

const MenuCard = ({ icon, title, description, to }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            as={RouterLink}
            to={to}
            p={6}
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'purple.500',
            }}
            transition="all 0.2s"
        >
            <VStack align="start" spacing={4}>
                <Icon as={icon} fontSize="24" color="purple.500" />
                <Box>
                    <Heading size="md" mb={2}>{title}</Heading>
                    <Text color="gray.600">{description}</Text>
                </Box>
            </VStack>
        </Box>
    );
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const deleteProject = useProjectStore(state => state.deleteProject);
    const project = useProjectStore(state =>
        state.projects.find(p => p.id === projectId)
    );
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!project) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text>Project not found</Text>
            </Container>
        );
    }

    const handleDelete = async (projectId) => {
        await deleteProject(projectId);
        navigate('/projects');
    };

    const menuItems = [
        {
            icon: FaSearch,
            title: 'Community Insights',
            description: 'Analyze community discussions to uncover valuable insights and opportunities',
            to: `/projects/${projectId}/community-insights`,
        },
        {
            icon: FaChartBar,
            title: 'Competition Intelligence',
            description: 'Track and analyze competitor strategies and performance',
            to: `/projects/${projectId}/competition`,
        },
        {
            icon: FaUsers,
            title: 'Avatars',
            description: 'Create and manage customer personas',
            to: `/projects/${projectId}/avatars`,
        },
        {
            icon: FaAd,
            title: 'Ad Scripts',
            description: 'Generate and optimize advertising content',
            to: `/projects/${projectId}/ad-scripts`,
        },
        {
            icon: FaRobot,
            title: 'Chatbots',
            description: 'Create and customize AI chatbots for your business',
            to: `/projects/${projectId}/chatbots`,
        },
    ];

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between" align="start">
                    <Box>
                        <Heading size="lg" mb={2}>{project.name}</Heading>
                        <Text color="gray.600">{project.description}</Text>
                    </Box>
                    <Button
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        variant="outline"
                        onClick={onOpen}
                    >
                        Delete Project
                    </Button>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {menuItems.map((item, index) => (
                        <MenuCard key={index} {...item} />
                    ))}
                </SimpleGrid>
            </VStack>

            <DeleteProjectModal
                isOpen={isOpen}
                onClose={onClose}
                project={project}
                onDelete={handleDelete}
            />
        </Container>
    );
};

export default ProjectDetail; 