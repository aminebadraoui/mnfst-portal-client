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
import { FaSearch, FaChartLine } from 'react-icons/fa';
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

const ResearchHub = () => {
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading mb={2}>Research Hub</Heading>
                    <Text color="gray.600">
                        Analyze your market and competition to make data-driven decisions
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FeatureCard
                        icon={FaSearch}
                        title="Community Insights"
                        description="Understand your community's needs and preferences through advanced analytics"
                        to="./community-insights"
                    />
                    <FeatureCard
                        icon={FaChartLine}
                        title="Competition Intelligence"
                        description="Monitor and analyze your competitors' strategies and market position"
                        to="./competition-intelligence"
                    />
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default ResearchHub; 