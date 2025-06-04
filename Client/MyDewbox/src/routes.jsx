import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './authpages/SignIn';
import SubscribeTo from './authpages/SubscribeTo';
import FirstContribute from './authpages/FirstContribute';
import Layout from './Layout';
import Dashboard from './Dashboard';
import { useAuthStore } from './store/authstore';

const ProtectedRoute = ({ children, requiresContribution = false }) => {
    const { isSignedIn, user, hasContributed } = useAuthStore();

    if (!isSignedIn) {
        return <Navigate to="/signin" replace />;
    }

    if (requiresContribution && !hasContributed) {
        return <Navigate to="/firstcontribute" replace />;
    }

    return children;
};

const RoutesConfig = () => {
    const { isSignedIn } = useAuthStore();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <Layout />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/subscribeto" element={<SubscribeTo />} />

            {/* Only restrict to first contribute after subscribe to */}
            <Route
                path="/firstcontribute"
                element={
                    <ProtectedRoute requiresContribution={false}>
                        <FirstContribute />
                    </ProtectedRoute>
                }
            />

            {/* Dashboard Routes - do not restrict to first contribute */}
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Catch all route */}
            <Route path="*" element={isSignedIn ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
        </Routes>
    );
};

export default RoutesConfig;