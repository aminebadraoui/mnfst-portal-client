import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MarketingResearchAgent from './pages/MarketingResearchAgent';
import MarketingResearchWorkflows from './pages/MarketingResearchWorkflows';
import ResearchList from './pages/ResearchList';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/marketing-research" element={<PrivateRoute><MarketingResearchWorkflows /></PrivateRoute>} />
        <Route path="/marketing-research/list" element={<PrivateRoute><ResearchList /></PrivateRoute>} />
        <Route path="/marketing-research/new" element={<PrivateRoute><MarketingResearchAgent /></PrivateRoute>} />
        <Route path="/marketing-research/:researchId" element={<PrivateRoute><MarketingResearchAgent /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
