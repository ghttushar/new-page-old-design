export const bidFieldStyles = {
  width: '11rem',

  '& .MuiFormHelperText-root': {
    marginRight: '0',
    marginLeft: '0rem',
    marginTop: '0',
    textWrap: 'wrap',
  },
  '& .MuiOutlinedInput-input': {
    padding: '0 1rem',
    height: '3.5rem',
  },

  '& .MuiOutlinedInput-root': {
    fontSize: '1.2rem',
    fontWeight: 500,
    borderRadius: 0,
    paddingLeft: '0.5em',
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

export const bidCellStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const bidTextStyle = {
  color: '#77469B',
  textDecoration: 'underline',
};
