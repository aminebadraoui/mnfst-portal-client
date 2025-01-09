import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectDetail from '../pages/ProjectDetail';
import ResearchHub from '../pages/hubs/research/ResearchHub';
import ContentHub from '../pages/hubs/ContentHub';
import CommunicationHub from '../pages/hubs/CommunicationHub';
import StrategyHub from '../pages/hubs/StrategyHub';

// Research Hub Components
import PainAnalysisDetail from '../pages/hubs/research/PainAnalysisDetail';
import QuestionAdviceDetail from '../pages/hubs/research/QuestionAdviceDetail';
import PatternDetectionDetail from '../pages/hubs/research/PatternDetectionDetail';
import ProductAnalysisDetail from '../pages/hubs/research/ProductAnalysisDetail';
import AvatarsDetail from '../pages/hubs/research/AvatarsDetail';

// Content Hub Components
import Avatars from '../pages/hubs/content/Avatars';
import AdScripts from '../pages/hubs/content/AdScripts';
import CreateAdvertorials from '../pages/hubs/content/CreateAdvertorials';

// Communication Hub Components
import Chatbots from '../pages/hubs/communication/Chatbots';

// Empty state components for sub-features
const EmptyState = ({ title }) => (
    <div style={{ padding: '2rem' }}>
        <h2>{title}</h2>
        <p>This feature is coming soon!</p>
    </div>
);

// Content Hub Features
const SocialMediaStudio = () => <EmptyState title="Social Media Content Studio" />;
const EmailStudio = () => <EmptyState title="Email Marketing Studio" />;

// Communication Hub Features
const ChatFlows = () => <EmptyState title="Chat Flows" />;
const Support = () => <EmptyState title="Customer Support" />;

// Strategy Hub Features
const Metrics = () => <EmptyState title="Performance Metrics" />;
const Analytics = () => <EmptyState title="Growth Analytics" />;
const Goals = () => <EmptyState title="Goal Tracking" />;
const Insights = () => <EmptyState title="AI Insights" />;

const ProjectRoutes = () => {
    return (
        <Routes>
            <Route index element={<ProjectDetail />} />

            {/* Research Hub Routes */}
            <Route path="research">
                <Route index element={<ResearchHub />} />
                <Route path="pain-analysis" element={<PainAnalysisDetail />} />
                <Route path="question-advice" element={<QuestionAdviceDetail />} />
                <Route path="pattern-detection" element={<PatternDetectionDetail />} />
                <Route path="product-analysis" element={<ProductAnalysisDetail />} />
                <Route path="avatars" element={<AvatarsDetail />} />
            </Route>

            {/* Content Hub Routes */}
            <Route path="content">
                <Route index element={<ContentHub />} />
                <Route path="avatars" element={<Avatars />} />
                <Route path="ad-script-studio" element={<AdScripts />} />
                <Route path="ad-script-studio/create" element={<CreateAdvertorials />} />
                <Route path="social-media-studio" element={<SocialMediaStudio />} />
                <Route path="email-studio" element={<EmailStudio />} />
            </Route>

            {/* Communication Hub Routes */}
            <Route path="communication">
                <Route index element={<CommunicationHub />} />
                <Route path="chatbots" element={<Chatbots />} />
                <Route path="chat-flows" element={<ChatFlows />} />
                <Route path="support" element={<Support />} />
            </Route>

            {/* Strategy Hub Routes */}
            <Route path="strategy">
                <Route index element={<StrategyHub />} />
                <Route path="metrics" element={<Metrics />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="goals" element={<Goals />} />
                <Route path="insights" element={<Insights />} />
            </Route>
        </Routes>
    );
};

export default ProjectRoutes; 