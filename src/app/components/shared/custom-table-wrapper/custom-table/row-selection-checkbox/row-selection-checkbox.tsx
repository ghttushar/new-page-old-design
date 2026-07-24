import { useEffect, useMemo, useRef } from 'react';
import styles from './row-selection-checkbox.module.scss';
export interface RowSelectionCheckboxProps {
  indeterminate: boolean;
  checked: boolean;
  onChange: (event: unknown) => void;
  disabled?: boolean;
  isLoading?: boolean;
  areColumnsPopulated?: boolean;
  isHeader: boolean;
}

export function RowSelectionCheckbox(props: RowSelectionCheckboxProps) {
  const {
    indeterminate,
    checked,
    disabled,
    onChange,
    isLoading,
    areColumnsPopulated = false,
    isHeader,
  } = props;
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate;
    }
  }, [ref, indeterminate, checked]);

  const isHeaderCheckboxVisible = useMemo(() => {
    if (isHeader === true) {
      if (isLoading === true) return false;
      else {
        if (areColumnsPopulated === true) return true;
        return false;
      }
    }
  }, [areColumnsPopulated, isLoading, isHeader]);

  return (
    <div
      className={styles.rowSelectionCheckboxWrapper}
      style={{
        visibility:
          isHeaderCheckboxVisible === undefined
            ? isLoading === true
              ? 'hidden'
              : 'visible'
            : isHeaderCheckboxVisible === false
            ? 'hidden'
            : 'visible',
      }}
    >
      <input
        type="checkbox"
        ref={ref}
        className={styles.checkbox}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}

export default RowSelectionCheckbox;
