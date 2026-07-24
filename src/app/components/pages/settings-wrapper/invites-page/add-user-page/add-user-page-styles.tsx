import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const buttonInviteStyles = {
  height: '3rem',
  width: '6rem',
  borderRadius: 0,
  background: '#77469B',
  color: '#fff',
  textTransform: 'none',
  boxShadow: 'none',
  fontSize: '1.2rem',
  fontWeight: 600,

  '&:hover': {
    background: '#77469B',
    boxShadow: 'none',
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
    padding: theme.spacing(3),
  },

  '& .MuiDialog-scrollPaper .MuiPaper-root': {
    height: '100%',
    width: '47.8rem',
    margin: 0,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
}));

export const labelStyles = {
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
  fontFamily: 'Inter, sans-serif !important',
  color: '#000000',
  display: 'flex',
  '&.Mui-error': {
    color: '#F00',
  },
};

export const selectStyles = {
  '& > :not(style)': {
    height: '4rem',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0rem',
    marginBottom: '2rem',
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
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: '#F00',
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
