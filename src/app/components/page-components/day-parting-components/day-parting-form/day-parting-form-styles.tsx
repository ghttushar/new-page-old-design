export const textFieldStyles = {
  '& > :not(style)': {
    width: '100%',
    height: '3.1rem',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0',
    marginBottom: '1.4rem',
    padding: 0,
  },
  '&.MuiFormControl-root': {
    width: '90%',
  },
  '& .MuiOutlinedInput-input': {
    padding: '1rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
    borderRadius: '0.4rem',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #464646 !important',
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
      borderColor: '#464646  !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-active fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#F00 !important',
    },
  },
  '& .MuiFormHelperText-root': {
    margin: 0,
    marginTop: 1,
    fontWeight: 400,
    fontSize: '1.1rem',
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
    fontSize: '1.6rem',
    color: '#77469b',

    '& .Mui-error': {
      color: '#F00',
    },
  },
};

export const checkboxStyles = {
  borderRadius: '0.4rem',
  '&.Mui-checked': {
    color: '#77469b',
  },
  '&.Mui-disabled': {
    color: '#bbb',
  },
};

export const timeRangeButtonStyles = {
  '.MuiButton-startIcon': {
    marginRight: '2px',
  },

  '&:hover': {
    '.MuiButton-startIcon': {
      '& svg': {
        fill: '#ffffff',
      },
    },
  },
};

export const timeLabelStyles = {
  fontSize: '1rem',
  fontWeight: '400',
  letterSpacing: '-0.02rem',
  lineHeight: '144%',
};
