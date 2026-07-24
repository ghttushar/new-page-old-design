export const inputLabelStyles = {
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#000000',
  marginBottom: '0rem',
  fontFamily: 'Inter, sans-serif !important',
  '&.Mui-error': {
    color: '#F00',
  },
  display: 'flex',
  lineHeight: '17.26px',
};

export const textFieldStyles = {
  width: '100%',

  '&.brand-name': {
    width: '15rem',
  },

  '&.brand-headline': {
    width: '25rem',
  },

  '&.brand-url': {
    width: '35rem',
  },

  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    fontWeight: 400,
    lineHeight: '17.26px',
    marginTop: '0.3rem',
    padding: '0.7rem',
  },

  '.Mui-disabled': {
    cursor: 'not-allowed',
  },

  '& .MuiOutlinedInput-input': {
    padding: 0,
    textOverflow: 'ellipsis',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dedede !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #dedede !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #dedede !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #dedede !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#F00',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#dedede !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dedede !important',
    },
    '&.Mui-disabled': {
      background: 'rgba(0, 0, 0, 0.05)',
      cursor: 'not-allowed',

      '&:hover fieldset': {
        borderWidth: '1px !important',
      },
      '&.Mui-focused fieldset': {
        borderWidth: '1px !important',
      },
    },
  },
};
