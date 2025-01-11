import React from 'react';
import { Box, Heading, VStack, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const docs = [
    {
        title: 'Agent Insight Retrieval Flow',
        path: '/docs/agent-insight-flow',
        description: 'How agents autonomously decide what insights they need using Qdrant and Neo4j.'
    },
    {
        title: 'RAG Implementation',
        path: '/docs/rag-implementation',
        description: 'Implementation details of the Retrieval Augmented Generation (RAG) system.'
    }
];

const DocsIndex = () => {
    return (
        <Box p={8} maxW="1200px" mx="auto">
            <Heading as="h1" mb={8}>
                Documentation
            </Heading>

            <VStack spacing={4} align="stretch">
                {docs.map((doc) => (
                    <Box
                        key={doc.path}
                        p={6}
                        borderWidth="1px"
                        borderRadius="lg"
                        _hover={{
                            shadow: 'md',
                            bg: 'gray.50',
                            _dark: { bg: 'gray.700' }
                        }}
                    >
                        <Link
                            as={RouterLink}
                            to={doc.path}
                            _hover={{ textDecoration: 'none' }}
                        >
                            <Heading as="h2" size="lg" mb={2}>
                                {doc.title}
                            </Heading>
                            <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                                {doc.description}
                            </Text>
                        </Link>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default DocsIndex; 