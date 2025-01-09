import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Heading,
    Text,
    Button,
    VStack,
    useToast,
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
    useColorModeValue,
    Select,
    FormControl,
    FormLabel,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import ReactMarkdown from 'react-markdown';
import useProjectStore from "../../../store/projectStore";
import { generateAdvertorials, getAdvertorial, getAdvertorials, deleteAllAdvertorials } from "../../../services/advertorialService";
import { getProducts } from "../../../services/productService";
import '../../../styles/advertorials.css';

// Helper function to parse and format advertorial content
const parseAdvertorialContent = (advertorial) => {
    if (!advertorial?.content) return null;

    try {
        // If content is a string that looks like JSON, parse it
        if (typeof advertorial.content === 'string' && advertorial.content.trim().startsWith('{')) {
            const parsed = JSON.parse(advertorial.content);
            return parsed.content || parsed.Lead || null;
        }

        // If content is an object with a content field
        if (advertorial.content.content) {
            return advertorial.content.content;
        }

        // If content is already a string
        if (typeof advertorial.content === 'string') {
            return advertorial.content;
        }

        return null;
    } catch (error) {
        console.error('Error parsing advertorial content:', error);
        return null;
    }
};

export default function AdScripts() {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [advertorials, setAdvertorials] = useState({
        story: null,
        value: null,
        info: null,
    });
    const toast = useToast();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));

    // Theme-aware colors
    const boxBg = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(projectId);
                setProducts(data);
            } catch (error) {
                toast({
                    title: 'Error fetching products',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchProducts();
    }, [projectId]);

    useEffect(() => {
        const fetchExistingAdvertorials = async () => {
            if (!projectId) return;

            setLoading(true);
            try {
                const result = await getAdvertorials(projectId);
                if (result) {
                    setAdvertorials({
                        story: result.story_based,
                        value: result.value_based,
                        info: result.informational,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch existing advertorials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingAdvertorials();
    }, [projectId]);

    const handleProductSelect = (e) => {
        const product = products.find(p => p.id === e.target.value);
        setSelectedProduct(product);
    };

    const handleCreateNew = async () => {
        if (!project) {
            toast({
                title: "Error",
                description: "Project not found",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!selectedProduct) {
            toast({
                title: "Error",
                description: "Please select a product first",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await generateAdvertorials(projectId, {
                project_description: JSON.stringify(project),
                product_description: JSON.stringify(selectedProduct),
                product_id: selectedProduct.id
            });

            // Fetch all advertorials to get the updated list
            const updatedAdvertorials = await getAdvertorials(projectId);
            setAdvertorials({
                story: updatedAdvertorials.story_based,
                value: updatedAdvertorials.value_based,
                info: updatedAdvertorials.informational,
            });

            toast({
                title: "Success",
                description: "Advertorials generated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        if (!project) return;

        if (!window.confirm('Are you sure you want to delete all advertorials? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await deleteAllAdvertorials(projectId);
            setAdvertorials({
                story: [],
                value: [],
                info: [],
            });
            toast({
                title: "Success",
                description: "All advertorials deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!project) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text>Project not found</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Advertorials</Heading>
                <Text>Generate different types of advertorials for your project.</Text>

                {products.length === 0 ? (
                    <Alert status="warning">
                        <AlertIcon />
                        You need to create at least one product before generating advertorials.
                        Please go to the Products section to create a product first.
                    </Alert>
                ) : (
                    <Box>
                        <FormControl mb={4}>
                            <FormLabel>Select Product</FormLabel>
                            <Select
                                placeholder="Choose a product"
                                onChange={handleProductSelect}
                                value={selectedProduct?.id || ''}
                                isRequired
                            >
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            colorScheme="blue"
                            onClick={handleCreateNew}
                            isLoading={loading}
                            loadingText="Generating..."
                            isDisabled={!selectedProduct}
                            width="full"
                        >
                            Create New Advertorials Set
                        </Button>
                    </Box>
                )}

                {(advertorials.story?.length > 0 || advertorials.value?.length > 0 || advertorials.info?.length > 0) && (
                    <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={handleDeleteAll}
                        isLoading={loading}
                        loadingText="Deleting..."
                    >
                        Delete All Advertorials
                    </Button>
                )}

                {loading && !advertorials.story && !advertorials.value && !advertorials.info && (
                    <Box textAlign="center" py={8}>
                        <Spinner size="xl" />
                        <Text mt={4}>Loading advertorials...</Text>
                    </Box>
                )}

                {(advertorials.story || advertorials.value || advertorials.info) && (
                    <Box mt={4}>
                        <Heading size="md" mb={4}>Generated Advertorials:</Heading>
                        <Tabs variant="enclosed">
                            <TabList>
                                <Tab>Story-Based</Tab>
                                <Tab>Value-Based</Tab>
                                <Tab>Informational</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    {advertorials.story?.map((ad, index) => (
                                        <Box
                                            key={ad.id}
                                            bg={boxBg}
                                            borderRadius="xl"
                                            boxShadow="xl"
                                            overflow="hidden"
                                            mb={8}
                                        >
                                            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')}>
                                                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                                                    Generated on: {ad.created_at ? new Date(ad.created_at).toLocaleString() : 'Not yet generated'}
                                                </Text>
                                            </Box>
                                            <Box
                                                p={8}
                                                className="markdown-content"
                                            >
                                                <ReactMarkdown>{parseAdvertorialContent(ad)}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    ))}
                                </TabPanel>

                                <TabPanel>
                                    {advertorials.value?.map((ad, index) => (
                                        <Box
                                            key={ad.id}
                                            bg={boxBg}
                                            borderRadius="xl"
                                            boxShadow="xl"
                                            overflow="hidden"
                                            mb={8}
                                        >
                                            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')}>
                                                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                                                    Generated on: {ad.created_at ? new Date(ad.created_at).toLocaleString() : 'Not yet generated'}
                                                </Text>
                                            </Box>
                                            <Box
                                                p={8}
                                                className="markdown-content"
                                            >
                                                <ReactMarkdown>{parseAdvertorialContent(ad)}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    ))}
                                </TabPanel>

                                <TabPanel>
                                    {advertorials.info?.map((ad, index) => (
                                        <Box
                                            key={ad.id}
                                            bg={boxBg}
                                            borderRadius="xl"
                                            boxShadow="xl"
                                            overflow="hidden"
                                            mb={8}
                                        >
                                            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')}>
                                                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                                                    Generated on: {ad.created_at ? new Date(ad.created_at).toLocaleString() : 'Not yet generated'}
                                                </Text>
                                            </Box>
                                            <Box
                                                p={8}
                                                className="markdown-content"
                                            >
                                                <ReactMarkdown>{parseAdvertorialContent(ad)}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    ))}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                )}
            </VStack>
        </Container>
    );
} 