import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useDisclosure,
    useToast,
    Switch,
    FormHelperText,
    Spinner,
    Badge,
    Link,
    Icon,
    Card,
    CardBody,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { FaExclamationCircle, FaQuestionCircle, FaChartLine, FaLightbulb, FaMagic } from 'react-icons/fa';
import { api } from '../../../services/api';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useLoadingStore from '../../../store/loadingStore';
import useProjectStore from '../../../store/projectStore';

const iconMap = {
    FaExclamationCircle,
    FaQuestionCircle,
    FaChartLine,
    FaLightbulb
};

export default function CommunityInsights() {
    const { projectId } = useParams();
    const { projects, fetchProjects } = useProjectStore();
    const currentProject = projects.find(p => p.id === projectId);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [error, setError] = useState(null);
    const [insights, setInsights] = useState([]);
    const [topicKeyword, setTopicKeyword] = useState('');
    const [sourceUrls, setSourceUrls] = useState('');
    const [productUrls, setProductUrls] = useState('');
    const [useOnlySpecifiedSources, setUseOnlySpecifiedSources] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const toast = useToast();
    const setLoading = useLoadingStore(state => state.setLoading);
    const isLoading = useLoadingStore(state => state.isLoading);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Function to start polling for results
    const startPolling = useCallback((taskId) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`community-insights/${taskId}`);
                if (response.data.status === "processing") {
                    return; // Keep polling
                }

                // Results are ready
                setInsights(response.data.sections || []);
                setLoading(false);
                clearInterval(interval);
                setPollingInterval(null);
                setTaskId(null);

                toast({
                    title: "Insights Generated",
                    description: "Successfully generated community insights.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

            } catch (error) {
                console.error("Error polling for results:", error);
                setError("Error fetching results. Please try again.");
                setLoading(false);
                clearInterval(interval);
                setPollingInterval(null);
                setTaskId(null);

                toast({
                    title: "Error",
                    description: "Failed to fetch results. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }, 2000); // Poll every 2 seconds

        setPollingInterval(interval);
    }, [toast, setLoading]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const handleAddQuery = (query) => {
        if (!query.trim()) {
            toast({
                title: "Query is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setQueries([...queries, query.trim()]);
        setTopicKeyword('');
    };

    const handleGenerateWithAI = async () => {
        console.log('Current project:', currentProject);
        console.log('Projects:', projects);
        console.log('Project ID:', projectId);

        if (!currentProject) {
            toast({
                title: "No project found",
                description: "Could not find the current project",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!currentProject.description && !currentProject.project?.description) {
            toast({
                title: "No project description",
                description: "Please add a description to your project",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const description = currentProject.description || currentProject.project?.description;
        setLoading(true, `Researching for "${description}"`);
        try {
            const response = await api.post('ai/generate-query', {
                description: description
            });

            if (response.data.query) {
                setTopicKeyword(response.data.query);
                toast({
                    title: "Query Generated",
                    description: "AI has generated a query for you",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate query with AI",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInsights = async () => {
        if (!topicKeyword.trim()) {
            toast({
                title: "No query provided",
                description: "Please enter a query or generate one with AI",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        setError(null);
        setInsights([]);
        onClose();

        try {
            const response = await api.post('community-insights', {
                topic_keyword: topicKeyword.trim(),
                persona: selectedPersona || null,
                source_urls: [],
                product_urls: []
            });

            if (response.data.task_id) {
                setTaskId(response.data.task_id);
                startPolling(response.data.task_id);

                toast({
                    title: "Processing Started",
                    description: "Generating insights... This may take a few minutes.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error('No task ID received');
            }
        } catch (error) {
            console.error("Error generating insights:", error);
            setError("Error generating insights. Please try again.");
            setLoading(false);
            toast({
                title: "Error",
                description: error.message || "Failed to generate insights. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const renderInsightDetails = (insight) => (
        <VStack align="start" spacing={3} w="100%">
            <Box p={3} bg="gray.50" borderRadius="md" w="100%">
                <Text fontStyle="italic" color="gray.700">"{insight.evidence}"</Text>
            </Box>

            {insight.source_url && (
                <Text fontSize="sm" color="gray.600">
                    <strong>Source:</strong>{' '}
                    {typeof insight.source_url === 'string' && insight.source_url.startsWith('http') ? (
                        <Link href={insight.source_url} isExternal color="blue.500" textDecoration="underline">
                            {insight.source_url}
                        </Link>
                    ) : (
                        `Source ${insight.source_url}`
                    )}
                </Text>
            )}

            {insight.engagement_metrics && (
                <Text fontSize="sm" color="gray.600">
                    <strong>Engagement:</strong> {insight.engagement_metrics}
                </Text>
            )}

            {insight.frequency && (
                <Text fontSize="sm" color="gray.600">
                    <strong>Frequency:</strong> {insight.frequency}
                </Text>
            )}

            {insight.correlation && (
                <Text fontSize="sm" color="gray.600">
                    <strong>Correlation:</strong> {insight.correlation}
                </Text>
            )}

            {insight.significance && (
                <Text fontSize="sm" color="gray.600">
                    <strong>Significance:</strong> {insight.significance}
                </Text>
            )}
        </VStack>
    );

    const ResearchFocusOption = ({ title, description, isSelected, onClick }) => (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            bg={isSelected ? "purple.50" : "white"}
            borderColor={isSelected ? "purple.500" : "gray.200"}
            onClick={onClick}
            _hover={{ borderColor: "purple.500" }}
            transition="all 0.2s"
        >
            <Text fontWeight="semibold">{title}</Text>
            <Text color="gray.600" fontSize="sm">{description}</Text>
        </Box>
    );

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg">Community Insights</Heading>
                    <Button
                        colorScheme="purple"
                        onClick={onOpen}
                        isLoading={isLoading}
                    >
                        Generate Insights
                    </Button>
                </HStack>

                {insights.length === 0 && !isLoading ? (
                    <Box p={6} textAlign="center" bg="gray.50" borderRadius="md">
                        <Text>No insights generated yet. Click the button above to get started.</Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <HStack spacing={6} pb={4} minW="max-content">
                            {insights.map((section, sectionIndex) => (
                                <Box
                                    key={sectionIndex}
                                    minW="400px"
                                    maxW="400px"
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={4}
                                    bg="white"
                                    boxShadow="sm"
                                >
                                    <VStack align="stretch" spacing={4}>
                                        <HStack>
                                            <Icon as={iconMap[section.icon] || FaLightbulb} />
                                            <Heading size="md">{section.title}</Heading>
                                            <Badge colorScheme="blue" ml="auto">
                                                {section.insights?.length || 0}
                                            </Badge>
                                        </HStack>

                                        <Box maxH="600px" overflowY="auto">
                                            <VStack spacing={4} align="stretch">
                                                {section.insights?.map((insight, insightIndex) => (
                                                    <Box
                                                        key={insightIndex}
                                                        p={4}
                                                        borderWidth="1px"
                                                        borderRadius="md"
                                                        _hover={{ bg: 'gray.50' }}
                                                    >
                                                        <Heading size="sm" mb={3}>
                                                            {insight.title}
                                                        </Heading>
                                                        {renderInsightDetails(insight)}
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </VStack>
                                </Box>
                            ))}
                        </HStack>
                    </Box>
                )}

                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Heading size="lg">Generate Insights</Heading>
                            <Text color="gray.600" fontSize="md" mt={1}>
                                Select avatars to generate targeted insights
                            </Text>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={6} align="stretch">
                                <Card variant="outline">
                                    <CardBody>
                                        <VStack spacing={4} align="stretch">
                                            <Heading size="md">Choose Your Research Focus</Heading>

                                            <ResearchFocusOption
                                                title="General Insights"
                                                description="Broad analysis without specific persona focus"
                                                isSelected={!selectedPersona}
                                                onClick={() => setSelectedPersona(null)}
                                            />

                                            <Text color="gray.500" textAlign="center">or choose avatars</Text>

                                            <ResearchFocusOption
                                                title="Active Senior with Chronic Pain"
                                                description="Former hiker dealing with joint issues"
                                                isSelected={selectedPersona === 'senior'}
                                                onClick={() => setSelectedPersona('senior')}
                                            />

                                            <ResearchFocusOption
                                                title="Young Professional with Sports Injury"
                                                description="Recovering athlete seeking treatment"
                                                isSelected={selectedPersona === 'athlete'}
                                                onClick={() => setSelectedPersona('athlete')}
                                            />
                                        </VStack>
                                    </CardBody>
                                </Card>

                                <Card variant="outline">
                                    <CardBody>
                                        <VStack spacing={4} align="stretch">
                                            <Heading size="md">Enter Your Query</Heading>

                                            <InputGroup>
                                                <Textarea
                                                    value={topicKeyword}
                                                    onChange={(e) => setTopicKeyword(e.target.value)}
                                                    placeholder="Type your query here (e.g., 'joint pain management')"
                                                    resize="vertical"
                                                    minH="60px"
                                                    rows={2}
                                                />
                                            </InputGroup>

                                            <Button
                                                leftIcon={<Icon as={FaMagic} />}
                                                variant="outline"
                                                colorScheme="purple"
                                                width="100%"
                                                onClick={handleGenerateWithAI}
                                                isLoading={isLoading}
                                            >
                                                Generate with AI
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="purple"
                                width="100%"
                                onClick={handleGenerateInsights}
                                isDisabled={!topicKeyword.trim()}
                            >
                                Generate Insights
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Debug Box */}
                <Box
                    mt={8}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="gray.50"
                    overflowX="auto"
                >
                    <Heading size="sm" mb={2}>Debug: Raw Response</Heading>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify({ status: 'completed', sections: insights }, null, 2)}
                    </pre>
                </Box>
            </VStack>
        </Container>
    );
} 