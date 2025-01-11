import React, { useState } from 'react';
import {
    Box,
    Input,
    Button,
    VStack,
    Text,
    useToast,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';

const DOCS_PASSWORD = 'mnfst2025'; // This is client-side only, not secure for sensitive data

const PasswordGate = ({ children }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [show, setShow] = useState(false);
    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === DOCS_PASSWORD) {
            setIsAuthenticated(true);
            // Store in session storage so it persists during the session
            sessionStorage.setItem('docs_authenticated', 'true');
        } else {
            toast({
                title: 'Invalid password',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Check session storage on component mount
    React.useEffect(() => {
        if (sessionStorage.getItem('docs_authenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    if (isAuthenticated) {
        return children;
    }

    return (
        <Box maxW="md" mx="auto" mt={20}>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <Text>Please enter the documentation password to continue</Text>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Button type="submit" colorScheme="blue">
                        Submit
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default PasswordGate; 