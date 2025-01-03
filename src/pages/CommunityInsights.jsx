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
} from '@chakra-ui/react';
import { FaExclamationCircle, FaQuestionCircle, FaChartLine, FaLightbulb, FaSearch, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import useProjectStore from '../store/projectStore';

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
        >
            <VStack align="stretch" flex={1} spacing={3}>
                <HStack justify="flex-end">
                    <Badge colorScheme={keyword === 'joint pain' ? 'purple' : 'blue'} fontSize="xs">
                        {keyword}
                    </Badge>
                </HStack>

                <Box flex={1}>
                    <Text color="gray.600" fontSize="sm" fontStyle="italic" noOfLines={3}>"{evidence}"</Text>
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
                            <Text noOfLines={1}><strong>Frequency:</strong> {frequency}</Text>
                        )}
                        {correlation && (
                            <Text noOfLines={1}><strong>Correlation:</strong> {correlation}</Text>
                        )}
                        {significance && (
                            <Text noOfLines={2}><strong>Significance:</strong> {significance}</Text>
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

const CommunityInsights = () => {
    const { projectId } = useParams();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        // TODO: Implement API call to generate insights
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
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
                },
                {
                    title: 'Recurring sources of anger',
                    evidence: 'Three different doctors, three different diagnoses for my neck.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/neck_diagnosis/',
                    engagement: '175 upvotes / 45 comments',
                    frequency: 'Common in diagnostic experience discussions',
                    correlation: 'Related to healthcare system navigation challenges',
                    significance: 'Indicates issues with diagnostic consistency',
                    keyword: 'neck pain'
                },
                {
                    title: 'Recurring sources of anger',
                    evidence: 'Insurance won\'t cover the treatment that actually helps my shoulder.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/shoulder_insurance/',
                    engagement: '195 upvotes / 60 comments',
                    frequency: 'Frequent in insurance coverage discussions',
                    correlation: 'Links to healthcare access and affordability',
                    significance: 'Highlights barriers to effective treatment access',
                    keyword: 'shoulder pain'
                },
                {
                    title: 'Recurring sources of anger',
                    evidence: 'Physical therapy copays are making me choose between treatment and groceries.',
                    source: 'https://www.reddit.com/r/ChronicPain/comments/knee_pt_cost/',
                    engagement: '230 upvotes / 70 comments',
                    frequency: 'Common in treatment cost discussions',
                    correlation: 'Strong links to financial burden of chronic pain',
                    significance: 'Demonstrates economic impact of ongoing treatment',
                    keyword: 'knee pain'
                },
                {
                    title: 'Hidden/normalized frustrations',
                    evidence: 'I\'ve just learned to live with it; it\'s my new normal.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '120 upvotes / 25 comments',
                    frequency: 'A recurring theme in personal narratives',
                    correlation: 'Tied to discussions about mental health impacts of chronic conditions',
                    significance: 'Indicates a potential barrier to seeking further treatment',
                    keyword: 'joint pain'
                },
                {
                    title: 'Indirect expressions of dissatisfaction',
                    evidence: 'Oh great, another day of pretending my knees don\'t hurt!',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '90 upvotes / 15 comments',
                    frequency: 'Common in light-hearted threads',
                    correlation: 'Related to coping mechanisms discussed in mental health contexts',
                    significance: 'Suggests a need for more serious engagement with underlying issues',
                    keyword: 'joint pain'
                },
                {
                    title: 'Cascade effects of problems',
                    evidence: 'My knee pain keeps me from going out, which makes me feel more depressed.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10785940/',
                    engagement: '180 upvotes / 50 comments',
                    frequency: 'Frequently noted in personal stories',
                    correlation: 'Links with discussions on mental health and lifestyle changes',
                    significance: 'Emphasizes the interconnectedness of physical and mental health',
                    keyword: 'joint pain'
                },
                {
                    title: 'Time patterns in complaint posting',
                    evidence: 'Every winter, my joints feel like they\'re on fire.',
                    source: 'https://www.healthdirect.gov.au/joint-pain-and-swelling',
                    engagement: '75 upvotes / 10 comments',
                    frequency: 'Seasonal trend observed over two years',
                    correlation: 'Related to weather discussions impacting joint health',
                    significance: 'Highlights the need for seasonal awareness in treatment approaches',
                    keyword: 'joint pain'
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
                },
                {
                    title: 'Most repeated recommendations',
                    evidence: 'Physical therapy made a world of difference for me.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10785940/',
                    engagement: '160 upvotes / 45 comments',
                    frequency: 'Frequently mentioned across various forums',
                    correlation: 'Links with discussions on rehabilitation strategies for chronic conditions',
                    significance: 'Suggests a community consensus on the value of professional guidance',
                    keyword: 'joint pain'
                },
                {
                    title: 'Success stories with details',
                    evidence: 'After switching to an anti-inflammatory diet, my pain decreased dramatically!',
                    source: 'https://www.healthdirect.gov.au/joint-pain-and-swelling',
                    engagement: '200 upvotes / 50 comments',
                    frequency: 'Occasional but impactful narratives shared by users',
                    correlation: 'Related to dietary discussions and their effects on inflammation',
                    significance: 'Provides hope and practical examples for others struggling with similar issues',
                    keyword: 'joint pain'
                },
                {
                    title: 'Failure patterns with context',
                    evidence: 'I tried X medication but it did nothing for my pain.',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '120 upvotes / 30 comments',
                    frequency: 'Commonly reported experiences among users seeking solutions',
                    correlation: 'Links with broader dissatisfaction regarding medical treatments available',
                    significance: 'Indicates a gap in effective treatment options available for chronic joint pain',
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
                },
                {
                    title: 'Non-obvious correlations between problems',
                    evidence: 'My joints hurt more when my stomach is upset.',
                    source: 'https://www.reddit.com/r/CrohnsDisease/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '110 upvotes / 25 comments',
                    frequency: 'Occasionally noted but significant when mentioned',
                    correlation: 'Links with discussions on conditions like Crohn\'s disease',
                    significance: 'Highlights the need for holistic approaches in treatment plans',
                    keyword: 'joint pain'
                },
                {
                    title: 'Counter-intuitive success patterns',
                    evidence: 'Acupuncture has been my saving grace, even if I was doubtful at first.',
                    source: 'https://www.reddit.com/r/rheumatoid/comments/16p06n1/anyone_have_joint_pain/',
                    engagement: '130 upvotes / 30 comments',
                    frequency: 'Occasionally mentioned but positively impactful',
                    correlation: 'Contrasts with mainstream medical advice focusing solely on pharmaceuticals',
                    significance: 'Suggests potential benefits from exploring alternative therapies',
                    keyword: 'joint pain'
                },
                {
                    title: 'Secondary effects users don\'t recognize',
                    evidence: 'I didn\'t realize how much poor sleep affected my joints until I changed my routine.',
                    source: 'https://www.healthdirect.gov.au/joint-pain-and-swelling',
                    engagement: '90 upvotes / 15 comments',
                    frequency: 'Rarely acknowledged but crucial when discussed',
                    correlation: 'Links with broader conversations about sleep hygiene',
                    significance: 'Encourages consideration of lifestyle factors beyond immediate symptoms',
                    keyword: 'joint pain'
                },
                {
                    title: 'Unexpected relationships between issues',
                    evidence: 'When I\'m stressed, my knees flare up worse than usual.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '140 upvotes / 40 comments',
                    frequency: 'Noted by several users across different threads',
                    correlation: 'Ties into discussions about stress management techniques',
                    significance: 'Highlights the importance of addressing psychological factors in managing physical health',
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
                },
                {
                    title: 'Common misconceptions',
                    evidence: 'I thought all arthritis was just old age; I didn\'t know there were different types.',
                    source: 'https://www.healthdirect.gov.au/joint-pain-and-swelling',
                    engagement: '100 upvotes / 20 comments',
                    frequency: 'Regularly encountered misconceptions within forums',
                    correlation: 'Links with educational resources shared among users',
                    significance: 'Indicates a need for better public education regarding arthritis types and treatments',
                    keyword: 'joint pain'
                },
                {
                    title: 'Unmet needs and gaps',
                    evidence: 'There\'s nothing out there for someone my age dealing with this.',
                    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7690206/',
                    engagement: '140 upvotes / 35 comments',
                    frequency: 'Frequently mentioned by younger users',
                    correlation: 'Related to age-specific healthcare resources and support',
                    significance: 'Highlights a demographic gap in support services for young adults',
                    keyword: 'joint pain'
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
                <HStack justify="space-between" align="center">
                    <Box>
                        <Heading size="lg" mb={2}>Community Insights</Heading>
                        <Text color="gray.600">
                            Analyze and understand community discussions to uncover valuable insights for {project.name}
                        </Text>
                    </Box>
                    <Button
                        colorScheme="purple"
                        size="lg"
                        onClick={handleGenerateInsights}
                        isLoading={isLoading}
                        leftIcon={<Icon as={FaSearch} />}
                    >
                        Generate Insights
                    </Button>
                </HStack>

                <Accordion allowToggle defaultIndex={[0]}>
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