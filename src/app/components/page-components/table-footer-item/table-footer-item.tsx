import { getTimeFromMilitaryTimeStamp } from '@/utils/datetime.utils';
import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import { displayValue, formatNum, hasProperty } from 'src/utils';

/* eslint-disable-next-line */
export interface ITableFooterItemProps {
  accessorKey: string;
  isFraction?: boolean;
  isPercentage?: boolean;
  isUnit?: boolean;
  className?: string;
  totalData?: ITableFooterData;
  isMilitaryTime?: boolean;
}

export function TableFooterItem(props: ITableFooterItemProps) {
  const {
    accessorKey,
    isUnit = false,
    isPercentage = false,
    isFraction = false,
    className,
    totalData,
    isMilitaryTime = false,
  } = props;

  const getValueByKey = () => {
    if (!totalData || !hasProperty(totalData, accessorKey)) return null;
    return totalData[accessorKey];
  };
  if (isMilitaryTime)
    return (
      <b className={className}>
        {getTimeFromMilitaryTimeStamp(getValueByKey() as string)}
      </b>
    );

  if (isUnit)
    return (
      <b className={className}>{formatNum(getValueByKey(), isFraction)}</b>
    );

  return (
    <b className={className}>
      {displayValue(formatNum(getValueByKey(), isFraction), isPercentage)}
    </b>
  );
}

export default TableFooterItem;
