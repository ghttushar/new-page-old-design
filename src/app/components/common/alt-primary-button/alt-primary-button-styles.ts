export const altPrimaryButtonStyles = (bgColor: string, textColor: string) => {
  return {
    borderRadius: '0.8rem',
    background: bgColor,
    color: textColor,
    textTransform: 'none',
    boxShadow: 'none',
    padding: '0.5rem 0.8rem',
    border: '1px solid #dadeeb',
    minWidth: 0,

    '&:hover': {
      background: bgColor,
      color: textColor,
    },

    '&.Mui-disabled': {
      border: 'inherit',
      cursor: 'not-allowed',
      background: 'rgba(0, 0, 0, 0.12)',
    },

    '.MuiButton-startIcon': {
      marginRight: '0.7rem',
    },
  };
};

export const altPrimaryButtonNewStyles = {
  borderRadius: '0.8rem',
  background: '#fff',
  color: '#464646',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '0.5rem 0.8rem',
  border: '0.5px solid #d1d1d1',
  minWidth: 0,

  '&:hover': {
    background: '#fff',
    color: '#464646',
    boxShadow: 'none',
    borderColor: '#000',
  },

  '.MuiButton-startIcon': {
    marginRight: '5px',
  },

  '&.Mui-disabled': {
    border: '0.5px solid #acacac',
    cursor: 'not-allowed',
    background: '#F0F0F01A',
    color: '#acacac',
    svg: {
      fill: '#acacac',
    },

    '.MuiButton-startIcon': {
      svg: {
        fill: '#acacac',
      },
    },
  },
};

export const noBorderIconButtonStyles = {
  background: 'transparent',
  textTransform: 'none',
  boxShadow: 'none',
  padding: 0,
  border: 'none',
  minWidth: 0,

  svg: {
    fill: '#464646',
  },

  '&:hover': {
    background: 'transparent',
    color: '#464646',
    boxShadow: 'none',
    borderColor: 'transparent',
    svg: {
      fill: '#77469B',
    },
  },

  '&.Mui-disabled': {
    cursor: 'not-allowed',
    svg: {
      fill: '#acacac',
    },
  },
};
