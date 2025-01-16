import React from 'react';
import { 
  Card, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider 
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  ChevronRight,
  Language,
  DirectionsCar
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Updated import

const Settings = () => {
  const navigate = useNavigate(); // Replaced useHistory with useNavigate

  const settingsItems = [
    {
      icon: <Person />,
      title: 'Profile Settings',
      path: '/settings/profile'
    },
    {
      icon: <Security />,
      title: 'Privacy Settings',
      path: '/settings/privacy'
    },
    {
      icon: <DirectionsCar />,
      title: 'Travel Mode',
      path: '/settings/travel-mode'
    },
    {
      icon: <Notifications />,
      title: 'Notification Preferences',
      path: '/settings/notifications'
    },
    {
      icon: <Language />,
      title: 'Language',
      path: '/settings/language'
    }
  ];

  return (
    <Card>
      <List>
        {settingsItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <ListItem button onClick={() => navigate(item.path)}> {/* Replaced history.push with navigate */}
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <ChevronRight />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < settingsItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default Settings;
