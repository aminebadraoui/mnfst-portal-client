import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    useToast,
    Stack,
    Divider,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore from "../../../store/projectStore";
import { generateAdvertorials } from '../../../services/advertorialService';

const CreateAdvertorials = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const project = useProjectStore(state => state.projects.find(p => p.id === projectId));

    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        targetCustomer: '',
        customerProblem: '',
        specialOffer: '',
        guarantee: '',
        trafficSource: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await generateAdvertorials(projectId, formData);

            toast({
                title: "Success",
                description: "Your advertorials have been generated successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Navigate back to the ad script studio
            navigate(`/projects/${projectId}/content/ad-script-studio`);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate advertorials. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
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
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Create New Advertorials Set</Heading>
                    <Text color="gray.600">
                        Fill in the details below to generate story-based, informational, and value-based advertorials
                    </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={6}>
                        <FormControl isRequired>
                            <FormLabel>Product/Service Name</FormLabel>
                            <Input
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                placeholder="Enter the name of your product or service"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Product Description</FormLabel>
                            <Textarea
                                name="productDescription"
                                value={formData.productDescription}
                                onChange={handleInputChange}
                                placeholder="Describe your product and how it solves problems"
                                rows={4}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Target Customer</FormLabel>
                            <Textarea
                                name="targetCustomer"
                                value={formData.targetCustomer}
                                onChange={handleInputChange}
                                placeholder="Describe your ideal customer"
                                rows={3}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Customer Problem</FormLabel>
                            <Textarea
                                name="customerProblem"
                                value={formData.customerProblem}
                                onChange={handleInputChange}
                                placeholder="What problem does your customer face?"
                                rows={3}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Special Offer (if any)</FormLabel>
                            <Input
                                name="specialOffer"
                                value={formData.specialOffer}
                                onChange={handleInputChange}
                                placeholder="Enter any special offer or promotion"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Guarantee (if any)</FormLabel>
                            <Input
                                name="guarantee"
                                value={formData.guarantee}
                                onChange={handleInputChange}
                                placeholder="Enter your guarantee terms"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Traffic Source</FormLabel>
                            <Input
                                name="trafficSource"
                                value={formData.trafficSource}
                                onChange={handleInputChange}
                                placeholder="e.g., Facebook, Native Ads, etc."
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="green"
                            size="lg"
                            isLoading={isLoading}
                            loadingText="Generating..."
                        >
                            Generate Advertorials
                        </Button>
                    </Stack>
                </form>
            </VStack>
        </Container>
    );
};

export default CreateAdvertorials; 