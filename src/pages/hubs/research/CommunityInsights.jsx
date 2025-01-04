import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    useColorModeValue,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Badge,
    Link,
    Divider,
    SimpleGrid,
    IconButton,
    useToast,
    Grid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Switch,
    FormHelperText,
} from '@chakra-ui/react';
import { FaExclamationCircle, FaQuestionCircle, FaChartLine, FaLightbulb, FaSearch, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaChartBar, FaBuilding, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import useProjectStore from "../../../store/projectStore";

const InsightCard = ({ evidence, source, engagement, frequency, correlation, significance, keyword }) => {
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const bgColor = useColorModeValue('white', 'gray.800');

    return (
        <Box
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            bg={bgColor}
            _hover={{ borderColor: 'purple.500' }}
            transition="all 0.2s"
            minW="400px"
            maxW="400px"
            height="320px"
            display="flex"
            flexDirection="column"
            overflow="hidden"
        >
            <VStack align="stretch" flex={1} spacing={3} h="full">
                <HStack justify="flex-end">
                    <Badge colorScheme={keyword === 'joint pain' ? 'purple' : 'blue'} fontSize="xs">
                        {keyword}
                    </Badge>
                </HStack>

                <Box flex={1} overflowY="auto" css={{
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'gray.200',
                        borderRadius: '24px',
                    },
                }}>
                    <Text color="gray.600" fontSize="sm" fontStyle="italic" whiteSpace="pre-wrap">
                        "{evidence}"
                    </Text>
                </Box>

                <VStack spacing={3} align="stretch">
                    <HStack spacing={2} fontSize="sm">
                        <Link href={source} isExternal color="purple.500">
                            Source <Icon as={FaExternalLinkAlt} mx="2px" />
                        </Link>
                        {engagement && (
                            <Badge colorScheme="green">
                                {engagement}
                            </Badge>
                        )}
                    </HStack>

                    <Divider />

                    <VStack align="stretch" spacing={2} fontSize="sm">
                        {frequency && (
                            <Text whiteSpace="pre-wrap"><strong>Frequency:</strong> {frequency}</Text>
                        )}
                        {correlation && (
                            <Text whiteSpace="pre-wrap"><strong>Correlation:</strong> {correlation}</Text>
                        )}
                        {significance && (
                            <Text whiteSpace="pre-wrap"><strong>Significance:</strong> {significance}</Text>
                        )}
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
};

const InsightGroup = ({ title, insights = [] }) => {
    const scrollContainerRef = React.useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    React.useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 420; // card width + spacing
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Box position="relative" mb={8}>
            <Heading size="sm" mb={4} color="gray.700">{title}</Heading>
            <Box position="relative" mx={10}>
                <Box
                    position="absolute"
                    left="-50px"
                    top="0"
                    bottom="0"
                    width="50px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                >
                    <IconButton
                        icon={<Icon as={FaChevronLeft} boxSize={5} />}
                        aria-label="Scroll left"
                        colorScheme="purple"
                        variant="ghost"
                        rounded="full"
                        onClick={() => scroll('left')}
                        opacity={canScrollLeft ? 1 : 0.3}
                        _hover={{
                            bg: 'rgba(128, 90, 213, 0.12)',
                            transform: canScrollLeft ? 'scale(1.1)' : 'none',
                        }}
                        _active={{
                            transform: canScrollLeft ? 'scale(0.95)' : 'none',
                        }}
                    />
                </Box>
                <Box
                    position="absolute"
                    right="-50px"
                    top="0"
                    bottom="0"
                    width="50px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                >
                    <IconButton
                        icon={<Icon as={FaChevronRight} boxSize={5} />}
                        aria-label="Scroll right"
                        colorScheme="purple"
                        variant="ghost"
                        rounded="full"
                        onClick={() => scroll('right')}
                        opacity={canScrollRight ? 1 : 0.3}
                        _hover={{
                            bg: 'rgba(128, 90, 213, 0.12)',
                            transform: canScrollRight ? 'scale(1.1)' : 'none',
                        }}
                        _active={{
                            transform: canScrollRight ? 'scale(0.95)' : 'none',
                        }}
                    />
                </Box>
                <Box
                    ref={scrollContainerRef}
                    overflowX="auto"
                    css={{
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }}
                    onScroll={handleScroll}
                >
                    <HStack spacing={4} pb={2}>
                        {insights.map((insight, index) => (
                            <InsightCard key={index} {...insight} />
                        ))}
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
};

const InsightSection = ({ title, icon, insights = [] }) => {
    // Group insights by their title pattern
    const groupedInsights = insights.reduce((acc, insight) => {
        if (!acc[insight.title]) {
            acc[insight.title] = [];
        }
        acc[insight.title].push(insight);
        return acc;
    }, {});

    return (
        <AccordionItem>
            <AccordionButton py={6}>
                <HStack flex="1" spacing={4}>
                    <Icon as={icon} boxSize={7} />
                    <Text fontSize="xl" fontWeight="semibold">{title}</Text>
                    <Badge ml={2} colorScheme="purple" fontSize="md">{insights.length}</Badge>
                </HStack>
                <AccordionIcon boxSize={8} />
            </AccordionButton>
            <AccordionPanel pb={4}>
                {insights.length > 0 ? (
                    <VStack spacing={8} align="stretch">
                        {Object.entries(groupedInsights).map(([groupTitle, groupInsights], index) => (
                            <InsightGroup
                                key={index}
                                title={groupTitle}
                                insights={groupInsights}
                            />
                        ))}
                    </VStack>
                ) : (
                    <Text color="gray.500" textAlign="center">No insights generated yet</Text>
                )}
            </AccordionPanel>
        </AccordionItem>
    );
};

const CompetitionSection = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            p={6}
            bg={bg}
            mt={8}
        >
            <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                    <Icon as={FaBuilding} boxSize={6} color="blue.500" />
                    <Heading size="md">Competition Intelligence</Heading>
                </HStack>

                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                    <GridItem>
                        <VStack
                            p={6}
                            bg={useColorModeValue('gray.50', 'gray.700')}
                            borderRadius="md"
                            align="stretch"
                            spacing={4}
                        >
                            <HStack>
                                <Icon as={FaChartBar} color="purple.500" />
                                <Text fontWeight="semibold">Market Analysis</Text>
                            </HStack>
                            <Text color="gray.600" fontSize="sm">
                                Track market trends and analyze competitor strategies
                            </Text>
                            <Button
                                leftIcon={<FaSearch />}
                                colorScheme="purple"
                                variant="outline"
                                size="sm"
                            >
                                Start Analysis
                            </Button>
                        </VStack>
                    </GridItem>

                    <GridItem>
                        <VStack
                            p={6}
                            bg={useColorModeValue('gray.50', 'gray.700')}
                            borderRadius="md"
                            align="stretch"
                            spacing={4}
                        >
                            <HStack>
                                <Icon as={FaChartLine} color="green.500" />
                                <Text fontWeight="semibold">Performance Tracking</Text>
                            </HStack>
                            <Text color="gray.600" fontSize="sm">
                                Monitor competitor performance metrics and benchmarks
                            </Text>
                            <Button
                                leftIcon={<FaChartLine />}
                                colorScheme="green"
                                variant="outline"
                                size="sm"
                            >
                                View Metrics
                            </Button>
                        </VStack>
                    </GridItem>
                </Grid>
            </VStack>
        </Box>
    );
};

const CommunityInsights = () => {
    const { projectId } = useParams();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topicKeyword, setTopicKeyword] = useState('');
    const [sourceUrls, setSourceUrls] = useState(['']);
    const [productUrls, setProductUrls] = useState(['']);
    const [useOnlySpecifiedSources, setUseOnlySpecifiedSources] = useState(false);
    const toast = useToast();

    const handleAddUrl = (type) => {
        if (type === 'source') {
            setSourceUrls([...sourceUrls, '']);
        } else {
            setProductUrls([...productUrls, '']);
        }
    };

    const handleRemoveUrl = (type, index) => {
        if (type === 'source') {
            setSourceUrls(sourceUrls.filter((_, i) => i !== index));
        } else {
            setProductUrls(productUrls.filter((_, i) => i !== index));
        }
    };

    const handleUrlChange = (type, index, value) => {
        if (type === 'source') {
            const newUrls = [...sourceUrls];
            newUrls[index] = value;
            setSourceUrls(newUrls);
        } else {
            const newUrls = [...productUrls];
            newUrls[index] = value;
            setProductUrls(newUrls);
        }
    };

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        try {
            // Filter out empty URLs
            const filteredSourceUrls = sourceUrls.filter(url => url.trim());
            const filteredProductUrls = productUrls.filter(url => url.trim());

            const response = await api.post(`/community-insights`, {
                topic_keyword: topicKeyword || undefined,
                source_urls: filteredSourceUrls.length > 0 ? filteredSourceUrls : undefined,
                product_urls: filteredProductUrls.length > 0 ? filteredProductUrls : undefined,
                use_only_specified_sources: useOnlySpecifiedSources,
            });

            setIsModalOpen(false);
            toast({
                title: "Insights Generated",
                description: "New insights have been generated for your project",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate insights",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Sample data based on the provided response
    const sections = [
        {
            title: 'Pain & Frustration Analysis',
            icon: FaExclamationCircle,
            insights: [
                {
                    title: 'Most emotionally charged complaints and grievances',
                    evidence: 'I feel like no one understands how debilitating this pain is.',
                    source: 'https://www.reddit.com/r/CrohnsDisease/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '150 upvotes / 30 comments',
                    frequency: 'Common in discussions about chronic pain',
                    correlation: 'Related to discussions on healthcare access and treatment efficacy',
                    significance: 'Highlights the emotional toll of chronic pain and the perceived inadequacies in medical responses',
                    keyword: 'joint pain'
                },
                {
                    title: 'Most emotionally charged complaints and grievances',
                    evidence: 'Every morning I wake up feeling like my back is made of concrete.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/back_pain_discussion/',
                    engagement: '180 upvotes / 45 comments',
                    frequency: 'Very common in morning-related discussions',
                    correlation: 'Strong correlation with sleep quality and mattress discussions',
                    significance: 'Indicates the significant impact on daily life and morning routines',
                    keyword: 'back pain'
                },
                {
                    title: 'Most emotionally charged complaints and grievances',
                    evidence: 'My neck pain is ruining my ability to focus at work, it\'s unbearable.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/neck_pain_work/',
                    engagement: '165 upvotes / 40 comments',
                    frequency: 'Frequently mentioned in work-related discussions',
                    correlation: 'Strong correlation with workplace ergonomics and productivity',
                    significance: 'Highlights the impact of chronic pain on professional life',
                    keyword: 'neck pain'
                },
                {
                    title: 'Most emotionally charged complaints and grievances',
                    evidence: 'Can\'t even lift my arm to brush my hair anymore.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/shoulder_pain_daily/',
                    engagement: '190 upvotes / 50 comments',
                    frequency: 'Common in daily activities discussions',
                    correlation: 'Links to impact on self-care and independence',
                    significance: 'Demonstrates how pain affects basic daily activities',
                    keyword: 'shoulder pain'
                },
                {
                    title: 'Most emotionally charged complaints and grievances',
                    evidence: 'My knee pain has taken away my ability to play with my kids.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/knee_pain_family/',
                    engagement: '210 upvotes / 55 comments',
                    frequency: 'Recurring theme in family impact discussions',
                    correlation: 'Strong links to emotional well-being and family relationships',
                    significance: 'Shows the broader impact on family life and parenting',
                    keyword: 'knee pain'
                },
                {
                    title: 'Recurring sources of anger',
                    evidence: 'Why do they charge so much for something that barely works?',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '200 upvotes / 40 comments',
                    frequency: 'Frequently mentioned in threads discussing treatment options',
                    correlation: 'Links to broader discussions about healthcare reform',
                    significance: 'Reflects a systemic issue in healthcare that affects patient satisfaction',
                    keyword: 'joint pain'
                },
                {
                    title: 'Recurring sources of anger',
                    evidence: 'Doctors keep dismissing my back pain as "just stress".',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/back_pain_frustration/',
                    engagement: '220 upvotes / 55 comments',
                    frequency: 'Common complaint in medical experience discussions',
                    correlation: 'Related to discussions about medical gaslighting',
                    significance: 'Highlights issues with pain validation in healthcare settings',
                    keyword: 'back pain'
                }
            ]
        },
        {
            title: 'Question & Advice Mapping',
            icon: FaQuestionCircle,
            insights: [
                {
                    title: 'Most frequently asked questions',
                    evidence: 'What are some natural ways to ease joint pain?',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '130 upvotes / 20 comments',
                    frequency: 'High frequency across various threads',
                    correlation: 'Related to discussions about medication side effects',
                    significance: 'Indicates a strong desire for non-pharmaceutical solutions',
                    keyword: 'joint pain'
                },
                {
                    title: 'Most frequently asked questions',
                    evidence: 'Has anyone found a good office chair that actually helps with back pain?',
                    source: 'https://www.reddit.com/r/backpain/comments/office_chair_recommendations/',
                    engagement: '160 upvotes / 40 comments',
                    frequency: 'Common in work-related discussions',
                    correlation: 'Strong links to workplace ergonomics topics',
                    significance: 'Demonstrates the impact of work environment on pain management',
                    keyword: 'back pain'
                },
                {
                    title: 'Most upvoted advice',
                    evidence: 'Losing weight has helped my knees so much!',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '250 upvotes / 60 comments',
                    frequency: 'Frequently cited in advice threads',
                    correlation: 'Ties into broader health discussions regarding lifestyle changes',
                    significance: 'Reinforces the importance of lifestyle management in joint health',
                    keyword: 'joint pain'
                },
                {
                    title: 'Most debated solutions',
                    evidence: 'I swear by glucosamine; others say it\'s useless.',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '140 upvotes / 35 comments',
                    frequency: 'Commonly debated across multiple threads',
                    correlation: 'Related to skepticism towards alternative medicine approaches',
                    significance: 'Highlights the divide between traditional and alternative medicine perspectives',
                    keyword: 'joint pain'
                }
            ]
        },
        {
            title: 'Pattern Detection',
            icon: FaChartLine,
            insights: [
                {
                    title: 'Unusual word combinations appearing frequently',
                    evidence: 'I feel this constant joint fatigue that makes everything harder.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '100 upvotes / 20 comments',
                    frequency: 'Noted regularly in posts discussing daily experiences',
                    correlation: 'Related to discussions on chronic fatigue syndrome',
                    significance: 'Highlights a nuanced understanding of joint-related issues beyond just pain',
                    keyword: 'joint pain'
                },
                {
                    title: 'Vocabulary differences between satisfied/frustrated users',
                    evidence: 'My new routine has brought me relief! vs This pain feels hopeless.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10785940/',
                    engagement: '150 upvotes / 35 comments',
                    frequency: 'Consistent across various threads',
                    correlation: 'Links with emotional well-being discussions',
                    significance: 'Reveals how language reflects user sentiment regarding their conditions',
                    keyword: 'joint pain'
                },
                {
                    title: 'Shifts in how problems are described over time',
                    evidence: 'My anxiety about my joints has skyrocketed since last year.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '200 upvotes / 50 comments',
                    frequency: 'Notable increase observed over the last year',
                    correlation: 'Related to broader societal mental health trends during COVID-19',
                    significance: 'Indicates an evolving understanding of the interplay between physical and mental health',
                    keyword: 'joint pain'
                }
            ]
        },
        {
            title: 'Community Insights',
            icon: FaLightbulb,
            insights: [
                {
                    title: 'Most upvoted concerns',
                    evidence: 'Why can\'t we have better access to affordable medications?',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '250 upvotes / 60 comments',
                    frequency: 'Frequently raised issue within community forums',
                    correlation: 'Links with broader healthcare system critiques',
                    significance: 'Reflects systemic barriers facing patients seeking care',
                    keyword: 'joint pain'
                },
                {
                    title: 'Silent issues (only mentioned when failing)',
                    evidence: 'I never realized how much fatigue was affecting me until I couldn\'t get out of bed.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '80 upvotes / 10 comments',
                    frequency: 'Infrequently mentioned until severe cases arise',
                    correlation: 'Related to overall quality of life discussions among users',
                    significance: 'Suggests a need for more proactive conversations around fatigue management',
                    keyword: 'joint pain'
                },
                {
                    title: 'Unexpected positive outcomes',
                    evidence: 'Talking about my struggles here has brought me closer to friends who understand.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10785940/',
                    engagement: '120 upvotes / 25 comments',
                    frequency: 'Occasionally noted but impactful when shared',
                    correlation: 'Ties into themes of community building and support networks',
                    significance: 'Highlights the role of community support in coping with chronic conditions',
                    keyword: 'joint pain'
                }
            ]
        },
        {
            title: 'Main Competitors',
            icon: FaBuilding,
            insights: [
                {
                    title: 'Market Leaders',
                    evidence: 'Company X has captured 45% of the market share in pain relief products.',
                    source: 'https://www.marketreport.com/healthcare-2023',
                    engagement: '180 mentions / 40 reviews',
                    frequency: 'Dominant player in market discussions',
                    correlation: 'Strong presence in professional healthcare channels',
                    significance: 'Sets pricing and distribution standards for the industry',
                    keyword: 'market leader'
                },
                {
                    title: 'Emerging Competitors',
                    evidence: 'Startup Y is disrupting the market with their new natural formula.',
                    source: 'https://www.techcrunch.com/healthcare-startups',
                    engagement: '220 upvotes / 55 comments',
                    frequency: 'Growing presence in natural health communities',
                    correlation: 'Popular among younger demographic',
                    significance: 'Indicates shift towards natural alternatives',
                    keyword: 'natural products'
                },
                {
                    title: 'Customer Sentiment',
                    evidence: 'Customers consistently rate Brand Z higher for customer service.',
                    source: 'https://www.trustpilot.com/reviews',
                    engagement: '150 reviews / 4.5 average rating',
                    frequency: 'Monthly trend in customer feedback',
                    correlation: 'Strong correlation with brand loyalty',
                    significance: 'Highlights importance of customer support',
                    keyword: 'customer service'
                },
                {
                    title: 'Market Leaders',
                    evidence: 'Traditional pharma companies still dominate prescription pain medication market.',
                    source: 'https://www.pharmainsights.com/market-share-2023',
                    engagement: '200 mentions / 50 reviews',
                    frequency: 'Consistently mentioned in industry reports',
                    correlation: 'Strong ties to healthcare provider preferences',
                    significance: 'Indicates barriers to entry for new competitors',
                    keyword: 'market share'
                },
                {
                    title: 'Emerging Competitors',
                    evidence: 'New CBD-based products gaining traction in alternative medicine space.',
                    source: 'https://www.healthtech.com/cbd-market-analysis',
                    engagement: '250 upvotes / 60 comments',
                    frequency: 'Increasing mentions in wellness communities',
                    correlation: 'Links to growing interest in natural alternatives',
                    significance: 'Suggests shifting market preferences',
                    keyword: 'alternative medicine'
                }
            ]
        }
    ];

    if (!project) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text>Project not found</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Community Insights</Heading>
                    <Text color="gray.600">
                        Analyze and understand community discussions to uncover valuable insights for {project?.name}
                    </Text>
                </Box>

                <Button
                    leftIcon={<Icon as={FaSearch} />}
                    colorScheme="purple"
                    size="lg"
                    onClick={() => setIsModalOpen(true)}
                >
                    Generate Insights
                </Button>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Generate Community Insights</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Topic Keyword</FormLabel>
                                    <Input
                                        placeholder="Enter a topic to focus the analysis"
                                        value={topicKeyword}
                                        onChange={(e) => setTopicKeyword(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Source URLs (Optional)</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                        {sourceUrls.map((url, index) => (
                                            <HStack key={index}>
                                                <Input
                                                    placeholder="Enter URL to analyze"
                                                    value={url}
                                                    onChange={(e) => handleUrlChange('source', index, e.target.value)}
                                                />
                                                {sourceUrls.length > 1 && (
                                                    <IconButton
                                                        icon={<FaTrash />}
                                                        onClick={() => handleRemoveUrl('source', index)}
                                                        aria-label="Remove URL"
                                                        colorScheme="red"
                                                        variant="ghost"
                                                    />
                                                )}
                                            </HStack>
                                        ))}
                                        <Button
                                            leftIcon={<FaPlus />}
                                            onClick={() => handleAddUrl('source')}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="purple"
                                        >
                                            Add Another URL
                                        </Button>
                                    </VStack>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Product URLs (Optional)</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                        {productUrls.map((url, index) => (
                                            <HStack key={index}>
                                                <Input
                                                    placeholder="Enter product URL to reference"
                                                    value={url}
                                                    onChange={(e) => handleUrlChange('product', index, e.target.value)}
                                                />
                                                {productUrls.length > 1 && (
                                                    <IconButton
                                                        icon={<FaTrash />}
                                                        onClick={() => handleRemoveUrl('product', index)}
                                                        aria-label="Remove URL"
                                                        colorScheme="red"
                                                        variant="ghost"
                                                    />
                                                )}
                                            </HStack>
                                        ))}
                                        <Button
                                            leftIcon={<FaPlus />}
                                            onClick={() => handleAddUrl('product')}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="purple"
                                        >
                                            Add Another URL
                                        </Button>
                                    </VStack>
                                </FormControl>

                                {(sourceUrls.some(url => url.trim()) || productUrls.some(url => url.trim())) && (
                                    <FormControl display="flex" alignItems="center">
                                        <FormLabel htmlFor="use-only-specified-sources" mb="0">
                                            Use only specified URLs
                                        </FormLabel>
                                        <Switch
                                            id="use-only-specified-sources"
                                            isChecked={useOnlySpecifiedSources}
                                            onChange={(e) => setUseOnlySpecifiedSources(e.target.checked)}
                                            colorScheme="purple"
                                        />
                                        <FormHelperText ml={2}>
                                            {useOnlySpecifiedSources ?
                                                "AI will analyze only the URLs you provided" :
                                                "AI will search through additional relevant sources"
                                            }
                                        </FormHelperText>
                                    </FormControl>
                                )}

                                <Button
                                    colorScheme="purple"
                                    width="full"
                                    onClick={handleGenerateInsights}
                                    isLoading={isLoading}
                                    isDisabled={!topicKeyword.trim()}
                                >
                                    Generate
                                </Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Accordion allowToggle>
                    {sections.map((section, index) => (
                        <InsightSection
                            key={index}
                            title={section.title}
                            icon={section.icon}
                            insights={section.insights}
                        />
                    ))}
                </Accordion>
            </VStack>
        </Container>
    );
};

export default CommunityInsights; 