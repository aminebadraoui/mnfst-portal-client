import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Switch,
    NumberInput,
    NumberInputField,
    FormErrorMessage,
    Icon,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaBox, FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../../../services/productService';

const ProductsList = () => {
    const { projectId } = useParams();
    const [products, setProducts] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const toast = useToast();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const fetchProducts = async () => {
        try {
            const data = await getProducts(projectId);
            setProducts(data);
        } catch (error) {
            if (error.response?.status !== 404) {
                toast({
                    title: 'Error fetching products',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [projectId]);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('features', product.features_and_benefits);
        setValue('guarantee', product.guarantee);
        setValue('price', product.price);
        setValue('is_service', product.is_service);
        onOpen();
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        reset();
        onClose();
    };

    const onSubmit = async (data) => {
        try {
            const productData = {
                ...data,
                features_and_benefits: data.features
            };

            if (selectedProduct) {
                await updateProduct(projectId, selectedProduct.id, productData);
                toast({
                    title: 'Product updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await createProduct(projectId, productData);
                toast({
                    title: 'Product created',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            toast({
                title: selectedProduct ? 'Error updating product' : 'Error creating product',
                description: error.response?.data?.detail || error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(projectId, productId);
            toast({
                title: 'Product deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchProducts();
        } catch (error) {
            toast({
                title: 'Error deleting product',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between">
                    <Box>
                        <Heading size="lg">Products & Services</Heading>
                        <Text color="gray.600">Manage your products and services</Text>
                    </Box>
                    <Button leftIcon={<FaPlus />} colorScheme="purple" onClick={() => { setSelectedProduct(null); onOpen(); }}>
                        Add New
                    </Button>
                </HStack>

                {products.length === 0 ? (
                    <Box
                        p={8}
                        textAlign="center"
                        borderWidth="1px"
                        borderRadius="lg"
                        borderStyle="dashed"
                        borderColor="gray.200"
                    >
                        <VStack spacing={4}>
                            <Icon as={FaBox} fontSize="48px" color="gray.400" />
                            <Heading size="md" color="gray.500">No Products or Services Yet</Heading>
                            <Text color="gray.500">
                                Get started by adding your first product or service to this project
                            </Text>
                            <Button
                                leftIcon={<FaPlus />}
                                colorScheme="purple"
                                onClick={() => { setSelectedProduct(null); onOpen(); }}
                                size="lg"
                            >
                                Add Your First Product
                            </Button>
                        </VStack>
                    </Box>
                ) : (
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Type</Th>
                                    <Th>Price</Th>
                                    <Th>Description</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {products.map((product) => (
                                    <Tr
                                        key={product.id}
                                        onClick={() => handleEdit(product)}
                                        cursor="pointer"
                                        _hover={{ bg: 'purple.50' }}
                                        _dark={{ _hover: { bg: 'whiteAlpha.200' } }}
                                    >
                                        <Td>{product.name}</Td>
                                        <Td>
                                            <Badge colorScheme={product.is_service ? 'blue' : 'green'}>
                                                {product.is_service ? 'Service' : 'Product'}
                                            </Badge>
                                        </Td>
                                        <Td>{product.price ? `$${product.price}` : 'N/A'}</Td>
                                        <Td>{product.description}</Td>
                                        <Td onClick={(e) => e.stopPropagation()}>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    icon={<FaEdit />}
                                                    colorScheme="blue"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(product);
                                                    }}
                                                    aria-label="Edit product"
                                                />
                                                <IconButton
                                                    icon={<FaTrash />}
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(product.id);
                                                    }}
                                                    aria-label="Delete product"
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </VStack>

            <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedProduct ? 'Edit Product/Service' : 'Add New Product/Service'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack spacing={4}>
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel mb="0">Is this a service?</FormLabel>
                                    <Switch {...register('is_service')} />
                                </FormControl>

                                <FormControl isInvalid={errors.name}>
                                    <FormLabel>Name</FormLabel>
                                    <Input {...register('name', { required: 'Name is required' })} />
                                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.description}>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea {...register('description', { required: 'Description is required' })} />
                                    <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.features}>
                                    <FormLabel>Features & Benefits</FormLabel>
                                    <Textarea
                                        {...register('features', { required: 'Features & Benefits are required' })}
                                        placeholder="Enter features and benefits"
                                        minH="150px"
                                    />
                                    <FormErrorMessage>{errors.features?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Guarantee (optional)</FormLabel>
                                    <Textarea {...register('guarantee')} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Price (optional)</FormLabel>
                                    <NumberInput>
                                        <NumberInputField {...register('price')} />
                                    </NumberInput>
                                </FormControl>

                                <Button type="submit" colorScheme="purple" width="full">
                                    {selectedProduct ? 'Update' : 'Create'}
                                </Button>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default ProductsList; 