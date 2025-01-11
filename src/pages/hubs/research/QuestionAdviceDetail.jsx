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
import { FaArrowLeft, FaQuestionCircle, FaChevronRight } from 'react-icons/fa';
import { api } from '../../../services/api';
import { Link as RouterLink } from 'react-router-dom';

export default function QuestionAdviceDetail() {
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

                // Then fetch insights for Question & Advice Mapping
                const response = await api.get(`/research-hub/Question & Advice Mapping/project/${projectId}`);
                console.log('Question Advice response:', response.data);

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
                    <Icon as={FaQuestionCircle} boxSize={10} color="red.500" />
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

                {insight.question_type && (
                    <Box w="full">
                        <Text color="blue.600" fontWeight="medium" mb={2} _dark={{ color: 'blue.300' }}>
                            Question Type:
                        </Text>
                        <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                            {insight.question_type}
                        </Badge>
                    </Box>
                )}

                {insight.suggested_answers && insight.suggested_answers.length > 0 && (
                    <Box w="full">
                        <Text color="green.600" fontWeight="medium" mb={2} _dark={{ color: 'green.300' }}>
                            Suggested Answers:
                        </Text>
                        <UnorderedList>
                            {insight.suggested_answers.map((answer, index) => (
                                <ListItem key={index}>{answer}</ListItem>
                            ))}
                        </UnorderedList>
                    </Box>
                )}

                {insight.related_questions && insight.related_questions.length > 0 && (
                    <Box w="full">
                        <Text color="purple.600" fontWeight="medium" mb={2} _dark={{ color: 'purple.300' }}>
                            Related Questions:
                        </Text>
                        <UnorderedList>
                            {insight.related_questions.map((question, index) => (
                                <ListItem key={index}>{question}</ListItem>
                            ))}
                        </UnorderedList>
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

                {insight.engagement_metrics && (
                    <Box w="full">
                        <Text color="teal.600" fontWeight="medium" mb={2} _dark={{ color: 'teal.300' }}>
                            Engagement:
                        </Text>
                        <Text>{insight.engagement_metrics}</Text>
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
                            <BreadcrumbLink>Question & Advice Mapping</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </HStack>

                <Box>
                    <HStack mb={2}>
                        <Icon as={FaQuestionCircle} color="purple.500" boxSize={6} />
                        <Heading>Question & Advice Mapping</Heading>
                    </HStack>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze common questions and advice patterns
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
                        <Icon as={FaQuestionCircle} boxSize={10} color="gray.400" mb={4} />
                        <Heading size="md" mb={2}>No Questions Found</Heading>
                        <Text color="gray.500">
                            {selectedQuery
                                ? `No questions found for query "${selectedQuery}"`
                                : "Map out the questions your community is asking and the advice they're sharing. Generate insights to understand common concerns, knowledge gaps, and valuable solutions being discussed."}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 