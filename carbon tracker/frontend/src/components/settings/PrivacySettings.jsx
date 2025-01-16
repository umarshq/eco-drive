// src/components/settings/PrivacySettings.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Typography,
  Box,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../utils/api';

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    locationTracking: true,
    shareCommunityStat: true,
    showInLeaderboard: true,
    autoDetectActivity: true,
    shareAchievements: true,
    anonymousMode: false
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      const res = await api.get('/settings/privacy');
      setSettings(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load privacy settings',
        type: 'error'
      });
    }
  };

  const handleToggle = async (setting) => {
    try {
      await api.put('/settings/privacy', {
        ...settings,
        [setting]: !settings[setting]
      });
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        type: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update settings',
        type: 'error'
      });
    }
  };

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Location Tracking"
              secondary="Allow automatic tracking of your commute routes"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.locationTracking}
                onChange={() => handleToggle('locationTracking')}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Community Statistics"
              secondary="Share your carbon footprint data with your community"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.shareCommunityStat}
                onChange={() => handleToggle('shareCommunityStat')}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Leaderboard Visibility"
              secondary="Show your name and progress in community leaderboards"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.showInLeaderboard}
                onChange={() => handleToggle('showInLeaderboard')}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Activity Detection"
              secondary="Automatically detect your travel mode"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.autoDetectActivity}
                onChange={() => handleToggle('autoDetectActivity')}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Anonymous Mode"
              secondary="Hide your identity in all public features"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.anonymousMode}
                onChange={() => handleToggle('anonymousMode')}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
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

export default PrivacySettings;