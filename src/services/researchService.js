import api from './api';

export const createResearch = async (name, source) => {
    try {
        const response = await api.post('/research', {
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
        const response = await api.get('/research');
        return response.data;
    } catch (error) {
        console.error('Error listing research:', error);
        throw error;
    }
};

export const getResearch = async (researchId) => {
    try {
        const response = await api.get(`/research/${researchId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting research:', error);
        throw error;
    }
};

export const updateResearchUrls = async (researchId, urls) => {
    try {
        const response = await api.put(`/research/${researchId}/urls`, { urls });
        return response.data;
    } catch (error) {
        console.error('Error updating research URLs:', error);
        throw error;
    }
};

export const saveContentAnalysis = async (researchId, insights) => {
    try {
        const formattedInsights = insights.map(insight => ({
            source: insight.source,
            top_keyword: insight.top_keyword,
            key_insight: insight.key_insight,
            key_quote: insight.key_quote
        }));

        const response = await api.post(`/research/${researchId}/content-analysis`, formattedInsights);
        return response.data;
    } catch (error) {
        console.error('Error saving content analysis:', error);
        throw error;
    }
};

export const saveMarketAnalysis = async (researchId, opportunities) => {
    try {
        const formattedOpportunities = opportunities.map(opp => ({
            opportunity: opp.opportunity,
            pain_points: opp.pain_points,
            target_market: opp.target_market,
            potential_solutions: opp.potential_solutions,
            supporting_quotes: opp.supporting_quotes
        }));

        const response = await api.post(`/research/${researchId}/market-analysis`, formattedOpportunities);
        return response.data;
    } catch (error) {
        console.error('Error saving market analysis:', error);
        throw error;
    }
};

export const deleteResearch = async (researchId) => {
    try {
        const response = await api.delete(`/research/${researchId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to delete research');
    }
}; 