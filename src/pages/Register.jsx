import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    useToast,
    VStack,
    FormErrorMessage,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm()
    const navigate = useNavigate()
    const toast = useToast()

    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:8000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.detail || 'Registration failed')
            }

            toast({
                title: 'Registration successful',
                description: 'Please login with your credentials',
                status: 'success',
                duration: 3000,
            })
            navigate('/login')
        } catch (error) {
            toast({
                title: 'Registration failed',
                description: error.message,
                status: 'error',
                duration: 3000,
            })
        }
    }

    return (
        <Box maxW="md" mx="auto" mt={8}>
            <VStack spacing={8} align="stretch">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    Create an Account
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        <FormControl isInvalid={errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.first_name}>
                            <FormLabel>First Name</FormLabel>
                            <Input
                                {...register('first_name', {
                                    required: 'First name is required',
                                })}
                            />
                            <FormErrorMessage>{errors.first_name?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.last_name}>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                {...register('last_name', {
                                    required: 'Last name is required',
                                })}
                            />
                            <FormErrorMessage>{errors.last_name?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="brand"
                            size="lg"
                            fontSize="md"
                            isLoading={isSubmitting}
                        >
                            Create Account
                        </Button>
                    </Stack>
                </form>

                <Text textAlign="center">
                    Already have an account?{' '}
                    <Link to="/login">
                        <Text as="span" color="brand.500">
                            Login here
                        </Text>
                    </Link>
                </Text>
            </VStack>
        </Box>
    )
}

export default Register 