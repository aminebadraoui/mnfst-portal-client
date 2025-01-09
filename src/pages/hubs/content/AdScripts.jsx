import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Heading,
    Text,
    Button,
    VStack,
    useToast,
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
    useColorModeValue,
} from "@chakra-ui/react";
import ReactMarkdown from 'react-markdown';
import useProjectStore from "../../../store/projectStore";
import { generateAdvertorials, getAdvertorial, getAdvertorials, deleteAllAdvertorials } from "../../../services/advertorialService";

// Helper function to parse and format advertorial content
const parseAdvertorialContent = (advertorial) => {
    if (!advertorial?.content) return null;

    try {
        // If content is a string that looks like JSON, parse it
        if (typeof advertorial.content === 'string' && advertorial.content.trim().startsWith('{')) {
            const parsed = JSON.parse(advertorial.content);
            return parsed.content || parsed.Lead || null;
        }

        // If content is an object with a content field
        if (advertorial.content.content) {
            return advertorial.content.content;
        }

        // If content is already a string
        if (typeof advertorial.content === 'string') {
            return advertorial.content;
        }

        return null;
    } catch (error) {
        console.error('Error parsing advertorial content:', error);
        return null;
    }
};

export default function AdScripts() {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const [advertorials, setAdvertorials] = useState({
        story: null,
        value: null,
        info: null,
    });
    const toast = useToast();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));

    // Theme-aware colors
    const boxBg = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        const fetchExistingAdvertorials = async () => {
            if (!projectId) return;

            setLoading(true);
            try {
                const result = await getAdvertorials(projectId);
                if (result) {
                    setAdvertorials({
                        story: result.story_based,
                        value: result.value_based,
                        info: result.informational,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch existing advertorials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingAdvertorials();
    }, [projectId]);

    const handleCreateNew = async () => {
        if (!project) {
            toast({
                title: "Error",
                description: "Project not found",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const result = await generateAdvertorials(projectId, {
                productDescription: project.description
            });

            // Fetch all advertorials to get the updated list
            const updatedAdvertorials = await getAdvertorials(projectId);
            setAdvertorials({
                story: updatedAdvertorials.story_based,
                value: updatedAdvertorials.value_based,
                info: updatedAdvertorials.informational,
            });

            toast({
                title: "Success",
                description: "Advertorials generated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        if (!project) return;

        if (!window.confirm('Are you sure you want to delete all advertorials? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await deleteAllAdvertorials(projectId);
            setAdvertorials({
                story: [],
                value: [],
                info: [],
            });
            toast({
                title: "Success",
                description: "All advertorials deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!project) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text>Project not found</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Advertorials</Heading>
                <Text>Generate different types of advertorials for your project.</Text>

                <Button
                    colorScheme="blue"
                    onClick={handleCreateNew}
                    isLoading={loading}
                    loadingText="Generating..."
                >
                    Create New Advertorials Set
                </Button>

                {(advertorials.story?.length > 0 || advertorials.value?.length > 0 || advertorials.info?.length > 0) && (
                    <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={handleDeleteAll}
                        isLoading={loading}
                        loadingText="Deleting..."
                    >
                        Delete All Advertorials
                    </Button>
                )}

                {loading && !advertorials.story && !advertorials.value && !advertorials.info && (
                    <Box textAlign="center" py={8}>
                        <Spinner size="xl" />
                        <Text mt={4}>Loading advertorials...</Text>
                    </Box>
                )}

                {(advertorials.story || advertorials.value || advertorials.info) && (
                    <Box mt={4}>
                        <Heading size="md" mb={4}>Generated Advertorials:</Heading>
                        <Tabs variant="enclosed">
                            <TabList>
                                <Tab>Story-Based</Tab>
                                <Tab>Value-Based</Tab>
                                <Tab>Informational</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    {advertorials.story?.map((ad, index) => (
                                        <Box
                                            key={ad.id}
                                            p={6}
                                            bg={boxBg}
                                            borderRadius="lg"
                                            boxShadow="lg"
                                            borderWidth="1px"
                                            borderColor={borderColor}
                                            mb={4}
                                        >
                                            <Text color={textColor} fontSize="sm" mb={2}>
                                                Generated on: {new Date(ad.created_at).toLocaleString()}
                                            </Text>
                                            <Box
                                                color={textColor}
                                                fontSize="lg"
                                                className="markdown-content"
                                            >
                                                <ReactMarkdown>{parseAdvertorialContent(ad)}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    ))}
                                </TabPanel>

                                <TabPanel>
                                    {advertorials.value?.map((ad, index) => (
                                        <Box
                                            key={ad.id}
                                            p={6}
                                            bg={boxBg}
                                            borderRadius="lg"
                                            boxShadow="lg"
                                            borderWidth="1px"
                                            borderColor={borderColor}
                                            mb={4}
                                        >
                                            <Text color={textColor} fontSize="sm" mb={2}>
                                                Generated on: {new Date(ad.created_at).toLocaleString()}
                                            </Text>
                                            <Box
                                                color={textColor}
                                                fontSize="lg"
                                                className="markdown-content"
                                            >
                                                <ReactMarkdown>{parseAdvertorialContent(ad)}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    ))}
                                </TabPanel>

                                <TabPanel>
                                    {advertorials.info?.map((ad, index) => (
                                        <Box
                                            key={ad.id}
                                            p={6}
                                            bg={boxBg}
                                            borderRadius="lg"
                                            boxShadow="lg"
                                            borderWidth="1px"
                                            borderColor={borderColor}
                                            mb={4}
                                        >
                                            <Text color={textColor} fontSize="sm" mb={2}>
                                                Generated on: {new Date(ad.created_at).toLocaleString()}
                                            </Text>
                                            <Box
                                                color={textColor}
                                                fontSize="lg"
                                                className="markdown-content"
                                            >
                                                <ReactMarkdown>{parseAdvertorialContent(ad)}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    ))}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 