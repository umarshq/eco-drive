import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, Alert } from "@mui/material";
import {Link,  useNavigate } from "react-router-dom";
import api from "../../utils/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      onLogin(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ p: 4, backgroundColor: "#F5F5F5", borderRadius: "8px" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2E3B55" }}>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#FFD700", color: "#2E3B55" }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link to="/onboarding" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;