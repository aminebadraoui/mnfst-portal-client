import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Card,
    CardBody,
    Text,
    FormHelperText,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const Profile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        metaToken: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get('/users/me');
                const userData = response.data;
                setFormData({
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                    email: userData.email || '',
                    metaToken: userData.meta_token || '',
                });
            } catch (error) {
                toast({
                    title: 'Error loading profile',
                    description: error.response?.data?.detail || 'Failed to load profile',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e) => {
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
            await api.put('/users/me', {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                meta_token: formData.metaToken,
            });

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been updated successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Failed to update profile',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Profile Settings</Heading>
                    <Text color="gray.600">
                        Manage your personal information and Meta token
                    </Text>
                </Box>

                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6}>
                                <FormControl>
                                    <FormLabel>First Name</FormLabel>
                                    <Input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter your first name"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter your last name"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Meta Token</FormLabel>
                                    <Input
                                        name="metaToken"
                                        value={formData.metaToken}
                                        onChange={handleChange}
                                        placeholder="Enter your Meta token"
                                    />
                                    <FormHelperText>
                                        Your Meta token is used for accessing Meta's marketing APIs
                                    </FormHelperText>
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="purple"
                                    size="lg"
                                    width="full"
                                    isLoading={isLoading}
                                >
                                    Save Changes
                                </Button>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>
            </VStack>
        </Container>
    );
};

export default Profile; 