import React from 'react';
import { IDropdownItem } from '../dropdown/dropdown';
import styles from './tabs-with-icon.module.scss';

interface TabWithIconProps {
  tabs: IDropdownItem<string>[];
  handleTabSelect: (val: IDropdownItem<string>) => void;
  customStyles?: React.CSSProperties;
}
function TabItemWithIcon({
  tabs,
  handleTabSelect,
  customStyles,
}: Readonly<TabWithIconProps>) {
  return (
    <div className="flex gap-[1rem] flex-wrap">
      {tabs.map((tab) => {
        return (
          <div
            key={tab.value}
            className={`${styles.tabItem} ${
              tab.selected ? styles.active : ''
            } ${tab.isDisabled ? styles.disabled : ''}`}
            style={customStyles}
            onClick={() => {
              handleTabSelect(tab);
            }}
          >
            {tab.prefixElement ?? null}
            {tab.label}
          </div>
        );
      })}
    </div>
  );
}

export default TabItemWithIcon;
