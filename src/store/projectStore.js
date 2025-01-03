import { create } from 'zustand';

const useProjectStore = create((set) => ({
    projects: [],
    addProject: (project) => set((state) => ({
        projects: [...state.projects, {
            ...project,
            id: Math.random().toString(36).substr(2, 9), // Temporary ID generation
            created_at: new Date().toISOString(),
        }]
    })),
    deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId)
    })),
}));

export default useProjectStore; 