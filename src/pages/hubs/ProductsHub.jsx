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
import { FaBox, FaTools, FaList } from 'react-icons/fa';
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

const ProductsHub = () => {
    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading mb={2}>Products & Services Hub</Heading>
                    <Text color="gray.600">
                        Manage your products and services to create targeted advertorials
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FeatureCard
                        icon={FaBox}
                        title="Products"
                        description="Create and manage physical products with features, benefits, and pricing"
                        to="./products"
                    />
                    <FeatureCard
                        icon={FaTools}
                        title="Services"
                        description="Define and manage your service offerings with detailed descriptions"
                        to="./services"
                    />
                    <FeatureCard
                        icon={FaList}
                        title="All Products & Services"
                        description="View and manage all your products and services in one place"
                        to="./all"
                    />
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default ProductsHub; 