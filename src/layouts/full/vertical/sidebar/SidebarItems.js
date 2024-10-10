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
import { useState, useEffect } from 'react';

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
  const filterMenuItems = (items, routeAccess) => {
    return items.filter((item) => {
      // Check for specific items like 'Database' and 'Approved'
      if (
        (item.title === 'Database' && !routeAccess.includes('Database')) ||
        (item.title === 'Approved' && !routeAccess.includes('Approved'))
      ) {
        return false; // Don't show these menus if the user doesn't have access
      }

      // If the item has children, check if the user has access to at least one child
      if (item.children) {
        item.children = item.children.filter(
          (child) => routeAccess.includes(child.title), // Check access for each child
        );
        return item.children.length > 0; // Keep parent only if it has accessible children
      }

      // If the item doesn't have children, just check its title
      return routeAccess.includes(item.title);
    });
  };

  const accessibleMenuItems = filterMenuItems(Menuitems, routeAccess);
  console.log('accessibleMenuItems', accessibleMenuItems);
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {accessibleMenuItems &&
          accessibleMenuItems.map((item, index) => {
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
