// src/components/community/Community.jsx
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import Leaderboard from './CommunityLeaderBoard';
import CommunityInvite from './CommunityInvite';
// import CommunityStats from './CommunityStats';

const Community = () => {
  const [communityData, setCommunityData] = useState(null);

  useEffect(() => {
    // Fetch community data
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Leaderboard />
      </Grid>
      <Grid item xs={12} md={4}>
        <CommunityInvite />
        {/* <CommunityStats /> */}
      </Grid>
    </Grid>
  );
};

export default Community;