import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    IconButton,
    Input,
    Stack,
    Text,
    VStack,
    HStack,
    useToast,
    Badge,
    SimpleGrid,
    FormHelperText,
    Link,
    Progress,
    UnorderedList,
    ListItem,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaKeyboard, FaLightbulb, FaQuoteRight, FaReddit, FaChartLine, FaBookmark, FaChevronLeft, FaChevronRight, FaAmazon, FaYoutube, FaSearch, FaLink, FaHistory } from 'react-icons/fa';
import api from '../services/api';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    createResearch,
    getResearch,
    updateResearchUrls,
    saveContentAnalysis,
    saveMarketAnalysis
} from '../services/researchService';
import MarketingResearchLayout from '../components/MarketingResearchLayout';

const InsightBox = ({ title, icon, insights = [], count, brandColor }) => (
    <Card h="full" variant="outline" boxShadow="sm" borderColor={brandColor}>
        <CardHeader bg={`${brandColor}10`} p={4} borderBottomWidth="1px">
            <VStack spacing={2}>
                <Icon as={icon} boxSize={6} color={brandColor} />
                <Heading size="md" textAlign="center" color={brandColor}>{title}</Heading>
                <Badge bg={brandColor} color="white" fontSize="sm" px={2} borderRadius="full">
                    {count} FOUND
                </Badge>
            </VStack>
        </CardHeader>
        <CardBody p={4} maxH="600px" overflowY="auto">
            <Stack spacing={3}>
                {insights.map((insight, index) => (
                    <Box
                        key={index}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ bg: `${brandColor}10` }}
                    >
                        {title === "Notable Quotes" ? (
                            <VStack align="stretch" spacing={2}>
                                <Text as="i">{insight.content}</Text>
                                <Text fontSize="sm" color="gray.500">Source: {insight.source}</Text>
                            </VStack>
                        ) : title === "Keywords Found" ? (
                            <HStack justify="space-between">
                                <Text>{insight.content}</Text>
                                <HStack spacing={2}>
                                    <Badge colorScheme="purple">{insight.count}x</Badge>
                                    <Text fontSize="sm" color="gray.500">from {insight.sources.length} sources</Text>
                                </HStack>
                            </HStack>
                        ) : (
                            <VStack align="stretch" spacing={2}>
                                <Text>{insight.content}</Text>
                                <Text fontSize="sm" color="gray.500">Source: {insight.source}</Text>
                            </VStack>
                        )}
                    </Box>
                ))}
            </Stack>
        </CardBody>
    </Card>
);

const MarketOpportunityCard = ({ opportunity }) => (
    <Box
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'md',
            borderColor: "#a961ff"
        }}
        transition="all 0.2s"
    >
        <VStack align="stretch" spacing={4}>
            <Heading size="md" color="#a961ff" textAlign="center">
                {opportunity.opportunity}
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box
                    p={4}
                    bg="#D35400"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="#D35400"
                    color="white"
                    _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s', boxShadow: 'lg' }}
                >
                    <Text fontWeight="bold" mb={2}>Pain Points</Text>
                    <UnorderedList spacing={2}>
                        {opportunity.pain_points.map((point, i) => (
                            <ListItem key={i}>{point}</ListItem>
                        ))}
                    </UnorderedList>
                </Box>

                <Box
                    p={4}
                    bg="#2980B9"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="#2980B9"
                    color="white"
                    _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s', boxShadow: 'lg' }}
                >
                    <Text fontWeight="bold" mb={2}>Target Market</Text>
                    <Text>{opportunity.target_market}</Text>
                </Box>

                <Box
                    p={4}
                    bg="#27AE60"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="#27AE60"
                    color="white"
                    _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s', boxShadow: 'lg' }}
                >
                    <Text fontWeight="bold" mb={2}>Potential Solutions</Text>
                    <UnorderedList spacing={2}>
                        {opportunity.potential_solutions.map((solution, i) => (
                            <ListItem key={i}>{solution}</ListItem>
                        ))}
                    </UnorderedList>
                </Box>

                <Box
                    p={4}
                    bg="#8E44AD"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="#8E44AD"
                    color="white"
                    _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s', boxShadow: 'lg' }}
                >
                    <Text fontWeight="bold" mb={2}>Supporting Quotes</Text>
                    <UnorderedList spacing={2}>
                        {opportunity.supporting_quotes.map((quote, i) => (
                            <ListItem key={i}>{quote}</ListItem>
                        ))}
                    </UnorderedList>
                </Box>
            </SimpleGrid>
        </VStack>
    </Box>
);

const EmptyState = ({ icon, title, description }) => (
    <VStack
        spacing={4}
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        borderStyle="dashed"
        borderColor="gray.200"
        bg="gray.50"
        color="gray.500"
        textAlign="center"
    >
        <Icon as={icon} boxSize={10} />
        <VStack spacing={1}>
            <Text fontWeight="bold" fontSize="lg">{title}</Text>
            <Text fontSize="sm">{description}</Text>
        </VStack>
    </VStack>
);

const MarketingResearchAgent = () => {
    const [keywords, setKeywords] = useState(['']);
    const [manualUrl, setManualUrl] = useState('');
    const [collectedUrls, setCollectedUrls] = useState([]);
    const [sources, setSources] = useState({
        reddit: true,
        amazon: false,
        youtube: false
    });
    const [isSearching, setIsSearching] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzingMarket, setIsAnalyzingMarket] = useState(false);
    const [processingStatus, setProcessingStatus] = useState({
        isProcessing: false,
        message: '',
        processedUrls: 0,
        totalUrls: 0
    });
    const [insights, setInsights] = useState([]);
    const [marketOpportunities, setMarketOpportunities] = useState([]);
    const [currentOpportunityIndex, setCurrentOpportunityIndex] = useState(0);
    const toast = useToast();
    const [currentResearch, setCurrentResearch] = useState(null);
    const { researchId } = useParams();
    const navigate = useNavigate();

    // Load existing research if researchId is provided
    useEffect(() => {
        const loadResearch = async () => {
            if (researchId) {
                try {
                    const research = await getResearch(researchId);
                    setCurrentResearch(research);
                    // Restore state from research
                    if (research.urls) setCollectedUrls(research.urls);
                    if (research.content_analysis?.insights) {
                        const restoredInsights = [];
                        research.content_analysis.insights.forEach(insight => {
                            restoredInsights.push(
                                { type: 'insight', content: insight.key_insight, source: insight.source },
                                { type: 'quote', content: insight.key_quote, source: insight.source }
                            );
                            // Restore keywords
                            if (insight.top_keyword) {
                                restoredInsights.push({
                                    type: 'keyword',
                                    content: insight.top_keyword,
                                    count: 1,
                                    sources: [insight.source]
                                });
                            }
                        });
                        setInsights(restoredInsights);
                    }
                    if (research.market_analysis?.opportunities) {
                        setMarketOpportunities(research.market_analysis.opportunities);
                    }
                } catch (error) {
                    toast({
                        title: 'Error Loading Research',
                        description: error.message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        };
        loadResearch();
    }, [researchId]);

    // Initialize new research when starting
    const initializeResearch = async () => {
        if (!currentResearch && !researchId) {
            try {
                const research = await createResearch();
                setCurrentResearch(research);
                navigate(`/marketing-research/${research.id}`);
            } catch (error) {
                toast({
                    title: 'Error Creating Research',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    // Call initializeResearch when component mounts
    useEffect(() => {
        initializeResearch();
    }, []);

    // Update collected URLs in research
    const updateResearchWithUrls = async (urls) => {
        if (currentResearch) {
            try {
                const updated = await updateResearchUrls(currentResearch.id, urls);
                setCurrentResearch(updated);
            } catch (error) {
                console.error('Error updating research URLs:', error);
            }
        }
    };

    const handleKeywordChange = (index, value) => {
        const newKeywords = [...keywords];
        newKeywords[index] = value;
        setKeywords(newKeywords);
    };

    const handleSourceChange = (source) => {
        setSources(prev => ({
            ...prev,
            [source]: !prev[source]
        }));
    };

    const handleSearch = async () => {
        try {
            setIsSearching(true);
            setProcessingStatus({
                isProcessing: true,
                message: 'Searching for relevant content...',
                processedUrls: 0,
                totalUrls: 0
            });

            const startResponse = await fetch('https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/run-sync-get-dataset-items?token=apify_api_jFbpFANfkb3NeUWC9JOfbOmMu8KwwJ41lY4L', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    debugMode: false,
                    includeNSFW: true,
                    maxComments: 10,
                    maxCommunitiesCount: 2,
                    maxItems: 10,
                    maxPostCount: 10,
                    maxUserCount: 2,
                    proxy: {
                        useApifyProxy: true,
                        apifyProxyGroups: ["RESIDENTIAL"]
                    },
                    scrollTimeout: 40,
                    searchComments: false,
                    searchCommunities: false,
                    searchPosts: true,
                    searchUsers: false,
                    searches: [keywords[0]],
                    skipComments: true,
                    skipCommunity: true,
                    skipUserPosts: false,
                })
            });

            const results = await startResponse.json();
            const urls = results
                .filter(item => item.url)
                .map(item => item.url);

            setCollectedUrls(prev => {
                const newUrls = [...new Set([...prev, ...urls])];
                // Update research with new URLs
                updateResearchWithUrls(newUrls);
                return newUrls;
            });
            toast({
                title: 'Search Complete',
                description: `Found ${urls.length} relevant links`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Search Failed',
                description: error.message || 'Failed to search for content',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSearching(false);
            setProcessingStatus(prev => ({ ...prev, isProcessing: false }));
        }
    };

    const handleAddManualUrl = () => {
        if (manualUrl.trim()) {
            setCollectedUrls(prev => {
                const newUrls = [...new Set([...prev, manualUrl.trim()])];
                // Update research with new URLs
                updateResearchWithUrls(newUrls);
                return newUrls;
            });
            setManualUrl('');
            toast({
                title: 'URL Added',
                description: 'URL has been added to the list',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleRemoveUrl = (urlToRemove) => {
        setCollectedUrls(prev => {
            const newUrls = prev.filter(url => url !== urlToRemove);
            // Update research with new URLs
            updateResearchWithUrls(newUrls);
            return newUrls;
        });
    };

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            setProcessingStatus({
                isProcessing: true,
                message: 'Analyzing content...',
                processedUrls: 0,
                totalUrls: collectedUrls.length
            });
            setInsights([]); // Clear previous insights at the start

            const response = await fetch(`${api.defaults.baseURL}/analysis/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({ urls: collectedUrls })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const keywordMap = new Map();
            let processedUrlsSet = new Set();
            let contentInsights = []; // Track raw insights for saving

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (!line.trim() || !line.startsWith('data: ')) continue;

                    const eventData = JSON.parse(line.slice(6));

                    if (eventData.type === 'status') {
                        setProcessingStatus(prev => ({
                            ...prev,
                            message: eventData.message
                        }));
                    } else if (eventData.type === 'chunk_insight') {
                        const insight = eventData.data;
                        const source = insight.source;

                        // Store raw insight for saving to database
                        contentInsights.push({
                            source: source,
                            top_keyword: insight.top_keyword,
                            key_insight: insight.key_insight,
                            key_quote: insight.key_quote
                        });

                        // Update keyword map for UI display
                        const keyword = insight.top_keyword.toLowerCase();
                        if (!keywordMap.has(keyword)) {
                            keywordMap.set(keyword, { content: insight.top_keyword, count: 1, sources: [source] });
                        } else {
                            const existing = keywordMap.get(keyword);
                            if (!existing.sources.includes(source)) {
                                existing.count++;
                                existing.sources.push(source);
                            }
                        }

                        // Update UI with insights
                        setInsights(prev => [
                            ...prev.filter(i => i.type !== 'keyword'), // Keep non-keyword insights
                            { type: 'insight', content: insight.key_insight, source },
                            { type: 'quote', content: insight.key_quote, source },
                            // Add updated keywords
                            ...Array.from(keywordMap.values()).map(k => ({
                                type: 'keyword',
                                content: k.content,
                                count: k.count,
                                sources: k.sources
                            }))
                        ]);

                        // Update processed URLs count
                        if (!processedUrlsSet.has(source)) {
                            processedUrlsSet.add(source);
                            setProcessingStatus(prev => ({
                                ...prev,
                                processedUrls: processedUrlsSet.size
                            }));
                        }
                    } else if (eventData.type === 'error') {
                        toast({
                            title: 'Analysis Error',
                            description: eventData.error,
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }
            }

            // Save content analysis with properly formatted insights
            if (researchId && contentInsights.length > 0) {
                await saveContentAnalysis(researchId, contentInsights);
            }

            setProcessingStatus(prev => ({ ...prev, isProcessing: false }));
            toast({
                title: 'Analysis Complete',
                description: `Analyzed ${processedUrlsSet.size} URLs successfully`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Analysis error:', error);
            toast({
                title: 'Analysis Failed',
                description: error.message || 'Failed to analyze content',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setProcessingStatus(prev => ({ ...prev, isProcessing: false }));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleMarketAnalysis = async () => {
        try {
            setIsAnalyzingMarket(true);

            const requestData = {
                keywords: keywords.filter(k => k.trim() !== ''),  // Filter out empty keywords
                insights: insights.filter(i => i.type === 'insight').map(i => i.content),
                quotes: insights.filter(i => i.type === 'quote').map(i => i.content),
                keywords_found: insights
                    .filter(i => i.type === 'keyword')
                    .map(i => i.content)
            };

            console.log('Market Analysis Request:', {
                keywordsCount: requestData.keywords.length,
                keywordsFoundCount: requestData.keywords_found.length,
                insightsCount: requestData.insights.length,
                quotesCount: requestData.quotes.length,
                keywords: requestData.keywords,
                keywordsFound: requestData.keywords_found,
                insights: requestData.insights,
                quotes: requestData.quotes
            });

            const response = await api.post('/analysis/analyze/market-opportunities', requestData);

            console.log('Market Analysis Response:', {
                status: response.status,
                opportunitiesCount: response.data.opportunities?.length || 0,
                opportunities: response.data.opportunities
            });

            setMarketOpportunities(response.data.opportunities || []);
            setCurrentOpportunityIndex(0);

            console.log('Updated Market Opportunities State:', {
                totalOpportunities: response.data.opportunities?.length || 0,
                currentIndex: 0
            });

            toast({
                title: 'Market Analysis Complete',
                description: `Found ${response.data.opportunities?.length || 0} market opportunities`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // After analysis is complete, save opportunities
            if (researchId && response.data.opportunities) {
                try {
                    await saveMarketAnalysis(researchId, response.data.opportunities);
                } catch (error) {
                    console.error('Error saving market analysis:', error);
                }
            }
        } catch (error) {
            console.error('Market Analysis Error:', {
                error: error,
                response: error.response?.data,
                status: error.response?.status
            });

            toast({
                title: 'Market Analysis Failed',
                description: error.response?.data?.detail || 'Failed to analyze market opportunities',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsAnalyzingMarket(false);
        }
    };

    const handleNextOpportunity = () => {
        if (currentOpportunityIndex < marketOpportunities.length - 1) {
            setCurrentOpportunityIndex(currentOpportunityIndex + 1);
        }
    };

    const handlePreviousOpportunity = () => {
        if (currentOpportunityIndex > 0) {
            setCurrentOpportunityIndex(currentOpportunityIndex - 1);
        }
    };

    // Determine current step based on state
    const getCurrentStep = () => {
        if (marketOpportunities.length > 0) {
            return 3;
        }
        if (insights.length > 0) {
            return 2;
        }
        return 1;
    };

    return (
        <MarketingResearchLayout currentStep={getCurrentStep()}>
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Box>
                        <Heading size="lg" mb={2}>Marketing Research Agent</Heading>
                        <Text color="gray.600">
                            Research and analyze market opportunities by examining websites and online discussions
                        </Text>
                    </Box>

                    {processingStatus.isProcessing && (
                        <Card
                            bg="white"
                            borderColor="#a961ff"
                            borderWidth={2}
                            borderRadius="lg"
                            p={4}
                            position="sticky"
                            top={4}
                            zIndex={10}
                            boxShadow="lg"
                        >
                            <HStack spacing={4} align="center">
                                <Box flex={1}>
                                    <Text fontWeight="bold" color="#a961ff" mb={1}>
                                        {processingStatus.message}
                                    </Text>
                                    {processingStatus.totalUrls > 0 && (
                                        <Progress
                                            value={(processingStatus.processedUrls / processingStatus.totalUrls) * 100}
                                            size="sm"
                                            colorScheme="purple"
                                            borderRadius="full"
                                            bg="purple.100"
                                        />
                                    )}
                                </Box>
                                {processingStatus.totalUrls > 0 && (
                                    <Badge
                                        colorScheme="purple"
                                        fontSize="sm"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                    >
                                        {processingStatus.processedUrls} / {processingStatus.totalUrls}
                                    </Badge>
                                )}
                            </HStack>
                        </Card>
                    )}

                    {/* Step 1: Research Setup */}
                    {getCurrentStep() === 1 && (
                        <Card>
                            <CardHeader bg="#a961ff10" p={4} borderBottomWidth="1px">
                                <VStack spacing={2}>
                                    <Icon as={FaKeyboard} boxSize={6} color="#a961ff" />
                                    <Heading size="md" textAlign="center" color="#a961ff">Research Keywords</Heading>
                                </VStack>
                            </CardHeader>
                            <CardBody p={4}>
                                <VStack spacing={6}>
                                    <FormControl>
                                        <FormLabel fontSize="lg">Keywords</FormLabel>
                                        <FormHelperText mb={2}>Enter keywords to find relevant content</FormHelperText>
                                        <HStack spacing={4}>
                                            <Input
                                                value={keywords[0]}
                                                onChange={(e) => handleKeywordChange(0, e.target.value)}
                                                placeholder="Enter keywords (e.g., joint pain, arthritis)"
                                            />
                                            <Button
                                                leftIcon={<FaSearch />}
                                                onClick={handleSearch}
                                                isLoading={isSearching}
                                                loadingText="Searching..."
                                                colorScheme="purple"
                                                px={8}
                                            >
                                                Get URLs
                                            </Button>
                                        </HStack>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel fontSize="lg">Sources</FormLabel>
                                        <FormHelperText mb={2}>Select sources to search from</FormHelperText>
                                        <HStack spacing={6} py={2}>
                                            <HStack>
                                                <input
                                                    type="checkbox"
                                                    id="reddit"
                                                    checked={sources.reddit}
                                                    onChange={() => handleSourceChange('reddit')}
                                                />
                                                <Icon as={FaReddit} color="#FF4500" />
                                                <Text>Reddit</Text>
                                            </HStack>
                                            <HStack opacity={0.5}>
                                                <input
                                                    type="checkbox"
                                                    id="amazon"
                                                    checked={sources.amazon}
                                                    onChange={() => handleSourceChange('amazon')}
                                                    disabled
                                                />
                                                <Icon as={FaAmazon} color="#FF9900" />
                                                <Text>Amazon (Coming Soon)</Text>
                                            </HStack>
                                            <HStack opacity={0.5}>
                                                <input
                                                    type="checkbox"
                                                    id="youtube"
                                                    checked={sources.youtube}
                                                    onChange={() => handleSourceChange('youtube')}
                                                    disabled
                                                />
                                                <Icon as={FaYoutube} color="#FF0000" />
                                                <Text>YouTube (Coming Soon)</Text>
                                            </HStack>
                                        </HStack>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel fontSize="lg">Add URLs Manually</FormLabel>
                                        <FormHelperText mb={2}>Enter specific URLs you want to analyze</FormHelperText>
                                        <HStack spacing={4}>
                                            <Input
                                                value={manualUrl}
                                                onChange={(e) => setManualUrl(e.target.value)}
                                                placeholder="Enter a URL"
                                            />
                                            <Button
                                                leftIcon={<FaPlus />}
                                                onClick={handleAddManualUrl}
                                                colorScheme="purple"
                                                px={8}
                                            >
                                                Add URL
                                            </Button>
                                        </HStack>
                                    </FormControl>

                                    {collectedUrls.length > 0 ? (
                                        <Card p={4} variant="outline" borderColor="purple.200">
                                            <FormLabel fontSize="lg" color="purple.600">
                                                <HStack>
                                                    <Icon as={FaLink} />
                                                    <Text>URLs to Analyze</Text>
                                                    <Badge colorScheme="purple">{collectedUrls.length} URLs</Badge>
                                                </HStack>
                                            </FormLabel>
                                            <Stack spacing={2}>
                                                {collectedUrls.map((url, index) => (
                                                    <HStack
                                                        key={index}
                                                        p={2}
                                                        borderWidth="1px"
                                                        borderRadius="md"
                                                        fontSize="sm"
                                                    >
                                                        <Link href={url} isExternal color="blue.500" flex={1}>
                                                            {url}
                                                        </Link>
                                                        <IconButton
                                                            icon={<FaTrash />}
                                                            onClick={() => handleRemoveUrl(url)}
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="ghost"
                                                        />
                                                    </HStack>
                                                ))}
                                            </Stack>
                                        </Card>
                                    ) : (
                                        <EmptyState
                                            icon={FaLink}
                                            title="No URLs Added Yet"
                                            description="Search using keywords or add URLs manually to begin analysis"
                                        />
                                    )}

                                    <Button
                                        leftIcon={<FaLightbulb />}
                                        onClick={handleAnalyze}
                                        isLoading={isAnalyzing}
                                        loadingText="Analyzing Content..."
                                        colorScheme="purple"
                                        width="full"
                                        isDisabled={collectedUrls.length === 0}
                                    >
                                        Analyze Content
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Step 2: Content Analysis */}
                    {getCurrentStep() === 2 && (
                        <Card>
                            <CardHeader bg="#a961ff10" p={4} borderBottomWidth="1px">
                                <VStack spacing={2}>
                                    <Icon as={FaLightbulb} boxSize={6} color="#a961ff" />
                                    <Heading size="md" textAlign="center" color="#a961ff">Content Analysis</Heading>
                                </VStack>
                            </CardHeader>
                            <CardBody p={4}>
                                {insights.length > 0 ? (
                                    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                                        <InsightBox
                                            title="Key Insights"
                                            icon={FaLightbulb}
                                            insights={insights.filter(i => i.type === 'insight')}
                                            count={insights.filter(i => i.type === 'insight').length}
                                            brandColor="#2ECC71"
                                        />
                                        <InsightBox
                                            title="Notable Quotes"
                                            icon={FaQuoteRight}
                                            insights={insights.filter(i => i.type === 'quote')}
                                            count={insights.filter(i => i.type === 'quote').length}
                                            brandColor="#E74C3C"
                                        />
                                        <InsightBox
                                            title="Keywords Found"
                                            icon={FaBookmark}
                                            insights={insights.filter(i => i.type === 'keyword')}
                                            count={insights.filter(i => i.type === 'keyword').length}
                                            brandColor="#3498DB"
                                        />
                                    </SimpleGrid>
                                ) : (
                                    <EmptyState
                                        icon={FaLightbulb}
                                        title="No Content Analysis Yet"
                                        description="Add URLs and analyze content to see insights here"
                                    />
                                )}

                                <Button
                                    leftIcon={<FaChartLine />}
                                    bg="#a961ff"
                                    color="white"
                                    _hover={{ bg: '#8f4ee6' }}
                                    onClick={handleMarketAnalysis}
                                    isLoading={isAnalyzingMarket}
                                    loadingText="Analyzing Market Opportunities..."
                                    size="lg"
                                    width="full"
                                    mt={6}
                                    isDisabled={insights.length === 0}
                                >
                                    Analyze Market Opportunities
                                </Button>
                            </CardBody>
                        </Card>
                    )}

                    {/* Step 3: Market Opportunities */}
                    {getCurrentStep() === 3 && (
                        <Card>
                            <CardHeader bg="#a961ff10" p={4} borderBottomWidth="1px">
                                <VStack spacing={2}>
                                    <Icon as={FaChartLine} boxSize={6} color="#a961ff" />
                                    <Heading size="md" textAlign="center" color="#a961ff">Market Opportunities</Heading>
                                </VStack>
                            </CardHeader>
                            <CardBody p={4}>
                                {marketOpportunities.length > 0 ? (
                                    <HStack spacing={4} align="center">
                                        <IconButton
                                            icon={<FaChevronLeft />}
                                            onClick={handlePreviousOpportunity}
                                            isDisabled={currentOpportunityIndex === 0}
                                            colorScheme="purple"
                                            variant="ghost"
                                            size="lg"
                                        />
                                        <Box flex={1}>
                                            <VStack spacing={4}>
                                                <HStack justify="center" spacing={2} mb={2}>
                                                    {marketOpportunities.map((_, idx) => (
                                                        <Box
                                                            key={idx}
                                                            w="8px"
                                                            h="8px"
                                                            borderRadius="full"
                                                            bg={idx === currentOpportunityIndex ? "#a961ff" : "gray.200"}
                                                        />
                                                    ))}
                                                </HStack>
                                                <MarketOpportunityCard
                                                    opportunity={marketOpportunities[currentOpportunityIndex]}
                                                />
                                            </VStack>
                                        </Box>
                                        <IconButton
                                            icon={<FaChevronRight />}
                                            onClick={handleNextOpportunity}
                                            isDisabled={currentOpportunityIndex === marketOpportunities.length - 1}
                                            colorScheme="purple"
                                            variant="ghost"
                                            size="lg"
                                        />
                                    </HStack>
                                ) : (
                                    <EmptyState
                                        icon={FaChartLine}
                                        title="No Market Opportunities Yet"
                                        description="Analyze your content insights to discover market opportunities"
                                    />
                                )}
                            </CardBody>
                        </Card>
                    )}
                </VStack>
            </Container>
        </MarketingResearchLayout>
    );
};

export default MarketingResearchAgent; 