import React, { useEffect } from 'react';
import { Box, useColorMode, Heading, Text, UnorderedList, OrderedList, ListItem } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';

const MarkdownDoc = ({ content }) => {
    const { colorMode } = useColorMode();

    useEffect(() => {
        mermaid.initialize({
            theme: colorMode === 'dark' ? 'dark' : 'default',
            sequence: {
                actorMargin: 80,
                messageMargin: 40
            }
        });

        // Find and render all mermaid diagrams
        const mermaidDiagrams = document.querySelectorAll('.language-mermaid');
        mermaidDiagrams.forEach((diagram, index) => {
            try {
                mermaid.render(`mermaid-diagram-${index}`, diagram.textContent).then(({ svg }) => {
                    diagram.innerHTML = svg;
                });
            } catch (error) {
                console.error('Failed to render Mermaid diagram:', error);
            }
        });
    }, [colorMode]);

    const codeStyle = colorMode === 'dark' ? oneDark : oneLight;

    return (
        <Box p={8} maxW="1200px" mx="auto">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <Heading as="h1" size="2xl" mb={6} mt={8}>
                            {children}
                        </Heading>
                    ),
                    h2: ({ children }) => (
                        <Heading as="h2" size="xl" mb={4} mt={8}>
                            {children}
                        </Heading>
                    ),
                    h3: ({ children }) => (
                        <Heading as="h3" size="lg" mb={3} mt={6}>
                            {children}
                        </Heading>
                    ),
                    h4: ({ children }) => (
                        <Heading as="h4" size="md" mb={2} mt={4}>
                            {children}
                        </Heading>
                    ),
                    p: ({ children }) => (
                        <Text mb={4} lineHeight="tall">
                            {children}
                        </Text>
                    ),
                    ul: ({ children }) => (
                        <UnorderedList mb={4} pl={4} spacing={2}>
                            {children}
                        </UnorderedList>
                    ),
                    ol: ({ children }) => (
                        <OrderedList mb={4} pl={4} spacing={2}>
                            {children}
                        </OrderedList>
                    ),
                    li: ({ children, ordered }) => (
                        <ListItem fontSize="md" lineHeight="tall">
                            {children}
                        </ListItem>
                    ),
                    blockquote: ({ children }) => (
                        <Box
                            borderLeftWidth="4px"
                            borderLeftColor="gray.300"
                            pl={4}
                            py={2}
                            my={4}
                            color="gray.600"
                            _dark={{ borderLeftColor: 'gray.600', color: 'gray.300' }}
                        >
                            {children}
                        </Box>
                    ),
                    hr: () => (
                        <Box
                            as="hr"
                            my={8}
                            borderColor="gray.200"
                            _dark={{ borderColor: 'gray.700' }}
                        />
                    ),
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        if (inline) {
                            return (
                                <Box
                                    as="code"
                                    px={2}
                                    py={0.5}
                                    bg="gray.100"
                                    _dark={{ bg: 'gray.700' }}
                                    borderRadius="md"
                                    fontSize="0.875em"
                                    {...props}
                                >
                                    {children}
                                </Box>
                            );
                        }

                        if (language === 'mermaid') {
                            return (
                                <Box
                                    bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}
                                    p={4}
                                    borderRadius="lg"
                                    my={6}
                                    sx={{ '& svg': { maxWidth: '100%' } }}
                                >
                                    <div className="language-mermaid">
                                        {String(children).replace(/\n$/, '')}
                                    </div>
                                </Box>
                            );
                        }

                        return (
                            <Box borderRadius="lg" overflow="auto" my={6}>
                                <SyntaxHighlighter
                                    language={language}
                                    style={codeStyle}
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        padding: '1rem',
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </Box>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </Box>
    );
};

export default MarkdownDoc; 