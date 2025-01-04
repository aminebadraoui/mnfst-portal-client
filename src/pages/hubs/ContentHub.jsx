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
import { FaUserCircle, FaAd, FaHashtag, FaEnvelope } from 'react-icons/fa';
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

const ContentHub = () => {
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading mb={2}>Content Hub</Heading>
                    <Text color="gray.600">
                        Create and manage all your marketing content in one place
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FeatureCard
                        icon={FaUserCircle}
                        title="Avatars"
                        description="Create and manage AI-powered brand avatars for consistent communication"
                        to="./avatars"
                    />
                    <FeatureCard
                        icon={FaAd}
                        title="Ad Script Studio"
                        description="Create compelling ad scripts optimized for your target audience"
                        to="./ad-script-studio"
                    />
                    <FeatureCard
                        icon={FaHashtag}
                        title="Social Media Content Studio"
                        description="Design and schedule engaging social media content across platforms"
                        to="./social-media-studio"
                    />
                    <FeatureCard
                        icon={FaEnvelope}
                        title="Email Marketing Studio"
                        description="Craft personalized email campaigns that convert"
                        to="./email-studio"
                    />
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default ContentHub; 