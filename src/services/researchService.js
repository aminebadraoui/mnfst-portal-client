import api from './api';

export const startAnalysis = async (projectId, query, analysisType, userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const response = await api.post(`/research-hub/${analysisType}/analyze`, {
        project_id: projectId,
        user_id: userId,
        user_query: query,
        topic_keyword: query,
        source_urls: [],
        product_urls: [],
        use_only_specified_sources: false
    });
    return response.data;
};

export const getAnalysisResults = async (analysisType, taskId) => {
    const response = await api.get(`/research-hub/${analysisType}/results/${taskId}`);
    return response.data;
};

export const getProjectAnalyses = async (analysisType, projectId) => {
    const response = await api.get(`/research-hub/${analysisType}/project/${projectId}`);
    return response.data;
};

export const getAnalysisTypes = async () => {
    const response = await api.get('/research-hub/analysis-types');
    return response.data;
};

export const getProjectQueries = async (projectId) => {
    const response = await api.get(`/research-hub/project/${projectId}/queries`);
    return response.data;
};

export const listResearch = async (projectId) => {
    const response = await api.get(`/research-hub/project/${projectId}`);
    return response.data;
};

export const deleteResearch = async (researchId) => {
    const response = await api.delete(`/research-hub/${researchId}`);
    return response.data;
}; 