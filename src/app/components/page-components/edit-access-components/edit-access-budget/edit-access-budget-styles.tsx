export const budgetFieldStyles = {
  width: '11rem',

  '& .MuiFormHelperText-root': {
    marginRight: '0',
    marginLeft: '0rem',
    marginTop: '0',
    textWrap: 'balance',
  },
  'input[type=number]': {
    marginLeft: '5px',
  },

  'input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
  },
  '& .MuiOutlinedInput-input': {
    padding: '0.1rem 1rem',
    height: '3.5rem',
  },

  '& .MuiOutlinedInput-root': {
    fontSize: '1.2rem',
    fontWeight: 500,
    borderRadius: 0,
    paddingLeft: '0.5em',
    margin: '3rem',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469B',
    outline: 'none !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #77469B !important',
    outline: 'none !important',
  },
  '& .Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #77469B !important',
    outline: 'none !important',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #77469B !important',
    outline: 'none !important',
  },
};
