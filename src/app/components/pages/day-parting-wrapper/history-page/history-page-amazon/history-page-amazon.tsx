import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { DAY_PARTING_HISTORY_URL } from '@/constants/urls.constants';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import DayPartingService from '@/services/day-parting.service';
import columnFilterUtils from '@/utils/column-filter.utils';
import { getJobHistoryUrl } from '@/utils/day-parting.utils';
import PreviewIcon from '@mui/icons-material/Preview';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';

import ServerSearch from '@/app/components/common/search/server-search';
import { DayPartingTitlesEnum } from '@/enums/day-parting.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { IDayPartingHistoryResponse } from '@/interfaces/day-parting.interfaces';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { getUpdatedPagination } from '@/utils';
import { dayPartingHistoryColumns } from '../history-page-columns';
import styles from '../history-page.module.scss';

export default function HistoryPageAmazon() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.HISTORY,
    PAGE_TITLE_TOOLTIPS.HISTORY,
    false,
    getJobHistoryUrl
  );

  const searchText = useAppSelector(selectSearchText);

  const [historyData, setHistoryData] = useState<IDayPartingHistoryResponse>();
  const [paginationModel, setPaginationModel] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);

  const handlePaginationReset = useCallback(
    () => setPaginationModel(getUpdatedPagination),
    []
  );
  const fetchAmazonHistoryData = useAppQuery({
    queryFn: () =>
      DayPartingService.getJobsHistory({
        searchText,
        searchColumns: ['jobId', 'title'],
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          dayPartingHistoryColumns,
          sorting
        ),
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
      }),
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_HISTORY_DATA,
      { advertisingAccount, paginationModel, sorting, searchText },
    ],
  });

  useEffect(() => {
    if (fetchAmazonHistoryData.isSuccess) {
      setHistoryData(fetchAmazonHistoryData.data.data.data);
    }
  }, [
    fetchAmazonHistoryData.data?.data.data,
    fetchAmazonHistoryData.isSuccess,
  ]);

  const isLoading = useMemo(
    () =>
      fetchAmazonHistoryData.isLoading || fetchAmazonHistoryData.isRefetching,
    [fetchAmazonHistoryData.isLoading, fetchAmazonHistoryData.isRefetching]
  );

  return (
    <div className={styles.historyPageContainer}>
      <div className={styles.historyContainer}>
        <ServerSearch
          title={DayPartingTitlesEnum.DAYPARTING_HISTORY}
          handleCustomSearchChange={handlePaginationReset}
        />
        <CustomTableWrapper
          data={historyData?.data ?? []}
          columns={dayPartingHistoryColumns}
          width="100%"
          height="60rem"
          isLoading={isLoading}
          pageSizes={PAGE_SIZE_OPTIONS}
          pagination={paginationModel}
          rowCount={historyData?.totalCount}
          setPagination={setPaginationModel}
          sorting={sorting}
          setSorting={setSorting}
          disableUndefinedSorting={true}
          manualSorting={true}
          manualPagination={true}
          noResultsOverlay={
            <Typography variant="body1" fontSize="1.2rem" fontWeight={500}>
              No records of Jobs History
            </Typography>
          }
        />
      </div>
    </div>
  );
}

interface IHistoryActionsProps {
  id: string;
}

export const HistoryActions = ({ id }: IHistoryActionsProps) => {
  const navigate = useNavigate();
  const selectedAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAccount.marketplace,
    [selectedAccount.marketplace]
  );

  return (
    <HoverInfoTooltip title={'View Job History Changes'}>
      <IconButton
        disableRipple
        onClick={() =>
          navigate(`${DAY_PARTING_HISTORY_URL}/${marketplace}/${id}`)
        }
      >
        <PreviewIcon />
      </IconButton>
    </HoverInfoTooltip>
  );
};
