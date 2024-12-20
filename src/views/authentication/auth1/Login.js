import React, { useState, useEffect } from 'react';
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
        const response = await fetch(constants.baseURL + '/api/checkiskAuth', {
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
      const response = await fetch(constants.baseURL + '/api/login', {
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
      <Grid
        container
        style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box p={4}>
            <AuthLogin
              title="Welcome to Ekta Enterprises"
              subtext={''}
              subtitle={''}
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
