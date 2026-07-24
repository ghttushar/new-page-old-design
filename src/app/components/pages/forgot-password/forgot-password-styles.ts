export const selectStyles = {
  '& > :not(style)': {
    width: '35rem',
    height: '4rem',
    borderRadius: '0.4rem',
    fontSize: '1.4rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0rem',
    marginBottom: '2rem',
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#F00 !important',
    },
    '&.Mui-error.Mui-focused fieldset': {
      borderColor: '#F00 !important',
    },
    '&.Mui-error:hover fieldset': {
      borderColor: '#F00 !important',
    },
  },
};

export const ButtonStyles = {
  width: '35rem',
  height: '3.5rem',
  borderRadius: '0rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  fontFamily: 'Inter, sans-serif !important',
  backgroundColor: '#77469b',
  boxShadow: 'none',
  marginBottom: '2rem',
  textTransform: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#77469b',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    background: '#F1DEFF',
    '.MuiLoadingButton-loadingIndicator': {
      color: '#77469B',
    },
  },
};

export const box = {
  '& > :not(style)': {
    m: 1,
    display: 'flex',
    borderRadius: '0rem',
    fontFamily: 'Inter, sans-serif !important',
  },
};

export const inputLabelStyles = {
  fontSize: '1.2rem',
  marginBottom: '0rem',
  fontFamily: 'Inter, sans-serif !important',
  '&.Mui-error': {
    color: '#F00',
  },
};
