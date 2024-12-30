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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username: email,
                password: password
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
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
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
};

export default Login; 