// src/components/analytics/CarbonTrends.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Box,
  ButtonGroup,
  Button,
  Grid
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../../utils/api';

const CarbonTrends = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    average: 0,
    improvement: 0
  });

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const [trendRes, summaryRes] = await Promise.all([
          api.get(`/analytics/trends/${timeRange}`),
          api.get(`/analytics/summary/${timeRange}`)
        ]);
        setTrendData(trendRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    };
    fetchTrendData();
  }, [timeRange]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Carbon Footprint Trends</Typography>
        <ButtonGroup variant="contained" color="primary">
          <Button 
            onClick={() => setTimeRange('week')}
            variant={timeRange === 'week' ? 'contained' : 'outlined'}
          >
            Week
          </Button>
          <Button 
            onClick={() => setTimeRange('month')}
            variant={timeRange === 'month' ? 'contained' : 'outlined'}
          >
            Month
          </Button>
          <Button 
            onClick={() => setTimeRange('year')}
            variant={timeRange === 'year' ? 'contained' : 'outlined'}
          >
            Year
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box p={2} height={400}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="carbonEmission" 
                    stroke="#4CAF50" 
                    name="Carbon Emission (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Box p={2}>
              <Typography variant="h6">Total Emissions</Typography>
              <Typography variant="h4" color="primary">
                {summary.total} kg CO2
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Box p={2}>
              <Typography variant="h6">Daily Average</Typography>
              <Typography variant="h4" color="primary">
                {summary.average} kg CO2
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <Box p={2}>
              <Typography variant="h6">Improvement</Typography>
              <Typography 
                variant="h4" 
                color={summary.improvement > 0 ? "success" : "error"}
              >
                {summary.improvement}%
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarbonTrends;