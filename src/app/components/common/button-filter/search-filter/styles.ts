import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';

const searchFieldStyles: SxProps<Theme> = {
  width: '100%',

  '.MuiInputBase-root': {
    borderRadius: 0,

    '.MuiInputBase-input': {
      padding: '0.6rem',
    },
  },

  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      border: '1px solid #dadeeb !important',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #dadeeb !important',
    },
  },
};
const optionWrapperStyles: SxProps<Theme> = {
  '.MuiFormControlLabel-label': {
    fontSize: '1rem',
    fontWeight: 500,
  },

  width: '15rem',
};

const buttonStyles: SxProps<Theme> = {
  width: '1rem',
};

const sxStyles = {
  searchFieldStyles,
  buttonStyles,
  optionWrapperStyles,
};

export default sxStyles;
