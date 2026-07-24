import {
  AmazonAdvertisingTableTypesEnum,
  WalmartAdvertisingTableTypeEnum,
} from '@/enums/advertising.enums';
import { FilterDropdownValue } from '@/enums/filter.enums';
import { getTitleCaseString } from '@/utils';
import { CircleIcon } from '@phosphor-icons/react';
import React from 'react';
import HoverInfoTooltip from '../../common/hover-info-tooltip/hover-info-tooltip';

interface AutomationIconProps {
  table: AmazonAdvertisingTableTypesEnum | WalmartAdvertisingTableTypeEnum;
  bidAutomation?: string;
  hideIcon?: boolean;
  children: React.ReactNode;
}
function AutomationIcon(props: AutomationIconProps) {
  const {
    bidAutomation = FilterDropdownValue.NO,
    table,
    children,
    hideIcon = true,
  } = props;

  if (bidAutomation !== FilterDropdownValue.YES || hideIcon === true)
    return children;
  return (
    <div className="flex items-center">
      {children}
      <div className="ml-[0.6rem]">
        <HoverInfoTooltip
          title={
            <span>
              Bids has been setup <br />
              at "{getTitleCaseString(table)} Level"
            </span>
          }
        >
          <CircleIcon
            color="#25B668"
            weight="fill"
            className="cursor-pointer"
          />
        </HoverInfoTooltip>
      </div>
    </div>
  );
}

export default AutomationIcon;
