import api from './api';

export const getProducts = async (projectId) => {
    try {
        const response = await api.get(`/projects/${projectId}/products`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProduct = async (projectId, productId) => {
    try {
        const response = await api.get(`/projects/${projectId}/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createProduct = async (projectId, productData) => {
    try {
        console.log('Creating product with data:', productData);
        const response = await api.post(`/projects/${projectId}/products`, productData);
        console.log('Product creation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            data: productData
        });
        throw error;
    }
};

export const updateProduct = async (projectId, productId, productData) => {
    try {
        console.log('Updating product with data:', productData);
        const response = await api.put(`/projects/${projectId}/products/${productId}`, productData);
        console.log('Product update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            data: productData
        });
        throw error;
    }
};

export const deleteProduct = async (projectId, productId) => {
    try {
        const response = await api.delete(`/projects/${projectId}/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 