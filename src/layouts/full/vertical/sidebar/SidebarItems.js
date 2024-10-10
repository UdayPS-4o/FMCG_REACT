import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import constants from 'src/constants';
import { useState,useEffect } from 'react';



const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();

  // State to store user access
  const [routeAccess, setRouteAccess] = useState([]);

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
            setRouteAccess(data.routeAccess); // Store the user's route access
          }
        }
      } catch (error) {
        console.error('Error fetching route access:', error);
        setRouteAccess([]); // No access if fetch fails
      }
    };

    fetchRouteAccess();
  }, []);

  // Filter Menuitems based on user access
  const filterMenuItems = (items) => {
    return items.filter((item) => {
      // If item is "Database", check if the user has "Database" in routeAccess
      if (item.title === 'Database' && !routeAccess.includes('Database')) {
        return false; // Do not show the "Database" menu if the user doesn't have access
      }
    
      if(item.title === 'Approved' && !routeAccess.includes('Approved')){
        return false;
      }
      // If item has children, check if the user has access to at least one child
      if (item.children) {
        const accessibleChildren = item.children.some((child) =>
          routeAccess.includes(child.title) // Check access for each child
        );
        return accessibleChildren;
      }
      
      // If the item doesn't have children, just check its title
      return routeAccess.includes(item.title);
    });
  };

  const accessibleMenuItems = filterMenuItems(Menuitems);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {accessibleMenuItems.map((item, index) => {
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;