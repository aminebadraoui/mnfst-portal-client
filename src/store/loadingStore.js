import { create } from 'zustand';

const useLoadingStore = create((set) => ({
    isLoading: false,
    keyword: '',
    setLoading: (isLoading, keyword = '') => set({ isLoading, keyword }),
}));

export default useLoadingStore; 