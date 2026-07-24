import { fancyScrollbar } from '@/assets/styles/scrollbar.styles';
import {
  focusedActiveStylesWithShadow,
  outlinedTextBoxNewStyles,
} from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';
import React from 'react';
import { checkboxStyles } from '../dropdown-styles';

export const dropdownComponentContainerStyles: React.CSSProperties = {
  borderRadius: '0.8rem',
  boxSizing: 'border-box',

  ...focusedActiveStylesWithShadow(),
};

export const dropdownFilterContainerStyles: React.CSSProperties = {
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'space-between',
  gap: '1rem',
};

export const dropdownSearchFilterStyles = {
  ...outlinedTextBoxNewStyles(),
  fontSize: '1rem',
  padding: '0.1rem',
};

export const dropdownCheckboxFilterContainerStyles = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '1rem',
};

export const dropdownFilterCheckboxFormControlLabelStyles = {
  mx: 0,
  '.MuiTypography-root': {
    fontSize: '1.1rem',
    fontWeight: 500,
  },
};

export const dropdownFilterCheckboxStyles = {
  ...checkboxStyles,
  p: 0,
  pr: '0.3rem',
  '& .MuiSvgIcon-root': { fontSize: '1.4rem', borderRadius: '0.4rem' },
};

export const dropdownOptionListContainerStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'auto',
  marginTop: '0.5rem',
  ...fancyScrollbar,
};

export const dropdownOptionContainerStyles = {
  width: '100%',
  padding: '1rem',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
};

export const optionLabelStyles = {
  fontSize: '1.2rem',
  fontWeight: 400,
  flex: '0 0 calc(70% - 1.5rem)',
};

export const optionMetaDataContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.2rem',
};

export const noOptionTextStyles = {
  fontSize: '1.1rem',
  fontWeight: '400',
  fontStyle: 'italic',
  padding: '1rem',
  color: '#a3a3a3',
};
