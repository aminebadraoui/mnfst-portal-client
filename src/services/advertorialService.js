import api from './api';

export const generateAdvertorials = async (projectId, formData) => {
    try {
        const response = await api.post(`/projects/${projectId}/advertorials/generate`, {
            description: formData.productDescription
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAdvertorial = async (projectId, advertorialId) => {
    try {
        const response = await api.get(`/projects/${projectId}/advertorials/${advertorialId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAdvertorials = async (projectId) => {
    try {
        const response = await api.get(`/projects/${projectId}/advertorials`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAllAdvertorials = async (projectId) => {
    try {
        const response = await api.delete(`/projects/${projectId}/advertorials`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 