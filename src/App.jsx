import { Routes, Route, Navigate } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MarketingAngleFinder from './pages/MarketingAngleFinder'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5f0ff',
      100: '#ead9ff',
      200: '#d7b8ff',
      300: '#c194ff',
      400: '#b375ff',
      500: '#a961ff',
      600: '#8746d1',
      700: '#6830a3',
      800: '#4a1d75',
      900: '#2c0d47',
    },
  },
})

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <ChakraProvider theme={theme}>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/marketing-angle-finder"
          element={
            <PrivateRoute>
              <MarketingAngleFinder />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
          }
        />
      </Routes>
    </ChakraProvider>
  )
}

export default App
