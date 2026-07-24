export const connectButtonStyles = {
  borderRadius: '0.6rem',
  color: '#FFFFFF',
  boxShadow: 'none',
  fontSize: '1.4rem',
  fontWeight: 600,
  width: '16rem',
  height: '4.5rem',
  marginTop: '1rem',
  backgroundColor: '#77469b',
  textTransform: 'none',

  '&:hover': {
    background: '#77469b',
    color: '#fff',
    boxShadow: 'none',
  },

  '&.Mui-disabled': {
    border: 'inherit',
    cursor: 'not-allowed !important',
    color: '#fff',
    boxShadow: 'none',
  },

  '& .MuiLoadingButton-loading': {
    color: '#fff',
  },
};

export const connectedButtonStyles = {
  background: '#77469b',
  color: '#fff',
  boxShadow: 'none',
};
