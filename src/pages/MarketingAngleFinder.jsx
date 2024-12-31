import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaKeyboard, FaLightbulb, FaQuoteRight, FaReddit } from 'react-icons/fa';
import api from '../services/api';

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
            <SimpleGrid columns={title === "Top Keywords" ? { base: 1, md: 2 } : 1} spacing={4}>
                {insights.map((insight, index) => (
                    <Box
                        key={index}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="white"
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'md',
                            borderColor: brandColor
                        }}
                        transition="all 0.2s"
                    >
                        {title === "Top Keywords" ? (
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between" align="center">
                                    <Text
                                        fontSize="md"
                                        fontWeight="semibold"
                                        color={brandColor}
                                    >
                                        {insight.value}
                                    </Text>
                                    {insight.count > 1 && (
                                        <Badge bg={brandColor} color="white" fontSize="xs">
                                            {insight.count}×
                                        </Badge>
                                    )}
                                </HStack>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                >
                                    From: {insight.source}
                                </Text>
                            </VStack>
                        ) : title === "Key Quotes" ? (
                            <VStack align="stretch" spacing={3}>
                                <Text
                                    fontStyle="italic"
                                    fontSize="md"
                                    color="gray.700"
                                >
                                    "{insight.value}"
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="right"
                                >
                                    From: {insight.source}
                                </Text>
                            </VStack>
                        ) : (
                            <VStack align="stretch" spacing={3}>
                                <Text fontSize="md" color="gray.700">
                                    {insight.value}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="right"
                                >
                                    From: {insight.source}
                                </Text>
                            </VStack>
                        )}
                    </Box>
                ))}
            </SimpleGrid>
        </CardBody>
    </Card>
);

const MarketingAngleFinder = () => {
    const [keywords, setKeywords] = useState("");
    const [urls, setUrls] = useState([""]);
    const [redditUrls, setRedditUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState([]);
    const toast = useToast();
    const [processingStatus, setProcessingStatus] = useState({
        isProcessing: false,
        totalUrls: 0,
        processedUrls: 0,
        currentUrl: '',
        message: ''
    });

    const cleanupText = (text) => {
        // Return empty string for default/error messages
        if (['No keyword found', 'No insight found', 'No quote found'].includes(text)) {
            return '';
        }

        return text
            .replace(/^(?:the )?most significant keyword\/phrase:\s*/i, '')
            .replace(/^key insight or takeaway:\s*/i, '')
            .replace(/^relevant verbatim quote:\s*/i, '')
            .replace(/^"(.+)"$/, '$1')  // Remove surrounding quotes
            .replace(/^['"]|['"]$/g, '') // Remove any remaining quotes
            .trim();
    };

    const normalizeKeyword = (keyword) => {
        return keyword
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
            .trim();
    };

    const splitKeywords = (insight) => {
        // Split keywords by commas, quotes, or "and"
        const keywordMap = new Map();

        insight.value
            .split(/[,"]|\s+and\s+/)
            .map(k => k.trim())
            .filter(k => k.length > 0)
            .forEach(keyword => {
                const normalizedKey = normalizeKeyword(keyword);
                if (normalizedKey) {
                    const existing = keywordMap.get(normalizedKey);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        keywordMap.set(normalizedKey, {
                            ...insight,
                            value: keyword, // Keep original casing
                            count: 1
                        });
                    }
                }
            });

        return Array.from(keywordMap.values());
    };

    const handleAddUrl = () => {
        setUrls([...urls, '']);
    };

    const handleRemoveUrl = (index) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
    };

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setProcessingStatus({
            isProcessing: true,
            totalUrls: 0,
            processedUrls: 0,
            currentUrl: '',
            message: 'Initializing search...'
        });
        try {
            let urlsToAnalyze = urls.filter(url => url.trim() !== '');

            // If keywords are provided, fetch Reddit URLs first
            if (keywords.trim()) {
                setProcessingStatus(prev => ({
                    ...prev,
                    message: 'Searching Reddit for relevant posts...'
                }));

                console.log("searching keywords")

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
                        searches: [keywords],
                        skipComments: true,
                        skipCommunity: true,
                        skipUserPosts: false,
                        sort: "relevance",
                        time: "year"
                    })
                });
                console.log(startResponse);

                const results = await startResponse.json();
                console.log(results);

                if (Array.isArray(results)) {
                    const foundUrls = results.map(post => post.url).filter(url => url && url.trim() !== '');
                    if (foundUrls.length > 0) {
                        setRedditUrls(foundUrls);
                        urlsToAnalyze = [...urlsToAnalyze, ...foundUrls];
                        setProcessingStatus(prev => ({
                            ...prev,
                            message: `Found ${foundUrls.length} Reddit posts. Starting analysis...`,
                            totalUrls: urlsToAnalyze.length
                        }));
                    } else {
                        toast({
                            title: 'No Results',
                            description: 'No relevant Reddit posts found for the given keywords',
                            status: 'info',
                            duration: 3000,
                        });
                    }
                }
            }

            if (urlsToAnalyze.length === 0) {
                toast({
                    title: 'Error',
                    description: 'No URLs to analyze',
                    status: 'error',
                    duration: 3000,
                });
                setIsLoading(false);
                return;
            }

            // Create POST request to initiate analysis
            const response = await fetch(`${api.defaults.baseURL}/analysis/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({ urls: urlsToAnalyze })
            });

            // Create a ReadableStream from the response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the chunk and add it to our buffer
                buffer += decoder.decode(value, { stream: true });

                // Process complete events in the buffer
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const event = JSON.parse(line.slice(6));

                            switch (event.type) {
                                case 'status':
                                    setProcessingStatus(prev => ({
                                        ...prev,
                                        message: event.message
                                    }));
                                    break;

                                case 'chunk_insight':
                                    setInsights(prev => [...prev, event.data]);
                                    break;

                                case 'error':
                                    toast({
                                        title: 'Error',
                                        description: `Failed to analyze ${event.url}: ${event.error}`,
                                        status: 'error',
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    break;

                                case 'url_complete':
                                    setProcessingStatus(prev => ({
                                        ...prev,
                                        processedUrls: prev.processedUrls + 1,
                                        message: `Completed ${prev.processedUrls + 1} of ${prev.totalUrls} URLs`
                                    }));
                                    break;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e, line);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
            setProcessingStatus(prev => ({
                ...prev,
                isProcessing: false,
                message: 'Analysis complete!'
            }));
        }
    };

    const groupInsightsByType = (insights) => {
        // Global keyword map for deduplication
        const keywordMap = new Map();

        // Process all keywords first
        insights.forEach(insight => {
            const cleanedKeyword = cleanupText(insight.top_keyword);
            if (!cleanedKeyword) return; // Skip empty or filtered out keywords

            // Split into individual keywords
            cleanedKeyword
                .split(/[,"]|\s+and\s+|"|\s*\+\s*/)
                .map(k => k.trim())
                .filter(k => k.length > 0)
                .forEach(keyword => {
                    const normalizedKey = normalizeKeyword(keyword);
                    if (normalizedKey) {
                        const existing = keywordMap.get(normalizedKey);
                        if (existing) {
                            existing.count += 1;
                            if (!existing.sources.includes(insight.source)) {
                                existing.sources.push(insight.source);
                            }
                        } else {
                            keywordMap.set(normalizedKey, {
                                value: keyword, // Keep original casing
                                count: 1,
                                sources: [insight.source]
                            });
                        }
                    }
                });
        });

        return {
            keywords: Array.from(keywordMap.values())
                .map(k => ({
                    value: k.value,
                    count: k.count,
                    source: k.sources.join(', ')
                }))
                .sort((a, b) => b.count - a.count), // Sort by count in descending order
            insights: insights
                .map(i => ({ ...i, value: cleanupText(i.key_insight) }))
                .filter(i => i.value), // Filter out empty insights
            quotes: insights
                .map(i => ({ ...i, value: cleanupText(i.key_quote) }))
                .filter(i => i.value) // Filter out empty quotes
        };
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
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

                <Box>
                    <Heading mb={4} color="#a961ff">Marketing Angle Finder</Heading>
                    <Text mb={6}>Enter keywords to find relevant Reddit posts or directly input URLs to analyze</Text>

                    <Stack spacing={6}>
                        <Card p={4} variant="outline" borderColor="blue.200">
                            <FormControl>
                                <FormLabel fontSize="lg" color="blue.600">
                                    <HStack>
                                        <Icon as={FaKeyboard} />
                                        <Text>Keywords Search</Text>
                                    </HStack>
                                </FormLabel>
                                <Input
                                    size="lg"
                                    placeholder="Enter keywords (e.g., 'joint pain', 'back pain')"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    borderColor="blue.200"
                                    _hover={{ borderColor: "blue.300" }}
                                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                                />
                                <FormHelperText>
                                    Enter keywords to automatically find and analyze relevant Reddit posts
                                </FormHelperText>
                            </FormControl>
                        </Card>

                        <Card p={4} variant="outline">
                            <FormLabel fontSize="lg">Manual URL Input</FormLabel>
                            <Stack spacing={4}>
                                {urls.map((url, index) => (
                                    <HStack key={index}>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter URL to analyze"
                                                value={url}
                                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                            />
                                        </FormControl>
                                        {urls.length > 1 && (
                                            <IconButton
                                                icon={<FaTrash />}
                                                onClick={() => handleRemoveUrl(index)}
                                                colorScheme="red"
                                                variant="ghost"
                                            />
                                        )}
                                    </HStack>
                                ))}
                                <Button
                                    leftIcon={<FaPlus />}
                                    onClick={handleAddUrl}
                                    variant="ghost"
                                    size="sm"
                                >
                                    Add Another URL
                                </Button>
                            </Stack>
                        </Card>

                        {redditUrls.length > 0 && (
                            <Card p={4} variant="outline" borderColor="green.200">
                                <FormLabel fontSize="lg" color="green.600">
                                    <HStack>
                                        <Icon as={FaReddit} />
                                        <Text>Reddit Search Results</Text>
                                        <Badge colorScheme="green">{redditUrls.length} posts found</Badge>
                                    </HStack>
                                </FormLabel>
                                <Stack spacing={2}>
                                    {redditUrls.map((url, index) => (
                                        <Box
                                            key={index}
                                            p={2}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            fontSize="sm"
                                        >
                                            <Link href={url} isExternal color="blue.500">
                                                {url}
                                            </Link>
                                        </Box>
                                    ))}
                                </Stack>
                            </Card>
                        )}

                        <Button
                            bg="#a961ff"
                            color="white"
                            _hover={{ bg: '#8f4ee6' }}
                            onClick={handleSearch}
                            isLoading={isLoading}
                            loadingText="Analyzing..."
                            size="lg"
                            width="full"
                        >
                            {keywords.trim() ? 'Search Reddit & Analyze' : 'Analyze URLs'}
                        </Button>
                    </Stack>
                </Box>

                {insights.length > 0 && (
                    <SimpleGrid
                        columns={{ base: 1, lg: 2, xl: 3 }}
                        spacing={6}
                        alignItems="stretch"
                    >
                        <InsightBox
                            title="Top Keywords"
                            icon={FaKeyboard}
                            insights={groupInsightsByType(insights).keywords}
                            count={groupInsightsByType(insights).keywords.length}
                            brandColor="#a961ff"
                        />
                        <InsightBox
                            title="Key Insights"
                            icon={FaLightbulb}
                            insights={groupInsightsByType(insights).insights}
                            count={groupInsightsByType(insights).insights.length}
                            brandColor="#a961ff"
                        />
                        <InsightBox
                            title="Key Quotes"
                            icon={FaQuoteRight}
                            insights={groupInsightsByType(insights).quotes}
                            count={groupInsightsByType(insights).quotes.length}
                            brandColor="#a961ff"
                        />
                    </SimpleGrid>
                )}
            </VStack>
        </Container>
    );
};

export default MarketingAngleFinder; 