import { SIDEBAR_MENU_ITEMS } from '@/constants/side-bar/sidebar.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISideBarComponentProps } from '@/interfaces/side-bar/sidebar.interfaces';
import { useAppSelector } from '@/redux/hooks';
import {
  selectAdvertisingAccount,
  selectUser,
} from '@/redux/slices/auth/auth.slice';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItem from './menu-item-component';
import styles from './sidebar-component.module.scss';

const SideBarComponent: React.FC<ISideBarComponentProps> = ({
  isSidebarMenuOpen,
  isHover = false,
}) => {
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('');
  const [selectedSubMenuItem, setSelectedSubMenuItem] = useState<string>('');
  const [expandedMenuItem, setExpandedMenuItem] = useState<string | null>(null);
  const selectedAccount = useAppSelector(selectAdvertisingAccount);
  const user = useAppSelector(selectUser);

  const marketplace = useMemo(
    () => selectedAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAccount.marketplace]
  );

  useEffect(() => {
    const path = location.pathname;
    const pathItems = path.split('/');
    if (pathItems.length >= 2) {
      setSelectedMenuItem(pathItems[1]);
      setExpandedMenuItem(pathItems[1]);
      setSelectedSubMenuItem(pathItems[2]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarMenuOpen && !isHover) {
      setSelectedMenuItem('');
      setExpandedMenuItem(null);
    }
  }, [isSidebarMenuOpen, isHover]);

  const handleMenuItemClick = (menuItemKey: string) => {
    if (expandedMenuItem === menuItemKey) {
      setExpandedMenuItem(null);
      setSelectedMenuItem('');
    } else {
      setExpandedMenuItem(menuItemKey);
      setSelectedMenuItem(menuItemKey);
    }
  };

  const isInternalUser = accessControlUtils.checkIsInternalUser(user?.userType);
  return (
    <div className={styles.sidebarComp}>
      {SIDEBAR_MENU_ITEMS(isInternalUser).map((item) => (
        <React.Fragment>
          <MenuItem
            key={`${item.key}-${isHover}`}
            item={item}
            isSidebarMenuOpen={isSidebarMenuOpen}
            isHover={isHover}
            selectedMenuItem={selectedMenuItem}
            selectedSubMenuItem={selectedSubMenuItem}
            setSelectedMenuItem={setSelectedMenuItem}
            setSelectedSubMenuItem={setSelectedSubMenuItem}
            isExpanded={expandedMenuItem === item.key}
            onMenuItemClick={handleMenuItemClick}
            marketplace={marketplace}
            isInternalUser={isInternalUser}
          />
          {item.divider === true && <div className={styles.divider} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideBarComponent;
