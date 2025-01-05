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
} from '@chakra-ui/react';
import { FaExclamationCircle, FaQuestionCircle, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { api } from '../../../services/api';
import axios from 'axios';
import useLoadingStore from '../../../store/loadingStore';

const iconMap = {
    FaExclamationCircle,
    FaQuestionCircle,
    FaChartLine,
    FaLightbulb
};

export default function CommunityInsights() {
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

    const handleGenerateInsights = async () => {
        if (!topicKeyword.trim()) {
            toast({
                title: "Topic keyword is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true, topicKeyword);
        setError(null);
        setInsights([]);
        onClose(); // Close the modal while processing

        try {
            // Convert newline-separated URLs to arrays
            const sourceUrlsArray = sourceUrls.split('\n').filter(url => url.trim());
            const productUrlsArray = productUrls.split('\n').filter(url => url.trim());

            // Start the generation process
            const response = await api.post('community-insights', {
                topic_keyword: topicKeyword,
                source_urls: sourceUrlsArray,
                product_urls: productUrlsArray,
                use_only_specified_sources: useOnlySpecifiedSources,
            });

            if (response.data.task_id) {
                // Start polling for results
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

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg">Community Insights</Heading>
                    <Button
                        colorScheme="blue"
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
                        <ModalHeader>Generate Community Insights</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Topic Keyword</FormLabel>
                                    <Input
                                        value={topicKeyword}
                                        onChange={(e) => setTopicKeyword(e.target.value)}
                                        placeholder="Enter a topic keyword"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Source URLs (Optional)</FormLabel>
                                    <Textarea
                                        value={sourceUrls}
                                        onChange={(e) => setSourceUrls(e.target.value)}
                                        placeholder="Enter URLs (one per line) of specific forum threads or discussions to analyze"
                                        rows={3}
                                    />
                                    <FormHelperText>Enter each URL on a new line</FormHelperText>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Product URLs (Optional)</FormLabel>
                                    <Textarea
                                        value={productUrls}
                                        onChange={(e) => setProductUrls(e.target.value)}
                                        placeholder="Enter URLs (one per line) of specific product pages to analyze"
                                        rows={3}
                                    />
                                    <FormHelperText>Enter each URL on a new line</FormHelperText>
                                </FormControl>

                                {(sourceUrls.trim() || productUrls.trim()) && (
                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel mb="0">
                                            Use Only Specified Sources
                                        </FormLabel>
                                        <Switch
                                            isChecked={useOnlySpecifiedSources}
                                            onChange={(e) => setUseOnlySpecifiedSources(e.target.checked)}
                                        />
                                    </FormControl>
                                )}
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={handleGenerateInsights}
                                isLoading={isLoading}
                                isDisabled={!topicKeyword.trim()}
                            >
                                Generate
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