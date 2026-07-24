export const errorButtonStyles = {
  borderRadius: '0.5rem',
  background: '#fff',
  border: `1px solid #dadeeb`,
  color: '#464646',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '0.3rem',
  minWidth: 0,
  maxWidth: '6rem',
  height: 'auto',
  width: 'auto',
  fontSize: '0.8rem',
  fontWeight: 400,

  '&:hover': {
    boxShadow: 'none',
    border: '1px solid #464646',
    background: '#fff',
  },
};

export const errPopupTitleStyles = {
  m: 0,
  px: 2,
  py: 1,
  fontSize: '1.4rem',
  fontWeight: 600,
  background: '#77469B',
  color: '#ffffff',
};

export const closeIconButtonStyles = {
  p: '2px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'rotate(90deg)',
  },
};

export const dialogContentStyles = {
  p: 2,
  '&.MuiDialogContent-root': {
    pt: 2,
  },
};
