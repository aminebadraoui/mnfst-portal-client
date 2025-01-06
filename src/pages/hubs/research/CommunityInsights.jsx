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
} from '@chakra-ui/react';
import { FaExclamationCircle, FaQuestionCircle, FaChartLine, FaLightbulb, FaMagic, FaUserCircle } from 'react-icons/fa';
import { api } from '../../../services/api';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useLoadingStore from '../../../store/loadingStore';
import useProjectStore from '../../../store/projectStore';

const iconMap = {
    FaExclamationCircle,
    FaQuestionCircle,
    FaChartLine,
    FaLightbulb
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

export default function CommunityInsights() {
    const { projectId } = useParams();
    const { projects, fetchProjects } = useProjectStore();
    const currentProject = projects.find(p => p.id === projectId);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [error, setError] = useState(null);
    const [insights, setInsights] = useState(mockData.sections); // Use mock data
    const [topicKeyword, setTopicKeyword] = useState('');
    const [sourceUrls, setSourceUrls] = useState('');
    const [productUrls, setProductUrls] = useState('');
    const [useOnlySpecifiedSources, setUseOnlySpecifiedSources] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const toast = useToast();
    const setLoading = useLoadingStore(state => state.setLoading);
    const isLoading = useLoadingStore(state => state.isLoading);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [queries, setQueries] = useState([]);
    const [avatars, setAvatars] = useState(mockData.avatars); // Use mock data
    const [perplexityResponse, setPerplexityResponse] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

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

    // Get unique queries from all insights
    const getUniqueQueries = useCallback(() => {
        const queries = new Set();
        insights.forEach(section => {
            section.insights?.forEach(insight => {
                if (insight.query) {
                    queries.add(insight.query);
                }
            });
        });
        return Array.from(queries);
    }, [insights]);

    // Filter insights based on selected query
    const filteredInsights = useMemo(() => {
        if (!selectedQuery) return insights;

        return insights.map(section => ({
            ...section,
            insights: section.insights?.filter(insight => insight.query === selectedQuery) || []
        })).filter(section => section.insights.length > 0);
    }, [insights, selectedQuery]);

    // Function to start polling for results
    const startPolling = useCallback((taskId) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`community-insights/${taskId}`);
                console.log('Raw response from API:', response.data);
                if (response.data.status === "processing") {
                    return; // Keep polling
                }

                // Store the raw Perplexity response
                setPerplexityResponse(response.data.raw_perplexity_response);
                console.log('Setting raw Perplexity response:', response.data.raw_perplexity_response);

                // Results are ready
                setInsights(response.data.sections || []);
                console.log('Setting insights:', response.data.sections);

                // Set avatars and log them
                const avatars = response.data.avatars || [];
                console.log('Setting avatars:', avatars);
                setAvatars(avatars);

                setLoading(false);
                clearInterval(interval);
                setPollingInterval(null);
                setTaskId(null);

                toast({
                    title: "Insights Generated",
                    description: "Successfully generated community insights.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

            } catch (error) {
                console.error("Error polling for results:", error);
                setError("Error fetching results. Please try again.");
                setLoading(false);
                clearInterval(interval);
                setPollingInterval(null);
                setTaskId(null);

                toast({
                    title: "Error",
                    description: "Failed to fetch results. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }, 2000); // Poll every 2 seconds

        setPollingInterval(interval);
    }, [toast, setLoading]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const handleAddQuery = (query) => {
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
        setTopicKeyword('');
    };

    const handleGenerateWithAI = async () => {
        console.log('Current project:', currentProject);
        console.log('Projects:', projects);
        console.log('Project ID:', projectId);

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
        setLoading(true, `Researching for "${description}"`);
        try {
            const response = await api.post('ai/generate-query', {
                description: description
            });

            if (response.data.query) {
                setTopicKeyword(response.data.query);
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
            setLoading(false);
        }
    };

    const handleGenerateInsights = async () => {
        if (!topicKeyword.trim()) {
            toast({
                title: "No query provided",
                description: "Please enter a query or generate one with AI",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

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

        const projectDescription = currentProject.description || currentProject.project?.description;
        if (!projectDescription) {
            toast({
                title: "No project description",
                description: "Please add a description to your project",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Store the original user query
        const userQuery = topicKeyword.trim();

        // Combine topic keyword with project description
        const enrichedTopic = `${userQuery} (Project Context: ${projectDescription})`;

        setLoading(true);
        setError(null);
        setInsights([]);
        setAvatars([]);
        onClose();

        // Use mock data if USE_MOCK_DATA is true
        const USE_MOCK_DATA = true; // Toggle this to switch between mock and real data

        if (USE_MOCK_DATA) {
            setTimeout(() => {
                setInsights(mockData.sections);
                setAvatars(mockData.avatars);
                setPerplexityResponse(JSON.stringify(mockData, null, 2));
                setLoading(false);

                toast({
                    title: "Insights Generated (Mock)",
                    description: "Successfully generated mock insights.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }, 1000);
            return;
        }

        try {
            const response = await api.post('community-insights', {
                topic_keyword: enrichedTopic,
                user_query: userQuery,
                persona: selectedPersona || null,
                source_urls: [],
                product_urls: []
            });

            if (response.data.task_id) {
                setTaskId(response.data.task_id);
                startPolling(response.data.task_id);

                toast({
                    title: "Processing Started",
                    description: "Generating insights... This may take a few minutes.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error('No task ID received');
            }
        } catch (error) {
            console.error("Error generating insights:", error);
            setError("Error generating insights. Please try again.");
            setLoading(false);
            toast({
                title: "Error",
                description: error.message || "Failed to generate insights. Please try again.",
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
                            {insight.query && (
                                <Badge colorScheme="purple" fontSize="sm" px={2} py={1} mb={2}>
                                    Query: {insight.query}
                                </Badge>
                            )}
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

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg">Community Insights</Heading>
                    <Button
                        colorScheme="purple"
                        onClick={onOpen}
                        isLoading={isLoading}
                    >
                        Generate Insights
                    </Button>
                </HStack>

                {insights.length === 0 && !isLoading ? (
                    <Box p={6} textAlign="center" bg="gray.50" borderRadius="md">
                        <Text>No insights generated yet. Click the button above to get started.</Text>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <VStack spacing={6} align="stretch">
                            {/* Query Filter and Delete Options */}
                            <HStack spacing={4} py={2} w="full" justify="space-between">
                                {/* Query Filter */}
                                <HStack spacing={4} overflowX="auto" flex={1}>
                                    <Badge
                                        colorScheme={!selectedQuery ? "purple" : "gray"}
                                        fontSize="sm"
                                        px={3}
                                        py={1}
                                        cursor="pointer"
                                        onClick={() => setSelectedQuery(null)}
                                        _hover={{ opacity: 0.8 }}
                                    >
                                        All Queries
                                    </Badge>
                                    {getUniqueQueries().map((query) => (
                                        <Badge
                                            key={query}
                                            colorScheme={selectedQuery === query ? "purple" : "gray"}
                                            fontSize="sm"
                                            px={3}
                                            py={1}
                                            cursor="pointer"
                                            onClick={() => setSelectedQuery(query)}
                                            _hover={{ opacity: 0.8 }}
                                        >
                                            {query}
                                        </Badge>
                                    ))}
                                </HStack>

                                {/* Delete Options */}
                                <HStack spacing={2}>
                                    {selectedQuery && (
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            onClick={() => handleDeleteInsights(selectedQuery)}
                                        >
                                            Delete Selected Query
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete all insights?')) {
                                                handleDeleteInsights();
                                            }
                                        }}
                                    >
                                        Delete All
                                    </Button>
                                </HStack>
                            </HStack>

                            {/* General Insights */}
                            <VStack spacing={6} w="full">
                                {filteredInsights.map((section, sectionIndex) => (
                                    <Box
                                        key={sectionIndex}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        p={4}
                                        bg="white"
                                        boxShadow="sm"
                                        position="relative"
                                        w="full"
                                    >
                                        <VStack align="stretch" spacing={4} w="full">
                                            <HStack
                                                bg="gray.50"
                                                p={3}
                                                borderRadius="md"
                                                position="sticky"
                                                top="0"
                                                zIndex="1"
                                            >
                                                <Icon
                                                    as={iconMap[section.icon] || FaLightbulb}
                                                    color="purple.500"
                                                    boxSize={5}
                                                />
                                                <Heading size="md">{section.title}</Heading>
                                                <Badge
                                                    colorScheme="purple"
                                                    ml="auto"
                                                    fontSize="sm"
                                                    px={2}
                                                >
                                                    {section.insights?.length || 0} insights
                                                </Badge>
                                            </HStack>

                                            <Box overflowX="auto" w="full">
                                                <HStack spacing={4} pb={2}>
                                                    {section.insights?.map((insight, insightIndex) => {
                                                        if (insight.platform || insight.positive_feedback || insight.negative_feedback) {
                                                            return (
                                                                <Box
                                                                    key={insightIndex}
                                                                    p={4}
                                                                    borderWidth="1px"
                                                                    borderRadius="md"
                                                                    _hover={{ bg: 'gray.50' }}
                                                                    transition="all 0.2s"
                                                                    minW="400px"
                                                                    maxW="400px"
                                                                >
                                                                    <VStack align="start" spacing={4} w="100%">
                                                                        {/* Query Badge */}
                                                                        <Badge
                                                                            colorScheme="purple"
                                                                            fontSize="sm"
                                                                            px={2}
                                                                            py={1}
                                                                        >
                                                                            QUERY: {insight.query || 'NURSE FOOT PAIN'}
                                                                        </Badge>

                                                                        {/* Platform */}
                                                                        <Text fontSize="md" color="gray.700">
                                                                            <strong>Platform:</strong> {insight.platform}
                                                                        </Text>

                                                                        {/* Price Range */}
                                                                        <Text fontSize="md" color="gray.700">
                                                                            <strong>Price Range:</strong> {insight.price_range}
                                                                        </Text>

                                                                        {/* Engagement */}
                                                                        <Text fontSize="md" color="gray.700">
                                                                            <strong>Engagement:</strong> {insight.engagement_metrics}
                                                                        </Text>

                                                                        {/* Correlation */}
                                                                        <Text fontSize="md" color="gray.700">
                                                                            <strong>Correlation:</strong> {insight.correlation}
                                                                        </Text>

                                                                        {/* Significance */}
                                                                        <Text fontSize="md" color="gray.700">
                                                                            <strong>Significance:</strong> {insight.significance}
                                                                        </Text>

                                                                        {/* Positive Feedback */}
                                                                        <Box w="100%">
                                                                            <Text fontSize="md" fontWeight="bold" color="green.600">
                                                                                Positive Feedback:
                                                                            </Text>
                                                                            <UnorderedList pl={4} mt={2}>
                                                                                {insight.positive_feedback?.map((point, idx) => (
                                                                                    <ListItem key={idx} fontSize="md">{point}</ListItem>
                                                                                ))}
                                                                            </UnorderedList>
                                                                        </Box>

                                                                        {/* Negative Feedback */}
                                                                        <Box w="100%">
                                                                            <Text fontSize="md" fontWeight="bold" color="red.600">
                                                                                Negative Feedback:
                                                                            </Text>
                                                                            <UnorderedList pl={4} mt={2}>
                                                                                {insight.negative_feedback?.map((point, idx) => (
                                                                                    <ListItem key={idx} fontSize="md">{point}</ListItem>
                                                                                ))}
                                                                            </UnorderedList>
                                                                        </Box>

                                                                        {/* Market Gap */}
                                                                        <Box w="100%">
                                                                            <Text fontSize="md" fontWeight="bold" color="purple.600">
                                                                                Market Gap:
                                                                            </Text>
                                                                            <Text fontSize="md" mt={2}>
                                                                                {insight.market_gap}
                                                                            </Text>
                                                                        </Box>
                                                                    </VStack>
                                                                </Box>
                                                            );
                                                        }
                                                        return (
                                                            <Box
                                                                key={insightIndex}
                                                                p={4}
                                                                borderWidth="1px"
                                                                borderRadius="md"
                                                                _hover={{ bg: 'gray.50' }}
                                                                transition="all 0.2s"
                                                                minW="400px"
                                                                maxW="400px"
                                                                height="500px"
                                                                display="flex"
                                                                flexDirection="column"
                                                            >
                                                                <VStack align="start" spacing={3} w="100%" height="100%">
                                                                    {/* Title and Tags Group */}
                                                                    <VStack align="start" spacing={1} w="100%">
                                                                        <Text
                                                                            fontWeight="semibold"
                                                                            fontSize="md"
                                                                            color="gray.700"
                                                                        >
                                                                            {insight.title}
                                                                        </Text>

                                                                        <HStack spacing={2} wrap="wrap" w="100%">
                                                                            {insight.frequency && (
                                                                                <Badge
                                                                                    colorScheme={
                                                                                        insight.frequency.toLowerCase() === 'high' ? 'green' :
                                                                                            insight.frequency.toLowerCase() === 'medium' ? 'yellow' :
                                                                                                'red'
                                                                                    }
                                                                                    fontSize="xs"
                                                                                    whiteSpace="normal"
                                                                                    wordBreak="break-word"
                                                                                >
                                                                                    {insight.frequency}
                                                                                </Badge>
                                                                            )}
                                                                            <Badge
                                                                                colorScheme="purple"
                                                                                fontSize="xs"
                                                                                whiteSpace="normal"
                                                                                wordBreak="break-word"
                                                                            >
                                                                                QUERY: {insight.query || 'NURSE FOOT PAIN'}
                                                                            </Badge>
                                                                        </HStack>
                                                                    </VStack>

                                                                    {insight.evidence && (
                                                                        <Box
                                                                            p={3}
                                                                            bg="gray.50"
                                                                            borderRadius="md"
                                                                            w="100%"
                                                                            fontSize="sm"
                                                                        >
                                                                            <Text fontStyle="italic" color="gray.700">
                                                                                "{insight.evidence}"
                                                                            </Text>
                                                                        </Box>
                                                                    )}

                                                                    <VStack align="start" spacing={2} w="100%" flex="1">
                                                                        {insight.engagement_metrics && (
                                                                            <Text fontSize="sm" color="gray.600">
                                                                                <strong>Engagement:</strong> {insight.engagement_metrics}
                                                                            </Text>
                                                                        )}
                                                                        {insight.correlation && (
                                                                            <Text fontSize="sm" color="gray.600">
                                                                                <strong>Correlation:</strong> {insight.correlation}
                                                                            </Text>
                                                                        )}
                                                                        {insight.significance && (
                                                                            <Text fontSize="sm" color="gray.600">
                                                                                <strong>Significance:</strong> {insight.significance}
                                                                            </Text>
                                                                        )}
                                                                    </VStack>
                                                                </VStack>
                                                            </Box>
                                                        );
                                                    })}
                                                </HStack>
                                            </Box>
                                        </VStack>
                                    </Box>
                                ))}
                            </VStack>

                            {/* Avatar Insights */}
                            {avatars.length > 0 && (
                                <Box
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={4}
                                    bg="white"
                                    boxShadow="sm"
                                    position="relative"
                                    w="full"
                                >
                                    <VStack align="stretch" spacing={4} w="full">
                                        <HStack
                                            bg="gray.50"
                                            p={3}
                                            borderRadius="md"
                                            position="sticky"
                                            top="0"
                                            zIndex="1"
                                        >
                                            <Icon
                                                as={FaUserCircle}
                                                color="purple.500"
                                                boxSize={5}
                                            />
                                            <Heading size="md">Avatar Insights</Heading>
                                            <Badge
                                                colorScheme="purple"
                                                ml="auto"
                                                fontSize="sm"
                                                px={2}
                                            >
                                                {avatars.length} avatars
                                            </Badge>
                                        </HStack>

                                        <Box overflowX="auto" w="full">
                                            <HStack spacing={4} pb={2}>
                                                {avatars.map((avatar) => (
                                                    <Box
                                                        key={avatar.name}
                                                        p={4}
                                                        borderWidth="1px"
                                                        borderRadius="md"
                                                        _hover={{ bg: 'gray.50' }}
                                                        transition="all 0.2s"
                                                        minW="400px"
                                                        maxW="400px"
                                                        display="flex"
                                                        flexDirection="column"
                                                    >
                                                        <VStack align="start" spacing={3} w="100%" height="100%">
                                                            {/* Title and Type */}
                                                            <VStack align="start" spacing={1} w="100%">
                                                                <Text
                                                                    fontWeight="semibold"
                                                                    fontSize="md"
                                                                    color="gray.700"
                                                                >
                                                                    {avatar.name}
                                                                </Text>
                                                                <Badge colorScheme="purple" fontSize="xs">
                                                                    {avatar.type}
                                                                </Badge>
                                                            </VStack>

                                                            {/* Avatar Insights */}
                                                            {avatar.insights?.map((insight, index) => (
                                                                <Box key={index} w="100%">
                                                                    <Text fontSize="sm" color="gray.600">
                                                                        {insight.description}
                                                                    </Text>

                                                                    <VStack align="start" spacing={3} mt={3}>
                                                                        <Box w="100%">
                                                                            <Text fontSize="sm" color="green.600" fontWeight="medium">
                                                                                Needs:
                                                                            </Text>
                                                                            <UnorderedList pl={4} fontSize="sm">
                                                                                {insight.needs.map((need, i) => (
                                                                                    <ListItem key={i}>{need}</ListItem>
                                                                                ))}
                                                                            </UnorderedList>
                                                                        </Box>
                                                                        <Box w="100%">
                                                                            <Text fontSize="sm" color="red.600" fontWeight="medium">
                                                                                Pain Points:
                                                                            </Text>
                                                                            <UnorderedList pl={4} fontSize="sm">
                                                                                {insight.pain_points.map((point, i) => (
                                                                                    <ListItem key={i}>{point}</ListItem>
                                                                                ))}
                                                                            </UnorderedList>
                                                                        </Box>
                                                                        <Box w="100%">
                                                                            <Text fontSize="sm" color="purple.600" fontWeight="medium">
                                                                                Behaviors:
                                                                            </Text>
                                                                            <UnorderedList pl={4} fontSize="sm">
                                                                                {insight.behaviors.map((behavior, i) => (
                                                                                    <ListItem key={i}>{behavior}</ListItem>
                                                                                ))}
                                                                            </UnorderedList>
                                                                        </Box>
                                                                    </VStack>
                                                                </Box>
                                                            ))}
                                                        </VStack>
                                                    </Box>
                                                ))}
                                            </HStack>
                                        </Box>
                                    </VStack>
                                </Box>
                            )}

                            {/* Debug box for raw response */}
                            {perplexityResponse && (
                                <Box mt={6} p={4} bg="gray.50" borderRadius="md">
                                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                                        Debug: Raw Response
                                    </Text>
                                    <Text whiteSpace="pre-wrap" fontSize="sm">
                                        {JSON.stringify(perplexityResponse, null, 2)}
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </Box>
                )}

                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Heading size="lg">Generate Insights</Heading>
                            <Text color="gray.600" fontSize="md" mt={1}>
                                Select avatars to generate targeted insights
                            </Text>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={6} align="stretch">
                                <Card variant="outline">
                                    <CardBody>
                                        <VStack spacing={4} align="stretch">
                                            <Heading size="md">Choose Your Research Focus</Heading>

                                            <ResearchFocusOption
                                                title="General Insights"
                                                description="Broad analysis without specific persona focus"
                                                isSelected={!selectedPersona}
                                                onClick={() => setSelectedPersona(null)}
                                            />

                                            <Box borderWidth="1px" borderStyle="dashed" borderRadius="md" p={4}>
                                                <VStack spacing={4} align="stretch">
                                                    <Text fontWeight="medium" color="gray.600">Persona-Based Research</Text>

                                                    <ResearchFocusOption
                                                        title="Active Senior with Chronic Pain"
                                                        description="Former hiker dealing with joint issues"
                                                        isSelected={selectedPersona === 'senior'}
                                                        onClick={() => setSelectedPersona('senior')}
                                                    />

                                                    <ResearchFocusOption
                                                        title="Young Professional with Sports Injury"
                                                        description="Recovering athlete seeking treatment"
                                                        isSelected={selectedPersona === 'athlete'}
                                                        onClick={() => setSelectedPersona('athlete')}
                                                    />
                                                </VStack>
                                            </Box>
                                        </VStack>
                                    </CardBody>
                                </Card>

                                <Card variant="outline">
                                    <CardBody>
                                        <VStack spacing={4} align="stretch">
                                            <Heading size="md">Enter Your Query</Heading>

                                            <InputGroup>
                                                <Textarea
                                                    value={topicKeyword}
                                                    onChange={(e) => setTopicKeyword(e.target.value)}
                                                    placeholder="Type your query here (e.g., 'joint pain management')"
                                                    resize="vertical"
                                                    minH="60px"
                                                    rows={2}
                                                />
                                            </InputGroup>

                                            <Button
                                                leftIcon={<Icon as={FaMagic} />}
                                                variant="outline"
                                                colorScheme="purple"
                                                width="100%"
                                                onClick={handleGenerateWithAI}
                                                isLoading={isLoading}
                                            >
                                                Generate with AI
                                            </Button>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="purple"
                                width="100%"
                                onClick={handleGenerateInsights}
                                isDisabled={!topicKeyword.trim()}
                            >
                                Generate Insights
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Debug Box */}
                <Box
                    mt={8}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="gray.50"
                    overflowX="auto"
                >
                    <Accordion allowToggle>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                        <Heading size="sm">Debug: Structured Response</Heading>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel>
                                <pre style={{ whiteSpace: 'pre-wrap' }}>
                                    {JSON.stringify({ status: 'completed', sections: insights, avatars }, null, 2)}
                                </pre>
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left">
                                        <Heading size="sm">Debug: Raw Perplexity Response</Heading>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel>
                                <pre style={{ whiteSpace: 'pre-wrap' }}>
                                    {perplexityResponse ? JSON.stringify(perplexityResponse, null, 2) : 'No raw response available'}
                                </pre>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Box>
            </VStack>
        </Container>
    );
} 