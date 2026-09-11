import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import { XIcon } from '@phosphor-icons/react';
import React from 'react';
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
          onClick={!isHover && !forceCollapsed ? toggleSidebar : undefined}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              gap: '1rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ImgComponent
              imageURL={imageUrls.anarixLogoLarge}
              alt="logo-large"
              customStyles={{
                height: '2.2rem',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                maxWidth: 'none',
                marginLeft: isHover ? '4rem' : '0.6rem',
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

          <IconButton
            disableRipple={isSidebarMenuOpen ? false : true}
            sx={{
              borderRadius: '0.4rem',
              padding: '0.3rem',
              opacity: isSidebarMenuOpen ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-label="toggle sidebar"
            onClick={forceCollapsed ? undefined : toggleSidebar}
          >
            <XIcon color="#464646" size={'2rem'} width={'2.4rem'} />
          </IconButton>
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
