import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'src/utils/useAuth';
import { useLocation } from 'react-router-dom';
import constants from 'src/constants';

function convertToTitleCase(str) {
  if (str.includes('-')) {
    return str
      .split('-') // Split by hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words with a space
  } else {
    return str.charAt(0).toUpperCase() + str.slice(1); // Convert to title case if no hyphen
  }
}

const PrivateRoute = ({ children }) => {
  const { isAuth, setIsAuth } = useAuth(); // Use the `useAuth` hook to check auth status
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeAccess, setRouteAccess] = useState([]);
  const location = useLocation();

  // Fetch the user's route access from the backend
  useEffect(() => {
    const fetchRouteAccess = async () => {
      try {
        const response = await fetch(`${constants.baseURL}/api/checkiskAuth`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuth(true); // Update auth status
            setRouteAccess(data.routeAccess); // Store the user's route access

            // Check if the user has access to the route
            let accessGranted = false;
            let pathneames = [
              'account-master',
              'cash-receipts',
              'cash-payments',
              'godown-transfer',
              'invoicing',
            ];

            pathneames.forEach((path) => {
              console.log(path, 'path');
              if (
                window.location.pathname.includes(path) &&
                data.routeAccess.includes(convertToTitleCase(path))
              ) {
                accessGranted = true;

                // Special handling for db, edit, and print pages under the Database category
                if (
                  (window.location.pathname.includes('db') &&
                    !data.routeAccess.includes('Database')) ||
                  (window.location.pathname.includes('edit') &&
                    !data.routeAccess.includes('Database')) ||
                  (window.location.pathname.includes('print') &&
                    !data.routeAccess.includes('Database'))
                ) {
                  accessGranted = false;
                }
                if (
                  window.location.pathname.includes('approved') &&
                  !data.routeAccess.includes('Approved')
                ) {
                  accessGranted = false;
                }
              }
            });

            // Handle "Database" routes
            if (window.location.pathname.includes('db') && data.routeAccess.includes('Database')) {
              accessGranted = true;
            }

            // Handle edit and print pages under Database
            if (
              window.location.pathname.includes('edit') &&
              data.routeAccess.includes('Database')
            ) {
              accessGranted = true;
            }

            if (
              window.location.pathname.includes('print') &&
              data.routeAccess.includes('Database')
            ) {
              accessGranted = true;
            }

            // Handle "Approved" routes
            if (
              window.location.pathname.includes('approved') &&
              data.routeAccess.includes('Approved')
            ) {
              accessGranted = true;
            }

            setHasAccess(accessGranted);
          } else {
            setIsAuth(false); // Set to false if not authenticated
          }
        } else {
          setIsAuth(false); // Set to false on failed response
        }
      } catch (error) {
        console.error('Error fetching route access:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteAccess();
  }, [window.location.pathname, setIsAuth]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (!hasAccess) {
    // Show access denied message if the user doesn't have access
    return <div>You don't have access to this page.</div>;
  }

  // Render children if authenticated and has access
  return children;
};

export default PrivateRoute;
