import { SxProps, Theme } from '@mui/system';
import { applyButtonStyles } from '../../common/action-confirmation-dialog/action-confirmation-dialog-styles';

export const URLInputStyles: SxProps<Theme> = {
  width: '100%',
  height: '4rem',
  backgroundColor: '#fff',
  fontSize: '1.3rem',

  '.MuiInputBase-root': {
    borderRadius: 0,
    height: '4rem',

    '.MuiInputBase-input': {
      padding: '0.6rem',
      fontSize: '1.3rem',
      height: '4rem',
    },
  },

  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      border: '1px solid #77469b !important',
    },
    '&.Mui-focused fieldset': {
      border: '1.5px solid #77469b !important',
    },
  },
};

export const urlErrInputStyles = {
  '& .MuiOutlinedInput-root': {
    border: '1px solid #ff0000 !important',
    '&:hover fieldset': {
      border: '1px solid #ff0000 !important',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #ff0000 !important',
    },
  },
};

export const analyseBtnStyles = {
  ...applyButtonStyles,
  background: '#FFF',
  width: '12rem',
  height: '4rem',
  fontSize: '1.3rem',
  fontWeight: '600',
  marginTop: '0rem',
  border: '1px solid #77469b',
  padding: '0.5rem 1rem',
  '&:hover': {
    background: '#FFF',
    color: '#77469b',
    boxShadow: 'none',
  },
};
