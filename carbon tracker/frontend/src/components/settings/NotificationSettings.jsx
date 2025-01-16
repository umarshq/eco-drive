// src/components/notifications/Notifications.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider,
  Badge,
  Tabs,
  Tab,
  Switch,
  Snackbar,
  Alert
} from '@mui/material';
import {
  EmojiEvents,
  DirectionsCar,
  Group,
  EcoRounded,
  Close,
  Settings
} from '@mui/icons-material';
import api from '../../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    achievementAlerts: true,
    commuteTracking: true,
    communityUpdates: true,
    weeklyReports: true,
    challengeReminders: true
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    fetchNotifications();
    fetchNotificationSettings();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load notifications',
        type: 'error'
      });
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const res = await api.get('/notifications/settings');
      setSettings(res.data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to dismiss notification',
        type: 'error'
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <EmojiEvents color="primary" />;
      case 'commute':
        return <DirectionsCar color="secondary" />;
      case 'community':
        return <Group color="primary" />;
      case 'challenge':
        return <EcoRounded style={{ color: '#4CAF50' }} />;
      default:
        return <EcoRounded />;
    }
  };

  const filterNotifications = (type) => {
    return notifications.filter(notification => {
      switch (type) {
        case 0: // All
          return true;
        case 1: // Achievements
          return notification.type === 'achievement';
        case 2: // Community
          return notification.type === 'community';
        case 3: // Challenges
          return notification.type === 'challenge';
        default:
          return true;
      }
    });
  };

  return (
    <Box>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          <Badge badgeContent={notifications.length} color="primary">
            <IconButton size="small" onClick={() => setCurrentTab(4)}>
              <Settings />
            </IconButton>
          </Badge>
        </Box>

        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" />
          <Tab label="Achievements" />
          <Tab label="Community" />
          <Tab label="Challenges" />
          <Tab label="Settings" />
        </Tabs>

        {currentTab !== 4 ? (
          <List>
            {filterNotifications(currentTab).map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDismissNotification(notification.id)}
                    >
                      <Close />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            {filterNotifications(currentTab).length === 0 && (
              <Box p={3} textAlign="center">
                <Typography color="textSecondary">
                  No notifications to display
                </Typography>
              </Box>
            )}
          </List>
        ) : (
          <List>
            <ListItem>
              <ListItemText
                primary="Achievement Alerts"
                secondary="Get notified about new badges and achievements"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.achievementAlerts}
                  onChange={() => setSettings({
                    ...settings,
                    achievementAlerts: !settings.achievementAlerts
                  })}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary="Commute Tracking"
                secondary="Notifications about your daily commute tracking"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.commuteTracking}
                  onChange={() => setSettings({
                    ...settings,
                    commuteTracking: !settings.commuteTracking
                  })}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary="Community Updates"
                secondary="Stay updated with your community's progress"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.communityUpdates}
                  onChange={() => setSettings({
                    ...settings,
                    communityUpdates: !settings.communityUpdates
                  })}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary="Weekly Reports"
                secondary="Receive weekly carbon footprint summaries"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.weeklyReports}
                  onChange={() => setSettings({
                    ...settings,
                    weeklyReports: !settings.weeklyReports
                  })}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary="Challenge Reminders"
                secondary="Get reminded about ongoing eco-challenges"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.challengeReminders}
                  onChange={() => setSettings({
                    ...settings,
                    challengeReminders: !settings.challengeReminders
                  })}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        )}
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;