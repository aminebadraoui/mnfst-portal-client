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
import { FaPlus, FaTrash, FaKeyboard, FaLightbulb, FaQuoteRight, FaReddit, FaChartLine, FaBookmark, FaChevronLeft, FaChevronRight, FaAmazon, FaYoutube, FaSearch, FaLink, FaHistory, FaEdit, FaGlobe, FaTwitter, FaFacebook, FaShoppingCart, FaFileAlt } from 'react-icons/fa';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../../services/api';
import useProjectStore from "../../../store/projectStore";
import CommunityInsightsLayout from '../../../components/CommunityInsightsLayout';

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
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        bg="white"
        boxShadow="md"
        _hover={{
            boxShadow: 'lg',
            transform: 'translateY(-2px)',
        }}
        transition="all 0.2s"
    >
        <VStack align="stretch" spacing={4}>
            <Heading size="md" color="#a961ff" textAlign="center">
                {opportunity?.opportunity || 'Market Opportunity'}
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
                        {(opportunity?.pain_points || []).map((point, i) => (
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
                    <Text>{opportunity?.target_audience || opportunity?.target_market || 'Not specified'}</Text>
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
                        {(opportunity?.potential_solutions || []).map((solution, i) => (
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
                    <Text fontWeight="bold" mb={2}>Supporting Insights</Text>
                    <UnorderedList spacing={2}>
                        {(opportunity?.supporting_insights || opportunity?.supporting_quotes || []).map((quote, i) => (
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

const CommunityInsightsAgent = () => {
    const [keywords, setKeywords] = useState(['']);
    const [manualUrl, setManualUrl] = useState('');
    const [collectedUrls, setCollectedUrls] = useState([]);
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
    const [researchName, setResearchName] = useState('');
    const [activeStep, setActiveStep] = useState(1);
    const [highestStep, setHighestStep] = useState(1);
    const [manualStep, setManualStep] = useState(null);

    // Load existing research if researchId is provided
    useEffect(() => {
        const loadResearch = async () => {
            if (researchId) {
                try {
                    const response = await api.get(`/research/${researchId}`);
                    const research = response.data;
                    console.log('Loaded research:', research);
                    setCurrentResearch(research);

                    // Restore state from research
                    if (research.urls) setCollectedUrls(research.urls);
                    if (research.name) setResearchName(research.name);

                    // Process insights and keywords
                    if (research.community_analysis?.insights) {
                        const processedInsights = [];
                        const keywordMap = new Map();

                        research.community_analysis.insights.forEach(insight => {
                            processedInsights.push({
                                type: 'insight',
                                content: insight.content,
                                source: insight.source
                            });

                            // Add keywords
                            insight.keywords?.forEach(keyword => {
                                const count = keywordMap.get(keyword) || 0;
                                keywordMap.set(keyword, count + 1);
                            });
                        });

                        setInsights(processedInsights);
                    }

                    if (research.market_analysis?.opportunities) {
                        setMarketOpportunities(research.market_analysis.opportunities);
                    }
                } catch (error) {
                    console.error('Error loading research:', error);
                    toast({
                        title: 'Error loading research',
                        description: error.message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        };

        loadResearch();
    }, [researchId, toast]);

    // Update highest step when progress is made
    useEffect(() => {
        let newHighestStep = 1;
        if (insights.length > 0 || isAnalyzing) {
            newHighestStep = 3;
        } else if (collectedUrls.length > 0) {
            newHighestStep = 2;
        }
        setHighestStep(Math.max(highestStep, newHighestStep));
    }, [insights.length, collectedUrls.length, isAnalyzing]);

    // Determine current step based on state
    const getCurrentStep = () => {
        // If user manually selected a step, show that
        if (manualStep !== null) {
            return manualStep;
        }

        // Otherwise, determine step based on progress
        if (insights.length > 0) {
            return 2;
        }
        return 1;
    };

    // Update step navigation
    const handleStepClick = (step) => {
        setManualStep(step);
    };

    const handleNextStep = () => {
        const nextStep = getCurrentStep() + 1;
        setManualStep(nextStep);
    };

    // Update the name research handler
    const handleNameSubmit = async () => {
        // Here we would save the research
        toast({
            title: "Research saved",
            description: "Your research has been saved successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <CommunityInsightsLayout currentStep={getCurrentStep()} onStepClick={handleStepClick}>
            <Box ml="64" p="12" maxW="7xl" mx="auto">
                <VStack spacing={8} align="stretch" w="full">
                    <Box>
                        <Heading size="xl" mb={3}>Community Insights Agent</Heading>
                        <Text color="gray.600" fontSize="lg">
                            Research and analyze community insights by examining websites and online discussions
                        </Text>
                    </Box>

                    {processingStatus.isProcessing && (
                        <Card
                            bg="white"
                            borderColor="#a961ff"
                            borderWidth={2}
                            borderRadius="lg"
                            p={6}
                            position="sticky"
                            top={4}
                            zIndex={10}
                            boxShadow="lg"
                        >
                            <HStack spacing={4} align="center">
                                <Box flex={1}>
                                    <Text fontWeight="bold" color="#a961ff" mb={2} fontSize="lg">
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
                                        fontSize="md"
                                        px={4}
                                        py={2}
                                        borderRadius="full"
                                    >
                                        {processingStatus.processedUrls} / {processingStatus.totalUrls}
                                    </Badge>
                                )}
                            </HStack>
                        </Card>
                    )}

                    {getCurrentStep() === 1 && (
                        <Card variant="outline" size="lg" p={8}>
                            <VStack spacing={8} align="stretch" maxW="3xl" mx="auto">
                                <VStack spacing={2} align="center">
                                    <Icon as={FaSearch} boxSize={8} color="purple.500" />
                                    <Heading size="lg" color="purple.500">Query</Heading>
                                    <Text color="gray.600" textAlign="center">
                                        Enter your search query and add any specific URLs you want to analyze
                                    </Text>
                                </VStack>

                                <FormControl>
                                    <Input
                                        value={keywords[0]}
                                        onChange={(e) => setKeywords([e.target.value])}
                                        placeholder="Enter your query (e.g., joint pain)"
                                        size="lg"
                                        fontSize="lg"
                                        height="16"
                                        _placeholder={{ color: 'gray.400' }}
                                    />
                                </FormControl>

                                <VStack spacing={4} align="stretch">
                                    <HStack>
                                        <Input
                                            value={manualUrl}
                                            onChange={(e) => setManualUrl(e.target.value)}
                                            placeholder="Enter a URL to analyze"
                                            size="lg"
                                            fontSize="lg"
                                            height="16"
                                            _placeholder={{ color: 'gray.400' }}
                                        />
                                        <IconButton
                                            icon={<FaPlus />}
                                            onClick={() => {
                                                if (manualUrl.trim()) {
                                                    setCollectedUrls([...collectedUrls, manualUrl.trim()]);
                                                    setManualUrl('');
                                                }
                                            }}
                                            colorScheme="purple"
                                            size="lg"
                                            height="16"
                                            width="16"
                                            fontSize="xl"
                                        />
                                    </HStack>

                                    {collectedUrls.length > 0 && (
                                        <Box
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            p={4}
                                            bg="gray.50"
                                            maxH="300px"
                                            overflowY="auto"
                                        >
                                            <VStack spacing={3} align="stretch">
                                                {collectedUrls.map((url, index) => (
                                                    <HStack key={index} bg="white" p={3} borderRadius="md" borderWidth="1px">
                                                        <Text flex={1} noOfLines={1} fontSize="md">{url}</Text>
                                                        <IconButton
                                                            icon={<FaTrash />}
                                                            onClick={() => {
                                                                const newUrls = collectedUrls.filter((_, i) => i !== index);
                                                                setCollectedUrls(newUrls);
                                                            }}
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            size="sm"
                                                        />
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    )}
                                </VStack>

                                <Button
                                    colorScheme="purple"
                                    size="lg"
                                    height="16"
                                    fontSize="lg"
                                    leftIcon={<FaLightbulb />}
                                    isDisabled={!keywords[0].trim()}
                                    onClick={() => {
                                        setIsAnalyzing(true);
                                        setManualStep(2);
                                    }}
                                >
                                    Find Insights
                                </Button>
                            </VStack>
                        </Card>
                    )}

                    {getCurrentStep() === 2 && (
                        <Card variant="outline" size="lg" p={8}>
                            <VStack spacing={8} align="stretch">
                                <VStack spacing={2} align="center">
                                    <Icon as={FaFileAlt} boxSize={8} color="purple.500" />
                                    <Heading size="lg" color="purple.500">Insights</Heading>
                                    <Text color="gray.600" textAlign="center">
                                        View insights generated from your query
                                    </Text>
                                </VStack>

                                {isAnalyzing ? (
                                    <VStack spacing={6} p={12} align="center">
                                        <Progress size="sm" isIndeterminate w="full" colorScheme="purple" />
                                        <Text color="gray.600" fontSize="lg">Analyzing content and generating insights...</Text>
                                    </VStack>
                                ) : insights.length > 0 ? (
                                    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                                        {/* Insights will be displayed here */}
                                    </SimpleGrid>
                                ) : (
                                    <VStack spacing={6} py={12}>
                                        <EmptyState
                                            icon={FaFileAlt}
                                            title="No Insights Yet"
                                            description="Your query is being analyzed"
                                        />
                                    </VStack>
                                )}
                            </VStack>
                        </Card>
                    )}

                    {getCurrentStep() === 3 && (
                        <Card variant="outline" size="lg" p={8}>
                            <VStack spacing={8} align="stretch" maxW="3xl" mx="auto">
                                <VStack spacing={2} align="center">
                                    <Icon as={FaEdit} boxSize={8} color="purple.500" />
                                    <Heading size="lg" color="purple.500">Name Research</Heading>
                                    <Text color="gray.600" textAlign="center">
                                        Give your research a meaningful name to save it
                                    </Text>
                                </VStack>

                                <FormControl isRequired>
                                    <Input
                                        value={researchName}
                                        onChange={(e) => setResearchName(e.target.value)}
                                        placeholder="e.g., Health Supplements Market Research"
                                        size="lg"
                                        fontSize="lg"
                                        height="16"
                                        _placeholder={{ color: 'gray.400' }}
                                    />
                                </FormControl>

                                <Button
                                    colorScheme="purple"
                                    size="lg"
                                    height="16"
                                    fontSize="lg"
                                    leftIcon={<FaBookmark />}
                                    isDisabled={!researchName.trim()}
                                    onClick={handleNameSubmit}
                                >
                                    Save Research
                                </Button>
                            </VStack>
                        </Card>
                    )}
                </VStack>
            </Box>
        </CommunityInsightsLayout>
    );
};

export default CommunityInsightsAgent; 