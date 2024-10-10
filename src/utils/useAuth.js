import React, { useEffect, useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false); // Start with `false`
  const [routeAccess, setRouteAccess] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuth(true); // Ensure this only runs if `storedUser` is valid
        console.log('User is authenticated', parsedUser);
      } catch (error) {
        console.error('Error parsing storedUser:', error);
      }
    }
  }, []);

  useEffect(() => {
    console.log('isAuth status:', isAuth);
  }, [isAuth]);

  return { user, isAuth, setIsAuth, routeAccess, setRouteAccess };
}
