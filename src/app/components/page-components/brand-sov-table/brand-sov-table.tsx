import { MarketplaceEnum } from '@/enums/serp.enums';
import Box from '@mui/material/Box';
import { ColumnPinningState, PaginationState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { IBrandAnalyticsProductData } from 'src/interfaces/brand-analytics.interfaces';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { brandColumns } from '../../pages/market-intelligence-wrapper/brand-page/brand-page-columns';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './brand-sov-table.module.scss';

interface IBrandSOVTableProps {
  data: IBrandAnalyticsProductData[];
  isLoading: boolean;
  marketplace: MarketplaceEnum;
}

export default function BrandSOVTable(props: IBrandSOVTableProps) {
  const { data, isLoading, marketplace } = props;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });

  const params = useParams();

  useEffect(() => {
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  const initialPinnedColumns: ColumnPinningState = useMemo(() => {
    const columns = brandColumns(marketplace);

    return {
      left: [columns[0].id as string],
      right: [],
    };
  }, [marketplace]);

  return (
    <Box className={styles.reportContainer} data-test="brand-sov-product-table">
      <CustomTableWrapper
        data={data}
        columns={brandColumns(marketplace)}
        width="100%"
        height="60rem"
        isLoading={isLoading}
        pageSizes={PAGE_SIZE_OPTIONS}
        pagination={pagination}
        setPagination={setPagination}
        initialPinnedColumns={initialPinnedColumns}
      />
    </Box>
  );
}
