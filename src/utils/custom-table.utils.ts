import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { DEFAULT_ADVERTISING_SORT_CRITERIA } from '@/constants/advertising-filter.constants';
import {
  Column,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
} from '@tanstack/react-table';
import { CSSProperties } from 'react';

const customTableUtils = {
  getCommonPinningStyles: <T>(
    column: Column<T>,
    isHeader = false,
    isPinFooter = false
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right');

    let zIndex = 0;
    if (isHeader && isPinned) zIndex = 3;
    else if (isHeader && !isPinned) zIndex = 2;
    else if (!isHeader && isPinned) zIndex = 1;
    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned || isHeader || isPinFooter ? 'sticky' : 'inherit',
      width: column.getSize(),
      zIndex,
      bottom: isPinFooter ? 0 : undefined,
    };
  },

  handleManualPagination: (
    updaterOrValue: Updater<PaginationState>,
    paginationModel: PaginationState
  ) => {
    let latestPaginationModel: PaginationState | null;

    if (typeof updaterOrValue === 'function') {
      latestPaginationModel = updaterOrValue(
        paginationModel || UPDATED_PAGINATION_MODEL
      );
    } else {
      latestPaginationModel = updaterOrValue;
    }

    if (latestPaginationModel) {
      return latestPaginationModel;
    } else return UPDATED_PAGINATION_MODEL;
  },

  handleManualSorting: (
    updaterOrValue: Updater<SortingState>,
    sortModel: SortingState | undefined
  ) => {
    let latestSortModel: SortingState;

    if (typeof updaterOrValue === 'function') {
      latestSortModel = updaterOrValue(
        sortModel || DEFAULT_ADVERTISING_SORT_CRITERIA
      );
    } else {
      latestSortModel = updaterOrValue;
    }
    if (latestSortModel.length > 0) {
      return latestSortModel;
    } else return DEFAULT_ADVERTISING_SORT_CRITERIA;
  },

  handleManualRowSelection: (
    updaterOrValue: Updater<RowSelectionState>,
    selectedRows: RowSelectionState
  ) => {
    let newSelection: RowSelectionState;

    if (typeof updaterOrValue === 'function') {
      newSelection = updaterOrValue(selectedRows || {});
    } else {
      newSelection = updaterOrValue;
    }

    return newSelection;
  },
  flattenData<T>(
    data: T[],
    getChildren: (item: T) => T[]
  ): (T & { pathIndex: string })[] {
    const result: (T & { pathIndex: string })[] = [];

    this.traverse(data, getChildren, result);

    return result;
  },

  traverse<T>(
    items: T[],
    getChildren: (item: T) => T[],
    result: (T & { pathIndex: string })[],
    parentPath = ''
  ) {
    items.forEach((item, index) => {
      const currentPath = parentPath
        ? `${parentPath}.${index + 1}`
        : `${index + 1}`;

      result.push({
        ...item,
        pathIndex: currentPath,
      });

      const children = getChildren(item);
      if (children?.length) {
        this.traverse(children, getChildren, result, currentPath);
      }
    });
  },
};

export default customTableUtils;
