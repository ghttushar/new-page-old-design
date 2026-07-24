export const secondaryButtonStyles = (hoverColor?: string) => {
  return {
    background: '#fff',
    color: '#464646',
    textTransform: 'none',
    boxShadow: 'none',
    padding: '0.5rem 0.8rem',
    border: '1px solid #dadeeb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minWidth: 0,

    '&:focus': {
      borderColor: '#8b8b8b',
    },

    '&:hover': {
      borderColor: hoverColor ?? '#8b8b8b',
      background: '#fff',
      color: hoverColor ?? 'initial',
      boxShadow: 'none',

      svg: {
        fill: hoverColor ?? 'initial',
      },
    },

    '.MuiButton-startIcon': {
      marginRight: '0.5rem',
    },
  };
};
