import { create } from 'zustand';
import api from '../services/api';

const useProjectStore = create((set) => ({
    projects: [],
    isLoading: false,
    error: null,

    // Fetch all projects
    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/projects');
            set({ projects: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Add a new project
    addProject: async (project) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/projects', project);
            set((state) => ({
                projects: [...state.projects, response.data],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Update a project
    updateProject: async (projectId, projectData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/projects/${projectId}`, projectData);
            set((state) => ({
                projects: state.projects.map(p =>
                    p.id === projectId ? response.data : p
                ),
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Delete a project
    deleteProject: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/projects/${projectId}`);
            set((state) => ({
                projects: state.projects.filter(p => p.id !== projectId),
                isLoading: false
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },
}));

export default useProjectStore; 