import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { generateAdvertorials, getAdvertorial } from '../services/advertorials';
import ReactMarkdown from 'react-markdown';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index} style={{ padding: '20px 0' }}>
            {value === index && children}
        </div>
    );
}

export default function Advertorials() {
    const { projectId } = useParams();
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [advertorials, setAdvertorials] = useState({
        story: null,
        value: null,
        info: null,
    });
    const [currentTab, setCurrentTab] = useState(0);

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await generateAdvertorials(projectId, description);

            // Fetch all advertorials
            const [story, value, info] = await Promise.all([
                getAdvertorial(projectId, result.story_based_id),
                getAdvertorial(projectId, result.value_based_id),
                getAdvertorial(projectId, result.informational_id),
            ]);

            setAdvertorials({
                story,
                value,
                info,
            });
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Advertorials
            </Typography>
            <Typography variant="body1" paragraph>
                Generate different types of advertorials for your project.
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Project Description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={handleGenerate}
                            disabled={!description || loading}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            Generate Advertorials
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {(advertorials.story || advertorials.value || advertorials.info) && (
                <Paper sx={{ mt: 4 }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, newValue) => setCurrentTab(newValue)}
                        variant="fullWidth"
                    >
                        <Tab label="Story-Based" />
                        <Tab label="Value-Based" />
                        <Tab label="Informational" />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        <TabPanel value={currentTab} index={0}>
                            {advertorials.story?.content?.content && (
                                <Paper sx={{ p: 3 }}>
                                    <ReactMarkdown>{advertorials.story.content.content}</ReactMarkdown>
                                </Paper>
                            )}
                        </TabPanel>

                        <TabPanel value={currentTab} index={1}>
                            {advertorials.value?.content?.content && (
                                <Paper sx={{ p: 3 }}>
                                    <ReactMarkdown>{advertorials.value.content.content}</ReactMarkdown>
                                </Paper>
                            )}
                        </TabPanel>

                        <TabPanel value={currentTab} index={2}>
                            {advertorials.info?.content?.content && (
                                <Paper sx={{ p: 3 }}>
                                    <ReactMarkdown>{advertorials.info.content.content}</ReactMarkdown>
                                </Paper>
                            )}
                        </TabPanel>
                    </Box>
                </Paper>
            )}
        </Container>
    );
} 