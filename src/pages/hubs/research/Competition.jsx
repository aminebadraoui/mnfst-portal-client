import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Icon,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaChartLine, FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import useProjectStore from "../../../store/projectStore";

const Competition = () => {
    const bg = useColorModeValue('gray.50', 'gray.800');
    const { projectId } = useParams();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));

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
                    <Heading size="lg" mb={2}>Competition Intelligence</Heading>
                    <Text color="gray.600">
                        Monitor and analyze your competitors' strategies and market position
                    </Text>
                </Box>

                <Box
                    p={12}
                    bg={bg}
                    borderRadius="xl"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor="gray.200"
                >
                    <VStack spacing={6}>
                        <Icon as={FaChartLine} boxSize={12} color="gray.400" />
                        <VStack spacing={2}>
                            <Heading size="md" color="gray.600">No Competition Analysis Yet</Heading>
                            <Text color="gray.500" textAlign="center">
                                Start tracking your competitors and get insights into their strategies
                            </Text>
                        </VStack>
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="blue"
                            size="lg"
                            onClick={() => { }}
                        >
                            Start Competition Analysis
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Competition; 