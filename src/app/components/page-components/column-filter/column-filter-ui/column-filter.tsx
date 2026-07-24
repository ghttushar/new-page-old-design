import columnFilterUtils from '@/utils/column-filter.utils';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import styles from './column-filter.module.scss';

interface IColumnFilterProps {
  columns: string[];
  setSelectedColumns: (columnName: string, selectedColumns: boolean) => void;
  selectedTableTitle: string;
  handleApply?: () => void;
  handleCancel?: () => void;
  checkedColumns?: string[];
  handleClearAll?: (searchItem: string) => void;
  handleSelectAll?: (searchItem: string) => void;
  style?: React.CSSProperties;
}

const ColumnFilter = (props: IColumnFilterProps) => {
  const {
    columns,
    style,
    setSelectedColumns,
    handleApply,
    handleCancel,
    checkedColumns,
    handleClearAll,
    handleSelectAll,
    selectedTableTitle,
  } = props;

  const [searchItem, setSearchItem] = useState<string>('');
  const [isSelectedColumnsChanged, setIsSelectedColumnsChanged] =
    useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const columnName = e.target.value;
    const updatedSelectedColumns = e.target.checked;
    setSelectedColumns(columnName, updatedSelectedColumns);
    setIsSelectedColumnsChanged(true);
  };

  const onHandleClearAll = (searchItem: string) => {
    handleClearAll && handleClearAll(searchItem);
  };

  const onHandleSelectAll = (searchItem: string) => {
    handleSelectAll && handleSelectAll(searchItem);
    setIsSelectedColumnsChanged(true);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        handleCancel && handleCancel();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      style={{ ...(style || {}) }}
    >
      <input
        className={styles.input}
        type="text"
        placeholder="Search"
        onChange={handleSearch}
        autoFocus
      />
      <div className={styles.AttributesContainer}>
        <div className={styles.AttributeGroup}>
          <div
            className={styles.OutlineButton}
            onClick={() => onHandleClearAll(searchItem)}
          >
            Clear All
          </div>
          <div
            className={styles.OutlineButton}
            onClick={() => onHandleSelectAll(searchItem)}
          >
            Select All
          </div>
        </div>
        <FormGroup className={styles.FormGroup}>
          {columns.map((column, index) => {
            const isColumnChecked = checkedColumns?.includes(column);
            const isColumnDisabled =
              columnFilterUtils.checkIsColumnDisabledByTableTitle(
                selectedTableTitle,
                column
              );
            return searchItem === '' ||
              column.toLowerCase().includes(searchItem.toLowerCase()) ? (
              <FormControlLabel
                key={`${column}-${index}`}
                disabled={columnFilterUtils.checkIsColumnDisabledByTableTitle(
                  selectedTableTitle,
                  column
                )}
                sx={{
                  '&.Mui-disabled': {
                    cursor: 'not-allowed',
                  },
                }}
                control={
                  <Checkbox
                    checked={isColumnChecked}
                    onChange={handleCheckboxChange}
                    value={column}
                    sx={{
                      '&.Mui-checked': {
                        color: '#77469b',
                      },
                      '&.Mui-disabled': {
                        color: '#969696',
                      },
                    }}
                  />
                }
                label={
                  <Typography className={styles.ItemTypo}>{column}</Typography>
                }
                className={styles.ListItem}
              />
            ) : null;
          })}
        </FormGroup>
      </div>
      <div className={styles.ButtonGroup}>
        <Button className={`${styles.Button} `} onClick={handleCancel}>
          Cancel
        </Button>

        <PrimaryButton
          buttonText={'Apply'}
          buttonFunction={() => {
            handleApply && handleApply();
          }}
          disabled={
            !isSelectedColumnsChanged ||
            (checkedColumns && checkedColumns?.length <= 0)
              ? true
              : false
          }
          height="2.5rem"
        />
      </div>
    </div>
  );
};

export default ColumnFilter;
