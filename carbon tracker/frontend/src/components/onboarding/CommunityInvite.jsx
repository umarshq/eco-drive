import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const CommunityInvite = ({ userData, setUserData, onBack, onComplete }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleAddEmail = () => {
    if (!email) {
      setError("Please enter an email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (userData.invitedEmails.includes(email)) {
      setError("Email already added");
      return;
    }

    setUserData({
      ...userData,
      invitedEmails: [...userData.invitedEmails, email],
    });
    setEmail("");
    setError("");
  };

  const handleDeleteEmail = (emailToDelete) => {
    setUserData({
      ...userData,
      invitedEmails: userData.invitedEmails.filter((e) => e !== emailToDelete),
    });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#F5F5F5", borderRadius: "8px" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#2E3B55" }}>
        Invite Friends & Family
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#555555" }}>
        Track your carbon footprint together and compete for a greener future.
      </Typography>
      <TextField
        fullWidth
        label="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (
            <Button
              onClick={handleAddEmail}
              color="primary"
              variant="contained"
              sx={{ backgroundColor: "#FFD700", color: "#2E3B55" }}
            >
              <AddIcon /> Add
            </Button>
          ),
        }}
        sx={{ mb: 2 }}
      />
      {userData.invitedEmails.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: "#2E3B55" }}>
            Invited Members
          </Typography>
          {userData.invitedEmails.map((email) => (
            <Chip
              key={email}
              label={email}
              onDelete={() => handleDeleteEmail(email)}
              sx={{ marginRight: "8px", marginBottom: "8px" }}
            />
          ))}
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <Button onClick={onBack} variant="outlined" sx={{ marginRight: "1rem", borderColor: "#FFD700", color: "#2E3B55" }}>
          Back
        </Button>
        <Button onClick={onComplete} variant="contained" sx={{ backgroundColor: "#FFD700", color: "#2E3B55" }}>
          Complete Setup
        </Button>
      </Box>
    </Box>
  );
};

export default CommunityInvite;