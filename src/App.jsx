import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProjectList from './pages/ProjectList';
import PastRuns from './pages/PastRuns';
import { useAuthStore } from './store/authStore';
import ProjectRoutes from './routes/projectRoutes';
import GlobalLoadingBanner from './components/GlobalLoadingBanner';
import useLoadingStore from './store/loadingStore';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isLoading, keyword } = useLoadingStore();

  return (
    <ChakraProvider theme={theme}>
      <GlobalLoadingBanner isVisible={isLoading} keyword={keyword} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
        <Route path="/past-runs" element={<PrivateRoute><PastRuns /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Project Routes */}
        <Route path="/projects/:projectId/*" element={<PrivateRoute><ProjectRoutes /></PrivateRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
