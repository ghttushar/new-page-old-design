import { Tab, Tabs } from '@mui/material';
import React from 'react';
import { ITabData } from './tabs-select';
import { tabsNewStyles } from './tabs-select-styles';

interface INewTabsSelectProps {
  tabValue: string;
  handleTabChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => void;
  tabData: ITabData[];
  width?: string;
  height?: string;
  isNewDesign?: boolean;
}

export default function NewTabsSelect({
  tabValue,
  handleTabChange,
  tabData,
  width = '100%',
  height = '3rem',
  isNewDesign = false,
}: INewTabsSelectProps) {
  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      sx={tabsNewStyles(isNewDesign, width, height)}
      variant="fullWidth"
    >
      {tabData.length > 0 &&
        tabData.map((data, index) => (
          <Tab
            key={`${data.value}-${index}`}
            value={data.value}
            label={data.label}
            disableTouchRipple
            disabled={data.isDisabled}
            sx={{
              '&.Mui-disabled': {
                pointerEvents: 'auto',
                cursor: 'not-allowed',
              },
            }}
          />
        ))}
    </Tabs>
  );
}
