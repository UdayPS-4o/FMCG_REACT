import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'src/utils/useAuth';
import { useLocation } from 'react-router-dom';
import constants from 'src/constants';
// const PrivateRoute = ({ children }) => {
//   const { isAuth, loading } = useAuth(); // Assuming useAuth provides isAuth and loading state
//   const [isLoaded, setIsLoaded] = useState(false);
//   console.log('isAuth in protected route', isAuth);
//   useEffect(() => {
//     if (!loading) {
//       setIsLoaded(true);
//     }
//   }, [loading]);

//   if (!isLoaded) {
//     return <div>Loading...</div>; // You can replace this with a proper loading component
//   }

//   console.log('isAuth in protected route', isAuth);
//   return isAuth ? children : <Navigate to="/auth/login" />;
// };
function convertToTitleCase(str) {
  return str
      .split('-') // Split by hyphen
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words with a space
}

const PrivateRoute = ({  children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means still loading
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
            setIsAuthenticated(true);
            setRouteAccess(data.routeAccess); // Store the user's route access

            // Check if the user has access to the route
            let accessGranted = false;

            // Normal route access check
            let pathneames= ['account-master' ,'cash-receipts' ,'cash-payments' ]
            console.log('pathneames',pathneames)  
            console.log("data route access",data.routeAccess)
            pathneames.forEach((path) => {
              console.log(convertToTitleCase(path))
              
              if (window.location.pathname.includes(path) && data.routeAccess.includes(convertToTitleCase(path))) {
                console.log('accessGranted',path) 
                accessGranted = true;

                
                console.log('accessGranted',path)
                if (window.location.pathname.includes('db')&&  data.routeAccess.includes('Database') || window.location.pathname.includes('edit')&&  data.routeAccess.includes('Database') || window.location.pathname.includes('print')&&  data.routeAccess.includes('Database')) {
                  accessGranted = false;
                  console.log('accessGranted',accessGranted)
                }
                
              }

            }
            )


            // Handle "Database" routes (e.g., /db/* and edit/print pages)
            if (window.location.pathname.includes('db') && data.routeAccess.includes('Database')) {
              accessGranted = true;
            }

            // Handle edit pages, which should fall under Database category
            if (window.location.pathname.includes('edit') && data.routeAccess.includes('Database')) {
              accessGranted = true;
            }

            // Handle print pages, which should fall under Database category
            if (window.location.pathname.includes('print') && data.routeAccess.includes('Database')) {
              accessGranted = true;
            }

            // Handle "Approved" routes (e.g., /approved/*)
            if (window.location.pathname.includes('Approved') && data.routeAccess.includes('Approved')) {
              accessGranted = true;
            }

            setHasAccess(accessGranted);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching route access:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteAccess();
  }, [window.location.pathname]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  if (!isAuthenticated) {
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
