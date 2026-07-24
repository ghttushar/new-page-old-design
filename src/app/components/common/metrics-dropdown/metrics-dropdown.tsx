import {
  IAdvertisingFilter,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  ArrowSquareDownRightIcon,
  ArrowSquareUpRightIcon,
} from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  iconStyle,
  percentBar,
  percentContainer,
} from 'src/app/components/common/brand-metrics/brand-metrics-styles';
import { MetricsOptions } from 'src/enums/advertising.enums';
import { displayValue, formatNum } from 'src/utils';
import { IDropdownItem } from '../dropdown/dropdown';
import OutLineDropdown from '../dropdown/outline-dropdown';
import { containerStyle, noChangeLogoStyles } from './metrics-dropdown-styles';

interface IMetricsDropdownProps {
  isBorderColorRequired: boolean;
  color?: string;
  onSelect: (value: IDropdownItem<string>) => void;
  selected: IDropdownItem<string>;
  options: IDropdownItem<string>[];
  metricsData: IPerformanceMetrics | null;
  filters: IAdvertisingFilter;
  width?: string;
  fontWeight?: string;
}

export default function MetricsDropdown({
  isBorderColorRequired,
  color,
  onSelect,
  selected,
  options,
  metricsData,
  filters,
  width,
  fontWeight,
}: IMetricsDropdownProps) {
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [changeValue, setChangeValue] = useState<string | number>('-');

  const iconUpColor =
    selected.value === MetricsOptions.ACOS ||
    selected.value === MetricsOptions.TACOS
      ? '#FF0000'
      : '#009688';
  const iconDownColor =
    selected.value === MetricsOptions.ACOS ||
    selected.value === MetricsOptions.TACOS
      ? '#009688'
      : '#FF0000';

  useEffect(() => {
    setCurrentValue(null);
    setPreviousValue('-');
    setChangeValue('-');
    if (metricsData !== undefined && metricsData !== null) {
      let currValue: string | number;
      let prevValue: string | number;

      switch (selected.value) {
        case MetricsOptions.PERCENTAGE_ORDERS_NTB:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.percentNtbOrders
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.percentNtbOrders === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.percentNtbOrders
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.percentNtbOrders === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.percentNtbOrders || 0
            );
          }
          break;

        case MetricsOptions.PERCENTAGE_SALES_NTB:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.percentNtbSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.percentNtbSales === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.percentNtbSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.percentNtbSales === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }

          if (metricsData?.changePercentageData !== null) {
            setChangeValue(
              metricsData?.changePercentageData?.percentNtbSales || 0
            );
          }
          break;

        case MetricsOptions.PERCENTAGE_UNITS_NTB:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.percentNtbUnits
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.percentNtbUnits === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.percentNtbUnits
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.percentNtbUnits === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.percentNtbUnits || 0
            );
          }
          break;

        case MetricsOptions.ACOS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.acos);
            setCurrentValue(
              metricsData?.currPerformanceData?.acos === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.acos
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.acos === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.acos || 0);
          }

          break;

        case MetricsOptions.CTR:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.ctr);
            setCurrentValue(
              metricsData?.currPerformanceData?.ctr === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.ctr
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.ctr === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.ctr || 0);
          }

          break;

        case MetricsOptions.CLICKS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.clicks,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.clicks === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.clicks,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.clicks === null
                ? '-'
                : `${prevValue}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.clicks || 0);
          }

          break;

        case MetricsOptions.VCPM:
          setCurrentValue(null);
          setPreviousValue('-');
          setChangeValue('-');
          break;

        case MetricsOptions.CPC:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.cpc);
            setCurrentValue(
              metricsData?.currPerformanceData?.cpc === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.cpc
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.cpc === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.cpc || 0);
          }

          break;

        case MetricsOptions.IMPRESSIONS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.impressions,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.impressions === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.impressions,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.impressions === null
                ? '-'
                : `${prevValue}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.impressions || 0);
          }

          break;

        case MetricsOptions.NTB_ORDERS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.ntbOrders,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.ntbOrders === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.ntbOrders,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.ntbOrders === null
                ? '-'
                : `${prevValue}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.ntbOrders || 0);
          }
          break;

        case MetricsOptions.AD_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.unitsSold,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.unitsSold === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.unitsSold,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.unitsSold === null
                ? '-'
                : `${prevValue}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.unitsSold || 0);
          }

          break;

        case MetricsOptions.TOTAL_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.totalUnits || 0,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.totalUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.totalUnits || 0,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.totalUnits === null
                ? '-'
                : `${prevValue}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.totalUnits || 0);
          }

          break;

        case MetricsOptions.TACOS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.tacos || 0);
            setCurrentValue(
              metricsData?.currPerformanceData?.tacos === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.tacos || 0
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.tacos === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.tacos || 0);
          }

          break;

        case MetricsOptions.ROAS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.roas);
            setCurrentValue(
              metricsData?.currPerformanceData?.roas === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.roas
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.roas === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.roas || 0);
          }

          break;

        case MetricsOptions.AD_SPEND:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.adSpend);
            setCurrentValue(
              metricsData?.currPerformanceData?.adSpend === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.adSpend
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.adSpend === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.adSpend || 0);
          }

          break;

        case MetricsOptions.VIEWABLE_IMPRESSIONS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.viewableImpressions,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.viewableImpressions === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.viewableImpressions,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.viewableImpressions === null
                ? '-'
                : `${prevValue}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.viewableImpressions || 0
            );
          }
          break;

        case MetricsOptions.TOTAL_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.totalSales || 0
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.totalSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.totalSales || 0
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.totalSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.totalSales || 0);
          }

          break;

        case MetricsOptions.AD_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.adSales);
            setCurrentValue(
              metricsData?.currPerformanceData?.adSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.adSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.adSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }

          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.adSales || 0);
          }

          break;

        case MetricsOptions.CVR_ORDERS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.cvrOrdersSoldBased
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.cvrOrdersSoldBased === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.cvrOrdersSoldBased
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.cvrOrdersSoldBased === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.cvrOrdersSoldBased || 0
            );
          }
          break;

        case MetricsOptions.CVR_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.cvrUnitsSoldBased
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.cvrUnitsSoldBased === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.cvrUnitsSoldBased
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.cvrUnitsSoldBased === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.cvrUnitsSoldBased || 0
            );
          }
          break;

        case MetricsOptions.ADVERTISED_SKU_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.advertisedSkuSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.advertisedSkuSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.advertisedSkuSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.advertisedSkuSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.advertisedSkuSales || 0
            );
          }
          break;

        case MetricsOptions.OTHER_SKU_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.otherSkuSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.otherSkuSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.otherSkuSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.otherSkuSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.otherSkuSales || 0
            );
          }
          break;

        case MetricsOptions.ADVERTISED_SKU_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.advertisedSkuUnits,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.advertisedSkuUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.advertisedSkuUnits,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.advertisedSkuUnits === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.advertisedSkuUnits || 0
            );
          }
          break;

        case MetricsOptions.OTHER_SKU_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.otherSkuUnits,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.otherSkuUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.otherSkuUnits,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.otherSkuUnits === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.otherSkuUnits || 0
            );
          }
          break;

        case MetricsOptions.CVR:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.cvr);
            setCurrentValue(
              metricsData?.currPerformanceData?.cvr === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.cvr
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.cvr === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.cvr || 0);
          }
          break;

        case MetricsOptions.ORDERS:
          setCurrentValue(null);
          setPreviousValue('-');
          setChangeValue('-');
          break;

        case MetricsOptions.AD_ORDERS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.adOrders,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.adOrders === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.adOrders,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.adOrders === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.adOrders || 0);
          }
          break;

        case MetricsOptions.NTB_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.ntbUnits,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.ntbUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.ntbUnits,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.ntbUnits === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.ntbUnits || 0);
          }
          break;

        case MetricsOptions.NTB_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.ntbSales);
            setCurrentValue(
              metricsData?.currPerformanceData?.ntbSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.ntbSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.ntbSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.ntbSales || 0);
          }
          break;

        case MetricsOptions.COMPLETE_VIEW_AD_ORDERS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.completeViewOrders,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.completeViewOrders === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.completeViewOrders,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.completeViewOrders === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.completeViewOrders || 0
            );
          }
          break;

        case MetricsOptions.COMPLETE_VIEW_AD_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.completeViewAdUnits,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.completeViewAdUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.completeViewAdUnits,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.completeViewAdUnits === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.completeViewAdUnits || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_COMPLETE_VIEWS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.videoCompleteViews,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.videoCompleteViews === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.videoCompleteViews,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.videoCompleteViews === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.videoCompleteViews || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_FIRST_QUARTILE_VIEWS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.videoFirstQuartileViews,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.videoFirstQuartileViews === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData
                ?.videoFirstQuartileViews,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.videoFirstQuartileViews === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.videoFirstQuartileViews || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_IMPRESSIONS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.videoImpressions,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.videoImpressions === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.videoImpressions,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.videoImpressions === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.videoImpressions || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_MIDPOINT_VIEWS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.videoMidpointViews,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.videoMidpointViews === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.videoMidpointViews,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.videoMidpointViews === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.videoMidpointViews || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_THIRD_QUARTILE_VIEWS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.videoThirdQuartileViews,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.videoThirdQuartileViews === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData
                ?.videoThirdQuartileViews,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.videoThirdQuartileViews === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.videoThirdQuartileViews || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_UNMUTES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.videoUnmutes,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.videoUnmutes === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.videoUnmutes,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.videoUnmutes === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.videoUnmutes || 0
            );
          }
          break;

        case MetricsOptions.VIDEO_5_SECOND_VIEWS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.video5SecondViews,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.video5SecondViews === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.video5SecondViews,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.video5SecondViews === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.video5SecondViews || 0
            );
          }
          break;

        case MetricsOptions.VIEW_THROUGH_AD_ORDERS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.viewThroughAdOrders,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.viewThroughAdOrders === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.viewThroughAdOrders,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.viewThroughAdOrders === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.viewThroughAdOrders || 0
            );
          }
          break;

        case MetricsOptions.VIEW_THROUGH_AD_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.viewThroughAdSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.viewThroughAdSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.viewThroughAdSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.viewThroughAdSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.viewThroughAdSales || 0
            );
          }
          break;

        case MetricsOptions.VIEW_THROUGH_AD_UNITS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.viewThroughAdUnits,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.viewThroughAdUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.viewThroughAdUnits,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.viewThroughAdUnits === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.viewThroughAdUnits || 0
            );
          }
          break;

        case MetricsOptions.COMPLETE_VIEW_AD_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.completeViewAdSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.completeViewAdSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.completeViewAdSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.completeViewAdSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.completeViewAdSales || 0
            );
          }
          break;

        case MetricsOptions.OTHER_COMPLETE_VIEW_AD_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.otherCompleteViewAdSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.otherCompleteViewAdSales ===
                null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData
                ?.otherCompleteViewAdSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.otherCompleteViewAdSales ===
                null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.otherCompleteViewAdSales || 0
            );
          }
          break;

        case MetricsOptions.VTR:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.vtr);
            setCurrentValue(
              metricsData?.currPerformanceData?.vtr === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.vtr
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.vtr === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.vtr || 0);
          }
          break;

        case MetricsOptions.VCTR:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.vctr);
            setCurrentValue(
              metricsData?.currPerformanceData?.vctr === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.vctr
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.vctr === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.vctr || 0);
          }
          break;

        case MetricsOptions.VIDEO_5_SECOND_VIEW_RATE:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.video5SecondViewRate
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.video5SecondViewRate === null
                ? null
                : `${displayValue(currValue)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.video5SecondViewRate
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.video5SecondViewRate === null
                ? '-'
                : `${displayValue(prevValue)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.video5SecondViewRate || 0
            );
          }
          break;

        case MetricsOptions.GMV:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(metricsData?.currPerformanceData?.gmv);
            setCurrentValue(
              metricsData?.currPerformanceData?.gmv === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.gmv
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.gmv === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.gmv || 0);
          }
          break;

        case MetricsOptions.UNITS_SOLD:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.grossUnits,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.grossUnits === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.grossUnits,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.grossUnits === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(metricsData?.changePercentageData?.grossUnits || 0);
          }
          break;

        case MetricsOptions.IN_STORE_ADVERTISED_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.inStoreAdvertisedSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.inStoreAdvertisedSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.inStoreAdvertisedSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.inStoreAdvertisedSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.inStoreAdvertisedSales || 0
            );
          }
          break;

        case MetricsOptions.IN_STORE_ATTRIBUTES_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.inStoreAttributedSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.inStoreAttributedSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.inStoreAttributedSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.inStoreAttributedSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.inStoreAttributedSales || 0
            );
          }
          break;

        case MetricsOptions.IN_STORE_ORDERS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.inStoreOrders,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.inStoreOrders === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.inStoreOrders,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.inStoreOrders === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.inStoreOrders || 0
            );
          }
          break;

        case MetricsOptions.IN_STORE_OTHER_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.inStoreOtherSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.inStoreOtherSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.inStoreOtherSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.inStoreOtherSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.inStoreOtherSales || 0
            );
          }
          break;

        case MetricsOptions.IN_STORE_UNITS_SOLD:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.inStoreUnitsSold,
              false
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.inStoreUnitsSold === null
                ? null
                : `${currValue}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.inStoreUnitsSold,
              false
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.inStoreUnitsSold === null
                ? '-'
                : `${prevValue}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.inStoreUnitsSold || 0
            );
          }
          break;

        case MetricsOptions.OMNI_CHANNEL_SALES:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.omniChannelSales
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.omniChannelSales === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.omniChannelSales
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.omniChannelSales === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.omniChannelSales || 0
            );
          }
          break;

        case MetricsOptions.OMNI_CHANNEL_ROAS:
          if (
            metricsData.currPerformanceData &&
            Object.keys(metricsData?.currPerformanceData)?.length > 0
          ) {
            currValue = formatNum(
              metricsData?.currPerformanceData?.omniChannelRoas
            );
            setCurrentValue(
              metricsData?.currPerformanceData?.omniChannelRoas === null
                ? null
                : `${displayValue(currValue, false)}`
            );
          }
          if (
            metricsData.prevPerformanceData &&
            metricsData.prevPerformanceData.prevData &&
            Object.keys(metricsData.prevPerformanceData?.prevData)?.length > 0
          ) {
            prevValue = formatNum(
              metricsData?.prevPerformanceData?.prevData?.omniChannelRoas
            );
            setPreviousValue(
              metricsData?.currPerformanceData?.omniChannelRoas === null
                ? '-'
                : `${displayValue(prevValue, false)}`
            );
          }
          if (metricsData.changePercentageData) {
            setChangeValue(
              metricsData?.changePercentageData?.omniChannelRoas || 0
            );
          }
          break;

        default:
          setCurrentValue(null);
          setPreviousValue('-');
          setChangeValue('-');
          break;
      }
    } else {
      setCurrentValue(null);
      setPreviousValue('-');
      setChangeValue('-');
    }
  }, [metricsData, selected, filters]);

  const handleChange = (value: IDropdownItem<string>) => {
    onSelect(value);
  };

  const changeTrendComponent: React.ReactNode = useMemo(() => {
    if (typeof changeValue === 'string') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={noChangeLogoStyles}>-</span>
        </div>
      );
    } else {
      const formattedChangeValue = displayValue(formatNum(changeValue));

      if (changeValue < 0) {
        return (
          <React.Fragment>
            <ArrowSquareDownRightIcon
              size={18}
              color={iconDownColor}
              weight="fill"
            />
            <h6
              style={{
                color: iconDownColor,
                fontWeight: 400,
                fontSize: '1.2rem',
              }}
            >
              {formattedChangeValue}
            </h6>
          </React.Fragment>
        );
      } else if (changeValue === 0) {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={noChangeLogoStyles}>-</span>
            <h6
              style={{
                color: '#919191',
                fontWeight: 400,
                fontSize: '1.2rem',
              }}
            >
              {formattedChangeValue}
            </h6>
          </div>
        );
      } else {
        return (
          <React.Fragment>
            <ArrowSquareUpRightIcon
              size={18}
              color={iconUpColor}
              weight="fill"
            />
            <h6
              style={{
                color: iconUpColor,
                fontWeight: 400,
                fontSize: '1.2rem',
              }}
            >
              {formattedChangeValue}
            </h6>
          </React.Fragment>
        );
      }
    }
  }, [changeValue, iconDownColor, iconUpColor]);

  return (
    <div
      style={Object.assign(
        {
          borderTop:
            isBorderColorRequired === true &&
            color !== undefined &&
            `0.45rem solid ${color}`,
        },
        containerStyle
      )}
    >
      <div>
        <div style={iconStyle}>
          <OutLineDropdown
            onSelect={(value) => handleChange(value)}
            selected={selected}
            options={options}
            width={width}
            fontWeight={fontWeight}
            isTooltipRequired={true}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <div style={percentContainer}>
            <h5 style={{ fontSize: '1.5rem' }}>{currentValue}</h5>
            <span style={percentBar}>{changeTrendComponent}</span>
          </div>
          <p style={{ color: 'rgb(0, 0, 0, 0.7)', fontSize: '1rem' }}>
            {metricsData?.prevPerformanceData?.prevText || '-'} :{' '}
            {previousValue}
          </p>
        </div>
      </div>
    </div>
  );
}
