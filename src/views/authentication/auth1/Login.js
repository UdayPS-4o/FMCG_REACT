import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Stack, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import constants from 'src/constants';
import { use } from 'i18next';


const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

    useEffect(() => {
      //if token is present in cookies, redirect to /account-master
      const checkAuthentication = async () => {
        try {
          const response = await fetch(constants.baseURL+'/api/checkiskAuth', {
            method: 'GET',
            credentials: 'include', // Ensure cookies are sent with the request
          });
      
          if (response.ok) {  
            const data = await response.json();
            console.log(data);
      
            if (data.authenticated) {
              // If user is authenticated, redirect to /account-master
              window.location.href = '/account-master';
            }
          } else {
            console.error('Failed to authenticate user.');
          }
        } catch (error) {
          // Handle error if the user is not authenticated
          console.error('Authentication check failed:', error);
        }
      };
      checkAuthentication();

    }, []);
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(constants.baseURL+'/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          password,
        }),
        credentials: 'include', // Ensure cookies (token) are included in the request
      });

      if (response.ok) {
        // If login is successful, redirect to /account-master
        navigate('/account-master');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={7}
          xl={8}
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '0.3',
            },
          }}
        >
          <Box position="relative">
            <Box px={3}>
              <Logo />
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              height={'calc(100vh - 75px)'}
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },
              }}
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box p={4}>
            <AuthLogin
              title="Welcome to Modernize"
              subtext={
                <Typography variant="subtitle1" color="textSecondary" mb={1}>
                  Your Admin Dashboard
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="500">
                    New to Modernize?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/auth/register"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Create an account
                  </Typography>
                </Stack>
              }
              handleSubmit={handleSubmit} // Pass handleSubmit to AuthLogin
              mobile={mobile} // Pass mobile and password to AuthLogin
              password={password}
              setMobile={setMobile} // Setters for mobile and password
              setPassword={setPassword}
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
