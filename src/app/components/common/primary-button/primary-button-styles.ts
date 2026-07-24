export const PRIMARY_BUTTON_BACKGROUND_NEW =
  'linear-gradient(99.66deg, #894DB5 4.22%, #6205A7 89%)';

export const primaryButtonStyles = (textColor: string, bgColor = '#77469B') => {
  return {
    borderRadius: '0.8rem',
    background: bgColor,
    border: `1px solid ${bgColor}`,
    color: textColor,
    textTransform: 'none',
    boxShadow: 'none',
    padding: '0.5rem 0.8rem',
    minWidth: 0,

    '&:hover': {
      background: bgColor,
      border: `1px solid ${bgColor}`,
      color: textColor,
    },
    '&.Mui-disabled': {
      border: '1px solid rgba(0, 0, 0, 0.02)',
      cursor: 'not-allowed !important',
      background: 'rgba(0, 0, 0, 0.12)',
    },

    '.MuiButton-startIcon': {
      marginRight: '0.3rem',
    },

    '.MuiButton-endIcon': {
      marginLeft: '0.3rem',
    },
  };
};

export const primaryButtonNewDesignStyles = (
  textColor: string,
  bgColor?: string
) => {
  return {
    borderRadius: '0.8rem',
    background: bgColor ?? PRIMARY_BUTTON_BACKGROUND_NEW,
    border: 'none',
    color: textColor,
    textTransform: 'none',
    boxShadow: 'none',
    padding: '0.5rem 0.8rem',
    minWidth: 0,

    '&:hover': {
      background: bgColor ?? PRIMARY_BUTTON_BACKGROUND_NEW,
      border: 'none',
      color: textColor,
    },

    '&.Mui-disabled': {
      border: '1px solid rgba(0, 0, 0, 0.02)',
      cursor: 'not-allowed !important',
      background: 'rgba(0, 0, 0, 0.12)',
    },

    '.MuiButton-startIcon': {
      marginRight: '0.3rem',
    },

    '.MuiButton-endIcon': {
      marginLeft: '0.3rem',
    },
  };
};
