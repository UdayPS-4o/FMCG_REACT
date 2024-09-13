import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'src/utils/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth(); // Assuming useAuth provides isAuth and loading state
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsLoaded(true);
    }
  }, [loading]);

  if (!isLoaded) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  console.log('isAuth in protected route', isAuth);
  return isAuth ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
