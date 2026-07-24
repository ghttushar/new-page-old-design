import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DISABLED_FEATURE_REASON } from '@/constants/feature-flag/feature-flag.constants';
import { SIDEBAR_MENU_ITEMS } from '@/constants/side-bar/sidebar.constants';
import { FeatureRoutes } from '@/enums/auth.enums';
import useIsMenuItemDisabled from '@/hooks/use-is-menu-item-disabled.hooks';
import {
  IMenuItem,
  IMenuItemProps,
} from '@/interfaces/side-bar/sidebar.interfaces';
import {
  selectIsHistorySideBarOpen,
  selectIsPreviewOpen,
  setIsHistorySideBarOpen,
  setIsPreviewOpen,
} from '@/redux/chatbot/chatbot.slice';
import {
  checkIsFeatureInBeta,
  debounce,
  getMenuItemBySelectedSubMenu,
} from '@/utils';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@mui/material/styles';
import { CaretDownIcon } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  setIsChatbotExpanded,
  setIsSidebarMenuOpen,
} from 'src/redux/slices/auth/auth.slice';
import CustomBadge from '../../common/custom-badge/custom-badge';
import HoverInfoTooltip from '../../common/hover-info-tooltip/hover-info-tooltip';
import {
  fontWeightTheme,
  popoverContentStyles,
  primaryColor,
  subMenuStyles,
  theme,
} from './menu-item-component-styles';
import menuItemStyles from './menu-item-component.module.scss';
import { sideBarStyles } from './side-bar-styles';
import styles from './sidebar-component.module.scss';
import SubMenuItem from './sub-menu-item-component';

const MenuItem = (props: IMenuItemProps) => {
  const {
    item,
    selectedMenuItem,
    selectedSubMenuItem,
    setSelectedMenuItem,
    setSelectedSubMenuItem,
    isSidebarMenuOpen,
    isHover = false,
    isExpanded,
    onMenuItemClick,
    marketplace,
    isInternalUser = false,
  } = props;
  const disabledItem = useIsMenuItemDisabled(item);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isJIVASideBarOpen = useAppSelector(selectIsHistorySideBarOpen);
  const isPreviewOpen = useAppSelector(selectIsPreviewOpen);

  const [isHovered, setIsHovered] = useState(false);

  const debouncedSetHovered = useMemo(
    () =>
      debounce(() => {
        setIsHovered(true);
      }, 100),
    []
  );

  const toggleJIVASidebar = () => {
    if (isPreviewOpen) dispatch(setIsPreviewOpen(false));
    dispatch(setIsHistorySideBarOpen(!isJIVASideBarOpen));
  };

  const isMenuItemSelected = (item: IMenuItem) => {
    if (isHover && item.key === FeatureRoutes.JIVA_CHATBOT_PAGE) return true;
    return isHover
      ? selectedMenuItemBySubMenu?.key === item.key
      : isSidebarMenuOpen
      ? selectedMenuItem === item.key
      : selectedMenuItemBySubMenu?.key === item.key;
  };

  const selectedMenuItemBySubMenu = getMenuItemBySelectedSubMenu(
    SIDEBAR_MENU_ITEMS(isInternalUser),
    selectedSubMenuItem
  );
  const isMenuSelected = isMenuItemSelected(item);

  const isSubMenuParentSelected = selectedMenuItemBySubMenu?.key === item.key;

  const isMenuActive = isMenuSelected || isHovered || isSubMenuParentSelected;

  const isMenuHighlighted = isMenuSelected || isSubMenuParentSelected;

  const handleMenuItemClick = (menuItem: string) => {
    if (disabledItem) return;
    setSelectedMenuItem(menuItem);
    onMenuItemClick(menuItem);

    if (menuItem === FeatureRoutes.JIVA_CHATBOT_PAGE) {
      toggleJIVASidebar();
      dispatch(setIsSidebarMenuOpen(false));
      if (!isHover) {
        navigate(`/${menuItem}`);
        return;
      }
    }

    if (!isHover && !isSidebarMenuOpen) {
      dispatch(setIsSidebarMenuOpen(true));
    }

    const pathname = `/${menuItem}`;
    if (!item.subMenu) navigate(pathname);
  };

  const handleMouseEnter = () => {
    if (disabledItem) return;
    debouncedSetHovered();
  };

  const handleMouseLeave = () => {
    debouncedSetHovered.cancel();
    if (!disabledItem) setIsHovered(false);
  };

  const iconElement =
    item.icon &&
    React.cloneElement(item.icon, {
      weight: isMenuActive ? 'fill' : 'regular',
      color: isMenuActive ? primaryColor : disabledItem ? '#bfbfbf' : '#464646',
    });

  const handleTriggerMouseEnter = () => {
    if (item.key === FeatureRoutes.JIVA_CHATBOT_PAGE) return;
    handleMenuItemClick(item.key);
    handleMouseEnter();
  };

  const handleTriggerClick = () => {
    if (disabledItem) return;
    dispatch(setIsChatbotExpanded(false));
    handleMenuItemClick(item.key);
  };

  if (isHover) {
    return (
      <div key={item.key} className={menuItemStyles.popoverWrapper}>
        <Popover open={isHovered && !!item.subMenu}>
          <PopoverTrigger
            onMouseEnter={handleTriggerMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={menuItemStyles.popoverTrigger}
          >
            <ListItem
              sx={{
                ...sideBarStyles,
                borderRadius: '0',
                display: 'flex',
                justifyContent: 'space-between',
                margin: 0,
                background: isHovered
                  ? 'linear-gradient(to right, white,white,#f5f6f7,#f5f6f7,#f5f6f7)'
                  : '',
              }}
              className={`${styles.sidebarItem} ${
                disabledItem ? styles.disabled : ''
              }`}
              onClick={handleTriggerClick}
            >
              <div
                className={`${styles.iconContainer} ${
                  isMenuHighlighted ? styles.active : styles.inactive
                }`}
                style={{
                  backgroundColor: isMenuSelected || isHovered ? '#f5f6f7' : '',
                  padding: '1rem',
                  borderRadius: isHovered ? '0.8rem 0 0 0.8rem' : '',
                }}
              >
                <ListItemIcon>{iconElement}</ListItemIcon>
              </div>
            </ListItem>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={-9}
            style={popoverContentStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {item.subMenu && (
              <div style={subMenuStyles(isHovered)}>
                <span className={styles.primaryText}>
                  <CustomBadge
                    badgeContent={'Beta'}
                    invisible={checkIsFeatureInBeta(item.key) === false}
                    customBadgeStyles={{
                      padding: '0 0.2rem',
                      fontSize: '0.7rem',
                      top: -1.4,
                      opacity: disabledItem ? 0.5 : 1,
                    }}
                  >
                    {item.primaryText}
                  </CustomBadge>
                </span>
                <div className="mt-[1rem]">
                  {item.subMenu.map((subItem) => (
                    <div className="my-[0.6rem]">
                      <SubMenuItem
                        key={subItem.key}
                        selectedMenuItem={selectedMenuItem}
                        selectedSubMenuItem={selectedSubMenuItem}
                        subItem={subItem}
                        setSelectedSubMenuItem={setSelectedSubMenuItem}
                        isHover={true}
                        isInternalUser={isInternalUser}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div key={item.key} className={menuItemStyles.menuItemWrapper}>
      <HoverInfoTooltip
        title={
          disabledItem
            ? DISABLED_FEATURE_REASON[item.feature] ?? item.primaryText
            : !isSidebarMenuOpen
            ? item.primaryText
            : ''
        }
        position={TooltipPlacement.Right}
      >
        <ListItem
          sx={{
            backgroundColor: isSidebarMenuOpen
              ? isMenuActive
                ? '#f5f6f7'
                : 'transparent'
              : '',
            ...sideBarStyles,
            width: '100%',
            borderRadius: isMenuSelected ? '0.8rem 0.8rem 0 0' : '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
          className={`${styles.sidebarItem} ${
            disabledItem ? styles.disabled : ''
          }`}
          onClick={() => handleMenuItemClick(item.key)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`${styles.iconContainer} ${
              isMenuHighlighted ? styles.active : styles.inactive
            }`}
            style={{
              backgroundColor: isMenuSelected || isHovered ? '#f5f6f7' : '',
              padding: '1rem',
              marginLeft: '-1.1rem',
            }}
          >
            <ListItemIcon
              style={{
                opacity: disabledItem ? 0.5 : 1,
              }}
            >
              {iconElement}
            </ListItemIcon>
          </div>

          <ThemeProvider theme={isMenuActive ? fontWeightTheme : theme}>
            <ListItemText
              data-test={`Top-menu-${item.key}`}
              sx={{
                width: 'max-content',
                opacity: isSidebarMenuOpen ? 1 : 0,
                transition: 'opacity 0.5s ease',
                marginLeft: '-1rem',
              }}
              primary={
                <CustomBadge
                  badgeContent={'Beta'}
                  invisible={checkIsFeatureInBeta(item.key) === false}
                  customBadgeStyles={{
                    padding: '0 0.2rem',
                    fontSize: '0.7rem',
                    top: -1.4,
                    opacity: disabledItem ? 0.5 : 1,
                  }}
                >
                  {item.primaryText}
                </CustomBadge>
              }
              className={styles.sidebarText}
              style={{
                color: isMenuActive
                  ? primaryColor
                  : disabledItem
                  ? '#bfbfbf'
                  : '#464646',
                fontStyle: isMenuActive ? 'bold' : 'normal',
              }}
            />
            {isSidebarMenuOpen && item.subMenu && (
              <CaretDownIcon
                className={`${styles.caret} ${
                  isExpanded ? styles.expanded : ''
                }`}
                size={'1.2rem'}
                color={isHovered ? primaryColor : '#464646'}
              />
            )}
          </ThemeProvider>
        </ListItem>
      </HoverInfoTooltip>
      {item.subMenu && isSidebarMenuOpen && (
        <div
          className={`${menuItemStyles.subMenuItemWrapper} ${
            isExpanded ? menuItemStyles.expandedSubMenu : ''
          }`}
        >
          {item.subMenu.map((subItem) => (
            <div
              className={menuItemStyles.subMenuItemContainer}
              key={subItem.key}
            >
              <SubMenuItem
                key={subItem.key}
                selectedMenuItem={selectedMenuItem}
                selectedSubMenuItem={selectedSubMenuItem}
                subItem={subItem}
                setSelectedSubMenuItem={setSelectedSubMenuItem}
                isSidebarMenuOpen={isSidebarMenuOpen}
                isInternalUser={isInternalUser}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
