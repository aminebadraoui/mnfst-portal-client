import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Icon,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaRobot, FaComments, FaUserFriends } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, to }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            as={RouterLink}
            to={to}
            p={6}
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'purple.500',
            }}
            transition="all 0.2s"
        >
            <VStack align="start" spacing={4}>
                <Icon as={icon} fontSize="24" color="purple.500" />
                <Box>
                    <Heading size="md" mb={2}>{title}</Heading>
                    <Text color="gray.600">{description}</Text>
                </Box>
            </VStack>
        </Box>
    );
};

const CommunicationHub = () => {
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading mb={2}>Communication Hub</Heading>
                    <Text color="gray.600">
                        Manage all your automated communication channels
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FeatureCard
                        icon={FaRobot}
                        title="AI Chatbots"
                        description="Deploy intelligent chatbots trained on your brand voice and knowledge"
                        to="./chatbots"
                    />
                    <FeatureCard
                        icon={FaComments}
                        title="Chat Flows"
                        description="Design and optimize conversation flows for better user engagement"
                        to="./chat-flows"
                    />
                    <FeatureCard
                        icon={FaUserFriends}
                        title="Customer Support"
                        description="Monitor and manage automated customer support interactions"
                        to="./support"
                    />
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default CommunicationHub; 