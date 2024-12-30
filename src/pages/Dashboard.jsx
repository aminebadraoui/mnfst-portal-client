import {
    Box,
    Grid,
    Heading,
    Text,
    useColorModeValue,
    Icon,
    VStack,
    Container,
} from '@chakra-ui/react'
import { FaSearchDollar, FaChartLine, FaRobot } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const AgentCard = ({ title, description, icon, to, isComingSoon = false }) => {
    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const hoverBg = useColorModeValue('gray.50', 'gray.700')

    return (
        <Box
            as={!isComingSoon ? Link : 'div'}
            to={to}
            p={6}
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            transition="all 0.3s"
            cursor={isComingSoon ? 'default' : 'pointer'}
            position="relative"
            _hover={!isComingSoon ? {
                transform: 'translateY(-4px)',
                shadow: 'lg',
                bg: hoverBg,
                borderColor: 'brand.500',
            } : {}}
        >
            <VStack spacing={4} align="flex-start">
                <Icon
                    as={icon}
                    boxSize={8}
                    color="brand.500"
                />
                <Heading size="md">{title}</Heading>
                <Text color="gray.600" fontSize="sm">
                    {description}
                </Text>
                {isComingSoon && (
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
    )
}

const Dashboard = () => {
    const agents = [
        {
            title: 'Marketing Angle Finder',
            description: 'Analyze websites and conversations to uncover marketing opportunities, pain points, and business ideas.',
            icon: FaSearchDollar,
            to: '/marketing-angle-finder',
        },
        {
            title: 'Market Trend Analyzer',
            description: 'Track and analyze market trends, consumer behavior, and competition insights.',
            icon: FaChartLine,
            isComingSoon: true,
        },
        {
            title: 'AI Sales Assistant',
            description: 'Generate personalized sales pitches and follow-up strategies.',
            icon: FaRobot,
            isComingSoon: true,
        },
    ]

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Welcome to Your AI Workspace</Heading>
                    <Text color="gray.600">
                        Choose an AI agent to help you discover market opportunities and grow your business.
                    </Text>
                </Box>

                <Grid
                    templateColumns={{
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                    }}
                    gap={6}
                >
                    {agents.map((agent, index) => (
                        <AgentCard key={index} {...agent} />
                    ))}
                </Grid>
            </VStack>
        </Container>
    )
}

export default Dashboard 