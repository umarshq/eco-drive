import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import api from '../../utils/api';
import axios from 'axios';

const CommuteTracker = ({ onFinishCommute }) => {
  const [activeCommute, setActiveCommute] = useState(null);
  const [activeCommutevalue, setActiveCommutevalue] = useState(false); // Track if commute is active
  const [travelMode, setTravelMode] = useState('');
  const [carType, setCarType] = useState('');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [manualDistance, setManualDistance] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [userStartCoordinates, setUserStartCoordinates] = useState({ lat: null, lng: null });
  const [endCoordinates, setEndCoordinates] = useState({ lat: null, lng: null });
  const [startTime, setStartTime] = useState(null);

  const carTypes = [
    'SmallDieselCar', 'MediumDieselCar', 'LargeDieselCar',
    'MediumHybridCar', 'LargeHybridCar', 'MediumLPGCar',
    'LargeLPGCar', 'MediumCNGCar', 'LargeCNGCar',
    'SmallPetrolVan', 'LargePetrolVan', 'SmallDielselVan',
    'MediumDielselVan', 'LargeDielselVan', 'LPGVan',
    'CNGVan', 'SmallPetrolCar', 'MediumPetrolCar',
    'LargePetrolCar', 'SmallMotorBike', 'MediumMotorBike',
    'LargeMotorBike'
  ];

  const startCommute = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/commute/start', {
        mode: travelMode === 'Car' ? carType : travelMode,
        token
      });
      setActiveCommute(res.data.commute_id);
      setStartTime(new Date());
      setActiveCommutevalue(true);
      console.log("Commute started");

      // Set user start coordinates using GPS
      if (gpsEnabled) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserStartCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    } catch (err) {
      console.error('Error starting commute:', err);
    }
  };

  const stopCommuteWithGPS = async () => {
    try {
      // if (!activeCommute) return;

      // Set end coordinates using GPS
      if (gpsEnabled) {
        navigator.geolocation.getCurrentPosition((position) => {
          setEndCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
      console.log(endCoordinates);
      // Calculate distances for user and passengers
      console.log(userStartCoordinates, endCoordinates)
      const userDistance = calculateDistance(userStartCoordinates, endCoordinates);
      console.log(userDistance)
      const passengerDistances = passengers.map((passenger) =>
        calculateDistance(passenger.coordinates, endCoordinates)
       
      );
      console.log(passengers);
      passengers.map((passenger) =>
        console.log(passenger.coordinates, endCoordinates),
       
      );

      // Prepare data payload
      const payload = {
        carType,
        travelMode,
        commuteId: activeCommute,
        user: {
          distance: userDistance,
          duration: calculateDuration(),
        },
        passengers: passengers.map((passenger, index) => ({
          email: passenger.email,
          distance: passengerDistances[index],
          duration: calculateDuration(),
        })),
      };

      await api.post('/commute/stop', payload);

      setActiveCommute(null);
      setStartTime(null);
      setActiveCommutevalue(false);
      setTravelMode('');
      setCarType('');
      setPassengers([]);
      console.log("Commute stopped and fields cleared");
    // Call the parent handler to refresh components
    onFinishCommute();
    } catch (err) {
      console.error('Error stopping commute:', err);
    }
  };

  const calculateDistance = (startCoords, endCoords) => {
    if (!startCoords || !endCoords || !startCoords.lat || !startCoords.lng || !endCoords.lat || !endCoords.lng) {
      return 0;
    }

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(endCoords.lat - startCoords.lat);
    const dLon = toRad(endCoords.lng - startCoords.lng);
    const lat1 = toRad(startCoords.lat);
    const lat2 = toRad(endCoords.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const toRad = (value) => value * Math.PI / 180;

  const calculateDuration = () => {
    if (!startTime) return 0;
    const endTime = new Date();
    return Math.floor((endTime - startTime) / (1000 * 60)); // Duration in minutes
  };


  const calculateCommuteWithManualDistance = async () => {
    try {
      if (!manualDistance || isNaN(manualDistance)) {
        alert('Please enter a valid distance in kilometers.');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await api.post('/commute/calculate', {
        mode: travelMode === 'Car' ? carType : travelMode,
        distance: parseFloat(manualDistance),
        token: token
      });
      console.log(res.data);
      setManualDistance('');
      setActiveCommute(null);
    } catch (err) {
      console.error('Error calculating commute:', err);
    }
  };

  const toggleGPS = () => {
    setGpsEnabled(!gpsEnabled);
  };

  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, { email: '', location: '', coordinates: { lat: null, lng: null } }]);
    }
  };

  const fetchCoordinates = async (index) => {
    const passenger = passengers[index];
    try {
      // Check if email exists in database
      const emailExistsRes = await api.post('/user/check-email', { email: passenger.email });
      if (!emailExistsRes.data.exists) {
        alert('Email does not exist in the database.');
        return;
      }
      
      // Fetch coordinates using Google Maps API
      const apiKey = 'AIzaSyC8V1wSBW1Jk8YDENY8HQcjySaCmeBNskE'; // Replace with your Google Maps API Key
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: { address: passenger.location || 'Default Location', key: apiKey }
      });
      
      const { results } = res.data;
      
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        const updatedPassengers = [...passengers];
        updatedPassengers[index].coordinates = { lat, lng };
        updatedPassengers[index].location = `Lat: ${lat}, Lng: ${lng}`;
        setPassengers(updatedPassengers);
      } else {
        alert('No results found for the entered location.');
      }
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      alert('Failed to fetch coordinates. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Commute Tracker</Typography>
      
      <Select value={travelMode} onChange={(e) => setTravelMode(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
        <MenuItem value="">Choose a mode</MenuItem>
        <MenuItem value="Car">Car</MenuItem>
        <MenuItem value="Bike">Bike</MenuItem>
        <MenuItem value="Public Transport">Public Transport</MenuItem>
        <MenuItem value="Walking">Walking</MenuItem>
      </Select>

      {travelMode === 'Car' && (
        <>
          <Select value={carType} onChange={(e) => setCarType(e.target.value)} displayEmpty fullWidth sx={{ mb: 2 }}>
            <MenuItem value="">Choose a car type</MenuItem>
            {carTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <Button onClick={toggleGPS}>{gpsEnabled ? "Disable GPS" : "Enable GPS"}</Button>
          {gpsEnabled && (
            <>
              <Button onClick={addPassenger}>Add Passenger</Button>
              {passengers.map((passenger, index) => (
                <Box key={index}>
                  <TextField
                    label="Passenger Email"
                    value={passenger.email}
                    onChange={(e) => {
                      const updatedPassengers = [...passengers];
                      updatedPassengers[index].email = e.target.value;
                      setPassengers(updatedPassengers);
                    }}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Passenger Location"
                    value={passenger.location}
                    onChange={(e) => {
                      const updatedPassengers = [...passengers];
                      updatedPassengers[index].location = e.target.value;
                      setPassengers(updatedPassengers);
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Button onClick={() => fetchCoordinates(index)} variant="outlined">Fetch Coordinates</Button>
      {/* Start/Stop Commute Button */}
      {activeCommutevalue ? (
        <Button onClick={stopCommuteWithGPS} variant="contained" color="error">
          Stop Commute
        </Button>
      ) : (
        <Button onClick={startCommute} variant="contained" color="primary">
          Start Commute
        </Button>
      )}
                </Box>
              ))}
            </>
          )}

          
          {!gpsEnabled && (
            <>
              <TextField
                label="Manual Distance (km)"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button onClick={calculateCommuteWithManualDistance} variant="contained">Calculate Commute</Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default CommuteTracker;
