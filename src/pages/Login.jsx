import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast,
    Text,
    Link,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const setAuth = useAuthStore(state => state.setAuth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create URLSearchParams for form data
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.access_token) {
                setAuth(response.data.access_token, response.data.user);
                navigate('/dashboard');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Failed to login',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={8}>
            <VStack spacing={8}>
                <Heading>Login</Heading>
                <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="100%"
                                isLoading={isLoading}
                            >
                                Login
                            </Button>
                            <Text pt={2}>
                                Don't have an account?{' '}
                                <Link as={RouterLink} to="/register" color="blue.500">
                                    Register here
                                </Link>
                            </Text>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
};

export default Login; 