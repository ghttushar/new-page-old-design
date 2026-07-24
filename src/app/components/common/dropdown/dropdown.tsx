import { CountryCodeEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListItemIcon } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import Typography from '@mui/material/Typography';
import { GlobalDataTestIds } from 'cypress/enums/global';
import React, { useEffect, useState } from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { IDateRange } from 'src/interfaces/serp.interface';
import InfoIcon from '../info-icon/info-icon';

import { checkIsNull } from '@/utils/advertising.utils';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import {
  formControlStyles,
  inputLabelNewStyles,
  inputLabelStyles,
  listItemTextStyles,
  menuPropsStyles,
  paperPropsNewStyles,
  paperPropsOldStyles,
  paperPropsStyles,
  selectNewStyles,
  selectOldStyles,
  selectStyles,
} from './dropdown-styles';
import styles from './dropdown.module.scss';

export interface IDropdownItem<T> {
  label: string;
  value: T;
  isCustom?: boolean;
  isDisabled?: boolean;
  selected?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPlacement;
  marketplace?: MarketplaceEnum;
  prefixElement?: JSX.Element;
  countryCode?: CountryCodeEnum;
  flagElement?: JSX.Element;
}

export interface IDropdownProps<T> {
  options: IDropdownItem<T>[];
  label?: string;
  labelStyles?: React.CSSProperties;
  labelTooltipTitle?: string;
  labelTooltipPosition?: TooltipPlacement;
  selected: IDropdownItem<T>;
  onSelect: (option: IDropdownItem<T>) => void;
  onBlur?: () => void;
  fieldValue?: number;
  onValueChange?: (value: number) => void;
  width?: string;
  height?: string;
  variant?: string;
  fontColor?: string;
  background?: string;
  fontSize?: string;
  fontWeight?: string | number;
  customDateRange?: IDateRange;
  disabled?: boolean;
  onMouseDown?: () => void;
  isTooltipRequired?: boolean;
  error?: boolean;
  stopPropagation?: boolean;
  minWidth?: string;
  prefixElement?: JSX.Element;
  isOptionsRequireTooltip?: boolean;
  dropShadow?: boolean;
  dropdownHeight?: string;
  flagElement?: JSX.Element;
  inlineLabel?: string;
  isNewDesign?: boolean;
}

export interface IMenuItemProps {
  'data-index': number;
}

const Dropdown = <T,>(props: IDropdownProps<T>) => {
  const {
    prefixElement,
    options,
    label,
    labelStyles,
    labelTooltipTitle,
    labelTooltipPosition = TooltipPlacement.Top,
    selected,
    onSelect,
    onBlur,
    customDateRange,
    width,
    height,
    background,
    fontSize,
    fontWeight,
    onMouseDown,
    fontColor,
    variant,
    stopPropagation,
    error = false,
    fieldValue,
    onValueChange,
    disabled,
    isTooltipRequired,
    minWidth,
    isOptionsRequireTooltip,
    dropShadow = false,
    flagElement,
    inlineLabel,
    isNewDesign,
  } = props;
  const [selectedOption, setSelectedOption] =
    useState<IDropdownItem<T>>(selected);
  const handleChange = (
    event: SelectChangeEvent<IDropdownItem<T>>,
    element: React.ReactNode
  ) => {
    const el = element as React.ReactElement;

    const idx = el.props['data-index'];
    const selectedValue = options[idx];
    if (selectedValue.isDisabled === true) return;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };
  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  function getClassName(styles: any, variant?: string): string {
    if (variant === 'sideBySide') {
      return styles.sideBySide;
    } else if (variant === 'unset') {
      return styles.unset;
    } else {
      return styles.default;
    }
  }

  return (
    <div
      data-test={GlobalDataTestIds.MARKETPLACE_DROPDOWN}
      className={getClassName(styles, variant)}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: width ?? '100%',
        transition: 'all 0.2s ease',
      }}
    >
      {label !== '' && label !== undefined && (
        <InputLabel
          sx={{
            ...(isNewDesign ? inputLabelNewStyles : inputLabelStyles),
            color: disabled ? '#bbb' : 'initial',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          style={labelStyles}
        >
          {label}
          {labelTooltipTitle && (
            <InfoIcon
              title={labelTooltipTitle as string}
              disabled={disabled}
              position={labelTooltipPosition}
            />
          )}
        </InputLabel>
      )}

      <FormControl
        sx={{
          ...formControlStyles,
          marginTop: 0,
          minWidth: minWidth ? minWidth : 0,
          width: width ? width : 'auto',
          boxShadow:
            dropShadow === false
              ? ''
              : '0rem 0.2rem 0.4rem 0rem rgba(0, 0, 0, 0.1)',
        }}
        error={error}
        disabled={disabled}
      >
        <Select
          value={selectedOption}
          onChange={handleChange}
          onMouseDown={onMouseDown}
          onBlur={handleBlur}
          disabled={disabled}
          IconComponent={ExpandMoreIcon}
          renderValue={(selected) => (
            <div
              style={{
                display: 'flex',
                gap: '0.4rem',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'start',
                marginLeft: '-0.4rem',
                width: '100%',
              }}
            >
              {renderElement(prefixElement)}
              {renderElement(flagElement)}

              <Typography
                sx={{
                  fontSize: fontSize ? fontSize : '1.2rem',
                  fontWeight: fontWeight ? fontWeight : 400,
                  color: fontColor ? fontColor : 'inherit',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                title={selectedOption.label}
              >
                <HoverInfoTooltip
                  title={selectedOption.label}
                  disableTooltip={disabled}
                >
                  <span>
                    {checkIsNull(inlineLabel) === false && (
                      <span
                        style={{
                          fontWeight: '600',
                        }}
                      >
                        {inlineLabel} | &nbsp;
                      </span>
                    )}
                    {selectedOption.label}
                  </span>
                </HoverInfoTooltip>
              </Typography>
              {isOptionsRequireTooltip === true &&
                !selectedOption.isDisabled &&
                selectedOption.tooltipText && (
                  <InfoIcon
                    title={selectedOption.tooltipText as string}
                    position={TooltipPlacement.Right}
                  />
                )}
            </div>
          )}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            ...selectStyles,
            textAlign: 'start',
            minWidth: minWidth ? minWidth : 0,
            width: width ? width : 'auto',
            height: height ? height : '3rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: background ? background : 'inherit',
            border:
              dropShadow === false
                ? '0.5px solid #acacac !important'
                : '1px solid white !important',

            ...(isNewDesign ? selectNewStyles : selectOldStyles),
          }}
          MenuProps={{
            slotProps: { root: { sx: { '.MuiList-root': { padding: 0 } } } },
            PaperProps: {
              sx: {
                ...paperPropsStyles,
                ...(isNewDesign ? paperPropsNewStyles : paperPropsOldStyles),
              },
            },
            sx: {
              ...menuPropsStyles,
              maxWidth: '20rem',
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={`${option.value}-${index}`}
              value={option.value as string}
              data-index={index}
              autoFocus={selectedOption.value === option.value}
              selected={selectedOption.value === option.value}
              className={
                selectedOption.value === option.value ? 'Mui-selected' : ''
              }
              sx={{
                margin: '0',
                marginLeft: '-0.4rem',
                cursor: option.isDisabled ? 'not-allowed' : 'pointer',
                opacity: option.isDisabled ? '0.5' : '1',
                '&:hover .MuiTypography-body1': {
                  color: option.isDisabled ? '#000000 !important' : '',
                },
              }}
            >
              {renderElement(option.prefixElement)}
              {renderElement(option.flagElement)}

              <HoverInfoTooltip
                title={option.tooltipText ?? 'In Progress...'}
                disableTooltip={option.isDisabled !== true}
                position={option.tooltipPosition}
              >
                <ListItemText primary={option.label} sx={listItemTextStyles} />
              </HoverInfoTooltip>
              {isOptionsRequireTooltip === true && (
                <ListItemIcon
                  sx={{
                    display: 'inline-flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: '0.3rem',
                  }}
                >
                  <InfoIcon
                    title={option.tooltipText as string}
                    position={TooltipPlacement.Right}
                  />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Dropdown;
function renderElement(
  prefixElement: JSX.Element | undefined
): React.ReactNode {
  if (prefixElement === undefined) return null;
  return (
    <React.Fragment>
      {prefixElement}
      <div className={styles.vl} />
    </React.Fragment>
  );
}
