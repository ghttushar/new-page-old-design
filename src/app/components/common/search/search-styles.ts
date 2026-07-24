export const searchStyles = (
  width = '20rem',
  height = '2.8rem',
  borderRadius: string
) => {
  return {
    '& > :not(style)': {
      borderRadius,
      fontSize: '1.2rem',
      fontFamily: 'Inter, sans-serif !important',
      marginTop: '0rem',
      backgroundColor: '#ffffff',
      paddingRight: '0rem',
      width: width,
      height: height,
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
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#77469b !important',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#77469b !important',
      },
    },
  };
};

export const searchButtonStyles = (height = '2.8rem', borderRadius: string) => {
  return {
    height,
    padding: 1,
    borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
    zIndex: 1,
    margin: 0,
  };
};
