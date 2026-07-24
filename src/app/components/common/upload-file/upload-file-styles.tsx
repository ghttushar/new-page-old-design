export const linkStyle = {
  '&.MuiLink-root': {
    color: 'inherit',
    fontWeight: '500',
    textDecoration: 'underline',
    '&:hover': {
      color: '#77469b',
    },
  },
};

export const uploadFileStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  '&.MuiDialogActions-root': {
    marginTop: 0,
    padding: '1rem 0',
  },
};

export const uploadBoxStyles = (isLoading: boolean) => {
  return {
    '& .MuiDialog-paper': {
      margin: 0,
      padding: isLoading === false ? '1.5rem 1.8rem' : '',
      paddingBottom: '0rem',
      borderRadius: '0.7rem',
      width: '60rem',
      height: 'auto',
    },

    '& .MuiDialogContent-root': {
      padding: 0,
      marginTop: '1rem',
    },
  };
};
