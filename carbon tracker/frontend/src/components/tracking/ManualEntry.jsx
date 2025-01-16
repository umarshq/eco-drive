import React, { useState } from 'react';
import { 
  Card, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Grid,
  Typography 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';  // Date adapter for DateTimePicker
import api from '../../utils/api';

const ManualEntry = () => {
  const [tripData, setTripData] = useState({
    mode: '',
    distance: '',
    startTime: new Date(),
    endTime: new Date(),
    notes: ''
  });

  const transportModes = [
    { value: 'car', label: 'Car' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train' },
    { value: 'bike', label: 'Bicycle' },
    { value: 'walk', label: 'Walking' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trips/manual', tripData);
      // Reset form or show success message
    } catch (error) {
      console.error('Error submitting trip:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}> {/* Wrap the component with LocalizationProvider */}
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} padding={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Add Trip Manually</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Transport Mode</InputLabel>
                <Select
                  value={tripData.mode}
                  onChange={(e) => setTripData({...tripData, mode: e.target.value})}
                >
                  {transportModes.map(mode => (
                    <MenuItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Start Time"
                value={tripData.startTime}
                onChange={(date) => setTripData({...tripData, startTime: date})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="End Time"
                value={tripData.endTime}
                onChange={(date) => setTripData({...tripData, endTime: date})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Distance (km)"
                type="number"
                value={tripData.distance}
                onChange={(e) => setTripData({...tripData, distance: e.target.value})}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={2}
                value={tripData.notes}
                onChange={(e) => setTripData({...tripData, notes: e.target.value})}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                Save Trip
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </LocalizationProvider>
  );
};

export default ManualEntry;
