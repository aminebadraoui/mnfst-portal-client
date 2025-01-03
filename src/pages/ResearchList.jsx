import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    Card,
    CardBody,
    Badge,
    Icon,
    HStack,
    Spinner,
    useToast,
    IconButton,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react';
import { FaLink, FaLightbulb, FaChartLine, FaTrash, FaChevronLeft, FaExclamationCircle } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { listResearch, deleteResearch } from '../services/researchService';

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    const cancelRef = useRef();

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Research
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? This action cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onConfirm}
                            ml={3}
                            isLoading={isDeleting}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

const ResearchCard = ({ research, onDelete }) => {
    const insightsCount = research.community_analysis?.insights?.length || 0;
    const opportunities = research.market_analysis?.opportunities || [];
    const opportunitiesCount = opportunities.length;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(research.id);
            onClose();
        } catch (error) {
            console.error('Error deleting research:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card
                position="relative"
                _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg',
                    borderColor: 'brand.500',
                }}
                transition="all 0.2s"
            >
                <IconButton
                    icon={<FaTrash />}
                    position="absolute"
                    top={2}
                    right={2}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={(e) => {
                        e.preventDefault();
                        onOpen();
                    }}
                />
                <CardBody
                    as={RouterLink}
                    to={`/community-insights/${research.id}`}
                    pt={12}
                >
                    <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                            <Text color="gray.500" fontSize="sm">
                                {new Date(research.created_at).toLocaleDateString()}
                            </Text>
                            <Badge colorScheme="purple">
                                {research.urls?.length || 0} URLs
                            </Badge>
                        </HStack>

                        <Box>
                            <Heading size="sm" mb={1}>{research.name || 'Untitled Research'}</Heading>
                            <Badge colorScheme="blue" mb={4}>{research.source || 'reddit'}</Badge>
                        </Box>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Box p={3} bg="green.50" borderRadius="md">
                                <VStack>
                                    <Icon as={FaLightbulb} color="green.500" />
                                    <Text fontSize="sm" fontWeight="bold" color="green.600">
                                        {insightsCount} Insights
                                    </Text>
                                </VStack>
                            </Box>
                            <Box p={3} bg="purple.50" borderRadius="md">
                                <VStack>
                                    <Icon as={FaChartLine} color="purple.500" />
                                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                        {opportunitiesCount} Opportunities
                                    </Text>
                                </VStack>
                            </Box>
                        </SimpleGrid>

                        {opportunities.length > 0 && (
                            <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                    Latest Opportunity:
                                </Text>
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                    {opportunities[0].opportunity}
                                </Text>
                            </Box>
                        )}

                        {research.urls && research.urls.length > 0 && (
                            <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={2}>
                                    Analyzed URLs:
                                </Text>
                                <VStack align="stretch" spacing={1}>
                                    {research.urls.slice(0, 2).map((url, index) => (
                                        <Text key={index} fontSize="xs" color="blue.500" isTruncated>
                                            {url}
                                        </Text>
                                    ))}
                                    {research.urls.length > 2 && (
                                        <Text fontSize="xs" color="gray.500">
                                            +{research.urls.length - 2} more
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </CardBody>
            </Card>
            <DeleteConfirmationDialog
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    );
};

const ResearchList = () => {
    const [researches, setResearches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const loadResearches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await listResearch();
            setResearches(data);
        } catch (error) {
            setError(error.message);
            toast({
                title: 'Error Loading Research',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadResearches();
    }, []);

    const handleDelete = async (researchId) => {
        try {
            await deleteResearch(researchId);
            toast({
                title: 'Research Deleted',
                description: 'Research has been deleted successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            await loadResearches(); // Reload the list
        } catch (error) {
            toast({
                title: 'Error Deleting Research',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <HStack justify="space-between" align="center" mb={4}>
                        <Button
                            leftIcon={<FaChevronLeft />}
                            variant="ghost"
                            onClick={() => navigate('/community-insights')}
                        >
                            Back
                        </Button>
                    </HStack>
                    <Heading size="lg" mb={2}>Past Research</Heading>
                    <Text color="gray.600">
                        View and continue your previous community insights analyses
                    </Text>
                </Box>

                {isLoading ? (
                    <Box textAlign="center" py={8}>
                        <Spinner size="xl" color="purple.500" thickness="4px" />
                        <Text mt={4} color="gray.600">Loading research...</Text>
                    </Box>
                ) : error ? (
                    <Box textAlign="center" py={8}>
                        <Icon as={FaExclamationCircle} boxSize={10} color="red.500" />
                        <Text mt={4} color="red.500" fontWeight="bold">Error loading research</Text>
                        <Text color="gray.600">{error}</Text>
                        <Button
                            mt={4}
                            colorScheme="purple"
                            onClick={loadResearches}
                        >
                            Try Again
                        </Button>
                    </Box>
                ) : researches.length === 0 ? (
                    <Box
                        textAlign="center"
                        py={8}
                        borderWidth="1px"
                        borderRadius="lg"
                        borderStyle="dashed"
                    >
                        <Icon as={FaLightbulb} boxSize={10} color="gray.400" />
                        <Text mt={4} fontWeight="bold">No Research Found</Text>
                        <Text color="gray.600">Start a new research analysis to get insights</Text>
                        <Button
                            as={RouterLink}
                            to="/community-insights/new"
                            colorScheme="purple"
                            mt={4}
                        >
                            Start New Research
                        </Button>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {researches.map((research) => (
                            <ResearchCard
                                key={research.id}
                                research={research}
                                onDelete={handleDelete}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </VStack>
        </Container>
    );
};

export default ResearchList;
