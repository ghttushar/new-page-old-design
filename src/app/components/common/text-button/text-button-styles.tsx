export const textButtonOldStyles = {
  textTransform: 'none',
  color: '#77469b',
  fontSize: '1.2rem',
  fontWeight: 600,
  padding: 0,
  minWidth: 'auto',
  transition: 'all 0.3s ease-in-out',

  '& .MuiButton-startIcon': {
    marginLeft: 0,
    marginRight: '0.2rem',

    svg: {
      fill: '#77469b',
    },
  },

  '& .MuiButton-endIcon': {
    marginLeft: '0.2rem',
    marginRight: 0,

    svg: {
      fill: '#77469b',
    },
  },

  '&.Mui-disabled': {
    color: '#dbdbdb',

    '& .MuiButton-startIcon svg': {
      fill: 'currentColor',
    },

    '& .MuiButton-endIcon svg': {
      fill: 'currentColor',
    },
  },

  '&:hover': {
    backgroundColor: 'transparent',
  },
} as React.CSSProperties;

export const newTextButtonHoverSelectedStyles = {
  backgroundColor: 'transparent',
  color: '#77469B',
  fontSize: '1.2rem',
  fontWeight: 500,

  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    svg: {
      fill: '#77469B',
    },
  },
};

export const newTextButtonStyles = (isDisabled = false, isSelected = false) => {
  return {
    textTransform: 'none',
    color: isDisabled ? '#bdbdbd' : '#464646',
    fontSize: '1.1rem',
    fontWeight: 500,
    padding: 0,
    height: '100%',
    minWidth: 'auto',
    backgroundColor: 'transparent',
    transition: 'all 0.1s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& .MuiButton-startIcon': {
      marginLeft: 0,
      marginRight: '0.2rem',
      svg: {
        fill: isDisabled ? '#bdbdbd' : '#464646',
        width: '1.5rem',
        height: '1.5rem',
      },
    },

    '& .MuiButton-endIcon': {
      marginLeft: '0.2rem',
      marginRight: 0,
      svg: {
        fill: isDisabled ? '#bdbdbd' : '#464646',
        width: '1.5rem',
        height: '1.5rem',
      },
    },

    ...(isSelected === true && newTextButtonHoverSelectedStyles),

    '&:hover': {
      ...(isDisabled === false && newTextButtonHoverSelectedStyles),
    },
  };
};
