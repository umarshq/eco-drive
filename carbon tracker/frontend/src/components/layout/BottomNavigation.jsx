// src/components/layout/BottomNavigation.jsx
import React from 'react';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import {
  Dashboard,
  DirectionsCar,
  Group,
  EmojiEvents,
  Timeline
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue); // Replaces history.push
  };

  return (
    <Paper
      elevation={3}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <MuiBottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Dashboard"
          value="/dashboard"
          icon={<Dashboard />}
        />
        <BottomNavigationAction
          label="Track"
          value="/track-commute"
          icon={<DirectionsCar />}
        />
        <BottomNavigationAction
          label="Community"
          value="/community"
          icon={<Group />}
        />
        <BottomNavigationAction
          label="Challenges"
          value="/challenges"
          icon={<EmojiEvents />}
        />
        <BottomNavigationAction
          label="Analytics"
          value="/analytics"
          icon={<Timeline />}
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
