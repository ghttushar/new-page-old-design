import React from 'react';

export const getTableAccordionStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '12.7rem',
  zIndex: '10',
  right: '6.4rem',
  width: '50rem',
};

export const getProfitabilityCardIconStyles = (
  isSelected: boolean,
  isExpanded: boolean
): React.CSSProperties => {
  return {
    rotate: isSelected && isExpanded ? '0deg' : '90deg',
    transition: 'all 0.2s ease',
  };
};

export const getAccordionItemStyles = (
  isNull: boolean,
  isTable: boolean,
  hasChildren: boolean,
  isLoading: boolean
): React.CSSProperties => {
  return {
    cursor:
      isNull === true && isTable === false
        ? 'not-allowed'
        : hasChildren
        ? 'pointer'
        : 'default',
    padding: isLoading === true ? '0.06rem 1rem' : undefined,
  };
};

export const getCaretIconStyles = (
  isExpanded: boolean,
  isNull: boolean,
  isTable: boolean,
  hasChildren: boolean
): React.CSSProperties => {
  return {
    transition: 'all 0.2s ease',
    rotate: isExpanded ? '90deg' : '0deg',
    cursor:
      (isNull === true && isTable === false) || !hasChildren
        ? 'not-allowed'
        : 'pointer',
  };
};

export const getExpandToggleStyles = (
  isExpanded: boolean
): React.CSSProperties => {
  return {
    rotate: isExpanded === true ? '90deg' : '0deg',
    transition: 'rotate 0.2s ease-in-out',
    cursor: 'pointer',
  };
};

export const getPnLTableRowCaretStyles = (
  isExpanded: boolean,
  hasChildren: boolean
): React.CSSProperties => {
  return {
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
    visibility: hasChildren ? 'visible' : 'hidden',
    marginLeft: '1rem',
  };
};
