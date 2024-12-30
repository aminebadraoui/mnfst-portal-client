import { create } from 'zustand'

// Get initial state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    return {
        isAuthenticated: !!token,
        token,
        user,
    }
}

const useAuthStore = create((set) => ({
    ...getInitialState(),

    setAuth: (token, user) => {
        // Save to localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        set({
            isAuthenticated: true,
            token,
            user,
        })
    },

    clearAuth: () => {
        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        set({
            isAuthenticated: false,
            token: null,
            user: null,
        })
    },
}))

export { useAuthStore } 