import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Icon,
    Text,
    VStack,
    HStack,
    Spinner,
    Badge,
    Select,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react';
import { FaArrowLeft, FaExclamationCircle, FaChevronRight } from 'react-icons/fa';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../../services/api';

const severityColors = {
    critical: "red",
    major: "orange",
    minor: "yellow"
};

// Helper function to determine severity color with fallback
const getSeverityColor = (severity) => {
    if (!severity) return "gray";
    return severityColors[severity.toLowerCase()] || "gray";
};

// Helper function to format engagement metrics
const formatEngagement = (insight) => {
    if (insight.engagement && typeof insight.engagement === 'object') {
        return {
            upvotes: insight.engagement.upvotes || 0,
            comments: insight.engagement.comments || 0
        };
    }
    // Handle old format
    return {
        upvotes: insight.engagement_metrics?.upvotes || 0,
        comments: insight.engagement_metrics?.comments || 0
    };
};

export default function PainAnalysisDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [insights, setInsights] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableQueries, setAvailableQueries] = useState([]);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // First fetch available queries
                const queriesResponse = await api.get(`/research-hub/project/${projectId}/queries`);
                const queries = queriesResponse.data || [];
                setAvailableQueries(queries);

                // Then fetch insights for Pain Analysis
                const response = await api.get(`/research-hub/Pain & Frustration Analysis/project/${projectId}`);
                console.log('Pain Analysis response:', response.data);

                // Extract insights from the response
                const analysisData = response.data || [];
                const extractedInsights = analysisData.flatMap(analysis => {
                    if (analysis.insights && Array.isArray(analysis.insights)) {
                        return analysis.insights;
                    }
                    return [];
                });

                console.log('Extracted insights:', extractedInsights);
                setInsights(extractedInsights);
            } catch (error) {
                console.error('Error fetching insights:', error);
                setError(error.message || 'Failed to fetch insights');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [projectId]);

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={6} align="center" justify="center" minH="400px">
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text>Loading insights...</Text>
                </VStack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <VStack spacing={6} align="center" justify="center" minH="400px">
                    <Icon as={FaExclamationCircle} boxSize={10} color="red.500" />
                    <Text color="red.500">Error: {error}</Text>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </VStack>
            </Container>
        );
    }

    const filteredInsights = selectedQuery
        ? insights.filter(insight => insight.query === selectedQuery)
        : insights;

    const renderInsight = (insight) => (
        <Box
            key={insight.id || Math.random()}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            _dark={{ bg: 'gray.700' }}
        >
            <VStack align="start" spacing={4}>
                {insight.query && (
                    <Badge
                        display="block"
                        w="full"
                        bg="red.100"
                        color="red.800"
                        px={2}
                        py={2}
                        borderRadius="md"
                        mb={4}
                        _dark={{
                            bg: 'red.900',
                            color: 'red.100'
                        }}
                    >
                        QUERY: {insight.query.toUpperCase()}
                    </Badge>
                )}

                <HStack w="full" justify="space-between" align="center">
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {insight.title}
                    </Text>
                    {insight.severity && (
                        <Badge
                            colorScheme={
                                insight.severity === 'critical' ? 'red' :
                                    insight.severity === 'major' ? 'orange' :
                                        'yellow'
                            }
                            fontSize="md"
                            px={3}
                            py={1}
                        >
                            {insight.severity}
                        </Badge>
                    )}
                </HStack>

                <Box p={4} bg="gray.50" borderRadius="md" mb={4} w="full" _dark={{ bg: 'gray.800' }}>
                    <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                        {insight.pain_quote}
                    </Text>
                </Box>

                <Box w="full">
                    <Text color="purple.600" fontWeight="medium" mb={2} _dark={{ color: 'purple.300' }}>
                        Impact:
                    </Text>
                    <Text>{insight.impact}</Text>
                    {insight.impact_quote && (
                        <Box p={4} bg="gray.50" borderRadius="md" mt={2} _dark={{ bg: 'gray.800' }}>
                            <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                {insight.impact_quote}
                            </Text>
                        </Box>
                    )}
                </Box>

                {insight.solution_attempt && (
                    <Box w="full">
                        <Text color="green.600" fontWeight="medium" mb={2} _dark={{ color: 'green.300' }}>
                            Solution Attempt:
                        </Text>
                        <Text>{insight.solution_attempt}</Text>
                        {insight.solution_quote && (
                            <Box p={4} bg="gray.50" borderRadius="md" mt={2} _dark={{ bg: 'gray.800' }}>
                                <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                    {insight.solution_quote}
                                </Text>
                            </Box>
                        )}
                    </Box>
                )}

                {insight.consequences && (
                    <Box w="full">
                        <Text color="red.600" fontWeight="medium" mb={2} _dark={{ color: 'red.300' }}>
                            Consequences:
                        </Text>
                        <Text>{insight.consequences}</Text>
                        {insight.consequence_quote && (
                            <Box p={4} bg="gray.50" borderRadius="md" mt={2} _dark={{ bg: 'gray.800' }}>
                                <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                    {insight.consequence_quote}
                                </Text>
                            </Box>
                        )}
                    </Box>
                )}

                {insight.workaround && (
                    <Box w="full">
                        <Text color="blue.600" fontWeight="medium" mb={2} _dark={{ color: 'blue.300' }}>
                            Workaround:
                        </Text>
                        <Text>{insight.workaround}</Text>
                        {insight.workaround_quote && (
                            <Box p={4} bg="gray.50" borderRadius="md" mt={2} _dark={{ bg: 'gray.800' }}>
                                <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                    {insight.workaround_quote}
                                </Text>
                            </Box>
                        )}
                    </Box>
                )}

                {insight.source_url && (
                    <Box w="full">
                        <Text color="orange.600" fontWeight="medium" mb={2} _dark={{ color: 'orange.300' }}>
                            Source:
                        </Text>
                        <Text>{insight.source_url}</Text>
                    </Box>
                )}

                {insight.engagement && (
                    <Box w="full">
                        <Text color="teal.600" fontWeight="medium" mb={2} _dark={{ color: 'teal.300' }}>
                            Engagement:
                        </Text>
                        <HStack spacing={4}>
                            <Badge colorScheme="blue">
                                {insight.engagement.comments} comments
                            </Badge>
                            <Badge colorScheme="purple">
                                {insight.engagement.upvotes} upvotes
                            </Badge>
                            {insight.engagement.frequency && (
                                <Badge colorScheme="green">
                                    {insight.engagement.frequency} mentions
                                </Badge>
                            )}
                        </HStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                {/* Header Section */}
                <HStack spacing={4} align="center">
                    <Button
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        onClick={() => navigate(`/projects/${projectId}/research`)}
                    >
                        Back to Research Hub
                    </Button>
                    <Breadcrumb separator={<Icon as={FaChevronRight} color="gray.500" />}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={RouterLink} to={`/projects/${projectId}/research`}>
                                Research Hub
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>Pain & Frustration Analysis</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </HStack>

                {/* Title Section */}
                <Box>
                    <HStack mb={2}>
                        <Icon as={FaExclamationCircle} color="purple.500" boxSize={6} />
                        <Heading>Pain & Frustration Analysis</Heading>
                    </HStack>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze pain points and user frustrations
                    </Text>
                </Box>

                {/* Query Filter */}
                <Box w="full" bg="white" p={4} borderRadius="lg" boxShadow="sm" _dark={{ bg: 'gray.700' }}>
                    <HStack spacing={4} align="center">
                        <Text fontWeight="medium" minW="fit-content">Filter by Query:</Text>
                        <Select
                            value={selectedQuery}
                            onChange={(e) => setSelectedQuery(e.target.value)}
                            maxW="400px"
                            placeholder="All Queries"
                        >
                            {availableQueries.map((query) => (
                                <option key={query} value={query}>{query}</option>
                            ))}
                        </Select>
                    </HStack>
                </Box>

                {/* Insights Section */}
                {filteredInsights.length > 0 ? (
                    <VStack spacing={6} align="stretch">
                        {filteredInsights.map(renderInsight)}
                    </VStack>
                ) : (
                    <Box
                        p={8}
                        textAlign="center"
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="white"
                        _dark={{ bg: 'gray.700' }}
                    >
                        <Icon as={FaExclamationCircle} boxSize={10} color="gray.400" mb={4} />
                        <Heading size="md" mb={2}>No Pain Points Found</Heading>
                        <Text color="gray.500">
                            {selectedQuery
                                ? `No pain points found for query "${selectedQuery}"`
                                : "No pain points have been analyzed yet"}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 