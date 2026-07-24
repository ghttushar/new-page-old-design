export const hoverStylesWithShadow = (blurSpread = '2px') => {
  return {
    '&:hover': {
      border: '0.5px solid transparent',
      background:
        'linear-gradient(#fff, #fff) padding-box, ' +
        'linear-gradient(90.2deg, rgba(122, 75, 235, 0.6) 0.09%, rgba(42, 109, 244, 0.6) 99.55%) border-box',
      boxShadow: `0 0 12px ${blurSpread} rgba(42, 109, 244, 0.25)`,
    },
  };
};

export const focusedActiveStylesWithShadow = (blurSpread = '3px') => {
  return {
    border: '0.5px solid transparent',
    background:
      'linear-gradient(#fff, #fff) padding-box, ' +
      'linear-gradient(90.2deg, rgba(122, 75, 235, 1) 0.09%, rgba(42, 109, 244, 1) 99.55%) border-box',
    boxShadow: `0 0 16px ${blurSpread} rgba(42, 109, 244, 0.25)`,
  };
};

export const focusedActiveMuiStylesWithShadow = (blurSpread = '3px') => {
  return {
    '&.Mui-focused, &.Mui-active': focusedActiveStylesWithShadow(blurSpread),
    '&:focus-within': focusedActiveStylesWithShadow(blurSpread),
  };
};

export const newHoverFocusActiveMuiStylesWithShadow = (
  hoverBlurSpread = '2px',
  activeBlurSpread = '3px'
) => {
  return {
    ...hoverStylesWithShadow(hoverBlurSpread),
    ...focusedActiveMuiStylesWithShadow(activeBlurSpread),
    '&:hover': {
      '&.Mui-disabled': {
        border: '0.5px solid #acacac',
        boxShadow: 'none',
      },
    },
  };
};

export const containerCollapseAnimationStyles = (
  height: number | 'auto',
  containerOpen: boolean
) => {
  return {
    height: typeof height === 'number' ? `${height}px` : height,
    overflow: 'hidden',
    opacity: containerOpen ? 1 : 0,
    transform: containerOpen ? 'translateY(0)' : 'translateY(-6px)',
    transition: 'all 0.2s ease',
    pointerEvents: containerOpen ? 'all' : 'none',
  };
};

export const outlinedTextBoxNewStylesWithShadow = {
  borderRadius: '0.8rem',
  border: '0.5px solid #acacac',
  padding: '0.5rem',
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 400,
  fontSize: '1.2rem',

  '.MuiOutlinedInput-input': {
    padding: '0.5rem',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },

  '&.Mui-error': {
    border: '0.5px solid #ff0000',
  },

  ...hoverStylesWithShadow(),
  ...focusedActiveMuiStylesWithShadow(),
};

export const hoverStyles = () => {
  return {
    '&:hover': {
      border: '0.5px solid #000000',
      background: '#ffffff',

      '&.Mui-error': {
        border: '0.5px solid #ff0000',
      },
    },
  };
};

export const focusedActiveStyles = () => {
  return {
    border: '0.5px solid #000000',
    background: '#ffffff',

    '&.Mui-error': {
      border: '0.5px solid #ff0000',
    },
  };
};

export const focusedActiveMuiStyles = () => {
  return {
    '&.Mui-focused, &.Mui-active': focusedActiveStyles(),
    '&:focus-within': focusedActiveStyles(),
  };
};

export const baseOutlineTextBoxStyles = (
  customPlaceholderFontSize: string
) => ({
  borderRadius: '0.8rem',
  border: '0.5px solid #acacac',
  padding: '0.5rem',
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 400,
  fontSize: '1.2rem',

  '.MuiOutlinedInput-input': {
    height: 'auto',
    padding: '0.5rem',

    '&.Mui-disabled': {
      cursor: 'not-allowed',
    },

    '&::placeholder': {
      fontSize: customPlaceholderFontSize,
      opacity: 0.8,
      color: '#acacac',
    },
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },

  '&.Mui-error': {
    border: '0.5px solid #ff0000',
  },
});

export const outlinedTextBoxNewStyles = (
  customPlaceholderFontSize = 'inherit'
) => ({
  ...baseOutlineTextBoxStyles(customPlaceholderFontSize),
  ...hoverStyles(),
  ...focusedActiveMuiStyles(),
});

export const outlinedTextBoxAltStyles = (
  customPlaceholderFontSize = 'inherit'
) => ({
  ...baseOutlineTextBoxStyles(customPlaceholderFontSize),

  '&:hover': {
    border: '0.5px solid #464646',
    background: '#ffffff',
  },

  '&.Mui-focused, &.Mui-active': {
    border: '0.5px solid #464646',
    background: '#ffffff',

    '&.Mui-error': {
      border: '0.5px solid #ff0000',
    },
  },

  '&:focus-within': {
    border: '0.5px solid #464646',
    background: '#ffffff',
  },
});
