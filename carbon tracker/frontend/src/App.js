import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import Navbar from './components/layout/Navbar';
import BottomNavigation from './components/layout/BottomNavigation';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Onboarding Components
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import AccountSetup from './components/onboarding/AccountSetup';
import TravelModeSetup from './components/onboarding/TravelModeSetup';
import CommunityInvite from './components/onboarding/CommunityInvite';

// Home & Dashboard Components
import Home from './components/dashboard/Home';
import Dashboard from './components/dashboard/Dashboard';
import Rewards from './components/gamification/Rewards';
import Achievements from './components/gamification/Achievements'

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700', // Green theme for eco-friendly app
    },
    secondary: {
      main: '#2196F3',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    JSON.parse(localStorage.getItem('hasCompletedOnboarding')) || false
  );

  // Handle login logic
  const handleLogin = (token) => { 
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // Handle logout logic
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('userRole'); // Clear session storage on logout
    localStorage.clear();
  };


  // Handle onboarding completion logic
  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setIsAuthenticated(true);
    localStorage.setItem('hasCompletedOnboarding', true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      
        <div style={styles.appContainer}>
          {isAuthenticated && <Navbar onLogout={handleLogout} />}
          <main style={styles.mainContent}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                      path="/onboarding"
                      element={<OnboardingFlow onComplete={handleOnboardingComplete} />}
                    >
                      <Route path="accountsetup" element={<AccountSetup />} />
                      <Route path="travelmodesetup" element={<TravelModeSetup />} />
                      <Route path="communityinvite" element={<CommunityInvite />} />
                    </Route>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    hasCompletedOnboarding ? (
                      <Navigate to="/" />
                    ) : (
                      <Navigate to="/onboarding" />
                    )
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <Register />}
              />
                    {/* Private routes (only accessible if authenticated) */}
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/achievements" element={<Achievements />} />

          </>
        )}
              
              
              

              {/* Redirect to login if not authenticated */}
              {/* <Route path="*" element={<Navigate to="/login" />} /> */}
            </Routes>
          </main>
          {isAuthenticated && hasCompletedOnboarding && <BottomNavigation />}
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Global styles
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    marginBottom: '56px', // Height of bottom navigation
    marginTop: '64px', // Height of navbar
  },
};

export default App;
