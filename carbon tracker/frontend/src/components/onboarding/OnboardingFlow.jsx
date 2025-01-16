import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Card,
  Box,
  Button,
  Typography
} from '@mui/material';
import AccountSetup from './AccountSetup';
import TravelModeSetup from './TravelModeSetup';
import CommunityInvite from './CommunityInvite';
import {Link, useNavigate } from 'react-router-dom'; // Updated import
import api from '../../utils/api';

const OnboardingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '',
    travelMode: '',
    invitedEmails: []
  });
  const navigate = useNavigate(); // Updated hook

  const steps = ['Create Account', 'Travel Mode', 'Community'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = async () => {
    try {
      await api.post('/auth/onboarding', userData);
      
      navigate('/login'); // Replaces history.push
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  return (
    <Box maxWidth={600} margin="auto" p={3}>
      <Card>
        <Box p={3}>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome to Carbon Footprint Tracker
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={4}>
            {activeStep === 0 && (
              <AccountSetup
                userData={userData}
                setUserData={setUserData}
                onNext={handleNext}
              />
            )}
            {activeStep === 1 && (
              <TravelModeSetup
                userData={userData}
                setUserData={setUserData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {activeStep === 2 && (
              <CommunityInvite
                userData={userData}
                setUserData={setUserData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}
          </Box>
        </Box>
      </Card>
      <center><Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Login
                </Link>
              </Typography></center>
    </Box>
  );
};

export default OnboardingFlow;
