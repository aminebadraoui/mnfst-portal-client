import { Box, Container, Flex, useColorMode } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
    const { colorMode } = useColorMode()

    return (
        <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}>
            <Navbar />
            <Container maxW="container.xl" py={8}>
                <Flex direction="column" gap={6}>
                    <Outlet />
                </Flex>
            </Container>
        </Box>
    )
}

export default MainLayout 