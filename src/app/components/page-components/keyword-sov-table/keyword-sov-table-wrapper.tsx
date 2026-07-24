import { ColumnDef } from '@tanstack/react-table';
import { IKeywordSOVTable } from 'src/interfaces/keyword-sov.interface';
import { IProductSOVTableData } from 'src/interfaces/product-sov.interface';
import KeywordSovTable from './keyword-sov-table';

interface IKeywordSovTableWrapperProps {
  tableData: IKeywordSOVTable[] | IProductSOVTableData[];
  tableColumns: ColumnDef<IKeywordSOVTable>[];
  isTableLoading: boolean;
  isDataUpdated: boolean;
}

export default function KeywordSovTableWrapper({
  tableData,
  tableColumns,
  isTableLoading,
  isDataUpdated,
}: IKeywordSovTableWrapperProps) {
  return (
    <KeywordSovTable
      tableData={tableData}
      tableColumns={tableColumns}
      isTableLoading={isTableLoading}
      isDataUpdated={isDataUpdated}
    />
  );
}
