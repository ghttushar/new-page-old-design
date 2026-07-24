import { Breakpoint } from '@mui/system';

export const confirmationBoxStyles = {
  WebkitUserSelect: 'none',
  userSelect: 'none',

  '& .MuiDialog-paper': {
    borderRadius: '0.5rem',
    margin: 0,
    padding: '2rem',
    paddingBottom: '1rem',
    border: 'none',
  },

  '& .MuiDialogTitle-root': {
    padding: 0,
    fontWeight: 700,
    fontSize: '2rem',
    letterSpacing: '-0.36px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '1rem',
  },

  '& .MuiDialogContent-root': {
    padding: 0,
    marginTop: '1rem',

    '& .MuiDialogContentText-root': {
      fontSize: '1.3rem',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '-0.2px',
      color: '#000000',
    },
  },

  '& .MuiDialogActions-root': {
    marginTop: '2rem',
  },
};

export const actionBoxStyles = {
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
  justifyContent: 'center',
};

export const newConfirmationBoxStyles = (maxWidth: Breakpoint) => {
  return {
    WebkitUserSelect: 'none',
    userSelect: 'none',

    '& .MuiDialog-paper': {
      borderRadius: '0.8rem',
      margin: 0,
      padding: '2rem',
      border: 'none',
      maxHeight: '60vh',
      overflow: 'hidden',
    },

    '& .MuiDialogTitle-root': {
      padding: 0,
      fontWeight: 600,
      fontSize: '1.6rem',
      color: '#464646',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '1rem',
      flexShrink: 0,
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
      overflowY: 'auto',
      overflowX: 'hidden',
    },

    '& .MuiDialogContent-root': {
      padding: 0,
      marginTop: '1rem',
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden',

      '& .MuiDialogContentText-root': {
        fontSize: '1.2rem',
        fontWeight: 400,
        lineHeight: '2rem',
        color: '#464646',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      },
    },

    '& .MuiDialogActions-root': {
      padding: 0,
      marginTop: '3rem',
      width: '100%',

      flexShrink: 0,

      ...(maxWidth === 'xs' && {
        justifyContent: 'center',
        alignItems: 'center',
      }),
    },
  };
};
