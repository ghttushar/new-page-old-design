export const textFieldStyles = {
  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0rem',
    marginBottom: '0.5rem',
    padding: 0,
  },
  '&.MuiFormControl-root': {
    width: '100%',
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
  '& .MuiFormHelperText-root': {
    margin: 0,
    fontWeight: 500,
  },
  '& .MuiTypography-root': {
    fontSize: '1.3rem',
    fontWeight: '500',
  },
};

export const labelStyles = {
  color: '#000000',
  fontSize: '1.4rem',
  fontWeight: '600',
  lineHeight: 'normal',
  letterSpacing: '-0.42px',
};

export const radioButtonStyles = {
  '& .MuiSvgIcon-root': {
    fontSize: 25,
    color: '#77469b',

    '& .Mui-error': {
      color: '#d32f2f',
    },
  },
};
