// src/components/community/CommunityLeaderboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import api from '../../utils/api';

const CommunityLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/community/leaderboard');
        setLeaderboardData(res.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    switch(rank) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return '#757575'; // Default
    }
  };

  return (
    <Card>
      <Box p={2}>
        <Typography variant="h6">Community Leaderboard</Typography>
        <List>
          {leaderboardData.map((user, index) => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar style={{ backgroundColor: getRankColor(index) }}>
                  {index < 3 ? <TrophyIcon /> : (index + 1)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={`${user.carbonSaved} kg CO2 saved`}
              />
              <Typography variant="h6" color="primary">
                {user.points} pts
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default CommunityLeaderboard;