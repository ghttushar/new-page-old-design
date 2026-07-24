import { Typography } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { PAGE_SIZE_OPTIONS, UPDATED_PAGINATION_MODEL } from 'src/constants';
import { IKeywordSOVTable } from 'src/interfaces/keyword-sov.interface';
import { IProductSOVTableData } from 'src/interfaces/product-sov.interface';
import CustomLoadingOverlay from '../../common/custom-loading-overlay/custom-loading-overlay';
import FloatingToast from '../../common/floating-toast/floating-toast';
import styles from '../../common/sov-table/sov-table.module.scss';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';

interface IKeywordSovTableProps {
  tableData: IKeywordSOVTable[] | IProductSOVTableData[];
  tableColumns: ColumnDef<IKeywordSOVTable>[];
  isTableLoading: boolean;
  isDataUpdated: boolean;
}

export default function KeywordSovTable({
  tableData,
  tableColumns,
  isTableLoading,
  isDataUpdated,
}: IKeywordSovTableProps) {
  return (
    <div
      className={styles.reportContainer}
      style={{
        height: '60rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
      }}
    >
      {!isTableLoading && isDataUpdated && (
        <FloatingToast message="Data Updated" />
      )}

      <CustomTableWrapper
        data={tableData as IKeywordSOVTable[]}
        columns={tableColumns}
        getRowId={(originalRow) => (originalRow as any)?.id as string}
        width="100%"
        height="60rem"
        enableRowSelection={false}
        pageSizes={PAGE_SIZE_OPTIONS}
        rowCount={tableData.length}
        manualPagination={true}
        initialPagination={UPDATED_PAGINATION_MODEL}
        disableUndefinedSorting={true}
        isLoading={isTableLoading}
        noResultsOverlay={
          <Typography fontSize="1.5rem" fontWeight={700} color={'black'}>
            No results found
          </Typography>
        }
        loadingOverlay={<CustomLoadingOverlay />}
        customStyles={{
          tbody: {
            tr: {
              td: {
                className: styles.TableRow,
              },
            },
          },
        }}
      />
    </div>
  );
}
