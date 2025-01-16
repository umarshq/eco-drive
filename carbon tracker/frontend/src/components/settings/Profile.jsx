// src/components/settings/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Grid,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    defaultTravelMode: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', profile);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Card>
      <Box p={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box position="relative">
                <Avatar
                  src={profile.avatar}
                  style={{ width: 100, height: 100 }}
                />
                <IconButton
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      // Handle avatar upload
                    }}
                  />
                  <PhotoCamera />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
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
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Card>
  );
};

export default Profile;