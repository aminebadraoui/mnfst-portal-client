const FeatureCard = ({ icon, title, description, onClick }) => {
    return (
        <Box
            as="button"
            onClick={onClick}
            p={6}
            bg="bg.subtle"
            borderRadius="xl"
            transition="all 0.2s"
            _hover={{ bg: 'bg.hover' }}
            textAlign="left"
            w="full"
        >
            <Icon as={icon} boxSize={6} color="accent.default" mb={4} />
            <Text fontSize="xl" fontWeight="semibold" mb={2}>
                {title}
            </Text>
            <Text className="description" fontSize="md">
                {description}
            </Text>
        </Box>
    );
}; 