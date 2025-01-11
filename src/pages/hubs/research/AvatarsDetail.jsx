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
                const response = await api.get(`/research-hub/Avatars/project/${projectId}`);
                const analysisData = response.data;

                // Extract unique queries
                const queries = [...new Set(analysisData.map(analysis => analysis.query))];
                setAvailableQueries(queries);

                // Transform the data
                const extractedInsights = analysisData.flatMap(analysis => {
                    if (analysis.insights && Array.isArray(analysis.insights)) {
                        return analysis.insights.map(avatarInsight => {
                            const { query, name, type, profiles } = avatarInsight;
                            return {
                                query,
                                name,
                                type,
                                profiles: Array.isArray(profiles) ? profiles.map(profile => ({
                                    // Basic Information
                                    name: profile.name,
                                    type: profile.type,
                                    description: profile.description,
                                    demographics: profile.demographics || {
                                        age_range: '',
                                        income_level: '',
                                        location: '',
                                        company_size: '',
                                        industry: ''
                                    },
                                    market_size: profile.market_size,

                                    // Buying Behavior
                                    budget_range: profile.budget_range,
                                    purchase_frequency: profile.purchase_frequency,
                                    purchase_channels: profile.purchase_channels || [],
                                    decision_makers: profile.decision_makers || [],
                                    brand_preferences: profile.brand_preferences || [],

                                    // Purchase Drivers
                                    pain_points: profile.pain_points || [],
                                    must_have_features: profile.must_have_features || [],
                                    buying_criteria: profile.buying_criteria || [],
                                    deal_breakers: profile.deal_breakers || [],
                                    price_sensitivity: profile.price_sensitivity,

                                    // Competitive Landscape
                                    current_solutions: profile.current_solutions || [],
                                    competitors: profile.competitors || [],
                                    competitive_advantages: profile.competitive_advantages || [],
                                    market_gaps: profile.market_gaps || [],
                                    market_trends: profile.market_trends || [],

                                    // Source Information
                                    source_url: profile.source_url || '',
                                    engagement: profile.engagement || { frequency: 1, representation: 10 }
                                })) : []
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
        }

        fetchInsights();
    }, [projectId]);

    const filteredInsights = selectedQuery
        ? insights.filter(insight => insight.query === selectedQuery)
        : insights;

    const renderAvatarProfile = (profile) => {
        return (
            <Box bg="white" rounded="lg" shadow="md" p={6} mb={6} _dark={{ bg: 'gray.800' }}>
                {/* Basic Information */}
                <VStack spacing={6} align="stretch">
                    <Box>
                        <Heading as="h3" size="lg" mb={4}>{profile.name}</Heading>
                        <Text fontWeight="bold" mb={2}>Type: {profile.type}</Text>
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
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Avatar Analysis</h2>

            {/* Query Selection */}
            <div className="mb-8">
                <label htmlFor="querySelect" className="block text-sm font-medium text-gray-700">
                    Select Query:
                </label>
                <select
                    id="querySelect"
                    value={selectedQuery}
                    onChange={(e) => setSelectedQuery(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">All Queries</option>
                    {availableQueries.map((query, index) => (
                        <option key={index} value={query}>
                            {query}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <p>Loading avatars...</p>
                </div>
            ) : error ? (
                <div className="text-red-600">
                    <p>Error: {error}</p>
                </div>
            ) : (
                <div>
                    {filteredInsights.map((insight, index) => (
                        <div key={index} className="mb-12">
                            <h3 className="text-2xl font-bold mb-6">{insight.name}</h3>
                            <p className="text-gray-600 mb-6">Type: {insight.type}</p>
                            {insight.profiles.map((profile, profileIndex) => (
                                <div key={profileIndex}>
                                    {renderAvatarProfile(profile)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}