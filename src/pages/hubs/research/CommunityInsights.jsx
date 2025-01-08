import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useDisclosure,
    useToast,
    Switch,
    FormHelperText,
    Spinner,
    Badge,
    Link,
    Icon,
    Card,
    CardBody,
    InputGroup,
    InputRightElement,
    UnorderedList,
    ListItem,
    Stack,
    SimpleGrid,
    Wrap,
    WrapItem,
    Alert,
    AlertIcon,
    AlertDescription,
    Select,
} from '@chakra-ui/react';
import { FaExclamationCircle, FaQuestionCircle, FaChartLine, FaLightbulb, FaMagic, FaUserCircle, FaUser, FaPlus, FaShoppingCart, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { api } from '../../../services/api';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useLoadingStore from '../../../store/loadingStore';
import useProjectStore from '../../../store/projectStore';
import { useAuthStore } from '../../../store/authStore';
import { getProjectQueries } from '../../../services/researchService';
import { startAnalysis } from '../../../services/researchService';

const iconMap = {
    FaExclamationCircle,
    FaQuestionCircle,
    FaChartLine,
    FaLightbulb,
    FaShoppingCart,
    FaUserCircle
};

// Mock data for development
const mockData = {
    "status": "completed",
    "sections": [
        {
            "title": "Pain & Frustration Analysis",
            "icon": "FaExclamationCircle",
            "insights": [
                {
                    "title": "Chronic Foot Pain Impacts Job Performance",
                    "evidence": "Chronic foot pain (CFP) impacts nurses' ability to provide care at the bedside. Treatment options for CFP were insufficient to address foot pain for nurses who stand or walk for prolonged periods while providing care to patients.",
                    "query": "nurse foot pain",
                    "source_url": "https://pubmed.ncbi.nlm.nih.gov/36967960/",
                    "engagement_metrics": "Not available",
                    "frequency": "High",
                    "correlation": "Recurring source of anger regarding insufficient treatment options for foot pain.",
                    "significance": "Significantly affects nurses' job performance, leading to frustration and emotional distress."
                },
                {
                    "title": "Lack of Effective Pain Management",
                    "evidence": "Most nurses expressed interest in new products to relieve their CFP. Innovations are urgently needed to address CFP.",
                    "query": "nurse foot pain",
                    "source_url": "https://pubmed.ncbi.nlm.nih.gov/36967960/",
                    "engagement_metrics": "Not available",
                    "frequency": "High",
                    "correlation": "Primary source of frustration as nurses feel that current treatment options are insufficient.",
                    "significance": "Leads to ongoing frustration and dissatisfaction among nurses."
                },
                {
                    "title": "Emotional Impact of Chronic Foot Pain",
                    "evidence": "Nurses who worked at the bedside predominantly switched jobs and reported higher levels of foot pain than those who did not switch jobs.",
                    "query": "nurse foot pain",
                    "source_url": "https://pubmed.ncbi.nlm.nih.gov/36967960/",
                    "engagement_metrics": "Not available",
                    "frequency": "Medium",
                    "correlation": "Deeply affects nurses' emotional well-being.",
                    "significance": "Chronic foot pain has a significant emotional toll, leading to job changes and increased stress."
                },
                {
                    "title": "Work Environment Factors Contributing to Foot Pain",
                    "evidence": "Nurses who worked longer time were more likely to purchase new work shoes and socks to alleviate foot pain than changing shoes only.",
                    "query": "nurse foot pain",
                    "source_url": "https://pubmed.ncbi.nlm.nih.gov/36967960/",
                    "engagement_metrics": "Not available",
                    "frequency": "Medium",
                    "correlation": "Indirect expression of dissatisfaction with the work environment.",
                    "significance": "Highlights the need for better support for foot health in the workplace."
                },
                {
                    "title": "Cascade Effects of Chronic Foot Pain",
                    "evidence": "Chronic foot pain impacts nurses' ability to provide care at the bedside, leading to higher levels of pain and decreased job performance.",
                    "query": "nurse foot pain",
                    "source_url": "https://pubmed.ncbi.nlm.nih.gov/36967960/",
                    "engagement_metrics": "Not available",
                    "frequency": "High",
                    "correlation": "Affects not only job performance but overall health and well-being.",
                    "significance": "Highlights the need for comprehensive solutions addressing both physical and emotional well-being."
                }
            ]
        },
        {
            "title": "Failed Solutions Analysis",
            "icon": "FaTimesCircle",
            "insights": [
                {
                    "title": "Wearing Unsuitable Shoes",
                    "evidence": "\"I used to wear those fancy nurse shoes that were supposed to be comfortable, but they ended up causing more pain. The heels were too high, and the soles were too thin. I had to switch to running shoes, which have been a game-changer for my feet.\"",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/foot_pain_solutions_for_nurses/",
                    "engagement_metrics": "100 upvotes, 20 comments",
                    "frequency": "Commonly mentioned in discussions about foot pain.",
                    "correlation": "Many nurses reported that their initial choice of shoes was based on aesthetics rather than functionality, leading to increased foot pain.",
                    "significance": "Wearing unsuitable shoes can lead to chronic foot pain and discomfort, affecting nurses' ability to perform their duties effectively."
                },
                {
                    "title": "Soft Orthotics: A Misguided Solution",
                    "evidence": "\"I tried using those soft, squishy orthotics thinking they would provide some relief, but they ended up making my feet feel worse. They were too forgiving and didn't provide the support my feet needed.\"",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/foot_pain_solutions_for_nurses/",
                    "engagement_metrics": "50 upvotes, 10 comments",
                    "frequency": "Frequently mentioned as a failed solution.",
                    "correlation": "Nurses often seek quick fixes without considering the specific needs of their feet, leading to ineffective treatments.",
                    "significance": "Soft orthotics can fail to address the structural issues in the feet, exacerbating pain and discomfort."
                },
                {
                    "title": "Neglecting Foot Exercises",
                    "evidence": "\"I know I should be doing more foot exercises, but it's hard to find the time. I've been trying to stretch more, but it's not a priority for me right now.\"",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/foot_pain_solutions_for_nurses/",
                    "engagement_metrics": "80 upvotes, 15 comments",
                    "frequency": "Commonly discussed as a missed opportunity for prevention.",
                    "correlation": "Nurses often prioritize patient care over their own self-care, leading to neglect of preventive measures like foot exercises.",
                    "significance": "Regular foot exercises can significantly reduce the risk of foot pain and improve overall foot health."
                },
                {
                    "title": "Overreliance on Creams and Gels",
                    "evidence": "\"I've tried so many creams and gels thinking they would fix my foot pain, but nothing seems to work. It's like they just mask the problem without addressing the root cause.\"",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/foot_pain_solutions_for_nurses/",
                    "engagement_metrics": "120 upvotes, 25 comments",
                    "frequency": "Frequently mentioned as a temporary solution that fails to provide lasting relief.",
                    "correlation": "Nurses often seek quick fixes like creams and gels, which may provide temporary relief but do not address the underlying issues.",
                    "significance": "Overreliance on creams and gels can lead to wasted time and resources, as well as continued discomfort."
                },
                {
                    "title": "Lack of Knowledge About Foot Care",
                    "evidence": "\"I didn't know much about foot care until I started experiencing severe pain. Now I realize how important it is to wear the right shoes and take care of my feet.\"",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/foot_pain_solutions_for_nurses/",
                    "engagement_metrics": "150 upvotes, 30 comments",
                    "frequency": "Commonly discussed as a knowledge gap.",
                    "correlation": "Nurses often lack education on proper foot care, leading to poor choices and increased risk of foot problems.",
                    "significance": "Educating nurses about proper foot care can significantly reduce the incidence of foot pain and related issues."
                }
            ]
        },
        {
            "title": "Question & Advice Mapping",
            "icon": "FaQuestionCircle",
            "insights": [
                {
                    "title": "Most Frequently Asked Question About Foot Pain Causes",
                    "evidence": "I've been a nurse for 10 years and I'm constantly on my feet. What can I do to prevent foot pain?",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "200 upvotes, 50 comments",
                    "frequency": "High",
                    "correlation": "Related to discussions about preventive measures and occupational health.",
                    "significance": "Understanding the causes is crucial for developing effective prevention strategies."
                },
                {
                    "title": "Most Frequently Asked Question About Best Shoes for Nurses",
                    "evidence": "What are the best shoes for nurses? I'm looking for something that will reduce my foot pain after long shifts.",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "300 upvotes, 75 comments",
                    "frequency": "Very High",
                    "correlation": "Often discussed alongside preventive measures and occupational health.",
                    "significance": "Proper footwear is essential for reducing foot pain and preventing musculoskeletal disorders."
                },
                {
                    "title": "Most Upvoted Advice for Wearing Proper Footwear",
                    "evidence": "Invest in good quality nursing shoes with proper arch support and cushioning. It makes a huge difference in reducing foot pain.",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "500 upvotes, 150 comments",
                    "frequency": "Very High",
                    "correlation": "Directly related to the most frequently asked questions about footwear.",
                    "significance": "Proper footwear is a critical preventive measure for reducing foot pain and preventing musculoskeletal disorders."
                },
                {
                    "title": "Most Debated Solution for Minimally Invasive Bunion Surgery",
                    "evidence": "I had minimally invasive bunion surgery and it was a game-changer. I was back on my feet in no time.",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "400 upvotes, 100 comments",
                    "frequency": "High",
                    "correlation": "Often mentioned alongside success stories and preventive measures.",
                    "significance": "Minimally invasive surgery can be an effective solution for severe foot pain, but it is not a preventive measure."
                },
                {
                    "title": "Most Repeated Recommendation for Stretching and Exercise",
                    "evidence": "Make sure to stretch your feet and legs after long shifts. It helps reduce pain and improves circulation.",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "300 upvotes, 75 comments",
                    "frequency": "Very High",
                    "correlation": "Directly related to preventive measures and occupational health.",
                    "significance": "Regular stretching and exercise are essential for maintaining foot health and reducing pain."
                },
                {
                    "title": "Success Story for Minimally Invasive Bunion Surgery",
                    "evidence": "I had minimally invasive bunion surgery and was back on my feet in just a few days. It was a huge relief.",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "400 upvotes, 100 comments",
                    "frequency": "High",
                    "correlation": "Often mentioned alongside preventive measures and debated solutions.",
                    "significance": "Minimally invasive surgery can be an effective solution for severe foot pain, offering quick recovery times and reduced pain."
                },
                {
                    "title": "Failure Pattern Due to Inadequate Footwear",
                    "evidence": "I thought my shoes were fine, but they ended up causing more pain. I wish I had invested in better shoes earlier.",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/12q4j6/foot_pain_prevention/",
                    "engagement_metrics": "200 upvotes, 50 comments",
                    "frequency": "High",
                    "correlation": "Directly related to the most frequently asked questions about footwear.",
                    "significance": "Inadequate footwear can lead to persistent foot pain and musculoskeletal disorders, emphasizing the importance of proper footwear."
                }
            ]
        },
        {
            "title": "Pattern Detection",
            "icon": "FaChartLine",
            "insights": [
                {
                    "title": "Gender Differences in Foot Pain",
                    "evidence": "\"As a female nurse, I experience more knee pain, while my male colleagues have more ankle pain. It's interesting to see these differences.\" - u/FemaleNurse (Reddit)",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/nurse_foot_pain/",
                    "engagement_metrics": "50 upvotes, 10 comments",
                    "frequency": "Moderate",
                    "correlation": "Discussed in the context of musculoskeletal disorders and workplace ergonomics.",
                    "significance": "Tailoring interventions to specific gender groups can improve support for nurses."
                },
                {
                    "title": "Secondary Effects of Poor Footwear",
                    "evidence": "\"I used to wear cheap shoes, and I got fungal infections and dry skin. Now I invest in good shoes, and my feet are much better.\" - u/NurseFootCare (Reddit)",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/nurse_foot_pain/",
                    "engagement_metrics": "100 upvotes, 15 comments",
                    "frequency": "Moderate",
                    "correlation": "Discussed alongside common causes of foot pain and shoe recommendations.",
                    "significance": "Prioritizing comprehensive foot care can prevent more severe issues."
                },
                {
                    "title": "Counter-Intuitive Success Patterns with Breaks",
                    "evidence": "\"I take short breaks every hour to stretch my feet and legs. It really helps reduce the pain and fatigue.\" - u/NurseSelfCare (Reddit)",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/nurse_foot_pain/",
                    "engagement_metrics": "75 upvotes, 10 comments",
                    "frequency": "Moderate",
                    "correlation": "Discussed alongside treatment options and workplace ergonomics.",
                    "significance": "Regular breaks and stretching can significantly reduce foot and ankle disorders."
                },
                {
                    "title": "Unexpected Relationship Between Standing and Pain",
                    "evidence": "\"Standing for long periods is a major contributor to my foot and ankle pain. It's not just about the shoes; it's about the environment.\" - u/NurseOccupationalHealth (Reddit)",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/nurse_foot_pain/",
                    "engagement_metrics": "50 upvotes, 5 comments",
                    "frequency": "Low",
                    "correlation": "Mentioned alongside common causes of foot pain and workplace ergonomics.",
                    "significance": "Acknowledging occupational risk factors helps advocate for better conditions."
                },
                {
                    "title": "Non-Obvious Correlation with Mental Health",
                    "evidence": "\"My foot pain has been affecting my mental health. I feel more stressed and anxious when I'm in pain.\" - u/NurseMentalHealth (Reddit)",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/nurse_foot_pain/",
                    "engagement_metrics": "25 upvotes, 3 comments",
                    "frequency": "Low",
                    "correlation": "Discussed alongside treatment options and workplace ergonomics.",
                    "significance": "Impacts of foot pain on mental health can prompt comprehensive care."
                },
                {
                    "title": "Unexpected Job Satisfaction Relationship",
                    "evidence": "\"My foot pain has been affecting my job satisfaction. I feel less able to do my job when I'm in pain.\" - u/NurseJobSatisfaction (Reddit)",
                    "query": "nurse foot pain",
                    "source_url": "https://www.reddit.com/r/nursing/comments/123456/nurse_foot_pain/",
                    "engagement_metrics": "5 upvotes, 1 comment",
                    "frequency": "Low",
                    "correlation": "Related to treatment options and workplace ergonomics.",
                    "significance": "Recognizing how foot pain affects job satisfaction can lead to improved conditions."
                }
            ]
        },
        {
            "title": "Popular Products Analysis",
            "icon": "FaShoppingCart",
            "insights": [
                {
                    "title": "Aspercreme Lidocaine Pain Relief Cream",
                    "platform": "Amazon, eBay, Google Shopping",
                    "query": "nurse foot pain",
                    "price_range": "$10-$20",
                    "positive_feedback": [
                        "Effective Pain Relief",
                        "Moisturizing Properties",
                        "Easy to Use",
                        "Non-Irritating"
                    ],
                    "negative_feedback": [
                        "Temporary Relief",
                        "Not Suitable for All Conditions"
                    ],
                    "market_gap": "Combination Products that offer long-lasting hydration and support for plantar fasciitis",
                    "source_url": "https://www.aspercreme.com/en-us/products/cream/lidocaine-foot-pain-relief-cream",
                    "engagement_metrics": "Reviews: 4.5/5 on Amazon, 4.5/5 on eBay; Ratings: 4.5/5 on Amazon, 4.5/5 on eBay",
                    "frequency": "High frequency in discussions about foot pain relief",
                    "correlation": "Correlates with other lidocaine-based creams but lacks hydration support",
                    "significance": "Highly recommended for minor to moderate foot pain"
                }
            ]
        }
    ],
    "avatars": [
        {
            "name": "Nurse with Chronic Foot Pain",
            "type": "Healthcare",
            "insights": [
                {
                    "title": "Key Characteristics",
                    "description": "An experienced nurse aged 35-55, struggling with chronic foot pain due to long hours of standing and walking. Often seeks effective pain relief options and shares experiences with peers.",
                    "evidence": "\"I've tried everything from ice packs to orthotics, but nothing seems to work.\" (Source: r/nursing)",
                    "query": "nurse foot pain",
                    "needs": [
                        "Effective pain relief solutions",
                        "Personalized medical advice",
                        "Time-efficient treatments"
                    ],
                    "pain_points": [
                        "Chronic foot pain",
                        "Limited time for self-care",
                        "Concerns about medication side effects"
                    ],
                    "behaviors": [
                        "Researching online for pain relief",
                        "Engaging in nursing forums",
                        "Using pain relief creams regularly"
                    ]
                }
            ]
        },
        {
            "name": "Health-Conscious Individual",
            "type": "Natural Health Advocate",
            "insights": [
                {
                    "title": "Key Characteristics",
                    "description": "Aged 25-45, this individual is focused on health and wellness, preferring natural treatments over chemical solutions. They actively seek advice on organic products.",
                    "evidence": "\"I'm really hesitant to use anything with chemicals. I'd rather try something natural first\" (Source: r/naturalhealth)",
                    "query": "nurse foot pain",
                    "needs": [
                        "Natural and organic solutions",
                        "Budget-friendly treatments",
                        "Reliable product information"
                    ],
                    "pain_points": [
                        "Concerns about chemical-based treatments",
                        "Limited knowledge of natural remedies",
                        "Budget constraints"
                    ],
                    "behaviors": [
                        "Researching natural treatments online",
                        "Engaging with health-related social media",
                        "Seeking peer recommendations"
                    ]
                }
            ]
        },
        {
            "name": "Retiree with Chronic Pain",
            "type": "Elderly Pain Sufferer",
            "insights": [
                {
                    "title": "Key Characteristics",
                    "description": "Typically aged 60-80, this retiree faces chronic pain due to age-related conditions and expresses concerns about treatment affordability and side effects.",
                    "evidence": "\"I'm not sure if I can afford the latest creams and ointments.\" (Source: r/chronicpain)",
                    "query": "nurse foot pain",
                    "needs": [
                        "Affordable pain relief options",
                        "Safe treatments with minimal side effects",
                        "Support for chronic pain management"
                    ],
                    "pain_points": [
                        "Chronic age-related pain",
                        "Financial constraints",
                        "Limited mobility for treatments"
                    ],
                    "behaviors": [
                        "Using pain relief creams",
                        "Seeking advice from healthcare professionals",
                        "Engaging in chronic pain support groups"
                    ]
                }
            ]
        },
        {
            "name": "Athlete with Acute Injury",
            "type": "Active Recoverer",
            "insights": [
                {
                    "title": "Key Characteristics",
                    "description": "Aged 18-40, this athlete needs rapid recovery from acute injuries to maintain performance levels, prioritizing quick and safe treatment options.",
                    "evidence": "\"I need something that will help me recover fast so I can get back to training\" (Source: r/sportsmedicine)",
                    "query": "nurse foot pain",
                    "needs": [
                        "Fast-acting treatment options",
                        "Effective pain management",
                        "Endorsements from sports professionals"
                    ],
                    "pain_points": [
                        "Acute injury pain",
                        "Need for quick recovery",
                        "Performance concerns with treatments"
                    ],
                    "behaviors": [
                        "Consulting sports medicine professionals",
                        "Researching injury treatments online",
                        "Sharing recovery experiences with teammates"
                    ]
                }
            ]
        }
    ]
};

const DEFAULT_SECTIONS = [
    {
        title: "Pain & Frustration Analysis",
        icon: "FaExclamationCircle",
        insights: []
    },
    {
        title: "Question & Advice Mapping",
        icon: "FaQuestionCircle",
        insights: []
    },
    {
        title: "Pattern Detection",
        icon: "FaChartLine",
        insights: []
    },
    {
        title: "Popular Products Analysis",
        icon: "FaShoppingCart",
        insights: []
    },
    {
        title: "User Avatars",
        icon: "FaUserCircle",
        insights: []
    }
];

export default function ResearchHub() {
    const { projectId } = useParams();
    const { projects, fetchProjects } = useProjectStore();
    const currentProject = projects.find(p => p.id === projectId);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [error, setError] = useState(null);
    const [insights, setInsights] = useState([]); // Start with empty array
    const [avatars, setAvatars] = useState([]);
    const [perplexityResponse, setPerplexityResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [queries, setQueries] = useState([]);
    const [topicKeyword, setTopicKeyword] = useState('');
    const [sourceUrls, setSourceUrls] = useState('');
    const [productUrls, setProductUrls] = useState('');
    const [useOnlySpecifiedSources, setUseOnlySpecifiedSources] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [userQuery, setUserQuery] = useState('');
    const [enrichedTopic, setEnrichedTopic] = useState('');
    const toast = useToast();
    const { user } = useAuthStore();
    const [availableQueries, setAvailableQueries] = useState([]);
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState({
        painAnalysis: [],
        questionAdvice: [],
        productAnalysis: [],
        patternDetection: [],
        avatars: []
    });

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        const fetchAllAnalysis = async () => {
            try {
                setIsLoading(true);

                // Fetch all analysis types in parallel
                const [
                    painResponse,
                    questionResponse,
                    productResponse,
                    patternResponse,
                    avatarResponse
                ] = await Promise.all([
                    api.get(`/research-hub/Pain & Frustration Analysis/project/${projectId}`),
                    api.get(`/research-hub/Question & Advice Mapping/project/${projectId}`),
                    api.get(`/research-hub/Popular Products Analysis/project/${projectId}`),
                    api.get(`/research-hub/Pattern Detection/project/${projectId}`),
                    api.get(`/research-hub/Avatars/project/${projectId}`)
                ]);

                // Extract insights from each response
                const extractInsights = (response) => {
                    const data = response.data || [];
                    return data.flatMap(analysis => analysis.insights || []);
                };

                // Special handling for avatars since they have a different structure
                const extractAvatars = (response) => {
                    const data = response.data || [];
                    return data.flatMap(analysis => {
                        if (analysis.insights && Array.isArray(analysis.insights)) {
                            return analysis.insights.map(avatarInsight => {
                                const sections = avatarInsight.insights || [];
                                const mainSection = sections[0] || {};
                                return {
                                    query: avatarInsight.query || '',
                                    name: avatarInsight.name || '',
                                    type: avatarInsight.type || '',
                                    description: mainSection.description || '',
                                    evidence: mainSection.evidence || '',
                                    needs: mainSection.needs || [],
                                    pain_points: mainSection.pain_points || [],
                                    behaviors: mainSection.behaviors || [],
                                    sections
                                };
                            });
                        }
                        return [];
                    });
                };

                setAnalysisData({
                    painAnalysis: extractInsights(painResponse),
                    questionAdvice: extractInsights(questionResponse),
                    productAnalysis: extractInsights(productResponse),
                    patternDetection: extractInsights(patternResponse),
                    avatars: extractAvatars(avatarResponse)
                });

            } catch (error) {
                console.error('Error fetching analysis data:', error);
                toast({
                    title: 'Error fetching analysis data',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchAllAnalysis();
        }
    }, [projectId, toast]);

    const sections = useMemo(() => [
        {
            title: "Pain & Frustration Analysis",
            icon: "FaExclamationCircle",
            insights: analysisData.painAnalysis
        },
        {
            title: "Question & Advice Mapping",
            icon: "FaQuestionCircle",
            insights: analysisData.questionAdvice
        },
        {
            title: "Popular Products Analysis",
            icon: "FaShoppingCart",
            insights: analysisData.productAnalysis
        },
        {
            title: "Pattern Detection",
            icon: "FaChartLine",
            insights: analysisData.patternDetection
        },
        {
            title: "User Avatars",
            icon: "FaUserCircle",
            insights: analysisData.avatars
        }
    ], [analysisData]);

    // Fetch initial insights
    useEffect(() => {
        const fetchInitialInsights = async () => {
            if (!projectId || !user?.id) return;

            try {
                // First fetch available queries
                const queries = await getProjectQueries(projectId);
                setAvailableQueries(queries || []); // Store available queries in state

                // Then fetch insights (either filtered by query or all)
                const insightsEndpoint = selectedQuery
                    ? `research-hub/${projectId}/insights?query=${encodeURIComponent(selectedQuery)}`
                    : `research-hub/${projectId}/insights`;

                const response = await api.get(insightsEndpoint);
                if (response.data) {
                    setSections(prevSections => {
                        return prevSections.map(section => {
                            const analysisType = Object.entries(response.data).find(([type]) =>
                                type === section.title
                            );

                            if (analysisType) {
                                const [_, analysisResponse] = analysisType;
                                return {
                                    ...section,
                                    insights: analysisResponse.insights || []
                                };
                            }
                            return section;
                        });
                    });
                }
            } catch (error) {
                // Only log the error, don't modify the insights state
                if (error.response?.status !== 404) {
                    console.error("Error fetching initial insights:", error);
                }
            }
        }

        fetchInitialInsights();
    }, [projectId, user?.id, selectedQuery]);

    // Delete insights by query
    const handleDeleteInsights = useCallback((query = null) => {
        if (!query) {
            // Delete all insights
            setInsights([]);
            setAvatars([]);
            setSelectedQuery(null);
            toast({
                title: "All insights deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            // Delete insights for specific query
            const updatedInsights = insights.map(section => ({
                ...section,
                insights: section.insights?.filter(insight => insight.query !== query) || []
            })).filter(section => section.insights.length > 0);

            setInsights(updatedInsights);
            setSelectedQuery(null);
            toast({
                title: `Insights for query "${query}" deleted`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [insights, toast]);

    // Filter insights based on selected query
    const filteredInsights = useMemo(() => {
        if (!selectedQuery) {
            // When no query is selected (All Queries), return all sections with all insights
            return insights.map(section => ({
                ...section,
                insights: section.insights || []
            })).filter(section => section.insights.length > 0);
        }

        // When a specific query is selected, filter insights
        return insights.map(section => ({
            ...section,
            insights: section.insights?.filter(insight =>
                insight.query && insight.query.toLowerCase() === selectedQuery.toLowerCase()
            ) || []
        })).filter(section => section.insights.length > 0);
    }, [insights, selectedQuery]);

    // Filter avatars based on selected query
    const filteredAvatars = useMemo(() => {
        if (!selectedQuery) {
            // When no query is selected (All Queries), return all avatars with all insights
            return avatars.map(avatar => ({
                ...avatar,
                insights: avatar.insights || []
            })).filter(avatar => avatar.insights.length > 0);
        }

        // When a specific query is selected, filter avatars
        return avatars.map(avatar => ({
            ...avatar,
            insights: avatar.insights?.filter(insight =>
                insight.query && insight.query.toLowerCase() === selectedQuery.toLowerCase()
            ) || []
        })).filter(avatar => avatar.insights.length > 0);
    }, [avatars, selectedQuery]);

    const handleAddQuery = () => {
        if (!query.trim()) {
            toast({
                title: "Query is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setQueries([...queries, query.trim()]);
        setQuery('');
    };

    const handleGenerateWithAI = async () => {
        if (!currentProject) {
            toast({
                title: "No project found",
                description: "Could not find the current project",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!currentProject.description && !currentProject.project?.description) {
            toast({
                title: "No project description",
                description: "Please add a description to your project",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const description = currentProject.description || currentProject.project?.description;
        setIsLoading(true);
        try {
            const response = await api.post('ai/generate-query', {
                description: description
            });

            if (response.data.query) {
                setUserQuery(response.data.query);
                toast({
                    title: "Query Generated",
                    description: "AI has generated a query for you",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate query with AI",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateInsights = async () => {
        if (!userQuery) {
            toast({
                title: "Error",
                description: "Please enter a query.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        onClose();

        try {
            if (!user) {
                throw new Error('User not authenticated');
            }
            if (!projectId) {
                throw new Error('Project ID is required');
            }

            const projectDescription = currentProject.description || currentProject.project?.description;
            const enrichedTopic = `${userQuery} (Project Context: ${projectDescription})`;

            // Base request payload
            const basePayload = {
                topic_keyword: enrichedTopic,
                user_query: userQuery,
                source_urls: [],
                product_urls: [],
                project_id: projectId,
                user_id: user.id,
                use_only_specified_sources: false
            };

            // Call analyze endpoint for each analysis type
            const analysisTypes = [
                'Pain & Frustration Analysis',
                'Question & Advice Mapping',
                'Pattern Detection',
                'Popular Products Analysis',
                'Avatars'
            ];

            // Call each analysis endpoint sequentially
            for (const analysisType of analysisTypes) {
                await api.post(`research-hub/${encodeURIComponent(analysisType)}/analyze`, basePayload);
            }

            setIsLoading(false);
            toast({
                title: "Analysis Started",
                description: "Successfully started analysis for all types.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            console.error("Error starting analysis:", error);
            setError(error.message || "Failed to start analysis. Please try again.");
            setIsLoading(false);
            toast({
                title: "Error",
                description: error.message || "Failed to start analysis. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const ResearchFocusOption = ({ title, description, isSelected, onClick }) => (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            bg={isSelected ? "purple.50" : "white"}
            borderColor={isSelected ? "purple.500" : "gray.200"}
            onClick={onClick}
            _hover={{ borderColor: "purple.500" }}
            transition="all 0.2s"
        >
            <Text fontWeight="semibold">{title}</Text>
            <Text color="gray.600" fontSize="sm">{description}</Text>
        </Box>
    );

    const renderAvatarInsights = useCallback((avatar) => {
        console.log('Rendering avatar insights for:', avatar);
        return (
            <Box key={avatar.name} mb={4}>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {avatar.name}
                </Text>
                {avatar.insights && avatar.insights.map((insight, index) => {
                    console.log('Rendering insight:', insight);
                    return (

                        <Box key={index} p={4} bg="white" borderRadius="md" boxShadow="sm" mb={2}>
                            {(
                                <Badge colorScheme="purple" fontSize="sm" px={2} py={1} mb={2}>
                                    Query: {insight.query}
                                </Badge>
                            )}
                            <Text fontWeight="semibold" mb={2}>
                                {insight.title}
                            </Text>
                            <Text fontWeight="semibold" mb={2}>
                                {insight.title}
                            </Text>
                            <Text mb={2}>{insight.description}</Text>
                            <Text fontStyle="italic" color="gray.600" mb={2}>
                                Evidence: {insight.evidence}
                            </Text>
                            <Stack spacing={2}>
                                <Text fontWeight="medium">Needs:</Text>
                                <UnorderedList>
                                    {insight.needs.map((need, i) => (
                                        <ListItem key={i}>{need}</ListItem>
                                    ))}
                                </UnorderedList>
                                <Text fontWeight="medium">Pain Points:</Text>
                                <UnorderedList>
                                    {insight.pain_points.map((point, i) => (
                                        <ListItem key={i}>{point}</ListItem>
                                    ))}
                                </UnorderedList>
                                <Text fontWeight="medium">Behaviors:</Text>
                                <UnorderedList>
                                    {insight.behaviors.map((behavior, i) => (
                                        <ListItem key={i}>{behavior}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        );
    }, []);

    const renderSectionCard = (section) => {
        const getCardPath = (title) => {
            switch (title) {
                case "Pain & Frustration Analysis":
                    return "pain-analysis";
                case "Failed Solutions Analysis":
                    return "failed-solutions";
                case "Question & Advice Mapping":
                    return "question-advice";
                case "Pattern Detection":
                    return "pattern-detection";
                case "Popular Products Analysis":
                    return "product-analysis";
                case "User Avatars":
                    return "avatars";
                default:
                    return null;
            }
        };

        const getDescription = (title) => {
            switch (title) {
                case "Pain & Frustration Analysis":
                    return "Discover what frustrates your users and identify common pain points in their experience. Understand the challenges they face and how they affect their journey.";
                case "Question & Advice Mapping":
                    return "Map out the questions your community is asking and the advice they're sharing. Understand common concerns, knowledge gaps, and valuable solutions.";
                case "Popular Products Analysis":
                    return "Explore what products your community is talking about, their preferences, and market opportunities. Understand product sentiment and feature requests.";
                case "Pattern Detection":
                    return "Uncover trends and recurring themes in your community discussions. Identify emerging patterns, correlations, and significant behavioral trends.";
                case "User Avatars":
                    return "Build detailed user personas based on your community's behavior patterns. Understand user types, their needs, pain points, and common behaviors.";
                default:
                    return "";
            }
        };

        const path = getCardPath(section.title);
        if (!path) return null;

        const hasInsights = section.insights?.length > 0;
        const isAvatarSection = section.title === "User Avatars";

        return (
            <Card
                key={section.title}
                cursor="pointer"
                onClick={() => navigate(`/projects/${projectId}/research/${path}`)}
                _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                bg="white"
                _dark={{ bg: 'gray.700' }}
                height="fit-content"
                minH="200px"
            >
                <CardBody>
                    <VStack align="start" spacing={4} height="100%">
                        <HStack>
                            <Icon as={iconMap[section.icon] || FaLightbulb} color="purple.500" />
                            <Heading size="md">{section.title}</Heading>
                        </HStack>
                        <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm">
                            {getDescription(section.title)}
                        </Text>
                        {hasInsights ? (
                            <Text>
                                {isAvatarSection ? `${section.insights.length} avatars found` : `${section.insights.length} insights found`}
                            </Text>
                        ) : (
                            <Text color="gray.500">
                                {isAvatarSection ? "No avatars yet" : "No insights yet"}
                            </Text>
                        )}
                    </VStack>
                </CardBody>
            </Card>
        );
    };

    const filteredSections = useMemo(() => {
        if (!selectedQuery) {
            return sections;
        }

        return sections.map(section => ({
            ...section,
            insights: section.insights?.filter(insight =>
                insight.query === selectedQuery
            ) || []
        }));
    }, [sections, selectedQuery]);

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading>Research Hub</Heading>
                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                        Analyze community discussions and extract valuable insights
                    </Text>
                </Box>

                {/* Query Filter - Always visible */}
                <Box w="full" bg="white" p={4} borderRadius="lg" boxShadow="sm" _dark={{ bg: 'gray.700' }}>
                    <HStack spacing={4} align="center">
                        <Text fontWeight="medium" minW="fit-content">Filter by Query:</Text>
                        <Select
                            value={selectedQuery || ''}
                            onChange={(e) => setSelectedQuery(e.target.value || null)}
                            maxW="400px"
                            placeholder="All Queries"
                            isDisabled={availableQueries.length === 0}
                        >
                            {availableQueries.map((query) => (
                                <option key={query} value={query}>{query}</option>
                            ))}
                        </Select>
                        {selectedQuery && (
                            <Button
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDeleteInsights(selectedQuery)}
                            >
                                Delete Query Results
                            </Button>
                        )}
                        {availableQueries.length === 0 && (
                            <Text fontSize="sm" color="gray.500">
                                No queries available yet
                            </Text>
                        )}
                    </HStack>
                </Box>

                {/* Query Input Section */}
                <Box>
                    <FormControl>
                        <FormLabel>Research Query</FormLabel>
                        <HStack spacing={4}>
                            <InputGroup>
                                <Input
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                    placeholder="Enter your research query..."
                                />
                            </InputGroup>
                            <Button
                                leftIcon={<FaMagic />}
                                onClick={handleGenerateWithAI}
                                isDisabled={isLoading}
                                variant="outline"
                                colorScheme="purple"
                            >
                                Generate with AI
                            </Button>
                        </HStack>
                    </FormControl>
                </Box>

                {/* Available Queries Section */}
                {availableQueries.length > 0 && (
                    <Box>
                        <Heading size="md" mb={4}>Available Queries</Heading>
                        <Wrap spacing={4}>
                            {availableQueries.map((q, index) => (
                                <WrapItem key={index}>
                                    <Badge
                                        p={2}
                                        borderRadius="md"
                                        colorScheme="purple"
                                        cursor="pointer"
                                        onClick={() => setUserQuery(q)}
                                    >
                                        {q}
                                    </Badge>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                )}

                {/* Generate Insights Button */}
                <Box>
                    <Button
                        colorScheme="purple"
                        onClick={handleGenerateInsights}
                        isDisabled={isLoading || !userQuery}
                        size="lg"
                        width={{ base: "full", md: "auto" }}
                    >
                        Generate Insights
                    </Button>
                </Box>

                {/* Insights Display */}
                <Box>
                    <Heading size="md" mb={6}>Analysis Results</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {filteredSections.map(renderSectionCard)}
                    </SimpleGrid>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert status="error" mt={4}>
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Back Button */}
                <Button
                    leftIcon={<FaArrowLeft />}
                    width="fit-content"
                    onClick={() => navigate(`/projects/${projectId}/research`)}
                >
                    Back to Research Hub
                </Button>
            </VStack>
        </Container>
    );
} 