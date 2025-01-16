import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import ecodrive from "../../images/eco-drive.jpg"; // Example image import




const Home = () => {
  const navigate = useNavigate();





  return (
    <>
      {/* Header AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#2E3B55" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#FFD700" }}>
            Carbon Tracker App
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")} sx={{ color: "#FFD700" }}>
            Login
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/onboarding")}
            sx={{ color: "#FFD700", marginLeft: "1rem" }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>



      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Section: Welcome Text */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom sx={{ color: "#2E3B55" }}>
              Welcome to Carbon Tracker App
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#555555" }}>
              Track your carbon footprint, discover eco-friendly travel options, 
              and join a community making a positive impact on the planet.
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFD700",
                  color: "#2E3B55",
                  marginRight: "1rem",
                }}
                onClick={() => navigate("/onboarding")}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#FFD700",
                  color: "#2E3B55",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Box>
          </Grid>

          {/* Right Section: Image */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: "8px" }}>
              <img
                src={ecodrive}
                alt="Carbon Tracker App"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: "#F5F5F5", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom align="center" sx={{ color: "#2E3B55" }}>
            Why Choose Carbon Tracker App?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Track Your Impact",
                description:
                  "Monitor your carbon emissions and understand how your actions affect the environment.",
              },
              {
                title: "Eco-Friendly Travel",
                description:
                  "Discover sustainable travel options and reduce your environmental footprint.",
              },
              {
                title: "Join the Community",
                description:
                  "Connect with like-minded individuals making a difference for our planet.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: "#2E3B55" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555555" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 6, backgroundColor: "#FFD700", color: "#2E3B55" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom align="center">
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                quote:
                  "Carbon Tracker App has completely changed the way I think about my travel habits. It's a game-changer!",
                name: "Sarah P.",
              },
              {
                quote:
                  "I love how easy it is to track my carbon footprint and make better choices for the environment.",
                name: "John D.",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={3} sx={{ padding: "1.5rem", borderRadius: "8px" }}>
                  <Typography variant="body1" paragraph>"{testimonial.quote}"</Typography>
                  <Typography variant="subtitle1">- {testimonial.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          backgroundColor: "#2E3B55",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
          © {new Date().getFullYear()} Carbon Tracker App. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Home;