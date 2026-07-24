import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const buttonSaveStyles = {
  height: '3rem',
  width: 'auto',
  minWidth: '6rem',
  borderRadius: 0,
  background: '#77469B',
  color: '#fff',
  textTransform: 'none',
  boxShadow: 'none',
  fontSize: '1.2rem',
  fontWeight: 600,
  lineHeight: 1,

  '&:hover': {
    background: '#77469B',
    boxShadow: 'none',
  },

  '&.Mui-disabled': {
    pointerEvents: 'all',
    cursor: 'not-allowed',
    background: '#F1DEFF',
    '.MuiLoadingButton-loadingIndicator': {
      color: '#77469B',
    },
  },
};

export const buttonCloseStyles = {
  height: '3rem',
  width: '6rem',
  borderRadius: 0,
  background: '#F1DEFF',
  color: '#77469B',
  textTransform: 'none',
  boxShadow: 'none',
  fontSize: '1.2rem',
  fontWeight: 600,

  '&:hover': {
    background: '#F1DEFF',
    boxShadow: 'none',
  },
};

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },

  '& .MuiDialog-scrollPaper .MuiPaper-root': {
    height: '100%',
    width: '50rem',
    margin: 0,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
}));
