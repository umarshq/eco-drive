import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const AccountSetup = ({ userData, setUserData, onNext }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!userData.email) newErrors.email = "Email is required";
    if (!userData.password) newErrors.password = "Password is required";
    if (!userData.username) newErrors.username = "Username is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      localStorage.setItem("username", userData.username);
      onNext();
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#F5F5F5", borderRadius: "8px" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#2E3B55" }}>
        Create Your Account
      </Typography>
      <TextField
        fullWidth
        label="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Username"
        value={userData.username}
        onChange={(e) =>
          setUserData({ ...userData, username: e.target.value })
        }
        error={!!errors.username}
        helperText={errors.username}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        value={userData.password}
        onChange={(e) =>
          setUserData({ ...userData, password: e.target.value })
        }
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{ backgroundColor: "#FFD700", color: "#2E3B55" }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default AccountSetup;