import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { CardGiftcard,EmojiEvents,EditLocationSharp, Notifications, Settings, Home } from '@mui/icons-material'; // Import Home icon

import { useNavigate } from 'react-router-dom';
import Achievements from '../gamification/Achievements';

const Navbar = ({onLogout}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem('username');

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      navigate('/');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
        >
          <EditLocationSharp style={{ color: '#4CAF50' }} />
        </IconButton>

        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Carbon Tracker App
        </Typography>

        {/* Add Home IconButton next to Carbon Tracker */}
        <IconButton
          color="inherit"
          onClick={() => navigate('/dashboard')} // Navigate to home page
        >
          <Home style={{ color: '#000' }} /> {/* Home icon */}
        </IconButton>

        <IconButton
          color="inherit"
          onClick={() => navigate('/achievements')}
        >
          <EmojiEvents style={{ color: '#FFD700' }} />
        </IconButton>

        <IconButton
          color="inherit"
          onClick={() => navigate('/Rewards')}
        >
          <CardGiftcard style={{ color: '#FF5722' }} />
        </IconButton>

        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={3} color="primary">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => navigate('/settings')}
          >
            <Settings />
          </IconButton>

          <IconButton onClick={handleProfileClick}>
            <Avatar src={user?.photoURL} alt={user?.username}>
              {user?.username?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate('/profile');
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate('/settings');
            }}
          >
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleClose}
        >
          <MenuItem>New achievement unlocked!</MenuItem>
          <MenuItem>You're leading in weekly challenge</MenuItem>
          <MenuItem>Community milestone reached</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
