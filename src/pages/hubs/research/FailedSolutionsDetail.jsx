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
} from '@chakra-ui/react';
import { FaArrowLeft, FaTimesCircle } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export default function FailedSolutionsDetail() {
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

                // Then fetch insights for Failed Solutions Analysis
                const response = await api.get(`/research-hub/Failed Solutions Analysis/project/${projectId}`);

                if (response.data && Array.isArray(response.data)) {
                    // Filter insights by query if one is selected
                    const filteredInsights = selectedQuery
                        ? response.data.filter(insight => insight.query === selectedQuery)
                        : response.data;

                    setInsights(filteredInsights);
                } else {
                    setInsights([]);
                }
            } catch (error) {
                console.error('Error fetching insights:', error);
                setError(error.message || 'Failed to fetch insights');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [projectId, selectedQuery]);

    const filteredInsights = insights.filter(insight =>
        !selectedQuery || insight.query === selectedQuery
    );

    console.log('Filtered Insights:', filteredInsights); // Debug log

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
                    <Icon as={FaTimesCircle} boxSize={10} color="red.500" />
                    <Text color="red.500">Error: {error}</Text>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                {/* Header Section */}
                <Button
                    leftIcon={<FaArrowLeft />}
                    width="fit-content"
                    onClick={() => navigate(`/projects/${projectId}/research/community-insights`)}
                >
                    Back to Community Insights
                </Button>

                <Box>
                    <HStack mb={2}>
                        <Icon as={FaTimesCircle} color="red.500" boxSize={6} />
                        <Heading>Failed Solutions Analysis</Heading>
                    </HStack>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze failed attempts and solutions in your community
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
                                            bg="red.100"
                                            color="red.800"
                                            px={2}
                                            py={2}
                                            borderRadius="md"
                                            mb={4}
                                            whiteSpace="normal"
                                            textAlign="left"
                                            _dark={{
                                                bg: 'red.900',
                                                color: 'red.100'
                                            }}
                                        >
                                            QUERY: {insight.query.toUpperCase()}
                                        </Badge>
                                    )}

                                    <Text fontSize="lg" fontWeight="medium" mb={2}>
                                        {insight.title}
                                    </Text>

                                    <Box p={4} bg="gray.50" borderRadius="md" mb={4} _dark={{ bg: 'gray.800' }}>
                                        <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                            {insight.evidence}
                                        </Text>
                                    </Box>

                                    {insight.frequency && (
                                        <Box mb={4}>
                                            <Text color="red.600" fontWeight="medium" mb={2} _dark={{ color: 'red.300' }}>
                                                Frequency:
                                            </Text>
                                            <Text>{insight.frequency}</Text>
                                        </Box>
                                    )}

                                    {insight.correlation && (
                                        <Box mb={4}>
                                            <Text color="orange.600" fontWeight="medium" mb={2} _dark={{ color: 'orange.300' }}>
                                                Correlation:
                                            </Text>
                                            <Text>{insight.correlation}</Text>
                                        </Box>
                                    )}

                                    {insight.significance && (
                                        <Box>
                                            <Text color="purple.600" fontWeight="medium" mb={2} _dark={{ color: 'purple.300' }}>
                                                Significance:
                                            </Text>
                                            <Text>{insight.significance}</Text>
                                        </Box>
                                    )}

                                    {insight.source_url && (
                                        <Box mt={4}>
                                            <Text color="blue.600" fontWeight="medium" mb={2} _dark={{ color: 'blue.300' }}>
                                                Source:
                                            </Text>
                                            <Text>{insight.source_url}</Text>
                                        </Box>
                                    )}

                                    {insight.engagement_metrics && (
                                        <Box mt={4}>
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
                        <Icon as={FaTimesCircle} boxSize={10} color="gray.400" mb={4} />
                        <Heading size="md" mb={2}>No Failed Solutions Found</Heading>
                        <Text color="gray.500">
                            {selectedQuery
                                ? `No failed solutions found for query "${selectedQuery}"`
                                : "Generate insights to discover failed solutions and attempts"}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 