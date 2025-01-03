import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CommunityInsightsAgent from './pages/CommunityInsightsAgent';
import CommunityInsightsWorkflows from './pages/CommunityInsightsWorkflows';
import ResearchList from './pages/ResearchList';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import CommunityInsights from './pages/CommunityInsights';
import PastRuns from './pages/PastRuns';
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
        <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
        <Route path="/projects/:projectId" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
        <Route path="/projects/:projectId/community-insights" element={<PrivateRoute><CommunityInsights /></PrivateRoute>} />
        <Route path="/projects/:projectId/competition" element={<PrivateRoute><CommunityInsightsAgent /></PrivateRoute>} />
        <Route path="/projects/:projectId/avatars" element={<PrivateRoute><CommunityInsightsAgent /></PrivateRoute>} />
        <Route path="/projects/:projectId/ad-scripts" element={<PrivateRoute><CommunityInsightsAgent /></PrivateRoute>} />
        <Route path="/past-runs" element={<PrivateRoute><PastRuns /></PrivateRoute>} />
        <Route path="/community-insights" element={<PrivateRoute><CommunityInsightsWorkflows /></PrivateRoute>} />
        <Route path="/community-insights/list" element={<PrivateRoute><ResearchList /></PrivateRoute>} />
        <Route path="/community-insights/new" element={<PrivateRoute><CommunityInsightsAgent /></PrivateRoute>} />
        <Route path="/community-insights/:researchId" element={<PrivateRoute><CommunityInsightsAgent /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
