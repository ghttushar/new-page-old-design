import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import columnFilterUtils from 'src/utils/column-filter.utils';
import ColumnFilter from './column-filter-ui/column-filter';

interface INewColumnFilterWrapperProps<T> {
  columns: Array<ColumnDef<T>>;
  getSelectedColumns: (selectedColumns: Array<ColumnDef<T>>) => void;
  closeColumnFilter: () => void;
  selectedTableTitle: string;
  _selectedColumns: Array<ColumnDef<T>>;
  style?: React.CSSProperties;
}
const NewColumnFilterWrapper = <T,>(props: INewColumnFilterWrapperProps<T>) => {
  const {
    columns,
    getSelectedColumns,
    closeColumnFilter,
    _selectedColumns,
    style,
    selectedTableTitle,
  } = props;
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [initialColumns, setInitialColumns] = useState<string[]>([]);

  const handleSelectedColumns = (
    columnName: string,
    updatedSelectedColumns: boolean
  ) => {
    if (updatedSelectedColumns) {
      setSelectedColumns([...selectedColumns, columnName]);
    } else {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    }
  };

  useEffect(() => {
    const initialColumnIds: string[] = columnFilterUtils.getColumnIds(columns);
    const selectedColumnIds: string[] =
      columnFilterUtils.getColumnIds(_selectedColumns);

    setSelectedColumns(selectedColumnIds);
    setInitialColumns(initialColumnIds);
  }, [columns, _selectedColumns]);

  const handleApply = () => {
    const selectedColumnsData = columnFilterUtils.getSelectedColumns(
      columns,
      selectedColumns
    );
    getSelectedColumns(selectedColumnsData);
    closeColumnFilter();
  };

  const handleCancel = () => {
    closeColumnFilter();
  };

  const handleClearAll = (searchItem: string) => {
    const filteredColumns = initialColumns.filter((column) =>
      column.toLowerCase().includes(searchItem.toLowerCase())
    );
    setSelectedColumns((prev) =>
      prev.filter((col) => !filteredColumns.includes(col))
    );
  };

  const handleSelectAll = (searchItem: string) => {
    const filteredColumns = initialColumns.filter((column) =>
      column.toLowerCase().includes(searchItem.toLowerCase())
    );
    setSelectedColumns((prev) => [...prev, ...filteredColumns]);
  };

  return (
    <ColumnFilter
      style={style}
      columns={initialColumns}
      setSelectedColumns={handleSelectedColumns}
      handleApply={handleApply}
      handleCancel={handleCancel}
      checkedColumns={selectedColumns}
      handleClearAll={handleClearAll}
      handleSelectAll={handleSelectAll}
      selectedTableTitle={selectedTableTitle}
    />
  );
};

export default NewColumnFilterWrapper;
