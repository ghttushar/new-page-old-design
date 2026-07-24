import { CircularProgress } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { primaryColor } from '../../layout/side-bar/menu-item-component-styles';
import styles from './virtualized-multi-select-dropdown.module.scss';

interface IVirtualizedMultiSelectDropdownProps<T> {
  options: T[];
  inputValue: string;
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  disabled?: boolean;
  placeholder?: string;
  width?: string;
  height?: string;
  background?: string;
  itemHeight: number;
  maxVisibleItems: number;
  overScan?: number;
  loading?: boolean;
  loadingContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
  endAdornment?: React.ReactNode;
  textFieldSx?: SxProps<Theme>;
  inputRootSx?: React.CSSProperties;
  paperStyle?: React.CSSProperties;
  containerClassName?: string;
  inputContainerClassName?: string;
  getOptionKey: (option: T, index: number) => string;
  isOptionSelected: (option: T) => boolean;
  onOptionSelect: (option: T) => void;
  renderOptionContent: (option: T) => React.ReactNode;
  optionBaseStyle?: React.CSSProperties;
  optionSelectedStyle?: React.CSSProperties;
  optionUnselectedStyle?: React.CSSProperties;
}
const defaultLoader = (
  <span className={styles.defaultLoader}>
    <CircularProgress
      sx={{
        color: primaryColor,
      }}
    />
    Loading...
  </span>
);
export default function VirtualizedMultiSelectDropdown<T>({
  options,
  inputValue,
  onInputChange,
  open,
  onOpen,
  onClose,
  disabled,
  placeholder,
  width,
  height,
  background,
  itemHeight,
  maxVisibleItems,
  overScan = 5,
  loading,
  loadingContent = defaultLoader,
  emptyContent,
  endAdornment,
  textFieldSx,
  inputRootSx,
  paperStyle,
  containerClassName,
  inputContainerClassName,
  getOptionKey,
  isOptionSelected,
  onOptionSelect,
  renderOptionContent,
  optionBaseStyle,
  optionSelectedStyle,
  optionUnselectedStyle,
}: IVirtualizedMultiSelectDropdownProps<T>) {
  const dropdownAnchorRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => itemHeight,
    overscan: overScan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const dropdownHeight = useMemo(
    () => Math.min(options.length, maxVisibleItems) * itemHeight,
    [itemHeight, maxVisibleItems, options.length]
  );

  const inputRootStyles = useMemo(
    () => ({
      width: width || 'auto',
      height: height || '3rem',
      background: background || 'inherit',
      ...inputRootSx,
    }),
    [background, height, inputRootSx, width]
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const handleOptionMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (open && scrollParentRef.current) {
      scrollParentRef.current.scrollTop = 0;
    }
  }, [inputValue, open]);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className={containerClassName}>
        <div className={inputContainerClassName} ref={dropdownAnchorRef}>
          <TextField
            disabled={disabled}
            value={inputValue}
            onChange={onInputChange}
            onFocus={onOpen}
            onClick={onOpen}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            InputProps={{
              endAdornment,
              sx: inputRootStyles,
            }}
            sx={textFieldSx}
          />
        </div>

        <Popper
          open={open}
          anchorEl={dropdownAnchorRef.current}
          placement="bottom-start"
          disablePortal
          style={{ zIndex: 1300 }}
        >
          <div
            style={{
              ...paperStyle,
              width: dropdownAnchorRef.current
                ? `${dropdownAnchorRef.current.clientWidth}px`
                : width || 'auto',
            }}
            key={inputValue}
          >
            {loading ? (
              loadingContent
            ) : options.slice(1).length > 0 ? (
              <div
                ref={scrollParentRef}
                className={styles.optionsContainer}
                style={{ height: `${dropdownHeight}px` }}
              >
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: 'relative',
                  }}
                >
                  {virtualItems.map((virtualItem) => {
                    const option = options[virtualItem.index];

                    if (option === undefined) {
                      return null;
                    }

                    const selected = isOptionSelected(option);

                    return (
                      <div
                        key={getOptionKey(option, virtualItem.index)}
                        role="option"
                        aria-selected={selected}
                        onMouseDown={handleOptionMouseDown}
                        onClick={() => onOptionSelect(option)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                          display: 'flex',
                          alignItems: 'center',
                          ...optionBaseStyle,
                          ...(selected
                            ? optionSelectedStyle
                            : optionUnselectedStyle),
                        }}
                      >
                        {renderOptionContent(option)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              emptyContent || (
                <div className={styles.noOptionText}>No options available</div>
              )
            )}
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
