import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import { SidebarSimpleIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectIsSidebarMenuOpen,
  setIsSidebarMenuOpen,
} from 'src/redux/slices/auth/auth.slice';

import { imageUrls } from '@/constants/assets/images.constants';
import ImgComponent from '../../common/img-component/img-component';
import {
  drawerPaperProps,
  drawerStyles,
  listStyles,
  sideBarLogoStyles,
} from './side-bar-styles';
import SideBarComponent from './sidebar-component';

interface SidebarProps {
  isHover?: boolean;
  /** Renders the collapsed (icon-only) width regardless of the user's global sidebar preference, and disables the expand toggle — for contexts (e.g. the design-handoff preview screens) that want the nav present but out of the way, without touching the shared open/closed setting used elsewhere in the app. */
  forceCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isHover = false, forceCollapsed = false }) => {
  const isSidebarMenuOpenSetting = useAppSelector(selectIsSidebarMenuOpen);
  const isSidebarMenuOpen = forceCollapsed ? false : isSidebarMenuOpenSetting;
  const dispatch = useAppDispatch();

  const toggleSidebar = () => {
    dispatch(setIsSidebarMenuOpen(!isSidebarMenuOpenSetting));
  };
  // Collapsed, the rail is too narrow for a separate button: hovering the logo swaps it for the sidebar icon instead.
  const canToggle = !isHover && !forceCollapsed;
  const [logoHover, setLogoHover] = useState(false);
  const showOpenIcon = canToggle && !isSidebarMenuOpen && logoHover;

  return (
    <Drawer
      variant="permanent"
      sx={{
        ...drawerStyles(isSidebarMenuOpen),
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
      anchor="left"
      elevation={0}
      PaperProps={{
        sx: drawerPaperProps,
      }}
    >
      <List sx={listStyles}>
        <ListItemIcon
          style={{
            ...sideBarLogoStyles,
            width: '98%',
            justifyContent: isHover ? 'center' : 'space-between',
          }}
          onClick={canToggle ? toggleSidebar : undefined}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              gap: '1rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
            }}
          >
            {canToggle && !isSidebarMenuOpen && (
              <Tooltip title="Show sidebar" placement="right" arrow>
                <span
                  role="button"
                  aria-label="Show sidebar"
                  style={{
                    position: 'absolute', left: '0.2rem', bottom: '-0.4rem', width: '3rem', height: '3rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '0.6rem', background: '#f3f4f6', color: '#464646', cursor: 'pointer',
                    opacity: showOpenIcon ? 1 : 0, transition: 'opacity 150ms ease-out', zIndex: 1,
                  }}
                >
                  <SidebarSimpleIcon size={'2rem'} />
                </span>
              </Tooltip>
            )}
            <ImgComponent
              imageURL={imageUrls.anarixLogoLarge}
              alt="logo-large"
              customStyles={{
                height: '2.2rem',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                maxWidth: 'none',
                marginLeft: isHover ? '4rem' : '0.6rem',
                opacity: showOpenIcon ? 0 : 1,
              }}
            />
            <ImgComponent
              imageURL={imageUrls.logo_name}
              alt="logo"
              customStyles={{
                height: '1.7rem',
                opacity: isSidebarMenuOpen ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>

          <Tooltip title={isSidebarMenuOpen ? 'Hide sidebar' : ''} placement="right" arrow>
          <IconButton
            disableRipple={isSidebarMenuOpen ? false : true}
            sx={{
              borderRadius: '0.4rem',
              padding: '0.3rem',
              opacity: isSidebarMenuOpen ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-label={isSidebarMenuOpen ? 'Hide sidebar' : 'Show sidebar'}
            onClick={forceCollapsed ? undefined : toggleSidebar}
          >
            <SidebarSimpleIcon color="#464646" size={'2rem'} />
          </IconButton>
          </Tooltip>
        </ListItemIcon>
        <SideBarComponent
          isSidebarMenuOpen={isSidebarMenuOpen}
          isHover={isHover}
        />
      </List>
    </Drawer>
  );
};

export default Sidebar;
