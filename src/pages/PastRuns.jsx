import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    HStack,
    Text,
    Icon,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Link,
    Spinner,
    Center,
    Button,
} from '@chakra-ui/react';
import { FaSearch, FaChartLine, FaRobot } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { listResearch } from '../services/researchService';

const agentTypes = [
    { id: 'community-insights', name: 'Community Insights', icon: FaSearch },
];

const PastRuns = () => {
    const [selectedAgent, setSelectedAgent] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [runs, setRuns] = useState([]);

    useEffect(() => {
        const fetchRuns = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const communityInsights = await listResearch();
                console.log('Research:', communityInsights);
                const transformedRuns = communityInsights.map(research => ({
                    id: research.id,
                    name: research.name,
                    source: research.source,
                    status: research.status,
                    createdAt: new Date(research.created_at).toLocaleString(),
                    updatedAt: new Date(research.updated_at).toLocaleString(),
                }));
                setRuns(transformedRuns);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRuns();
    }, []);

    const filteredRuns = runs.filter(run =>
        selectedAgent === 'all' || run.type === selectedAgent
    );

    const getAgentIcon = (type) => {
        const agent = agentTypes.find(a => a.id === type);
        return agent ? agent.icon : FaRobot;
    };

    const getAgentName = (type) => {
        const agent = agentTypes.find(a => a.id === type);
        return agent ? agent.name : type;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <Center>
                    <Text color="red.500">Error loading runs: {error}</Text>
                </Center>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Past Runs</Heading>
                    <Text color="gray.600">
                        View and manage your previous agent runs
                    </Text>
                </Box>

                <Box>
                    <HStack mb={6}>
                        <Text fontWeight="medium">Filter by Agent:</Text>
                        <Select
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                            maxW="300px"
                        >
                            <option value="all">All Agents</option>
                            {agentTypes.map(agent => (
                                <option
                                    key={agent.id}
                                    value={agent.id}
                                    disabled={agent.disabled}
                                >
                                    {agent.name} {agent.disabled ? '(Coming Soon)' : ''}
                                </option>
                            ))}
                        </Select>
                    </HStack>

                    {isLoading ? (
                        <Center py={8}>
                            <Spinner size="xl" color="purple.500" thickness="4px" />
                        </Center>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Agent</Th>
                                        <Th>Date</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredRuns.map((run) => (
                                        <Tr key={run.id}>
                                            <Td>
                                                <Link
                                                    as={RouterLink}
                                                    to={`/community-insights/${run.id}`}
                                                    color="purple.500"
                                                    fontWeight="medium"
                                                    _hover={{ textDecoration: 'none', color: 'purple.600' }}
                                                >
                                                    {run.name}
                                                </Link>
                                            </Td>
                                            <Td>
                                                <HStack>
                                                    <Icon as={getAgentIcon(run.type)} />
                                                    <Text>{getAgentName(run.type)}</Text>
                                                </HStack>
                                            </Td>
                                            <Td>{formatDate(run.date)}</Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={run.status === 'completed' ? 'green' : 'yellow'}
                                                >
                                                    {run.status}
                                                </Badge>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </VStack>
        </Container>
    );
};

export default PastRuns; 