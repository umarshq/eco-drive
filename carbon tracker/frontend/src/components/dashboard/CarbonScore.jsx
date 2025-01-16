// src/components/dashboard/CarbonScore.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import api from '../../utils/api';

const CarbonScore = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await api.get('/dashboard/carbon-score', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        setScore(res.data);
      } catch (err) {
        console.error('Error fetching carbon score:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Carbon Score
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
            <CircularProgress />
          </Box>
        ) : score ? (
          <Box>
            <Typography variant="body1">
              <strong>Daily Average:</strong> {score.daily} kg CO2
            </Typography>
            <Typography variant="body1">
              <strong>Monthly Average:</strong> {score.monthly} kg CO2
            </Typography>
            <Typography variant="body1">
              <strong>Total Carbon Emission :</strong> {score.total} kg CO2
            </Typography>
          </Box>
        ) : (
          <Typography color="error">Failed to load carbon score.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CarbonScore;