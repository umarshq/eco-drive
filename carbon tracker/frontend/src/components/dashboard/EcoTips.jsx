// src/components/dashboard/EcoTips.jsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, IconButton, Box } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import api from '../../utils/api';

const EcoTips = () => {
  const [currentTip, setCurrentTip] = useState(null);

  const fetchNewTip = async () => {
    try {
      const res = await api.get('/dashboard/eco-tips');
      setCurrentTip(res.data);
    } catch (error) {
      console.error('Error fetching eco tip:', error);
    }
  };

  useEffect(() => {
    fetchNewTip();
  }, []);

  return (
    <Card className="eco-tip-card">
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Daily Eco Tip</Typography>
          <IconButton onClick={fetchNewTip} size="small">
            <RefreshIcon />
          </IconButton>
        </Box>
        {currentTip && (
          <>
            <Typography variant="subtitle1" color="primary">
              {currentTip.title}
            </Typography>
            <Typography variant="body2">
              {currentTip.description}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Potential CO2 Reduction: {currentTip.potentialReduction} kg/month
            </Typography>
          </>
        )}
      </Box>
    </Card>
  );
};

export default EcoTips;