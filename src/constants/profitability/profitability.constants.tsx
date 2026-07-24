import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { FilterDropdownValue } from '@/enums/filter.enums';
import {
  ProfitabilityMetricsKeyEnums,
  ProfitabilityMetricsLabelEnums,
  ProfitabilityOrdersMetricsKeyEnums,
  ProfitabilityOrdersMetricsLabelEnums,
  ProfitabilityRangeEnum,
  ProfitabilityTrendsMetricsKeyEnums,
  ProfitabilityTrendsMetricsLabelEnums,
} from '@/enums/profitability.enums';
import { Frequency, Range } from '@/enums/serp.enums';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { ChartLineIcon, SquaresFourIcon } from '@phosphor-icons/react';
import { customRangeFilterOption } from '@/constants';

export const yAxisNames = ['y', 'y1', 'y2', 'y3'];

export const tabs: IDropdownItem<string>[] = [
  {
    label: 'Home',
    value: '',
    prefixElement: <SquaresFourIcon />,
    selected: true,
    isDisabled: false,
  },
  {
    label: 'Trends',
    value: 'trends',
    prefixElement: <ChartLineIcon />,
    selected: false,
    isDisabled: false,
  },
];

export const DateRangeOptions: IDropdownItem<string>[] = [
  {
    value: ProfitabilityRangeEnum.RANGE_1,
    label: 'Today / Yesterday / This month / Last month',
  },
  {
    value: ProfitabilityRangeEnum.RANGE_2,
    label: 'Today / Yesterday / 7 days / 14 days',
  },
  {
    value: ProfitabilityRangeEnum.RANGE_3,
    label: 'This week / Last week / 2 weeks ago / 3 weeks ago',
  },
  {
    value: ProfitabilityRangeEnum.RANGE_4,
    label: 'This month / Last month / 2 months ago / 3 months ago',
  },
  {
    value: ProfitabilityRangeEnum.RANGE_5,
    label: 'Today / Yesterday / 2 days ago / 3 days ago',
  },
  {
    value: ProfitabilityRangeEnum.RANGE_6,
    label: 'Today / Yesterday / 7 days ago / 30 days ago',
  },
  {
    value: ProfitabilityRangeEnum.RANGE_7,
    label: 'This quarter / Last quarter / 2 quarters ago / 3 quarters ago',
  },
  {
    value: Range.CUSTOM_RANGE,
    label: 'Custom Range',
  },
];

export const ProfitabilityFrequency: IDropdownItem<Frequency>[] = [
  {
    label: 'Daily',
    value: Frequency.DAILY,
  },
  {
    label: 'Weekly',
    value: Frequency.WEEKLY,
  },
  {
    label: 'Monthly',
    value: Frequency.MONTHLY,
  },
  {
    label: 'Quarterly',
    value: Frequency.QUARTERLY,
  },
  {
    label: 'Yearly',
    value: Frequency.YEARLY,
  },
];

export const ProfitabilityPnLFrequency: IDropdownItem<Frequency>[] = [
  {
    label: 'Days',
    value: Frequency.DAILY,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Weeks',
    value: Frequency.WEEKLY,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Months',
    value: Frequency.MONTHLY,
    isDisabled: false,
    selected: false,
  },
];

export const ProfitabilityFrequencyConstants = [
  {
    label: 'Last 7 Days (by days)',
    value: Range.LAST_7_DAYS_FROM_TODAY,
  },
  {
    label: 'Last 30 Days (by days)',
    value: Range.LAST_30_DAYS_FROM_TODAY,
  },
  {
    label: 'Last Week (by days)',
    value: Range.LAST_WEEK,
  },
  {
    label: 'Last Month (by days)',
    value: Range.LAST_MONTH,
  },
  {
    label: 'This Year (by weeks)',
    value: Range.THIS_YEAR,
  },
  customRangeFilterOption,
];

export const profitabilityMetricsOptions: IMultiSelectDropdownItem[] = [
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ORDER_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.REFUND_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.REFUND_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.CANCELLED_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.CANCELLED_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.COGS,
    value: ProfitabilityOrdersMetricsKeyEnums.COGS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_UNITS_SOLD,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_UNITS_SOLD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ORDER_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.REFUND_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.CANCELLED_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.CANCELLED_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_EXPENSES,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_EXPENSES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_WALMART_ADJUSTMENT,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.COMMISSION_ON_PRODUCT,
    value: ProfitabilityOrdersMetricsKeyEnums.COMMISSION_ON_PRODUCT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.COMMISSION_ON_SHIPPING,
    value: ProfitabilityOrdersMetricsKeyEnums.COMMISSION_ON_SHIPPING,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WFS_FULFILLMENT_FEE,
    value: ProfitabilityOrdersMetricsKeyEnums.WFS_FULFILLMENT_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.EXTRA_DISCOUNT,
    value: ProfitabilityOrdersMetricsKeyEnums.EXTRA_DISCOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.PROMO_CODE,
    value: ProfitabilityOrdersMetricsKeyEnums.PROMO_CODE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OTHER_TAX_FEES,
    value: ProfitabilityOrdersMetricsKeyEnums.OTHER_TAX_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.PRODUCT_TAX,
    value: ProfitabilityOrdersMetricsKeyEnums.PRODUCT_TAX,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.PRODUCT_TAX_WITHHELD,
    value: ProfitabilityOrdersMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.EXCESS_REFUND_ADJUSTMENT,
    value: ProfitabilityOrdersMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WALMART_FUNDED_SAVINGS,
    value: ProfitabilityOrdersMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.CUSTOMER_RETURN_REVERSAL,
    value: ProfitabilityOrdersMetricsKeyEnums.CUSTOMER_RETURN_REVERSAL,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_SHIPPING_COST,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_SHIPPING_COST,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SHIPPING,
    value: ProfitabilityOrdersMetricsKeyEnums.SHIPPING,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SHIPPING_TAX,
    value: ProfitabilityOrdersMetricsKeyEnums.SHIPPING_TAX,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SHIPPING_TAX_WITHHELD,
    value: ProfitabilityOrdersMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WFS_RETURN_SHIPPING_FEE,
    value: ProfitabilityOrdersMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WALMART_RETURN_SHIPPING_CHARGE,
    value: ProfitabilityOrdersMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
    selected: false,
    isDisabled: false,
  },
  {
    label:
      ProfitabilityOrdersMetricsLabelEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
    value:
      ProfitabilityOrdersMetricsKeyEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ESTIMATED_PAYOUT,
    value: ProfitabilityOrdersMetricsKeyEnums.ESTIMATED_PAYOUT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ADDITIONAL_FEE,
    value: ProfitabilityOrdersMetricsKeyEnums.ADDITIONAL_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ADDITIONAL_FEE_BREAKDOWN_CHARGE,
    value: ProfitabilityOrdersMetricsKeyEnums.ADDITIONAL_FEE_BREAKDOWN_CHARGE,
    selected: false,
    isDisabled: false,
  },
];

export const amazonProfitabilityMetricsOptions: IMultiSelectDropdownItem[] = [
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_SALES,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.TOTAL_AD_SALES,
    value: ProfitabilityMetricsKeyEnums.TOTAL_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.ORGANIC_AD_SALES,
    value: ProfitabilityMetricsKeyEnums.ORGANIC_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SP_AD_SALES,
    value: ProfitabilityMetricsKeyEnums.SP_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SB_AD_SALES,
    value: ProfitabilityMetricsKeyEnums.SB_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SD_AD_SALES,
    value: ProfitabilityMetricsKeyEnums.SD_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_UNITS,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.TOTAL_AD_UNITS,
    value: ProfitabilityMetricsKeyEnums.TOTAL_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.ORGANIC_AD_UNITS,
    value: ProfitabilityMetricsKeyEnums.ORGANIC_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SP_AD_UNITS,
    value: ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SB_AD_UNITS,
    value: ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SD_AD_UNITS,
    value: ProfitabilityMetricsKeyEnums.SD_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_CANCELLED_ORDERS_COUNT,
    value: ProfitabilityMetricsKeyEnums.AMZ_CANCELLED_ORDERS_COUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_ORDERS,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_RETURNS,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_RETURNED_UNITS,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNED_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_RETURN_AMOUNT,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_AMOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_RETURN_COMMISSION_AMOUNT,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_COMMISSION_AMOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.AMZ_TOTAL_RETURN_REFERRAL_AMOUNT,
    value: ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_REFERRAL_AMOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.TOTAL_COGS,
    value: ProfitabilityMetricsKeyEnums.TOTAL_COGS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.TOTAL_AD_SPEND,
    value: ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SP_AD_SPEND,
    value: ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SB_AD_SPEND,
    value: ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.SD_AD_SPEND,
    value: ProfitabilityMetricsKeyEnums.SD_AD_SPEND,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityMetricsLabelEnums.TACOS,
    value: ProfitabilityMetricsKeyEnums.TACOS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.ROAS,
    value: ProfitabilityMetricsKeyEnums.ROAS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.ACOS,
    value: ProfitabilityMetricsKeyEnums.ACOS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.FBA_FULFILLMENT_FEES,
    value: ProfitabilityMetricsKeyEnums.FBA_FULFILLMENT_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.REFERRAL_FEES,
    value: ProfitabilityMetricsKeyEnums.REFERRAL_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.FBA_CUSTOMER_RETURN_PER_UNIT_FEE,
    value: ProfitabilityMetricsKeyEnums.FBA_CUSTOMER_RETURN_PER_UNIT_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.PROMOTION,
    value: ProfitabilityMetricsKeyEnums.PROMOTION,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.VALUE_OF_RETURNED_ITEMS,
    value: ProfitabilityMetricsKeyEnums.VALUE_OF_RETURNED_ITEMS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.NET_PROFIT,
    value: ProfitabilityMetricsKeyEnums.NET_PROFIT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.ROI,
    value: ProfitabilityMetricsKeyEnums.ROI,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.MARGIN,
    value: ProfitabilityMetricsKeyEnums.MARGIN,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.EST_PAYOUT,
    value: ProfitabilityMetricsKeyEnums.EST_PAYOUT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.REFUND_PERCENTAGE,
    value: ProfitabilityMetricsKeyEnums.REFUND_PERCENTAGE,
    selected: false,
    isDisabled: false,
  },
];

export const requiredPerformanceDataKeys = [
  ProfitabilityMetricsKeyEnums.TOTAL_GMV_AUTH_SALES,
  ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS_UNITS,
  ProfitabilityMetricsKeyEnums.TOTAL_RETURN_CANCELLED_SALES,
  ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
  ProfitabilityMetricsKeyEnums.EST_PAYOUT,
  ProfitabilityMetricsKeyEnums.NET_PROFIT,
];

export const INITIAL_PERFORMANCE_STATE = [null, null, null, null];
export const ACCORDION_ROOT_ID = 'root';

export const PURCHASE_STATUS_MAPPING: { [key: string]: string } = {
  [FilterDropdownValue.REFUND_COMPLETED_MAPPED]:
    FilterDropdownValue.REFUND_COMPLETED,
};

export const calculatedMetricsForPerformance = [
  ProfitabilityOrdersMetricsKeyEnums.NET_PROFIT,
  ProfitabilityMetricsKeyEnums.TACOS,
  ProfitabilityMetricsKeyEnums.ROAS,
];
export const calculatedMetricsForAmazonTable = [
  ProfitabilityMetricsKeyEnums.ROI,
  ProfitabilityMetricsKeyEnums.MARGIN,
  ProfitabilityMetricsKeyEnums.EST_PAYOUT,
  ProfitabilityOrdersMetricsKeyEnums.NET_PROFIT,
];
export const calculatedMetricsForWalmartTable = [
  ProfitabilityOrdersMetricsKeyEnums.NET_PROFIT,
];

export const profitabilityGraphMetricsOptions: IMultiSelectDropdownItem[] = [
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ORDER_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.REFUND_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.REFUND_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.CANCELLED_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.CANCELLED_SALES,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_UNITS_SOLD,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_UNITS_SOLD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ORDER_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.REFUND_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.CANCELLED_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.CANCELLED_UNITS,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.COGS,
    value: ProfitabilityOrdersMetricsKeyEnums.COGS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_EXPENSES,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_EXPENSES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.OVERALL_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.OVERALL_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SP_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.SP_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SB_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.SB_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_SPEND,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_ORDERS,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_UNITS,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SV_AD_SALES,
    value: ProfitabilityOrdersMetricsKeyEnums.SV_AD_SALES,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_WALMART_ADJUSTMENT,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.TOTAL_SHIPPING_COST,
    value: ProfitabilityOrdersMetricsKeyEnums.TOTAL_SHIPPING_COST,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ESTIMATED_PAYOUT,
    value: ProfitabilityOrdersMetricsKeyEnums.ESTIMATED_PAYOUT,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.PRODUCT_PRICE,
    value: ProfitabilityOrdersMetricsKeyEnums.PRODUCT_PRICE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.NET_PROFIT,
    value: ProfitabilityOrdersMetricsKeyEnums.NET_PROFIT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.ADDITIONAL_FEE,
    value: ProfitabilityOrdersMetricsKeyEnums.ADDITIONAL_FEE,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.COMMISSION_ON_PRODUCT,
    value: ProfitabilityOrdersMetricsKeyEnums.COMMISSION_ON_PRODUCT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.COMMISSION_ON_SHIPPING,
    value: ProfitabilityOrdersMetricsKeyEnums.COMMISSION_ON_SHIPPING,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WFS_FULFILLMENT_FEE,
    value: ProfitabilityOrdersMetricsKeyEnums.WFS_FULFILLMENT_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.EXTRA_DISCOUNT,
    value: ProfitabilityOrdersMetricsKeyEnums.EXTRA_DISCOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.PROMO_CODE,
    value: ProfitabilityOrdersMetricsKeyEnums.PROMO_CODE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WALMART_FUNDED_SAVINGS,
    value: ProfitabilityOrdersMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.OTHER_TAX_FEES,
    value: ProfitabilityOrdersMetricsKeyEnums.OTHER_TAX_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.PRODUCT_TAX,
    value: ProfitabilityOrdersMetricsKeyEnums.PRODUCT_TAX,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.PRODUCT_TAX_WITHHELD,
    value: ProfitabilityOrdersMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.SHIPPING,
    value: ProfitabilityOrdersMetricsKeyEnums.SHIPPING,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SHIPPING_TAX,
    value: ProfitabilityOrdersMetricsKeyEnums.SHIPPING_TAX,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.SHIPPING_TAX_WITHHELD,
    value: ProfitabilityOrdersMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WFS_RETURN_SHIPPING_FEE,
    value: ProfitabilityOrdersMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.WALMART_RETURN_SHIPPING_CHARGE,
    value: ProfitabilityOrdersMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
    selected: false,
    isDisabled: false,
  },

  {
    label: ProfitabilityOrdersMetricsLabelEnums.EXCESS_REFUND_ADJUSTMENT,
    value: ProfitabilityOrdersMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityOrdersMetricsLabelEnums.CUSTOMER_RETURN_REVERSAL,
    value: ProfitabilityOrdersMetricsKeyEnums.CUSTOMER_RETURN_REVERSAL,
    selected: false,
    isDisabled: false,
  },
  {
    label:
      ProfitabilityOrdersMetricsLabelEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
    value:
      ProfitabilityOrdersMetricsKeyEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
    selected: false,
    isDisabled: false,
  },
];

export const trendsMetricOptions: IDropdownItem<string>[] = [
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ORDER_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.ORDER_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.REFUND_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.REFUND_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.CANCELLED_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.CANCELLED_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_UNITS_SOLD,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_UNITS_SOLD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ORDER_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.ORDER_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.REFUND_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.REFUND_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.CANCELLED_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.CANCELLED_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.NET_PROFIT,
    value: ProfitabilityTrendsMetricsKeyEnums.NET_PROFIT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_EXPENSES,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_EXPENSES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.COMMISSION_ON_PRODUCT,
    value: ProfitabilityTrendsMetricsKeyEnums.COMMISSION_ON_PRODUCT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.COMMISSION_ON_SHIPPING,
    value: ProfitabilityTrendsMetricsKeyEnums.COMMISSION_ON_SHIPPING,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ADDITIONAL_FEE,
    value: ProfitabilityTrendsMetricsKeyEnums.ADDITIONAL_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ADDITIONAL_FEE_BREAKDOWN_CHARGE,
    value: ProfitabilityTrendsMetricsKeyEnums.ADDITIONAL_FEE_BREAKDOWN_CHARGE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.CUSTOMER_RETURN_REVERSAL,
    value: ProfitabilityTrendsMetricsKeyEnums.CUSTOMER_RETURN_REVERSAL,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.EXCESS_REFUND_ADJUSTMENT,
    value: ProfitabilityTrendsMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.EXTRA_DISCOUNT,
    value: ProfitabilityTrendsMetricsKeyEnums.EXTRA_DISCOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label:
      ProfitabilityTrendsMetricsLabelEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
    value:
      ProfitabilityTrendsMetricsKeyEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.OTHER_TAX_FEES,
    value: ProfitabilityTrendsMetricsKeyEnums.OTHER_TAX_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.PRODUCT_TAX,
    value: ProfitabilityTrendsMetricsKeyEnums.PRODUCT_TAX,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.PRODUCT_TAX_WITHHELD,
    value: ProfitabilityTrendsMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.PROMO_CODE,
    value: ProfitabilityTrendsMetricsKeyEnums.PROMO_CODE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SHIPPING,
    value: ProfitabilityTrendsMetricsKeyEnums.SHIPPING,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SHIPPING_TAX,
    value: ProfitabilityTrendsMetricsKeyEnums.SHIPPING_TAX,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SHIPPING_TAX_WITHHELD,
    value: ProfitabilityTrendsMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_SHIPPING_COST,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_SHIPPING_COST,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_WALMART_ADJUSTMENT,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.WALMART_FUNDED_SAVINGS,
    value: ProfitabilityTrendsMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.WALMART_RETURN_SHIPPING_CHARGE,
    value: ProfitabilityTrendsMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.WFS_FULFILLMENT_FEE,
    value: ProfitabilityTrendsMetricsKeyEnums.WFS_FULFILLMENT_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.WFS_RETURN_SHIPPING_FEE,
    value: ProfitabilityTrendsMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.WFS_RETURN_SHIPPING_FEE,
    value: ProfitabilityTrendsMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.WFS_RETURN_SHIPPING_FEE,
    value: ProfitabilityTrendsMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_AD_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.OVERALL_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.COGS,
    value: ProfitabilityTrendsMetricsKeyEnums.COGS,
    selected: false,
    isDisabled: false,
  },
];

export const AMAZON_TRENDS_METRIC_OPTIONS: IDropdownItem<string>[] = [
  {
    label: ProfitabilityTrendsMetricsLabelEnums.LIST_PRICE,
    value: ProfitabilityTrendsMetricsKeyEnums.LIST_PRICE,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_RETURN_AMOUNT,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_RETURN_AMOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_RETURNED_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_RETURNED_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_ORDERS,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_ORDERS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.CANCELLED_ORDERS_COUNT,
    value: ProfitabilityTrendsMetricsKeyEnums.CANCELLED_ORDERS_COUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_RETURNS,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_RETURNS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_RETURN_COMMISSION_AMOUNT,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_RETURN_COMMISSION_AMOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_RETURN_REFERRAL_AMOUNT,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_RETURN_REFERRAL_AMOUNT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.COGS,
    value: ProfitabilityTrendsMetricsKeyEnums.COGS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_AD_SPEND,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SP_AD_SPEND,
    value: ProfitabilityTrendsMetricsKeyEnums.SP_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SB_AD_SPEND,
    value: ProfitabilityTrendsMetricsKeyEnums.SB_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SD_AD_SPEND,
    value: ProfitabilityTrendsMetricsKeyEnums.SD_AD_SPEND,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_AD_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ORGANIC_AD_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.ORGANIC_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SP_AD_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.SP_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SB_AD_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.SB_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SD_AD_SALES,
    value: ProfitabilityTrendsMetricsKeyEnums.SD_AD_SALES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TOTAL_AD_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.TOTAL_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ORGANIC_AD_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.ORGANIC_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SP_AD_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.SP_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SB_AD_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.SB_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.SD_AD_UNITS,
    value: ProfitabilityTrendsMetricsKeyEnums.SD_AD_UNITS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.TACOS,
    value: ProfitabilityTrendsMetricsKeyEnums.TACOS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ROAS,
    value: ProfitabilityTrendsMetricsKeyEnums.ROAS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.ACOS,
    value: ProfitabilityTrendsMetricsKeyEnums.ACOS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.FBA_FULFILLMENT_FEES,
    value: ProfitabilityTrendsMetricsKeyEnums.FBA_FULFILLMENT_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.REFERRAL_FEES,
    value: ProfitabilityTrendsMetricsKeyEnums.REFERRAL_FEES,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.PROMOTION,
    value: ProfitabilityTrendsMetricsKeyEnums.PROMOTION,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityTrendsMetricsLabelEnums.VALUE_OF_RETURNED_ITEMS,
    value: ProfitabilityTrendsMetricsKeyEnums.VALUE_OF_RETURNED_ITEMS,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.ROI,
    value: ProfitabilityMetricsKeyEnums.ROI,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.MARGIN,
    value: ProfitabilityMetricsKeyEnums.MARGIN,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.EST_PAYOUT,
    value: ProfitabilityMetricsKeyEnums.EST_PAYOUT,
    selected: false,
    isDisabled: false,
  },
  {
    label: ProfitabilityMetricsLabelEnums.REFUND_PERCENTAGE,
    value: ProfitabilityMetricsKeyEnums.REFUND_PERCENTAGE,
    selected: false,
    isDisabled: false,
  },
];

export const emptyDateRange = { startDate: '', endDate: '' };

export const PRIORITY_ORDER = [
  ProfitabilityMetricsKeyEnums.VALUE_OF_RETURNED_ITEMS,
  ProfitabilityMetricsKeyEnums.REFUND_COMMISSION,
  ProfitabilityMetricsKeyEnums.RETURN_REFERRAL_AMOUNT,
  ProfitabilityMetricsKeyEnums.FBA_CUSTOMER_RETURN_PER_UNIT_FEE,
  ProfitabilityMetricsKeyEnums.RETURN_AMOUNT,
] as string[];
