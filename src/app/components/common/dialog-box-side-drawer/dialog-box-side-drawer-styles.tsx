import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

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
