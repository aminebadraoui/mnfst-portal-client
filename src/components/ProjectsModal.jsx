import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import useProjectStore from '../store/projectStore';

const ProjectsModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const addProject = useProjectStore((state) => state.addProject);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({
                title: 'Error',
                description: 'Project name is required',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            addProject({ name, description });
            toast({
                title: 'Project created.',
                description: 'Your new project has been created successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setName('');
            setDescription('');
            onClose();
        } catch (error) {
            toast({
                title: 'Error creating project.',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>Create New Project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Project Name</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter project name"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter project description"
                                    rows={4}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="purple"
                            type="submit"
                            isLoading={isLoading}
                        >
                            Create Project
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default ProjectsModal; 