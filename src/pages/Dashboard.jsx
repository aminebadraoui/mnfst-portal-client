import React from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Text,
    VStack,
    Icon,
    Button,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const AgentCard = ({ title, description, icon, to }) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'purple.500',
            }}
            transition="all 0.2s"
        >
            <VStack align="stretch" spacing={4}>
                <Icon as={icon} fontSize="24" color="purple.500" />
                <Box>
                    <Heading size="md" mb={2}>{title}</Heading>
                    <Text color="gray.600">{description}</Text>
                </Box>
                <Button
                    as={RouterLink}
                    to={to}
                    colorScheme="purple"
                    variant="outline"
                    alignSelf="flex-start"
                >
                    Start
                </Button>
            </VStack>
        </Box>
    );
};

const Dashboard = () => {
    const agents = [
        {
            title: 'Community Insights Agent',
            description: 'Analyze websites and conversations to uncover community insights, customer feedback, and business opportunities.',
            icon: FaSearch,
            to: '/community-insights'
        }
    ];

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Welcome to Your AI Workspace</Heading>
                    <Text color="gray.600">
                        Choose an AI agent to help you discover market opportunities and grow your business.
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {agents.map((agent, index) => (
                        <AgentCard key={index} {...agent} />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default Dashboard; 