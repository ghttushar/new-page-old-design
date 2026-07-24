import React from 'react';
import { fancyScrollbar } from 'src/assets/styles/scrollbar.styles';

export const openDrawerWidth = '20rem';
export const closeDrawerWidth = '5.3rem';

export const drawerStyles = (isSidebarMenuOpen: boolean) => {
  return {
    width: isSidebarMenuOpen ? openDrawerWidth : closeDrawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflowX: 'hidden !important',
    marginRight: '0 !important',
    '& .MuiDrawer-paper': {
      overflowX: 'hidden !important',
      width: isSidebarMenuOpen ? openDrawerWidth : closeDrawerWidth,
      boxSizing: 'border-box',
      transition: 'width 0.4s ease',
      marginRight: '0 !important',
      ...fancyScrollbar,
    },
  };
};
export const drawerPaperProps = {
  boxShadow: '2px 0 4px 0 rgba(0, 0, 0, 0.1)',
  borderTop: 'none',
  border: 'none',
  borderRadius: '0 1.2rem 1.2rem 0',
};

export const listStyles = {
  '.MuiListItemIcon-root': {
    margin: 0,
    minWidth: '1rem',
    marginRight: 0,
  },
  '.MuiListItemItem-root': {
    marginRight: 0,
    margin: 0,
    padding: 0,
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: 0,
};

export const sideBarLogoStyles = {
  marginTop: '0.8rem',
  marginBottom: '3.5rem',
  display: 'flex',
  cursor: 'pointer',
  height: '3rem',
};

export const subMenuItemStyles = (isHoverMode = false): React.CSSProperties => {
  return {
    borderRadius: '0.4rem',
    width: isHoverMode ? '100%' : '76%',
    marginBlock: '0.4rem',
    marginLeft: isHoverMode ? '0' : '3.5rem',
    marginTop: '-0.2rem',
  };
};

export const sideBarStyles = {
  height: '4rem',
  borderRadius: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '97%',
};
