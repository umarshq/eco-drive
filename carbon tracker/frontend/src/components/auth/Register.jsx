import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, MenuItem, Alert } from "@mui/material";
import api from "../../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    travelMode: "car",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await api.post("/auth/register", formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ p: 4, backgroundColor: "#F5F5F5", borderRadius: "8px" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2E3B55" }}>
          Create Account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Please log in.
          </Alert>
        )}
        <TextField
          fullWidth
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          select
          fullWidth
          label="Travel Mode"
          value={formData.travelMode}
          onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
          helperText="Select your primary travel mode"
          sx={{ mb: 3 }}
        >
          <MenuItem value="car">Car</MenuItem>
          <MenuItem value="bike">Bike</MenuItem>
          <MenuItem value="public">Public Transport</MenuItem>
          <MenuItem value="walk">Walk</MenuItem>
        </TextField>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#FFD700", color: "#2E3B55" }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;