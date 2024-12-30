import api from './api';

export const analyzeUrl = async (url, targetAudience = null, isCompetitor = false) => {
    try {
        const response = await api.post('/api/analyze', {
            url,
            target_audience: targetAudience,
            competitor_analysis: isCompetitor
        });
        return response;
    } catch (error) {
        console.error('Error analyzing URL:', error);
        throw error;
    }
}; 