
import React from "react";
import logo from "../../Assets/Back.jpg.jpg";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <Box
      sx={{
        display: "flex", 
        height: "100vh", 
        width: "100vw", 
      }}
    >
    
      <Box
        sx={{
          flex: 1, 
          backgroundImage: `url(${logo})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
       
        }}
      />

     
      <Box
        sx={{
          flex: 1, 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#25274D", 
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 3,
            borderRadius: 2,
            textAlign: "center",
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#25274D" }}
          >
            Login to Navamitra Chains
          </Typography>
          <Button
            onClick={handleLogin}
            variant="contained"
            size="large"
            sx={{
              textTransform: "none",
              backgroundColor: "#25274D",
              color: "#fff",
            }}
          >
            Login
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
