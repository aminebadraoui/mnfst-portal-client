import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MarkdownDoc from '../../components/MarkdownDoc';
import agentInsightFlowMd from '../../docs/AGENT_INSIGHT_FLOW.md?raw';
import ragImplementationMd from '../../docs/RAG_IMPLEMENTATION.md?raw';

// Map of document IDs to their content
const docs = {
    'agent-insight-flow': agentInsightFlowMd,
    'rag-implementation': ragImplementationMd
};

const DocPage = () => {
    const { docId } = useParams();
    const content = docs[docId];

    if (!content) {
        return <Navigate to="/docs" replace />;
    }

    return <MarkdownDoc content={content} />;
};

export default DocPage; 