export const clearButtonStyles = {
  borderRadius: 5,
  background: 'transparent',
  color: '#77469b',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '0.5rem 0.8rem',
  fontSize: '1rem',
  fontWeight: '500',
  border: '1px solid #77469b',
  width: 'auto',
  maxHeight: '2.5rem',
  height: 'auto',

  '& .MuiButton-startIcon': {
    marginRight: '2px',
  },

  '&:hover': {
    background: '#77469b',
    color: '#ffffff',
    boxShadow: 'none',

    '& .MuiButton-startIcon': {
      '& svg': {
        fill: '#ffffff',
      },
    },
  },
};
