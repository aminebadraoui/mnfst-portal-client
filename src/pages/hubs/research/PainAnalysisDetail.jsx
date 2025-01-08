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
    UnorderedList,
    ListItem,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react';
import { FaArrowLeft, FaExclamationCircle, FaChevronRight } from 'react-icons/fa';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../../services/api';

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

                // Then fetch insights for Pain & Frustration Analysis
                const response = await api.get(`/research-hub/Pain & Frustration Analysis/project/${projectId}`);
                console.log('Pain Analysis response:', response.data);

                // Extract insights from the response
                const analysisData = response.data || [];
                const extractedInsights = analysisData.flatMap(analysis => {
                    if (analysis.insights && Array.isArray(analysis.insights)) {
                        // Each insight already has its query field, so we don't need to add it
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

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
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

                {/* Content Section */}
                {filteredInsights.length > 0 ? (
                    <VStack spacing={6} align="stretch">
                        {filteredInsights.map((insight, index) => (
                            <Box
                                key={index}
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
                                            bg="purple.100"
                                            color="purple.800"
                                            px={2}
                                            py={2}
                                            borderRadius="md"
                                            mb={4}
                                            _dark={{
                                                bg: 'purple.900',
                                                color: 'purple.100'
                                            }}
                                        >
                                            QUERY: {insight.query.toUpperCase()}
                                        </Badge>
                                    )}

                                    <Text fontSize="lg" fontWeight="medium" mb={2}>
                                        {insight.title}
                                    </Text>

                                    <Box p={4} bg="gray.50" borderRadius="md" mb={4} w="full" _dark={{ bg: 'gray.800' }}>
                                        <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                            {insight.evidence}
                                        </Text>
                                    </Box>

                                    {insight.frequency && (
                                        <Box w="full">
                                            <Text color="red.600" fontWeight="medium" mb={2} _dark={{ color: 'red.300' }}>
                                                Frequency:
                                            </Text>
                                            <Text>{insight.frequency}</Text>
                                        </Box>
                                    )}

                                    {insight.correlation && (
                                        <Box w="full">
                                            <Text color="orange.600" fontWeight="medium" mb={2} _dark={{ color: 'orange.300' }}>
                                                Correlation:
                                            </Text>
                                            <Text>{insight.correlation}</Text>
                                        </Box>
                                    )}

                                    {insight.significance && (
                                        <Box w="full">
                                            <Text color="purple.600" fontWeight="medium" mb={2} _dark={{ color: 'purple.300' }}>
                                                Significance:
                                            </Text>
                                            <Text>{insight.significance}</Text>
                                        </Box>
                                    )}

                                    {insight.source_url && (
                                        <Box w="full">
                                            <Text color="blue.600" fontWeight="medium" mb={2} _dark={{ color: 'blue.300' }}>
                                                Source:
                                            </Text>
                                            <Text>{insight.source_url}</Text>
                                        </Box>
                                    )}

                                    {insight.engagement_metrics && (
                                        <Box w="full">
                                            <Text color="green.600" fontWeight="medium" mb={2} _dark={{ color: 'green.300' }}>
                                                Engagement:
                                            </Text>
                                            <Text>{insight.engagement_metrics}</Text>
                                        </Box>
                                    )}
                                </VStack>
                            </Box>
                        ))}
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
                                : "Discover what frustrates your users and identify common pain points in their experience. Generate insights to understand the challenges they face and how they affect their journey."}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 