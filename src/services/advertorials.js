import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const generateAdvertorials = async (projectId, description) => {
    const response = await axios.post(
        `${API_URL}/api/v1/projects/${projectId}/advertorials/generate`,
        { description },
        { withCredentials: true }
    );
    return response.data;
};

export const getAdvertorial = async (projectId, advertorialId) => {
    const response = await axios.get(
        `${API_URL}/api/v1/projects/${projectId}/advertorials/${advertorialId}`,
        { withCredentials: true }
    );
    return response.data;
}; 