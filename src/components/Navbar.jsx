import {
    Box,
    Button,
    Container,
    Flex,
    HStack,
    IconButton,
    useColorMode,
    Text,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa'
import useAuthStore from '../store/authStore'

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isAuthenticated, logout, user } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Box py={4} borderBottom="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}>
            <Container maxW="container.xl">
                <Flex justify="space-between" align="center">
                    <Link to="/">
                        <Text fontSize="2xl" fontWeight="bold" color={colorMode === 'light' ? 'brand.600' : 'brand.400'}>
                            MNFST
                        </Text>
                    </Link>

                    <HStack spacing={4}>
                        <IconButton
                            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                        />

                        {isAuthenticated ? (
                            <>
                                <Text>Welcome, {user?.email}</Text>
                                <Button variant="outline" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button as={Link} to="/login" variant="ghost">
                                    Login
                                </Button>
                                <Button as={Link} to="/register" colorScheme="brand">
                                    Register
                                </Button>
                            </>
                        )}
                    </HStack>
                </Flex>
            </Container>
        </Box>
    )
}

export default Navbar 