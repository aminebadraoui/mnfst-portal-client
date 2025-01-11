import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    Button,
    Text,
    UnorderedList,
    ListItem,
    Badge,
    HStack,
    Icon,
    Select,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaChevronRight } from 'react-icons/fa';
import { api } from '../../../services/api';
import { Link as RouterLink } from 'react-router-dom';

export default function PatternDetectionDetail() {
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

                // Then fetch insights for Pattern Detection
                const response = await api.get(`/research-hub/Pattern Detection/project/${projectId}`);
                console.log('Pattern Detection response:', response.data);

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
                    <Icon as={FaChartLine} boxSize={10} color="red.500" />
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
                        bg="blue.100"
                        color="blue.800"
                        px={2}
                        py={2}
                        borderRadius="md"
                        mb={4}
                        _dark={{
                            bg: 'blue.900',
                            color: 'blue.100'
                        }}
                    >
                        QUERY: {insight.query.toUpperCase()}
                    </Badge>
                )}

                <HStack w="full" justify="space-between" align="center">
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {insight.title}
                    </Text>
                    {insight.pattern_type && (
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                            {insight.pattern_type}
                        </Badge>
                    )}
                </HStack>

                {insight.correlation && (
                    <Box w="full">
                        <Text color="purple.600" fontWeight="medium" mb={2} _dark={{ color: 'purple.300' }}>
                            Correlation:
                        </Text>
                        <Text>{insight.correlation}</Text>
                    </Box>
                )}

                <Box p={4} bg="gray.50" borderRadius="md" mb={4} w="full" _dark={{ bg: 'gray.800' }}>
                    <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                        {insight.evidence}
                    </Text>
                </Box>

                {insight.significance && (
                    <Box w="full">
                        <Text color="green.600" fontWeight="medium" mb={2} _dark={{ color: 'green.300' }}>
                            Significance:
                        </Text>
                        <Text>{insight.significance}</Text>
                    </Box>
                )}

                {insight.frequency && (
                    <Box w="full">
                        <Text color="orange.600" fontWeight="medium" mb={2} _dark={{ color: 'orange.300' }}>
                            Frequency:
                        </Text>
                        <Text>{insight.frequency}</Text>
                    </Box>
                )}

                {insight.trend_direction && (
                    <Box w="full">
                        <Text color="blue.600" fontWeight="medium" mb={2} _dark={{ color: 'blue.300' }}>
                            Trend Direction:
                        </Text>
                        <Badge
                            colorScheme={
                                insight.trend_direction.toLowerCase().includes('up') ? 'green' :
                                    insight.trend_direction.toLowerCase().includes('down') ? 'red' :
                                        'yellow'
                            }
                            px={2}
                            py={1}
                        >
                            {insight.trend_direction}
                        </Badge>
                    </Box>
                )}

                {insight.implications && insight.implications.length > 0 && (
                    <Box w="full">
                        <Text color="red.600" fontWeight="medium" mb={2} _dark={{ color: 'red.300' }}>
                            Implications:
                        </Text>
                        <VStack align="start" spacing={2}>
                            {insight.implications.map((implication, index) => (
                                <Text key={index}>{implication}</Text>
                            ))}
                        </VStack>
                    </Box>
                )}

                {insight.supporting_data && insight.supporting_data.length > 0 && (
                    <Box w="full">
                        <Text color="teal.600" fontWeight="medium" mb={2} _dark={{ color: 'teal.300' }}>
                            Supporting Data:
                        </Text>
                        <VStack align="start" spacing={2}>
                            {insight.supporting_data.map((data, index) => (
                                <Text key={index}>{data}</Text>
                            ))}
                        </VStack>
                    </Box>
                )}

                {insight.source_url && (
                    <Box w="full">
                        <Text color="gray.600" fontWeight="medium" mb={2} _dark={{ color: 'gray.300' }}>
                            Source:
                        </Text>
                        <Text>{insight.source_url}</Text>
                    </Box>
                )}

                {insight.engagement_metrics && (
                    <Box w="full">
                        <Text color="teal.600" fontWeight="medium" mb={2} _dark={{ color: 'teal.300' }}>
                            Engagement:
                        </Text>
                        <HStack spacing={4}>
                            {typeof insight.engagement_metrics === 'string' ? (
                                <Text>{insight.engagement_metrics}</Text>
                            ) : (
                                <>
                                    <Badge colorScheme="blue">
                                        {insight.engagement_metrics.upvotes} upvotes
                                    </Badge>
                                    <Badge colorScheme="purple">
                                        {insight.engagement_metrics.comments} comments
                                    </Badge>
                                </>
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
                            <BreadcrumbLink>Pattern Detection</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </HStack>

                <Box>
                    <HStack mb={2}>
                        <Icon as={FaChartLine} color="green.500" boxSize={6} />
                        <Heading>Pattern Detection</Heading>
                    </HStack>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze patterns and trends in your community
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
                        <Icon as={FaChartLine} boxSize={10} color="gray.400" mb={4} />
                        <Heading size="md" mb={2}>No Patterns Found</Heading>
                        <Text color="gray.500">
                            {selectedQuery
                                ? `No patterns found for query "${selectedQuery}"`
                                : "Uncover trends and recurring themes in your community discussions. Generate insights to identify emerging patterns, correlations, and significant behavioral trends."}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 