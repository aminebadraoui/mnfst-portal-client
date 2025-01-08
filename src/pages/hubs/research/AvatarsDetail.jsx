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
import { FaArrowLeft, FaUser, FaUserCircle, FaChevronRight } from 'react-icons/fa';
import api from '../../../services/api';
import { Link as RouterLink } from 'react-router-dom';

export default function AvatarsDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [insights, setInsights] = useState([]);
    const [availableQueries, setAvailableQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // First fetch available queries
                const queriesResponse = await api.get(`/research-hub/project/${projectId}/queries`);
                const queries = queriesResponse.data || [];
                setAvailableQueries(queries);

                // Then fetch insights for Avatars
                const response = await api.get(`/research-hub/Avatars/project/${projectId}`);
                console.log('Avatar response:', response.data);

                // Extract insights from the response
                const analysisData = response.data || [];
                const extractedInsights = analysisData.flatMap(analysis => {
                    if (analysis.insights && Array.isArray(analysis.insights)) {
                        // Each analysis has an insights array with avatar data
                        return analysis.insights.map(avatarInsight => {
                            // Each avatar insight has its own insights array with sections
                            const sections = avatarInsight.insights || [];
                            // Get the demographics section (first one) for main avatar info
                            const mainSection = sections[0] || {};

                            return {
                                query: avatarInsight.query || '',  // Get query directly from avatarInsight
                                name: avatarInsight.name || '',
                                type: avatarInsight.type || '',
                                description: mainSection.description || '',
                                evidence: mainSection.evidence || '',
                                needs: mainSection.needs || [],
                                pain_points: mainSection.pain_points || [],
                                behaviors: mainSection.behaviors || [],
                                sections: sections.map(section => ({
                                    title: section.title,
                                    description: section.description,
                                    evidence: section.evidence,
                                    needs: section.needs || [],
                                    pain_points: section.pain_points || [],
                                    behaviors: section.behaviors || []
                                }))
                            };
                        });
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
                            <BreadcrumbLink>User Avatars</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </HStack>

                <Box>
                    <HStack mb={2}>
                        <Icon as={FaUserCircle} color="purple.500" boxSize={6} />
                        <Heading>User Avatars</Heading>
                    </HStack>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze user personas and their characteristics
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
                                        {insight.name} - {insight.type}
                                    </Text>

                                    {insight.sections?.map((section, sectionIndex) => (
                                        <Box key={sectionIndex} w="full">
                                            <Text fontSize="md" fontWeight="medium" color="purple.600" mb={2}>
                                                {section.title}
                                            </Text>

                                            <Box p={4} bg="gray.50" borderRadius="md" mb={4} w="full" _dark={{ bg: 'gray.800' }}>
                                                <Text fontStyle="italic" color="gray.600" _dark={{ color: 'gray.400' }}>
                                                    {section.description}
                                                </Text>
                                            </Box>

                                            {section.evidence && (
                                                <Box w="full" mb={4}>
                                                    <Text color="blue.600" fontWeight="medium" mb={2} _dark={{ color: 'blue.300' }}>
                                                        Evidence:
                                                    </Text>
                                                    <Text>{section.evidence}</Text>
                                                </Box>
                                            )}

                                            {section.needs && section.needs.length > 0 && (
                                                <Box w="full" mb={4}>
                                                    <Text color="green.600" fontWeight="medium" mb={2} _dark={{ color: 'green.300' }}>
                                                        Needs:
                                                    </Text>
                                                    <UnorderedList>
                                                        {section.needs.map((need, i) => (
                                                            <ListItem key={i}>{need}</ListItem>
                                                        ))}
                                                    </UnorderedList>
                                                </Box>
                                            )}

                                            {section.pain_points && section.pain_points.length > 0 && (
                                                <Box w="full" mb={4}>
                                                    <Text color="red.600" fontWeight="medium" mb={2} _dark={{ color: 'red.300' }}>
                                                        Pain Points:
                                                    </Text>
                                                    <UnorderedList>
                                                        {section.pain_points.map((point, i) => (
                                                            <ListItem key={i}>{point}</ListItem>
                                                        ))}
                                                    </UnorderedList>
                                                </Box>
                                            )}

                                            {section.behaviors && section.behaviors.length > 0 && (
                                                <Box w="full" mb={4}>
                                                    <Text color="purple.600" fontWeight="medium" mb={2} _dark={{ color: 'purple.300' }}>
                                                        Behaviors:
                                                    </Text>
                                                    <UnorderedList>
                                                        {section.behaviors.map((behavior, i) => (
                                                            <ListItem key={i}>{behavior}</ListItem>
                                                        ))}
                                                    </UnorderedList>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
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
                        <Icon as={FaUserCircle} boxSize={10} color="gray.400" mb={4} />
                        <Heading size="md" mb={2}>No Avatars Found</Heading>
                        <Text color="gray.500">
                            {selectedQuery
                                ? `No avatars found for query "${selectedQuery}"`
                                : "Build detailed user personas based on your community's behavior patterns. Generate insights to understand user types, their needs, pain points, and common behaviors."}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 