export const textFieldStyles = {
  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0rem',
    marginBottom: '1rem',
    padding: 0,
  },
  '& .MuiOutlinedInput-input': {
    padding: '1rem',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#F00',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
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
    background: 'rgba(0, 0, 0, 0.12)',
    color: '#77469B',
  },
};
