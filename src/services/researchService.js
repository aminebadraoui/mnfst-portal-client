import api from './api';

export const createResearch = async (data) => {
    const response = await api.post('/community-insights', data);
    return response.data;
};

export const getResearch = async (id) => {
    const response = await api.get(`/community-insights/${id}`);
    return response.data;
};

export const listResearch = async () => {
    const response = await api.get('/community-insights');
    return response.data;
};

export const updateResearchUrls = async (id, urls) => {
    const response = await api.put(`/community-insights/${id}/urls`, urls);
    return response.data;
};

export const saveCommunityAnalysis = async (id, insights) => {
    const response = await api.post(`/community-insights/${id}/community-analysis`, insights);
    return response.data;
};

export const saveMarketAnalysis = async (id, opportunities) => {
    const response = await api.post(`/community-insights/${id}/market-analysis`, opportunities);
    return response.data;
};

export const deleteResearch = async (researchId) => {
    try {
        const response = await api.delete(`/community-insights/${researchId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to delete research');
    }
};

export const startAnalysis = async (researchId, urls) => {
    const response = await api.post('/community-analysis/analyze-insights', {
        research_id: researchId,
        urls: urls
    });
    return response.data;
};

export const startMarketAnalysis = async (researchId, insights, quotes, keywords_found) => {
    const response = await api.post('/community-analysis/analyze-trends', {
        research_id: researchId,
        insights,
        quotes,
        keywords_found
    });
    return response.data;
};

export const checkTaskStatus = async (taskId) => {
    const response = await api.get(`/community-analysis/task/${taskId}`);
    return response.data;
}; 