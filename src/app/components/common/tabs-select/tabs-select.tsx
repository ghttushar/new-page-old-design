import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { KeywordTrackerDataTestIds } from '../../../../../cypress/enums/keyword-tracker';
import {
  tabsWithIndicatorStyles,
  tabsWithoutIndicatorStyles,
} from './tabs-select-styles';

export interface ITabData {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface ITabsSelectProps {
  tabValue: string;
  handleTabChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => void;
  tabsWithIndicator: boolean;
  singleTabStyles?: object;
  tabData: ITabData[];
}

export default function TabsSelect({
  tabValue,
  handleTabChange,
  tabsWithIndicator,
  singleTabStyles,
  tabData,
}: ITabsSelectProps) {
  return (
    <Tabs
      data-test={KeywordTrackerDataTestIds.KEYWORD_TRACKER_TABS}
      value={tabValue}
      onChange={handleTabChange}
      sx={
        tabsWithIndicator ? tabsWithIndicatorStyles : tabsWithoutIndicatorStyles
      }
    >
      {tabData.length > 0 &&
        tabData.map((data, index) => (
          <Tab
            key={`${data.value}-${index}`}
            value={data.value}
            label={data.label}
            disableTouchRipple
            sx={singleTabStyles}
          />
        ))}
    </Tabs>
  );
}
