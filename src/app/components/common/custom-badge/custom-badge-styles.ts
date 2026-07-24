import React from 'react';

export const getCustomBadgeStyles = (
  customColor: string,
  customTextColor: string,
  fontSize: string,
  minWidth: string,
  height: string,
  customStyles?: React.CSSProperties
) => {
  return {
    '& .MuiBadge-badge': {
      backgroundColor: customColor,
      color: customTextColor,
      fontSize: fontSize,
      minWidth: minWidth,
      height: height,
      borderRadius: '0.5rem',
      fontWeight: 500,
      lineHeight: 1,
      border: `1px solid ${customColor}`,
      boxShadow: 'none',
      fontFamily: 'inherit',
      top: '-0.3rem',
      right: '-0.8rem',
      letterSpacing: '0.04rem',
      ...customStyles,
    },
  };
};
