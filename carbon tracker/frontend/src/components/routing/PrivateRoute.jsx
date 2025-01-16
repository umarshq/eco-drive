import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Updated imports
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ redirectPath = "/", onboardingPath = "/onboarding" }) => {
  const { isAuthenticated, loading, isOnboarding } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (isOnboarding) {
    return <Navigate to={onboardingPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
