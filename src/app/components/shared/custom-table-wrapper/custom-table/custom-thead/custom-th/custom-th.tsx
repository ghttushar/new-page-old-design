import {
  ColumnSort,
  flexRender,
  Header,
  Row,
  SortDirection,
  SortingState,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { ROW_SELECTION_HEADER_ID } from 'src/constants/custom-table/table.constants';
import { ICustomTableStylesHelper } from 'src/interfaces/custom-table/custom-table.interfaces';
import customTableUtils from 'src/utils/custom-table.utils';
import ColumnSorter from './column-sorter/column-sorter';
import styles from './custom-th.module.scss';

/* eslint-disable-next-line */
export interface CustomThProps<T> {
  header: Header<T, unknown>;
  manualSorting?: boolean;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  setPageIndex: (pageIndex: number) => void;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  customStyles?: ICustomTableStylesHelper;
  enableMultiSort?: boolean;
  isNewDesign?: boolean;
}

export function CustomTh<T>(props: CustomThProps<T>) {
  const {
    header,
    manualSorting,
    sorting,
    setSorting,
    setPageIndex,
    enableRowSelection,
    customStyles,
    enableMultiSort,
    isNewDesign = false,
  } = props;
  const getIndexOfCurrentColumn = () => {
    if (!sorting || !sorting?.length) return -1;
    for (let i = 0; i < sorting.length; i++) {
      if (sorting[i].id === header.column.id) return i;
    }
    return -1;
  };
  const shouldShowResizingAndSorting = useMemo(
    () => header.id !== ROW_SELECTION_HEADER_ID || !enableRowSelection,
    [enableRowSelection, header.id]
  );

  const onSortHandler = (e: unknown, sortDirection: SortDirection) => {
    if (!header.column.getCanSort()) return;
    if (!manualSorting) {
      const sortFunction = header.column.toggleSorting;
      if (sortFunction) sortFunction(sortDirection === 'desc', false);
      return;
    } else if (manualSorting && setSorting) {
      const _sorting = sorting ? [...sorting] : [];
      const nextSortingOrder = header.column.getNextSortingOrder();

      const idx = getIndexOfCurrentColumn();

      if (idx === -1) {
        const sort: ColumnSort = {
          id: header.column.id,
          desc: sortDirection === 'desc',
        };
        if (enableMultiSort) setSorting([..._sorting, sort]);
        else setSorting([sort]);
      } else {
        if (nextSortingOrder === false) {
          _sorting.splice(idx, 1);
          setSorting([..._sorting]);
        } else {
          _sorting[idx] = {
            ..._sorting[idx],
            desc: sortDirection === 'desc',
          };
          setSorting([..._sorting]);
        }
      }
      setPageIndex(0);
    }
  };

  return (
    <th
      className={`${styles.th}  ${customStyles?.className}`}
      key={header.id}
      colSpan={header.colSpan}
      style={{
        width: `calc(var(--header-${header?.id}-size) * 1px)`,
        ...customTableUtils.getCommonPinningStyles(header.column, true),
      }}
      data-test="table-th"
    >
      <div className={`${styles.wrapper} ${customStyles?.wrapper}`}>
        {header.isPlaceholder ? null : (
          <div className={`${styles.textWrapper} ${customStyles?.tdDiv}`}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>

            <span>
              {shouldShowResizingAndSorting && (
                <ColumnSorter
                  header={header}
                  onSortHandler={onSortHandler}
                  isNewDesign={isNewDesign}
                />
              )}
            </span>
          </div>
        )}
        {/* {shouldShowResizingAndSorting && <ColumnResizer header={header} />} */}
      </div>
    </th>
  );
}

export default CustomTh;
