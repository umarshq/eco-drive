import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import {
  DirectionsCar,
  DirectionsBike,
  DirectionsTransit,
  DirectionsWalk,
} from "@mui/icons-material";

const TravelModeSetup = ({ userData, setUserData, onNext, onBack }) => {
  // Define travel modes
  const travelModes = [
    {
      id: "car",
      icon: <DirectionsCar fontSize="large" sx={{ color: "#FFD700" }} />,
      label: "Car",
      description: "Regular car commute",
    },
    {
      id: "bike",
      icon: <DirectionsBike fontSize="large" sx={{ color: "#FFD700" }} />,
      label: "Bicycle",
      description: "Eco-friendly cycling",
    },
    {
      id: "public",
      icon: <DirectionsTransit fontSize="large" sx={{ color: "#FFD700" }} />,
      label: "Public Transport",
      description: "Bus or train travel",
    },
    {
      id: "walk",
      icon: <DirectionsWalk fontSize="large" sx={{ color: "#FFD700" }} />,
      label: "Walking",
      description: "Walking or running",
    },
  ];

  // Handle mode selection
  const handleModeSelect = (mode) => {
    setUserData({ ...userData, travelMode: mode });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#F5F5F5", borderRadius: "8px" }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ color: "#2E3B55" }}>
        How do you usually commute?
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#555555" }}>
        Select your primary mode of transportation.
      </Typography>

      {/* Travel Modes */}
      <Grid container spacing={4}>
        {travelModes.map((mode) => (
          <Grid item xs={12} md={6} key={mode.id}>
            <Card
              elevation={3}
              sx={{
                border:
                  userData.travelMode === mode.id
                    ? "2px solid #FFD700"
                    : "2px solid transparent",
                borderRadius: "8px",
              }}
            >
              <CardActionArea onClick={() => handleModeSelect(mode.id)}>
                <CardContent
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {mode.icon}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#2E3B55", mt: 1 }}
                  >
                    {mode.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555555" }}>
                    {mode.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Navigation Buttons */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={onBack}
          variant="outlined"
          sx={{
            borderColor: "#FFD700",
            color: "#2E3B55",
          }}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          variant="contained"
          sx={{
            backgroundColor: "#FFD700",
            color: "#2E3B55",
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default TravelModeSetup;