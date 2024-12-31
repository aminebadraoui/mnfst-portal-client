import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    Icon,
    SimpleGrid,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaHistory, FaPlus } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const WorkflowOption = ({ title, description, icon, to, isDisabled = false }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Box
            as={!isDisabled ? RouterLink : 'div'}
            to={to}
            p={8}
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            transition="all 0.3s"
            cursor={isDisabled ? 'not-allowed' : 'pointer'}
            opacity={isDisabled ? 0.7 : 1}
            position="relative"
            _hover={!isDisabled ? {
                transform: 'translateY(-4px)',
                shadow: 'lg',
                bg: hoverBg,
                borderColor: 'brand.500',
            } : {}}
        >
            <VStack spacing={6} align="center">
                <Icon
                    as={icon}
                    boxSize={12}
                    color="brand.500"
                />
                <VStack spacing={2} align="center">
                    <Heading size="md">{title}</Heading>
                    <Text color="gray.600" textAlign="center">
                        {description}
                    </Text>
                </VStack>
                {isDisabled && (
                    <Text
                        position="absolute"
                        top={4}
                        right={4}
                        bg="brand.500"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                    >
                        Coming Soon
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

const MarketingResearchWorkflows = () => {
    const options = [
        {
            title: 'Create New Research',
            description: 'Start a new marketing research analysis to uncover customer insights',
            icon: FaPlus,
            to: '/marketing-research/analyze',
        },
        {
            title: 'View Past Research',
            description: 'Access and review your previous marketing research analyses',
            icon: FaHistory,
            isDisabled: true,
        },
    ];

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Marketing Research</Heading>
                    <Text color="gray.600">
                        Choose whether to start a new research analysis or view your past research
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {options.map((option, index) => (
                        <WorkflowOption key={index} {...option} />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default MarketingResearchWorkflows; 