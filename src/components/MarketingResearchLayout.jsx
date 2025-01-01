import React from 'react';
import {
    Box,
    VStack,
    Icon,
    Text,
    Flex,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaChevronLeft, FaSearch, FaFileAlt, FaBullseye, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WizardStep = ({ icon, title, isActive, isCompleted }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const activeBg = useColorModeValue('purple.50', 'purple.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={isActive ? activeBg : bg}
            borderWidth="1px"
            borderColor={isActive ? 'purple.500' : borderColor}
            color={isActive ? 'purple.500' : isCompleted ? 'green.500' : 'gray.500'}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    as={icon}
                />
            )}
            <Text fontWeight={isActive ? "bold" : "normal"}>{title}</Text>
            {isCompleted && (
                <Icon
                    ml="auto"
                    fontSize="16"
                    as={FaCheckCircle}
                />
            )}
        </Flex>
    );
};

const MarketingResearchLayout = ({ children, currentStep = 1 }) => {
    const navigate = useNavigate();
    const bg = useColorModeValue('gray.50', 'gray.900');
    const sidebarBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const steps = [
        { icon: FaSearch, title: 'Research Keywords' },
        { icon: FaFileAlt, title: 'Content Analysis' },
        { icon: FaBullseye, title: 'Market Opportunities' },
    ];

    return (
        <Box minH="100vh" bg={bg}>
            {/* Back Button */}
            <Button
                leftIcon={<FaChevronLeft />}
                variant="ghost"
                position="fixed"
                top={4}
                left={4}
                zIndex={2}
                onClick={() => navigate('/marketing-research')}
            >
                Back
            </Button>

            {/* Wizard Sidebar */}
            <Box
                w="64"
                h="full"
                bg={sidebarBg}
                borderRight="1px"
                borderRightColor={borderColor}
                pos="fixed"
                left="0"
                top="0"
                pt="16"
            >
                <VStack spacing={4} align="stretch" py={5}>
                    <Text
                        fontSize="xl"
                        color="purple.500"
                        fontWeight="bold"
                        textAlign="center"
                        mb={4}
                    >
                        Marketing Research
                    </Text>

                    <VStack spacing={3} align="stretch">
                        {steps.map((step, index) => (
                            <WizardStep
                                key={index}
                                icon={step.icon}
                                title={step.title}
                                isActive={currentStep === index + 1}
                                isCompleted={currentStep > index + 1}
                            />
                        ))}
                    </VStack>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box ml="64" p="4">
                {children}
            </Box>
        </Box>
    );
};

export default MarketingResearchLayout; 