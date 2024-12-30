import React, { useState } from 'react';
import {
    Box,
    Input,
    Button,
    VStack,
    Text,
    Card,
    CardBody,
    Heading,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { analyzeUrl } from '../services/marketingService';

const MarketingAnalysis = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const toast = useToast();

    const handleAnalyze = async () => {
        if (!url) {
            toast({
                title: 'Error',
                description: 'Please enter a URL',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const result = await analyzeUrl(url);
            setAnalysis(result.analysis);
        } catch (err) {
            toast({
                title: 'Error',
                description: err.message || 'Error analyzing URL',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4}>
            <VStack spacing={4} align="stretch">
                <Card>
                    <CardBody>
                        <VStack spacing={4}>
                            <Heading size="md">Marketing Angle Finder</Heading>
                            <Input
                                placeholder="Enter URL to analyze"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <Button
                                colorScheme="blue"
                                onClick={handleAnalyze}
                                isLoading={loading}
                                loadingText="Analyzing"
                            >
                                Analyze
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>

                {loading && (
                    <Box textAlign="center" py={4}>
                        <Spinner size="xl" />
                        <Text mt={2}>Analyzing content...</Text>
                    </Box>
                )}

                {analysis && !loading && (
                    <Card>
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <Heading size="md">Analysis Results</Heading>
                                {analysis.primary_angles.map((angle, index) => (
                                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                                        <Heading size="sm">{angle.headline}</Heading>
                                        <Text mt={2}>{angle.key_message}</Text>
                                        <Text mt={2} color="gray.600">
                                            Target Audience: {angle.target_audience}
                                        </Text>
                                    </Box>
                                ))}
                            </VStack>
                        </CardBody>
                    </Card>
                )}
            </VStack>
        </Box>
    );
};

export default MarketingAnalysis; 