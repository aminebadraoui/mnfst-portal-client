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
import { FaChartBar, FaChartLine, FaBullseye, FaLightbulb } from 'react-icons/fa';
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

const StrategyHub = () => {
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading mb={2}>Strategy Hub</Heading>
                    <Text color="gray.600">
                        Track, analyze, and optimize your marketing performance
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FeatureCard
                        icon={FaChartBar}
                        title="Performance Metrics"
                        description="Track key performance indicators across all marketing channels"
                        to="./metrics"
                    />
                    <FeatureCard
                        icon={FaChartLine}
                        title="Growth Analytics"
                        description="Analyze trends and identify growth opportunities"
                        to="./analytics"
                    />
                    <FeatureCard
                        icon={FaBullseye}
                        title="Goal Tracking"
                        description="Set and monitor marketing objectives and milestones"
                        to="./goals"
                    />
                    <FeatureCard
                        icon={FaLightbulb}
                        title="AI Insights"
                        description="Get AI-powered recommendations for strategy optimization"
                        to="./insights"
                    />
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default StrategyHub; 