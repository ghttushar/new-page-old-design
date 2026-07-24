export const keywordActionFilterButtonStyles = {
  backgroundColor: '#77469B',
  borderRadius: '0.4rem',
  color: '#ffffff',
  height: '3.5rem',
  width: '18rem',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#8B51B5',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
    pointerEvents: 'initial !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
  fontSize: '1.2rem',
};

export const keywordActionArchiveBtnStyles = {
  ...keywordActionFilterButtonStyles,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  border: '1px solid #77469b',
  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: '0.1rem solid #77469b',
  },
  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
    pointerEvents: 'initial !important',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
  color: '#77469B',
};
