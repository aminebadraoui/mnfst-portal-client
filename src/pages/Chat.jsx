import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import Chat from '../components/Chat/Chat';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { projectId } = useParams();

    return (
        <Container maxW="container.xl" h="calc(100vh - 80px)" py={8}>
            <Box h="full">
                <Chat projectId={projectId} />
            </Box>
        </Container>
    );
};

export default ChatPage;