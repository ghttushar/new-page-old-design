import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { fancyScrollbar } from 'src/assets/styles/scrollbar.styles';

export const CreateDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-scrollPaper': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '& .MuiPaper-root': {
    height: '100%',
    width: '100%',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0.8rem',
    overflow: 'hidden',
  },

  '& .MuiDialogContent-root': {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
}));

export const addDataTextFieldStyles = {
  '& .MuiInputBase-inputMultiline': {
    ...fancyScrollbar,
    fontSize: '1.2rem',
  },

  '& .MuiOutlinedInput-input': {
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
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
    borderColor: '#d32f2f',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#d32f2f !important',
    },
  },

  '& .Mui-disabled': {
    cursor: 'not-allowed !important',
  },
  overflow: 'auto',
  resize: 'none',
  borderRadius: '4px',
};

export const adTextButtonStyles = {
  color: 'red',
  textDecoration: 'underline',
  fontSize: '1rem',
};
export const addDataBoxStyles = {
  height: '20vh',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
  border: '1px solid #dadeeb',
  borderRadius: '4px',
  ...fancyScrollbar,
};
export const textFieldStyles = {
  width: '100%',

  '& > :not(style)': {
    width: '100%',
    height: '5rem',
    borderRadius: '0rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    fontWeight: 400,
    lineHeight: '17.26px',
    letterSpacing: '-2%',
    marginBottom: '2rem',
    padding: '0.7rem',
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'none',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'none',
    },
  },
};

export const matchTypeLabelStyles = {
  '&.MuiFormLabel-root': {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#464646',
    marginBottom: '0rem',
    fontFamily: 'Inter, sans-serif !important',
    width: 'fit-content',

    '&.Mui-focused': {
      color: 'inherit',
    },
  },
};

export const checkboxStyles = {
  '&.Mui-checked': {
    color: '#77469b',
  },
};

export const tableHeaderCellStyles = {
  padding: '1rem',
  fontSize: '1.1rem',
  fontWeight: 400,
  color: 'rgba(0, 0, 0, 0.7)',
};

export const tableRowCellStyles = {
  padding: '1rem',
  fontSize: '1.2rem',
  fontWeight: 600,
};

export const customBidStyles = {
  width: '9rem',
  position: 'relative',

  'input[type=number]': {
    marginLeft: '5px',
  },

  'input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
  },

  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    fontSize: '1.2rem',
    lineHeight: '17.26px',
    padding: '0.7rem',
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
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
    borderColor: '#d32f2f',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#77469b !important',
    },
    '&.Mui-error fieldset': {
      borderColor: '#d32f2f !important',
    },
  },
};

export const inputLabelStyles = {
  fontSize: '1rem',
  fontWeight: 400,
  color: 'rgba(0, 0, 0, 0.8)',
  marginBottom: '0rem',
  fontFamily: 'Inter, sans-serif !important',
  '&.Mui-error': {
    color: '#d32f2f',
  },
  display: 'flex',
};

export const searchFieldStyles = {
  width: '100%',

  '& > :not(style)': {
    width: '100%',
    height: 'auto',
    borderRadius: '0.4rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0rem',
    marginBottom: '1rem',
    padding: 0,
  },
  '& .MuiOutlinedInput-input': {
    padding: '1rem',
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

export const productContainerStyles = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontWeight: 'bold',
  paddingRight: '1rem',
};
