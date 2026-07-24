import { Row, SortingState, Table } from '@tanstack/react-table';
import { ICustomTableHeaderStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import CustomTh from './custom-th/custom-th';
import styles from './custom-thead.module.scss';

/* eslint-disable-next-line */
export interface CustomTheadProps<T> {
  table: Table<T>;
  manualSorting?: boolean;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  setPageIndex: (pageIndex: number) => void;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  customStyles?: ICustomTableHeaderStyles;
  isNewDesign?: boolean;
}

export function CustomThead<T>(props: CustomTheadProps<T>) {
  const {
    table,
    manualSorting,
    sorting,
    setSorting,
    setPageIndex,
    enableRowSelection,
    customStyles,
    isNewDesign = false,
  } = props;
  return (
    <thead
      className={`${styles.thead} ${customStyles?.className}`}
      data-test="table-thead"
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          className={`${styles.tr} ${customStyles?.tr?.className}`}
          key={headerGroup.id}
          style={{ height: 'auto' }}
        >
          {headerGroup.headers.map((header) => {
            return (
              <CustomTh
                header={header}
                key={header.id}
                manualSorting={manualSorting}
                sorting={sorting}
                setSorting={setSorting}
                setPageIndex={setPageIndex}
                enableRowSelection={enableRowSelection}
                customStyles={customStyles?.tr?.th}
                enableMultiSort={table.options.enableMultiSort}
                isNewDesign={isNewDesign}
              />
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

export default CustomThead;
