import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const Achievements = () => {
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [badgesRes, challengesRes] = await Promise.all([
          api.get('/gamification/badges', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
          api.get('/gamification/challenges', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
        ]);
        setBadges(badgesRes.data);
        setChallenges(challengesRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div>
      <center><h4>Achievements</h4></center>
      
      {/* <h3>Badges</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Earned At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {badges.map((badge) => (
              <TableRow key={badge.type}>
                <TableCell>{badge.type}</TableCell>
                <TableCell>{badge.description}</TableCell>
                <TableCell>{badge.earned_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      <h3>Challenges</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Completed At</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>{challenge.id}</TableCell>
                <TableCell>{challenge.completed_at}</TableCell>
                <TableCell>{challenge.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
};

export default Achievements;
