import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const SettingsDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },

  '& .MuiDialog-scrollPaper .MuiPaper-root': {
    maxHeight: '95%',
    width: '50rem',
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

export const inputLabelStyles = {
  fontSize: '1rem',
  fontWeight: 600,
  color: '#000000',
  marginBottom: '0rem',
  fontFamily: 'Inter, sans-serif !important',
  '&.Mui-error': {
    color: '#F00',
  },
  display: 'flex',
};

export const textFieldStyles = {
  width: '100%',

  '& .MuiFormHelperText-root': {
    margin: 'auto',
    padding: '0.2rem 0 0 0.1rem',
    textWrap: 'wrap',
  },

  'input[type=number]': {
    marginLeft: '5px',
  },

  'input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
  },

  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    fontWeight: 400,
    lineHeight: '17.26px',
    letterSpacing: '-2%',
    marginTop: '0.3rem',
    padding: '0.7rem',
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
    '&.Mui-disabled': {
      cursor: 'not-allowed',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: 'red !important',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
    },

    '&.Mui-error fieldset': {
      borderColor: 'red !important',
    },

    '&.Mui-disabled': {
      background: '#e5e5e5',
      borderColor: '#dadeeb',
      cursor: 'not-allowed',
      '&:hover fieldset': {
        borderColor: '#dadeeb !important',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#dadeeb !important',
      },
    },
  },
};

export const staticValueStyles = {
  fontSize: '1.2rem',
  fontFamily: 'Inter, sans-serif !important',
  fontWeight: 400,
  lineHeight: '17.26px',
  letterSpacing: '-2%',
  marginTop: '0.3rem',
};

export const radioButtonStyle = {
  '& .MuiSvgIcon-root': {
    fontSize: 20,
    color: '#77469b',

    '& .Mui-error': {
      color: '#d32f2f',
    },
  },
};
