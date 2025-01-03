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
import { FaSearchDollar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const AgentCard = ({ title, description, icon, to }) => {
    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const hoverBg = useColorModeValue('gray.50', 'gray.700')

    return (
        <Box
            as={Link}
            to={to}
            p={6}
            bg={bg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            transition="all 0.3s"
            cursor="pointer"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                bg: hoverBg,
                borderColor: 'brand.500',
            }}
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
            </VStack>
        </Box>
    )
}

const Dashboard = () => {
    const agents = [
        {
            title: 'Marketing Research Agent',
            description: 'Analyze websites and conversations to uncover marketing opportunities, customer insights, and business ideas.',
            icon: FaSearchDollar,
            to: '/marketing-research',
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