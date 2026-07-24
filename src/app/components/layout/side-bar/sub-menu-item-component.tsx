import { SIDEBAR_MENU_ITEMS } from '@/constants/side-bar/sidebar.constants';
import useIsMenuItemDisabled from '@/hooks/use-is-menu-item-disabled.hooks';
import { ISubMenuItemProps } from '@/interfaces/side-bar/sidebar.interfaces';
import {
  selectIsHistorySideBarOpen,
  setIsHistorySideBarOpen,
} from '@/redux/chatbot/chatbot.slice';
import { selectIsEditModeOn } from '@/redux/slices/rules/rules.slice';
import { checkIsFeatureInBeta, getMenuItemBySelectedSubMenu } from '@/utils';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  setIsChatbotExpanded,
  setIsNavigating,
  setIsSidebarMenuOpen,
  setPendingNavigationPath,
} from 'src/redux/slices/auth/auth.slice';
import {
  setAppliedFilters,
  setFilters,
} from 'src/redux/slices/filters/filter.slice';
import CustomBadge from '../../common/custom-badge/custom-badge';
import {
  subMenuFontWeightTheme,
  subMenuTheme,
} from './menu-item-component-styles';
import { subMenuItemStyles } from './side-bar-styles';
import styles from './sidebar-component.module.scss';

const SubMenuItem = (props: ISubMenuItemProps) => {
  const {
    subItem,
    selectedSubMenuItem,
    setSelectedSubMenuItem,
    selectedMenuItem,
    isSidebarMenuOpen,
    isHover = false,
    isInternalUser = false,
  } = props;
  const isDisabled = useIsMenuItemDisabled(subItem);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isEditModeOn = useAppSelector(selectIsEditModeOn);
  const isJIVASideBarOpen = useAppSelector(selectIsHistorySideBarOpen);

  const isSubMenuItemSelected = useMemo(
    () => subItem.key === selectedSubMenuItem,
    [subItem, selectedSubMenuItem]
  );

  const handleSubMenuItemClick = (subMenuItem: string) => {
    if (isDisabled) return;
    if (selectedSubMenuItem === subMenuItem) return;

    const selectedItem = getMenuItemBySelectedSubMenu(
      SIDEBAR_MENU_ITEMS(isInternalUser),
      subMenuItem
    );

    let pathname = `/${selectedMenuItem}/${subMenuItem}`;
    if (selectedItem) {
      pathname = `/${selectedItem.key}/${subMenuItem}`;
    }

    if (isEditModeOn) {
      dispatch(setIsNavigating(true));
      dispatch(setPendingNavigationPath(pathname));
      return;
    }

    if (isHover) {
      if (isJIVASideBarOpen) {
        dispatch(setIsHistorySideBarOpen(false));
      }
      dispatch(setIsSidebarMenuOpen(false));
      dispatch(setIsChatbotExpanded(false));
    }

    dispatch(setAppliedFilters([]));
    dispatch(setFilters([]));
    dispatch(setSearchText(''));
    setSelectedSubMenuItem(subMenuItem);
    navigate(pathname);
  };

  return (
    <ListItem
      data-test={`sub-menu-item-${subItem.key}`}
      onClick={() => handleSubMenuItemClick(subItem.key)}
      key={subItem.key}
      className={`${isDisabled ? styles.disabled : ''} ${styles.subMenuHover} ${
        isSubMenuItemSelected === true ? styles.MenuActive : ''
      }`}
      style={{
        ...subMenuItemStyles(isHover),
        background: isDisabled ? 'none' : '',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      {(isSidebarMenuOpen || isHover) && (
        <ThemeProvider
          theme={
            isSubMenuItemSelected === true
              ? subMenuFontWeightTheme
              : subMenuTheme
          }
        >
          <ListItemText
            primary={
              <CustomBadge
                badgeContent={'Beta'}
                invisible={checkIsFeatureInBeta(subItem.key) === false}
                customBadgeStyles={{
                  padding: '0 0.2rem',
                  fontSize: '0.7rem',
                  top: -1.4,
                }}
              >
                {subItem.primaryText}
              </CustomBadge>
            }
            style={{
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              backgroundColor: 'inherit',
            }}
            className={`${styles.subMenuText} ${
              isDisabled ? styles.disabled : ''
            } ${isSubMenuItemSelected === true ? styles.active : ''}`}
          />
        </ThemeProvider>
      )}
    </ListItem>
  );
};

export default SubMenuItem;
