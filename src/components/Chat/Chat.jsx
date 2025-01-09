import React, { useState } from 'react';
import {
    Box,
    VStack,
    Input,
    useColorModeValue,
    Container,
    Heading,
    HStack,
    IconButton,
    Card,
    CardBody,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import { api } from '../../services/api';

const Chat = ({ projectId }) => {
    const [message, setMessage] = useState('');
    const bg = useColorModeValue('white', '#141821');
    const cardBg = useColorModeValue('white', '#1E2533');
    const borderColor = useColorModeValue('gray.200', '#252D3D');

    const handleSend = async () => {
        if (message.trim()) {
            try {
                await api.post(`/chat/${projectId}/messages`, {
                    content: message,
                });
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            h="full"
            minH="calc(100vh - 80px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={bg}
            p={6}
        >
            <Card
                variant="outline"
                bg={cardBg}
                borderColor={borderColor}
                w="full"
                maxW="3xl"
            >
                <CardBody>
                    <VStack spacing={8} align="center" p={4}>
                        <Heading size="lg" textAlign="center">
                            What can I help you with?
                        </Heading>
                        <HStack spacing={2} w="full">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question here..."
                                size="lg"
                                bg={useColorModeValue('white', 'gray.700')}
                                borderColor={borderColor}
                                _hover={{
                                    borderColor: 'purple.500',
                                }}
                                _focus={{
                                    borderColor: 'purple.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                                }}
                            />
                            <IconButton
                                icon={<FaPaperPlane />}
                                colorScheme="purple"
                                size="lg"
                                onClick={handleSend}
                                isDisabled={!message.trim()}
                                aria-label="Send message"
                            />
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default Chat; 