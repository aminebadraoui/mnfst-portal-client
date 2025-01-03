import React from 'react';
import {
    Box,
    VStack,
    Icon,
    Text,
    Flex,
    Button,
    useColorModeValue,
    Divider,
} from '@chakra-ui/react';
import {
    FaChevronLeft,
    FaEdit,
    FaGlobe,
    FaSearch,
    FaFileAlt,
    FaBullseye,
    FaCheckCircle,
    FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WizardStep = ({ icon, title, isActive, isCompleted, description, onClick, stepNumber, highestStep }) => {
    const bg = useColorModeValue('white', 'gray.800');
    const activeBg = useColorModeValue('purple.50', 'purple.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const isAccessible = stepNumber <= highestStep;

    return (
        <Flex
            direction="column"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor={isAccessible ? "pointer" : "default"}
            bg={isActive ? activeBg : bg}
            borderWidth="1px"
            borderColor={isActive ? 'purple.500' : borderColor}
            color={isActive ? 'purple.500' : isAccessible ? 'gray.900' : 'gray.500'}
            onClick={() => isAccessible && onClick && onClick()}
            _hover={isAccessible ? {
                bg: 'purple.50',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
            } : {}}
        >
            <Flex align="center">
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
                        color="green.500"
                    />
                )}
            </Flex>
            {description && isActive && (
                <Text
                    fontSize="sm"
                    color="gray.500"
                    mt={2}
                    pl={8}
                >
                    {description}
                </Text>
            )}
        </Flex>
    );
};

const CommunityInsightsLayout = ({ children, currentStep = 1, onStepClick }) => {
    const navigate = useNavigate();
    const bg = useColorModeValue('gray.50', 'gray.900');
    const sidebarBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const steps = [
        {
            icon: FaEdit,
            title: 'Name Research',
            description: 'Give your research a meaningful name'
        },
        {
            icon: FaGlobe,
            title: 'Select Source',
            description: 'Choose one source to gather data from'
        },
        {
            icon: FaSearch,
            title: 'Research Keywords',
            description: 'Enter keywords to find relevant content'
        },
        {
            icon: FaFileAlt,
            title: 'Content Analysis',
            description: 'Analyze gathered content for insights'
        },
        {
            icon: FaBullseye,
            title: 'Market Opportunities',
            description: 'Discover potential market opportunities'
        },
    ];

    // The highest step the user has reached
    const highestStep = Math.max(currentStep, steps.length);

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
                onClick={() => navigate('/community-insights')}
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
                        Community Insights
                    </Text>

                    <VStack spacing={3} align="stretch">
                        {steps.map((step, index) => (
                            <WizardStep
                                key={index}
                                icon={step.icon}
                                title={step.title}
                                description={step.description}
                                isActive={currentStep === index + 1}
                                isCompleted={currentStep > index + 1}
                                onClick={() => onStepClick && onStepClick(index + 1)}
                                stepNumber={index + 1}
                                highestStep={highestStep}
                            />
                        ))}

                        {currentStep === 5 && (
                            <>
                                <Divider my={2} />
                                <Flex
                                    align="center"
                                    p="4"
                                    mx="4"
                                    borderRadius="lg"
                                    role="group"
                                    cursor="pointer"
                                    onClick={() => navigate('/community-insights/list')}
                                    bg="green.50"
                                    color="green.600"
                                    borderWidth="1px"
                                    borderColor="green.200"
                                    _hover={{
                                        bg: 'green.100',
                                    }}
                                >
                                    <Icon
                                        mr="4"
                                        fontSize="16"
                                        as={FaSignOutAlt}
                                    />
                                    <Text fontWeight="medium">Exit & Save</Text>
                                </Flex>
                            </>
                        )}
                    </VStack>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box ml="0" p="4">
                {children}
            </Box>
        </Box>
    );
};

export default CommunityInsightsLayout; 