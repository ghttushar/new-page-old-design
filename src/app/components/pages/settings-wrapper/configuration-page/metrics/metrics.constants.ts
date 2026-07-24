import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  IMetricsConfiguration,
  MetricValueTypeEnum,
  TargetProfitMarginTypeEnum,
} from '@/interfaces/configurations.interface';

export const PROFIT_MARGIN_OPTIONS: IDropdownItem<TargetProfitMarginTypeEnum>[] =
  [
    {
      label: 'Profit Percentage',
      value: TargetProfitMarginTypeEnum.PROFIT_PERCENTAGE,
    },
    {
      label: 'Absolute Profit',
      value: TargetProfitMarginTypeEnum.ABSOLUTE_PROFIT,
    },
  ];

export const DEFAULT_METRICS: IMetricsConfiguration = {
  budget: 0,
  budgetType: 'USD',
  targetProfitMarginType: MetricValueTypeEnum.PERCENTAGE,
  targetProfitMarginValue: 0,
  tacosTargetValue: 0,
  tacosTargetType: 'percentage',
  roasTargetValue: 0,
  targetRevenue: 0,
  targetRevenueType: 'USD',
};
