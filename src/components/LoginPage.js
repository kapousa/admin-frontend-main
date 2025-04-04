import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
//import { API_BASE_URL } from '../config'; // Import the API_BASE_URL
import { API_BASE_URL } from '../services/api'; // Import the API_BASE_URL

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.get(`${API_BASE_URL}/companies/`, {
        auth: {
          username: username,
          password: password,
        },
      });
      onLoginSuccess(username, password); // Pass username and password
      navigate('/admin/companies');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Incorrect username or password');
      } else {
        setError('An error occurred during login');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;