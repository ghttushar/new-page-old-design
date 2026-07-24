import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import { ITabData } from '../tabs-select/tabs-select';
import { tabsWithoutIndicatorStyles } from './view-edit-tabs-styles';

interface IViewEditTabsProps {
  tabValue: ITabData;
  handleTabChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: ITabData
  ) => void;
  singleTabStyles?: object;
  tabData: ITabData[];
  toggleDisabled?: boolean;
  disableReason?: string;
}

export default function ViewEditTabs({
  tabValue,
  handleTabChange,
  singleTabStyles,
  tabData,
  toggleDisabled = false,
  disableReason = '',
}: IViewEditTabsProps) {
  return (
    <HoverInfoTooltip title={toggleDisabled ? disableReason : ''}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={tabsWithoutIndicatorStyles}
      >
        {tabData.length > 0 &&
          tabData.map((data, index) => (
            <Tab
              key={`${data.value}-${index}`}
              value={data}
              label={data.label}
              disableTouchRipple
              sx={singleTabStyles}
              disabled={toggleDisabled}
            />
          ))}
      </Tabs>
    </HoverInfoTooltip>
  );
}
