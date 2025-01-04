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
import { FaRobot, FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import useProjectStore from "../../../store/projectStore";

const Chatbots = () => {
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
                    <Heading size="lg" mb={2}>AI Chatbots</Heading>
                    <Text color="gray.600">
                        Deploy intelligent chatbots trained on your brand voice and knowledge
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
                        <Icon as={FaRobot} boxSize={12} color="gray.400" />
                        <VStack spacing={2}>
                            <Heading size="md" color="gray.600">No Chatbots Created Yet</Heading>
                            <Text color="gray.500" textAlign="center">
                                Create your first AI chatbot to automate customer interactions with your brand's voice
                            </Text>
                        </VStack>
                        <Button
                            leftIcon={<FaPlus />}
                            colorScheme="purple"
                            size="lg"
                            onClick={() => { }}
                        >
                            Create New Chatbot
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Chatbots; 