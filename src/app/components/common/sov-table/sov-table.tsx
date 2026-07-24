import { MarketplaceEnum } from '@/enums/serp.enums';
import { ColumnPinningState, PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import {
  IBrandLevelSovChartData,
  ISOV,
  ISOVWithRank,
} from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectSelectedBrands } from 'src/redux/slices/market-intelligence/market-intelligence.slice';
import { selectAppliedSovFilters } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import marketIntelligenceUtils from 'src/utils/market-intelligence/market-intelligence.utils';
import { marketIntelligenceColumns } from '../../pages/market-intelligence-wrapper/market-intelligence-page/market-intelligence-page-columns';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import FloatingToast from '../floating-toast/floating-toast';
import styles from './sov-table.module.scss';

export interface ISovTableProps {
  data: ISOVWithRank[];
  isLoading: boolean;
  comparedBrand: ISOV | null;
  setComparedBrand: (brand: ISOV | null) => void;
  setComparedBrandSovData: (data: IBrandLevelSovChartData | null) => void;
  marketplace: MarketplaceEnum;
}

const skeletonStyle = {
  marginBottom: '2rem',
  marginTop: '2rem',
};

const SOVTable: React.FC<ISovTableProps> = ({
  data,
  isLoading,
  comparedBrand,
  setComparedBrand,
  setComparedBrandSovData,
  marketplace,
}) => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<ISOVWithRank[]>([]);
  const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });
  const selectedBrands = useAppSelector(selectSelectedBrands);
  const appliedSovFilters = useAppSelector(selectAppliedSovFilters);

  useEffect(() => {
    if (data && data.length > 0) {
      const _brandData = data.filter(
        (item) => item.brand === appliedSovFilters.brandName
      );
      let selectedBrandData: ISOVWithRank = {
        appearance: '-',
        brand: appliedSovFilters.brandName,
        label: '-',
        organic_sov: '-',
        product_count: '-',
        rank: 0,
        sponsored_sov: '-',
        total_sov: '-',
      };

      if (_brandData.length) {
        selectedBrandData = _brandData[0];
      }

      let _filteredData = data.filter(
        (item) =>
          selectedBrands.length === 0 ||
          selectedBrands.some((brand) => brand === item.brand)
      );

      if (
        _filteredData.some((item) => item.brand === appliedSovFilters.brandName)
      ) {
        _filteredData = _filteredData.filter(
          (item) => item.brand !== appliedSovFilters.brandName
        );
      }

      setFilteredData([selectedBrandData, ..._filteredData]);
      setIsDataUpdated(true);
    } else {
      setFilteredData([]);
    }
  }, [data, selectedBrands, appliedSovFilters.brandName]);

  useEffect(() => {
    if (isDataUpdated) {
      setTimeout(() => {
        setIsDataUpdated(false);
      }, 3000);
    }
  }, [isDataUpdated]);

  useEffect(() => {
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, brand: string) => {
      event.preventDefault();
      navigate(
        marketIntelligenceUtils.getBrandAnalyticsUrl(brand, marketplace)
      );
    },
    [marketplace, navigate]
  );

  const handleCompareBrand = useCallback(
    (row: ISOV) => {
      if (comparedBrand !== null && row.brand === comparedBrand.brand) {
        setComparedBrandSovData(null);
        setComparedBrand(null);
        return;
      }

      setComparedBrand(row);
      const element = document.getElementById('graph-container');

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
    },
    [comparedBrand, setComparedBrand, setComparedBrandSovData]
  );

  const initialPinnedColumns: ColumnPinningState = useMemo(() => {
    const columns = marketIntelligenceColumns(handleClick, handleCompareBrand);

    return {
      left: [columns[0].id as string, columns[1].id as string],
      right: [],
    };
  }, [handleClick, handleCompareBrand]);

  return (
    <div className={styles.reportContainer} data-test="report-container">
      {isDataUpdated && <FloatingToast message="Data Updated" />}
      <CustomTableWrapper
        data={filteredData}
        columns={marketIntelligenceColumns(handleClick, handleCompareBrand)}
        width="100%"
        height="60rem"
        isLoading={isLoading}
        pageSizes={PAGE_SIZE_OPTIONS}
        pagination={pagination}
        setPagination={setPagination}
        initialPinnedColumns={initialPinnedColumns}
      />
    </div>
  );
};

export default SOVTable;
