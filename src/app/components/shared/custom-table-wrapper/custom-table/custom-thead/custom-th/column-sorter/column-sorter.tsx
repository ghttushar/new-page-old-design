import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { Header, SortDirection } from '@tanstack/react-table';
import { useCallback } from 'react';
import styles from '../custom-th.module.scss';

export interface ColumnSorterProps<T> {
  header: Header<T, unknown>;
  onSortHandler: (e: unknown, sortDirection: SortDirection) => void;
  isNewDesign?: boolean;
}

export function ColumnSorter<T>(props: ColumnSorterProps<T>) {
  const { header, onSortHandler, isNewDesign = false } = props;

  const sortDirection = header.column.getIsSorted();

  const handleAscendingSort = useCallback(
    (e: unknown) => {
      if (sortDirection !== 'asc') {
        onSortHandler(e, 'asc');
      }
    },
    [sortDirection, onSortHandler]
  );

  const handleDescendingSort = useCallback(
    (e: unknown) => {
      if (sortDirection !== 'desc') {
        onSortHandler(e, 'desc');
      }
    },
    [sortDirection, onSortHandler]
  );

  if (header.column.getCanSort() === false) return <span></span>;
  return (
    <div
      className={styles.sortIcon}
      role="group"
      aria-label="Column sorting controls"
    >
      <HoverInfoTooltip
        title="Sort Ascending"
        children={
          <CaretUpIcon
            className={`${
              isNewDesign ? styles.newIconStyles : styles.iconStyles
            } ${
              sortDirection === 'asc' && !isNewDesign ? styles.activeColor : ''
            }`}
            weight={
              sortDirection === 'asc' && isNewDesign === true ? 'fill' : 'bold'
            }
            size={
              sortDirection === 'asc' && isNewDesign === true
                ? '1.3rem'
                : '1.2rem'
            }
            onClick={handleAscendingSort}
            aria-label="Sort column in ascending order"
          />
        }
      />

      <HoverInfoTooltip
        title="Sort Descending"
        position={TooltipPlacement.Bottom}
        children={
          <CaretDownIcon
            className={`${
              isNewDesign ? styles.newIconStyles : styles.iconStyles
            } ${
              sortDirection === 'desc' && !isNewDesign ? styles.activeColor : ''
            }`}
            weight={
              sortDirection === 'desc' && isNewDesign === true ? 'fill' : 'bold'
            }
            size={
              sortDirection === 'desc' && isNewDesign === true
                ? '1.3rem'
                : '1.2rem'
            }
            onClick={handleDescendingSort}
            aria-label="Sort column in descending order"
          />
        }
      />
    </div>
  );
}

export default ColumnSorter;
