const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const validateUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
};

const startAnalysis = async (url) => {
    try {
        // Validate URL format
        if (!validateUrl(url)) {
            return {
                success: false,
                error: 'Please enter a valid URL starting with http:// or https://'
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/agents/analyze-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || 'Failed to analyze URL'
            };
        }

        // Check if the response has the expected structure
        if (!data.success) {
            return {
                success: false,
                error: data.error || 'Analysis failed'
            };
        }

        return data; // Return the entire response as it should already have success and result fields
    } catch (error) {
        console.error('Analysis error:', error); // Debug log
        return {
            success: false,
            error: 'Failed to connect to server'
        };
    }
};

const pollForResults = async (taskId, onProgress) => {
    // For now, just return the analysis result directly
    return await startAnalysis(taskId);
};

export const analysisService = {
    startAnalysis,
    pollForResults
}; 