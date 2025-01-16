// src/components/dashboard/CommunityRanking.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  EmojiEvents,
  Share
} from '@mui/icons-material';
import api from '../../utils/api';

const CommunityRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await api.get('/community/rankings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      setRankings(response.data.rankings);
      setUserRank(response.data.userRank);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#757575';
    }
  };

  const getRankChange = (change) => {
    if (change > 0) {
      return <ArrowUpward style={{ color: '#4CAF50' }} />;
    } else if (change < 0) {
      return <ArrowDownward style={{ color: '#f44336' }} />;
    }
    return null;
  };

  return (
    <Card>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Community Rankings</Typography>
          <Button
            startIcon={<Share />}
            color="primary"
            onClick={() => {/* Share functionality */}}
          >
            Share
          </Button>
        </Box>

        {userRank && (
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Your Current Ranking
            </Typography>
            <Card variant="outlined">
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: getRankColor(userRank.position) }}>
                    {userRank.position}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={userRank.username}
                  secondary={`${userRank.carbonsaved} kg CO2 saved`}
                />
                <ListItemSecondaryAction>
                  <Chip
                    icon={getRankChange(userRank.change)}
                    label={`${Math.abs(userRank.change)} positions`}
                    size="small"
                    color={userRank.change >= 0 ? "primary" : "default"}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          </Box>
        )}

        <List>
          {rankings.map((rank, index) => (
            <ListItem key={rank.id}>
              <ListItemAvatar>
                {index < 3 ? (
                  <Avatar style={{ backgroundColor: getRankColor(index + 1) }}>
                    <EmojiEvents />
                  </Avatar>
                ) : (
                  <Avatar>{index + 1}</Avatar>
                )}

              </ListItemAvatar>
              <ListItemText
                primary={rank.username}
                secondary={`${rank.carbonsaved} kg CO2 saved`}
              />
              <ListItemSecondaryAction>
                <IconButton size="small">
                  {getRankChange(rank.change)}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default CommunityRanking;