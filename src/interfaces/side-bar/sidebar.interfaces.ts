import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';

export interface IMenuItem {
  key: FeatureRoutes;
  primaryText: string;
  icon?: JSX.Element;
  subMenu?: Array<IMenuItem>;
  feature: FeaturesEnum;
  divider?: boolean;
}

export interface ISideBarComponentProps {
  isSidebarMenuOpen: boolean;
  isHover?: boolean;
}

export interface IMenuItem {
  key: FeatureRoutes;
  primaryText: string;
  icon?: JSX.Element;
  subMenu?: Array<IMenuItem>;
  feature: FeaturesEnum;
  divider?: boolean;
}

export interface IMenuItemProps {
  item: IMenuItem;
  selectedMenuItem: string;
  selectedSubMenuItem: string;
  setSelectedMenuItem: (value: string) => void;
  setSelectedSubMenuItem: (value: string) => void;
  isExpanded?: boolean;
  onMenuItemClick: (menuItemKey: string) => void;
  isSidebarMenuOpen?: boolean;
  isHover?: boolean;
  marketplace: string;
  isInternalUser?: boolean;
}

export interface ISubMenuItemProps {
  subItem: IMenuItem;
  selectedSubMenuItem: string;
  setSelectedSubMenuItem: (value: string) => void;
  selectedMenuItem: string;
  isSidebarMenuOpen?: boolean;
  isHover?: boolean;
  isInternalUser?: boolean;
}
