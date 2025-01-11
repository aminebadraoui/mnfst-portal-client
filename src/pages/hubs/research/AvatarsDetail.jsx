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
    SimpleGrid,
    Link,
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
                console.log('Avatars response:', response.data);

                // Extract insights from the response
                const analysisData = response.data || [];
                const extractedInsights = analysisData[0]?.insights || [];

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

    const renderAvatarProfile = (profile, insight) => {
        return (
            <Box bg="white" rounded="lg" shadow="md" p={6} mb={6} _dark={{ bg: 'gray.800' }}>
                <VStack spacing={6} align="stretch">
                    {insight.query && (
                        <Badge
                            display="block"
                            w="full"
                            bg="green.100"
                            color="green.800"
                            px={2}
                            py={2}
                            borderRadius="md"
                            mb={4}
                            whiteSpace="normal"
                            textAlign="left"
                            _dark={{
                                bg: 'green.900',
                                color: 'green.100'
                            }}
                        >
                            QUERY: {insight.query.toUpperCase()}
                        </Badge>
                    )}
                    <Box>
                        <Heading as="h3" size="lg" mb={4}>{profile.name}</Heading>
                        <Text color="gray.600" mb={6} _dark={{ color: 'gray.400' }}>Type: {profile.type}</Text>
                        <Text mb={4}>{profile.description}</Text>

                        <Heading as="h4" size="md" mb={3}>Demographics</Heading>
                        <SimpleGrid columns={[1, 2, 3]} gap={4}>
                            <Box>
                                <Text fontWeight="semibold">Age Range:</Text>
                                <Text>{profile.demographics.age_range}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Income Level:</Text>
                                <Text>{profile.demographics.income_level}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Location:</Text>
                                <Text>{profile.demographics.location}</Text>
                            </Box>
                            {profile.demographics.company_size && (
                                <Box>
                                    <Text fontWeight="semibold">Company Size:</Text>
                                    <Text>{profile.demographics.company_size}</Text>
                                </Box>
                            )}
                            {profile.demographics.industry && (
                                <Box>
                                    <Text fontWeight="semibold">Industry:</Text>
                                    <Text>{profile.demographics.industry}</Text>
                                </Box>
                            )}
                        </SimpleGrid>

                        <Text fontWeight="semibold" mt={4}>Market Size:</Text>
                        <Text>{profile.market_size}</Text>
                    </Box>

                    {/* Buying Behavior */}
                    <Box>
                        <Heading as="h4" size="md" mb={4}>Buying Behavior</Heading>
                        <SimpleGrid columns={[1, 2]} gap={4}>
                            <Box>
                                <Text fontWeight="semibold">Budget Range:</Text>
                                <Text>{profile.budget_range}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Purchase Frequency:</Text>
                                <Text>{profile.purchase_frequency}</Text>
                            </Box>
                        </SimpleGrid>

                        <VStack spacing={4} mt={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold">Purchase Channels:</Text>
                                <UnorderedList pl={5}>
                                    {profile.purchase_channels.map((channel, idx) => (
                                        <ListItem key={idx}>{channel}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Decision Makers:</Text>
                                <UnorderedList pl={5}>
                                    {profile.decision_makers.map((maker, idx) => (
                                        <ListItem key={idx}>{maker}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Brand Preferences:</Text>
                                <UnorderedList pl={5}>
                                    {profile.brand_preferences.map((brand, idx) => (
                                        <ListItem key={idx}>{brand}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Purchase Drivers */}
                    <Box>
                        <Heading as="h4" size="md" mb={4}>Purchase Drivers</Heading>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold">Pain Points:</Text>
                                <UnorderedList pl={5}>
                                    {profile.pain_points.map((point, idx) => (
                                        <ListItem key={idx}>{point}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Must-Have Features:</Text>
                                <UnorderedList pl={5}>
                                    {profile.must_have_features.map((feature, idx) => (
                                        <ListItem key={idx}>{feature}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Buying Criteria:</Text>
                                <UnorderedList pl={5}>
                                    {profile.buying_criteria.map((criteria, idx) => (
                                        <ListItem key={idx}>{criteria}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Deal Breakers:</Text>
                                <UnorderedList pl={5}>
                                    {profile.deal_breakers.map((breaker, idx) => (
                                        <ListItem key={idx}>{breaker}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Price Sensitivity:</Text>
                                <Text>{profile.price_sensitivity}</Text>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Competitive Landscape */}
                    <Box>
                        <Heading as="h4" size="md" mb={4}>Competitive Landscape</Heading>
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text fontWeight="semibold">Current Solutions:</Text>
                                <UnorderedList pl={5}>
                                    {profile.current_solutions.map((solution, idx) => (
                                        <ListItem key={idx}>{solution}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Competitors:</Text>
                                <UnorderedList pl={5}>
                                    {profile.competitors.map((competitor, idx) => (
                                        <ListItem key={idx}>{competitor}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Competitive Advantages:</Text>
                                <UnorderedList pl={5}>
                                    {profile.competitive_advantages.map((advantage, idx) => (
                                        <ListItem key={idx}>{advantage}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Market Gaps:</Text>
                                <UnorderedList pl={5}>
                                    {profile.market_gaps.map((gap, idx) => (
                                        <ListItem key={idx}>{gap}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold">Market Trends:</Text>
                                <UnorderedList pl={5}>
                                    {profile.market_trends.map((trend, idx) => (
                                        <ListItem key={idx}>{trend}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Source Information */}
                    <Box>
                        <Heading as="h4" size="md" mb={4}>Source Information</Heading>
                        <VStack spacing={4} align="stretch">
                            {profile.source_url && (
                                <Box>
                                    <Text fontWeight="semibold">Source URL:</Text>
                                    <Link href={profile.source_url} isExternal color="blue.500">
                                        {profile.source_url}
                                    </Link>
                                </Box>
                            )}
                            <Box>
                                <Text fontWeight="semibold">Engagement Metrics:</Text>
                                <Text>Frequency: {profile.engagement.frequency}</Text>
                                <Text>Representation: {profile.engagement.representation}%</Text>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        );
    };

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
                            <BreadcrumbLink>Avatar Analysis</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </HStack>

                {/* Title Section */}
                <Box>
                    <HStack mb={2}>
                        <Icon as={FaUser} color="green.500" boxSize={6} />
                        <Heading>Avatar Analysis</Heading>
                    </HStack>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze user personas and market segments
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
                {isLoading ? (
                    <VStack spacing={6} align="center" justify="center" minH="400px">
                        <Spinner size="xl" color="green.500" thickness="4px" />
                        <Text>Loading avatars...</Text>
                    </VStack>
                ) : error ? (
                    <VStack spacing={6} align="center" justify="center" minH="400px">
                        <Icon as={FaUser} boxSize={10} color="red.500" />
                        <Text color="red.500">Error: {error}</Text>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </VStack>
                ) : (
                    <VStack spacing={6} align="stretch">
                        {filteredInsights.map((insight, index) => (
                            <Box key={index}>
                                {insight.profiles.map((profile, profileIndex) => (
                                    <Box key={profileIndex}>
                                        {renderAvatarProfile(profile, insight)}
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </VStack>
                )}
            </VStack>
        </Container>
    );
}