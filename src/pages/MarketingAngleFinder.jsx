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
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaKeyboard, FaLightbulb, FaQuoteRight } from 'react-icons/fa';
import api from '../services/api';

const InsightBox = ({ title, icon, insights = [], count }) => (
    <Card h="full" variant="outline" boxShadow="sm">
        <CardHeader bg="blue.50" p={4} borderBottomWidth="1px">
            <VStack spacing={2}>
                <Icon as={icon} boxSize={6} color="blue.500" />
                <Heading size="md" textAlign="center">{title}</Heading>
                <Badge colorScheme="blue" fontSize="sm" px={2} borderRadius="full">
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
                            borderColor: 'blue.200'
                        }}
                        transition="all 0.2s"
                    >
                        {title === "Top Keywords" ? (
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between" align="center">
                                    <Text
                                        fontSize="md"
                                        fontWeight="semibold"
                                        color="blue.600"
                                    >
                                        {insight.value}
                                    </Text>
                                    {insight.count > 1 && (
                                        <Badge colorScheme="blue" fontSize="xs">
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
    const [urls, setUrls] = useState(['']);
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState([]);
    const toast = useToast();

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

    const handleAnalyze = async () => {
        try {
            setIsLoading(true);
            setInsights([]);
            const validUrls = urls.filter(url => url.trim() !== '');

            if (validUrls.length === 0) {
                toast({
                    title: 'Error',
                    description: 'Please enter at least one valid URL',
                    status: 'error',
                    duration: 3000,
                });
                return;
            }

            // Create POST request to initiate analysis
            const response = await fetch(`${api.defaults.baseURL}/analysis/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({ urls: validUrls })
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
                            console.log('Received event:', event); // Debug log

                            switch (event.type) {
                                case 'status':
                                    toast({
                                        title: 'Status',
                                        description: event.message,
                                        status: 'info',
                                        duration: 2000,
                                        isClosable: true,
                                    });
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
                                    toast({
                                        title: 'Success',
                                        description: `Completed analysis of ${event.data.url}`,
                                        status: 'success',
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                    break;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e, line);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to analyze URLs',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
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
                <Box>
                    <Heading mb={4}>Marketing Angle Finder</Heading>
                    <Text mb={4}>Enter URLs to analyze for marketing insights</Text>

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

                    <Button
                        mt={4}
                        colorScheme="blue"
                        onClick={handleAnalyze}
                        isLoading={isLoading}
                        loadingText="Analyzing..."
                        width="full"
                    >
                        Analyze
                    </Button>
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
                        />
                        <InsightBox
                            title="Key Insights"
                            icon={FaLightbulb}
                            insights={groupInsightsByType(insights).insights}
                            count={groupInsightsByType(insights).insights.length}
                        />
                        <InsightBox
                            title="Key Quotes"
                            icon={FaQuoteRight}
                            insights={groupInsightsByType(insights).quotes}
                            count={groupInsightsByType(insights).quotes.length}
                        />
                    </SimpleGrid>
                )}
            </VStack>
        </Container>
    );
};

export default MarketingAngleFinder; 