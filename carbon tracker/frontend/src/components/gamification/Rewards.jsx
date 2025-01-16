import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import api from '../../utils/api';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        const [rewardsRes, pointsRes] = await Promise.all([
          api.get('/rewards/available', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
          api.get('/user/points', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
        ]);
        setRewards(rewardsRes.data);
        setUserPoints(pointsRes.data.points);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRewardsData();
  }, [token]);

  const handleClaimReward = async () => {
    const totalCost = rewards.reduce((sum, reward) => sum + reward.cost, 0);

    try {
      await api.post(`/rewards/claim`, { total_cost: totalCost }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      setUserPoints((prev) => prev - totalCost);
      setRewards([]); // Assuming all rewards are claimed
      setDialogOpen(false);
      alert('Rewards claimed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to claim rewards.');
    }
  };

  const totalCost = rewards.reduce((sum, reward) => sum + reward.cost, 0);

  return (
    <div>
      <center><Typography variant="h4">Available Rewards</Typography></center>
      <Typography variant="h6">Points Available: {userPoints}</Typography>
      <Typography variant="h6">Total Cost: {totalCost}</Typography>
      
      {errorMessage && (
        <Typography color="error" variant="body1">
          {errorMessage}
        </Typography>
      )}

      <Button
        onClick={() =>
          setDialogOpen(true)
        }
        variant="contained"
        color="primary"
        style={{ marginBottom: '16px' }}
      >
        Claim All Rewards
      </Button>

      {/* Rewards Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reward ID</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Cost (Points)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>{reward.id}</TableCell>
                <TableCell>{reward.score}</TableCell>
                <TableCell>{reward.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Claim</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to claim all rewards?</Typography>

          <Button onClick={handleClaimReward} variant="contained" color="primary" style={{ marginRight: '8px' }}>
            Yes
          </Button>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" color="secondary">
            No
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
