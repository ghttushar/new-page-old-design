export const applyButtonStyles = {
  borderRadius: 0,
  background: '#F4D5FF',
  color: '#77469b',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '0.5rem 0.8rem',
  fontSize: '1.2rem',
  fontWeight: '500',
  border: '1px solid #F4D5FF',
  width: '6rem',
  height: '2.5rem',
  marginTop: '1.5rem',

  '&:hover': {
    background: '#F4D5FF',
    color: '#77469b',
    boxShadow: 'none',
  },

  '&.Mui-disabled': {
    border: '1px solid #F4D5FF',
    cursor: 'not-allowed !important',
    background: 'rgba(0, 0, 0, 0.12)',
  },
};
