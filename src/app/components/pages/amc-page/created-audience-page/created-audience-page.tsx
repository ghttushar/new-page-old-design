import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAmcSubHeader from '@/hooks/use-amc-sub-header.hook';
import { debounce } from '@mui/material';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchText from 'src/app/components/common/search/debounce-search';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { IAMCCreatedAudienceData } from 'src/interfaces/amc.interfaces';
import { AMCQueryServices } from 'src/services/amc/amc-queries.services';
import { getSearchPlaceholder } from 'src/utils/advertising.utils';
import { amcExecutedAudienceColumns } from './created-audience-page-columns';
import styles from './created-audience-page.module.scss';

export default function CreatedAudiencePage() {
  const amcFilters = useAmcSubHeader(
    PageTitleEnum.CREATED_AUDIENCES,
    PAGE_TITLE_TOOLTIPS.CREATED_AUDIENCES
  );

  const [audienceData, setAudienceData] = useState<IAMCCreatedAudienceData[]>(
    []
  );
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const getAllExecutedAudience = useCallback(
    (searchText: string) => {
      setAudienceData([]);
      setTotalRowCount(0);
      setIsLoading(true);
      AMCQueryServices.getAllExecutedAudience(
        amcFilters?.value as string,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        searchText
      )
        .then((res) => {
          const pagination = res.data.data.pagination;
          let data = res.data.data.data;
          let id = 0;
          data = data.map((audience) => {
            id += 1;
            return {
              id,
              ...audience,
            };
          });
          setAudienceData(data);
          setTotalRowCount(pagination.totalItems as number);
        })
        .catch(() => {
          setAudienceData([]);
          setTotalRowCount(0);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      amcFilters?.value,
      paginationModel.pageIndex,
      paginationModel.pageSize,
    ]
  );

  useEffect(() => {
    getAllExecutedAudience('');
  }, [getAllExecutedAudience]);

  // This useEffect is needed just in case if the totalRows count is undefined from server for some unknown reason.
  useEffect(() => {
    setTotalRowCount((prevTotalRows) =>
      totalRowCount !== undefined ? totalRowCount : prevTotalRows
    );
  }, [totalRowCount]);

  const handleDebouncedChange = useMemo(
    () => debounce(getAllExecutedAudience, 800),
    [getAllExecutedAudience]
  );

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    handleDebouncedChange(searchText);
  };

  return (
    <div className={styles.executedAudienceContainer}>
      <div className={styles.subContainer}>
        <div className={styles.tableHeader}>
          <SearchText
            placeholder={getSearchPlaceholder('AMC_ExecutedAudience')}
            height="2.8rem"
            searchText={searchText}
            setSearchText={handleSearch}
          />
        </div>

        <div className={styles.wrapper}>
          <CustomTableWrapper
            data={audienceData}
            columns={amcExecutedAudienceColumns}
            width="100%"
            height="50rem"
            isLoading={isLoading}
            pageSizes={PAGE_SIZE_OPTIONS}
            rowCount={totalRowCount}
            manualPagination={true}
            pagination={paginationModel}
            setPagination={setPaginationModel}
          />
        </div>
      </div>
    </div>
  );
}
