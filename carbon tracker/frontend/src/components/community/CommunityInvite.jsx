// src/components/community/CommunityInvite.jsx
import React, { useState } from 'react';
import { 
  Card, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Snackbar 
} from '@mui/material';
import api from '../../utils/api';

const CommunityInvite = () => {
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInvite = async () => {
    try {
      await api.post('/community/invite', { email });
      setShowSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  return (
    <Card>
      <Box p={2}>
        <Typography variant="h6">Invite Friends</Typography>
        <Box mt={2}>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleInvite}
            fullWidth
          >
            Send Invite
          </Button>
        </Box>
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          message="Invitation sent successfully!"
        />
      </Box>
    </Card>
  );
};

export default CommunityInvite;