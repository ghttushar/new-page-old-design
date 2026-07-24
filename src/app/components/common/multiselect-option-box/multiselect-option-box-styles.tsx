export const checkboxStyles = {
  marginLeft: '1rem',
  color: '#77469b',
  '&.Mui-checked': {
    color: '#77469b',
  },
};

export const formControlLabelStyles = (isFilter: boolean) => {
  return {
    '&.MuiFormControlLabel-root .MuiFormControlLabel-label': {
      fontSize: '1.1rem',
      fontWeight: isFilter ? '400' : '600',
      borderRadius: '0.4rem',
      whiteSpace: 'pre-wrap',
    },
  };
};

export const textFieldStyles = {
  width: '100%',

  'input[type=number]': {
    marginLeft: '5px',
  },

  'input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
  },

  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '0.4rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    fontWeight: 400,
    lineHeight: '17.26px',
    letterSpacing: '-2%',
    marginTop: '0.3rem',
    padding: '0.7rem',
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #8b8b8b !important',
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
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
    },
  },
};
