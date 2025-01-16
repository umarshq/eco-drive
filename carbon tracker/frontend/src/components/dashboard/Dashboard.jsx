import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import CarbonScore from './CarbonScore';
import CommuteTracker from '../tracking/CommuteTracker';
import CommunityRanking from './CommunityRanking';
import EcoTips from './EcoTips';
import Challenges from '../gamification/Challenges';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFinishCommute = () => {
    // Increment refreshKey to trigger re-renders
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      {/* Example layout for components */}
      <Grid item xs={12} md={6}>
      <CarbonScore key={refreshKey} />
      </Grid>
      <Grid item xs={12} md={6}>
      <CommuteTracker onFinishCommute={handleFinishCommute} />
      </Grid>
      <Grid item xs={12} md={6}>
        <CommunityRanking />
      </Grid>
      <Grid item xs={12} md={6}>
        <EcoTips />
      </Grid>
      <Grid item xs={12} md={6}>
        <Challenges />
      </Grid>
    </Grid>
  );
};

export default Dashboard;