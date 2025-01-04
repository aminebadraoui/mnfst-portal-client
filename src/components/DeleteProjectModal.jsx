import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Input,
    FormControl,
    FormLabel,
    VStack,
    useToast,
} from '@chakra-ui/react';

const DeleteProjectModal = ({ isOpen, onClose, project, onDelete }) => {
    const [confirmName, setConfirmName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        if (confirmName !== project.name) {
            toast({
                title: 'Error',
                description: 'Project name does not match',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsDeleting(true);
        try {
            await onDelete(project.id);
            toast({
                title: 'Project deleted',
                description: 'Project has been deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete project',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="red.500">Delete Project</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <Text>
                            This action cannot be undone. This will permanently delete the
                            project <strong>{project?.name}</strong> and all of its data.
                        </Text>
                        <Text fontWeight="bold">
                            Please type <strong>{project?.name}</strong> to confirm.
                        </Text>
                        <FormControl>
                            <FormLabel>Project Name</FormLabel>
                            <Input
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder="Enter project name"
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        isDisabled={confirmName !== project?.name}
                    >
                        Delete Project
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteProjectModal; 