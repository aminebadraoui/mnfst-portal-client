import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Icon,
    Link,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { Link as RouterLink, useParams } from 'react-router-dom';
import useProjectStore from "../../../store/projectStore";

const ResearchHub = () => {
    const { projectId } = useParams();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    if (!project) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text>Project not found</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Research Hub</Heading>
                    <Text color="gray.600">
                        Analyze your market and competition to make data-driven decisions
                    </Text>
                </Box>

                <Link
                    as={RouterLink}
                    to={`/projects/${projectId}/research/community-insights`}
                    _hover={{ textDecoration: 'none' }}
                >
                    <Box
                        p={6}
                        bg={bg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        _hover={{
                            transform: 'translateY(-2px)',
                            shadow: 'md',
                            borderColor: 'blue.500',
                        }}
                        transition="all 0.2s"
                    >
                        <VStack spacing={4} align="stretch">
                            <HStack>
                                <Icon as={FaSearch} boxSize={6} color="blue.500" />
                                <Heading size="md">Community Insights</Heading>
                            </HStack>
                            <Text color="gray.600">
                                Understand your community's needs and preferences through advanced analytics
                            </Text>
                        </VStack>
                    </Box>
                </Link>
            </VStack>
        </Container>
    );
};

export default ResearchHub; 