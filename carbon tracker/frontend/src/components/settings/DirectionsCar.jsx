// src/components/settings/DirectionsCar.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { DirectionsCar, DirectionsBike, DirectionsTransit, DirectionsWalk } from '@mui/icons-material';
import api from '../../utils/api';

const DirectionsCar = () => {
  const [travelMode, setTravelMode] = useState({
    primaryMode: 'car',
    carType: '',
    carYear: '',
    fuelType: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    fetchTravelMode();
  }, []);

  const fetchTravelMode = async () => {
    try {
      const res = await api.get('/settings/travel-mode');
      setTravelMode(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load travel mode settings',
        type: 'error'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings/travel-mode', travelMode);
      setSnackbar({
        open: true,
        message: 'Travel mode updated successfully',
        type: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update travel mode',
        type: 'error'
      });
    }
  };

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>Travel Mode Settings</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Primary Travel Mode</Typography>
              <RadioGroup
                value={travelMode.primaryMode}
                onChange={(e) => setTravelMode({ ...travelMode, primaryMode: e.target.value })}
              >
                <FormControlLabel
                  value="car"
                  control={<Radio color="primary" />}
                  label={
                    <Box display="flex" alignItems="center">
                      <DirectionsCar /> <Box ml={1}>Car</Box>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="bike"
                  control={<Radio color="primary" />}
                  label={
                    <Box display="flex" alignItems="center">
                      <DirectionsBike /> <Box ml={1}>Bicycle</Box>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="transit"
                  control={<Radio color="primary" />}
                  label={
                    <Box display="flex" alignItems="center">
                      <DirectionsTransit /> <Box ml={1}>Public Transit</Box>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="walk"
                  control={<Radio color="primary" />}
                  label={
                    <Box display="flex" alignItems="center">
                      <DirectionsWalk /> <Box ml={1}>Walking</Box>
                    </Box>
                  }
                />
              </RadioGroup>
            </Grid>

            {travelMode.primaryMode === 'car' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Model"
                    value={travelMode.carType}
                    onChange={(e) => setTravelMode({ ...travelMode, carType: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Car Year"
                    value={travelMode.carYear}
                    onChange={(e) => setTravelMode({ ...travelMode, carYear: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Fuel Type"
                    select
                    value={travelMode.fuelType}
                    onChange={(e) => setTravelMode({ ...travelMode, fuelType: e.target.value })}
                    fullWidth
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default DirectionsCar;