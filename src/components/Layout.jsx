import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {isAuthenticated && <Navbar />}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout; 