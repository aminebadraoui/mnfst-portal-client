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
import { FaLink, FaLightbulb, FaChartLine, FaTrash, FaChevronLeft } from 'react-icons/fa';
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
    const opportunitiesCount = research.market_analysis?.opportunities?.length || 0;
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
                    to={`/marketing-research/${research.id}`}
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
    const toast = useToast();
    const navigate = useNavigate();

    const loadResearches = async () => {
        try {
            const data = await listResearch();
            setResearches(data);
        } catch (error) {
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
                            onClick={() => navigate('/marketing-research')}
                        >
                            Back
                        </Button>
                    </HStack>
                    <Heading size="lg" mb={2}>Past Research</Heading>
                    <Text color="gray.600">
                        View and continue your previous marketing research analyses
                    </Text>
                </Box>

                {isLoading ? (
                    <Box textAlign="center" py={8}>
                        <Spinner size="xl" color="purple.500" />
                    </Box>
                ) : researches.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {researches.map((research) => (
                            <ResearchCard
                                key={research.id}
                                research={research}
                                onDelete={handleDelete}
                            />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Box
                        p={8}
                        textAlign="center"
                        borderWidth="1px"
                        borderRadius="lg"
                        borderStyle="dashed"
                    >
                        <VStack spacing={4}>
                            <Icon as={FaLink} boxSize={10} color="gray.400" />
                            <Text color="gray.500">No research entries found</Text>
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default ResearchList;
