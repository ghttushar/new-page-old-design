import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { BooleanEnum } from '@/enums/chatbot.enums';
import { DataRow } from '@/interfaces/chatbot.interface';
import { formatHeaderText } from '@/utils';
import { checkIsNull } from '@/utils/advertising.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import { CircularProgress } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useMemo, useRef } from 'react';
import CustomCheckbox from '../../../common/custom-checkbox/custom-checkbox';
import styles from './generic-table.module.scss';

interface GenericTableProps {
  data: DataRow[] | undefined;
  setTableData?: (data: DataRow[]) => void;
  isLoading?: boolean;
  maxColumns?: number;
  isCompact?: boolean;
  hasCheckboxes?: boolean;
  onRowClick?: (index: number, e: React.MouseEvent) => void;
  isDisabled?: boolean;
  maxRows?: number;
}

const VIRTUALIZATION_THRESHOLD = 100;
const VIRTUALIZATION_OVERSCAN = 8;

const GenericTable: React.FC<GenericTableProps> = ({
  data,
  isLoading = false,
  maxColumns,
  isCompact = false,
  hasCheckboxes = false,
  onRowClick,
  isDisabled = false,
  setTableData,
  maxRows = data?.length || 0,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableData = data ?? [];

  const isAllSelected = useMemo(
    () => chatbotUtils.areAllRowsSelected(tableData),
    [tableData]
  );
  const isSomeRowsSelected = useMemo(
    () => chatbotUtils.isSelectionIndeterminate(tableData),
    [tableData]
  );
  const columns = useMemo(
    () =>
      tableData.length === 0
        ? []
        : chatbotUtils.getColumnsFromDataKeys(tableData[0], maxColumns),
    [maxColumns, tableData]
  );
  const formattedData = useMemo(
    () =>
      maxRows >= tableData.length ? tableData : tableData.slice(0, maxRows),
    [maxRows, tableData]
  );
  const shouldVirtualize = formattedData.length > VIRTUALIZATION_THRESHOLD;
  const columnCount = columns.length + (hasCheckboxes ? 1 : 0);

  const rowVirtualizer = useVirtualizer({
    count: shouldVirtualize ? formattedData.length : 0,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => (isCompact ? 40 : 58),
    overscan: VIRTUALIZATION_OVERSCAN,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  if (isLoading) {
    return (
      <div className={styles.noData}>
        <CircularProgress sx={{ color: '#77469b' }} size={'3rem'} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>
        <span>No data available</span>
      </div>
    );
  }

  const updateTableData = (nextData: DataRow[]) => {
    if (setTableData) setTableData(nextData);
  };

  const onChange = (index: number) => {
    const newData = [...tableData];
    if (newData[index]) {
      newData[index] = {
        ...newData[index],
        isSelected:
          newData[index].isSelected === BooleanEnum.TRUE
            ? BooleanEnum.FALSE
            : BooleanEnum.TRUE,
      };
    }
    updateTableData(
      newData.filter((nextRow) => checkIsNull(nextRow.isSelected) === false)
    );
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isDisabled) return;
    updateTableData(
      tableData
        .map((row) => ({
          ...row,
          isSelected: isAllSelected ? BooleanEnum.FALSE : BooleanEnum.TRUE,
        }))
        .filter((nextRow) => checkIsNull(nextRow.isSelected) === false)
    );
  };

  if (columns.length === 0) return null;

  const virtualRows = shouldVirtualize ? rowVirtualizer.getVirtualItems() : [];
  const totalSize = shouldVirtualize ? rowVirtualizer.getTotalSize() : 0;
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  const renderCells = (row: DataRow, rowIndex: number) => (
    <React.Fragment>
      {hasCheckboxes && (
        <td
          className={`${styles.td} ${styles.checkboxColumn} ${
            isCompact ? styles.compact : ''
          }`}
          style={{
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <CustomCheckbox
            checked={row.isSelected === BooleanEnum.TRUE}
            disabled={isDisabled}
            onChange={(e) => {
              e.stopPropagation();
              if (!isDisabled) onChange(rowIndex);
            }}
            onClick={(e) => e.stopPropagation()}
            className={`${styles.checkboxRow} ${
              isCompact ? styles.checkboxCompact : ''
            }`}
            checkboxColor="#77469b"
          />
        </td>
      )}
      {columns.map((column) => (
        <td
          key={`${rowIndex}-${column}`}
          className={`${styles.td} ${isCompact ? styles.compact : ''}`}
          title={`${chatbotUtils.formatCell(row[column], column)}`}
        >
          {chatbotUtils.formatCell(row[column], column)}
        </td>
      ))}
    </React.Fragment>
  );

  return (
    <div
      ref={scrollContainerRef}
      className={`${styles.container} ${isCompact ? styles.compact : ''}`}
    >
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr
              className={styles.headerRow}
              onClick={(e) => e.stopPropagation()}
            >
              {hasCheckboxes && (
                <th
                  className={`${styles.th} ${styles.checkboxColumn} ${
                    isCompact ? styles.compact : ''
                  }`}
                  style={{
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <CustomCheckbox
                    checked={isAllSelected}
                    indeterminate={isSomeRowsSelected}
                    disabled={isDisabled}
                    onChange={handleToggleAll}
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.checkboxHeader} ${
                      isCompact ? styles.checkboxCompact : ''
                    }`}
                    checkboxColor="white"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column}
                  className={`${styles.th} ${isCompact ? styles.compact : ''}`}
                >
                  <HoverInfoTooltip title={formatHeaderText(column)}>
                    <span className={styles.thDiv}>
                      {formatHeaderText(column)}
                    </span>
                  </HoverInfoTooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shouldVirtualize ? (
              <React.Fragment>
                {paddingTop > 0 && (
                  <tr aria-hidden="true">
                    <td
                      colSpan={columnCount}
                      className={styles.virtualSpacerCell}
                      style={{ height: `${paddingTop}px` }}
                    />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = formattedData[virtualRow.index];
                  if (!row) return null;

                  return (
                    <tr
                      key={virtualRow.index}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      className={styles.row}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick?.(virtualRow.index, e);
                      }}
                    >
                      {renderCells(row, virtualRow.index)}
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr aria-hidden="true">
                    <td
                      colSpan={columnCount}
                      className={styles.virtualSpacerCell}
                      style={{ height: `${paddingBottom}px` }}
                    />
                  </tr>
                )}
              </React.Fragment>
            ) : (
              formattedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={styles.row}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick?.(rowIndex, e);
                  }}
                >
                  {renderCells(row, rowIndex)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
