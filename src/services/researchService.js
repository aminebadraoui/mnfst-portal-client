import api from './api';

export const createResearch = async (name, source) => {
    try {
        const response = await api.post('/market-research', {
            name,
            source,
            urls: []
        });
        return response.data;
    } catch (error) {
        console.error('Error creating research:', error);
        throw error;
    }
};

export const listResearch = async () => {
    try {
        const response = await api.get('/market-research');
        return response.data;
    } catch (error) {
        console.error('Error listing research:', error);
        throw error;
    }
};

export const getResearch = async (researchId) => {
    try {
        const response = await api.get(`/market-research/${researchId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting research:', error);
        throw error;
    }
};

export const updateResearchUrls = async (researchId, urls) => {
    try {
        const response = await api.put(`/market-research/${researchId}/urls`, { urls });
        return response.data;
    } catch (error) {
        console.error('Error updating research URLs:', error);
        throw error;
    }
};

export const saveCommunityAnalysis = async (researchId, insights) => {
    try {
        const response = await api.post(`/market-research/${researchId}/community-analysis`, insights);
        return response.data;
    } catch (error) {
        console.error('Error saving community analysis:', error);
        throw error;
    }
};

export const saveMarketAnalysis = async (researchId, opportunities) => {
    try {
        const formattedOpportunities = opportunities.map(opp => ({
            opportunity: opp.opportunity,
            pain_points: opp.pain_points,
            target_audience: opp.target_audience,
            potential_solutions: opp.potential_solutions,
            supporting_insights: opp.supporting_insights
        }));

        const response = await api.post(`/market-research/${researchId}/market-analysis`, formattedOpportunities);
        return response.data;
    } catch (error) {
        console.error('Error saving market analysis:', error);
        throw error;
    }
};

export const deleteResearch = async (researchId) => {
    try {
        const response = await api.delete(`/market-research/${researchId}`);
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