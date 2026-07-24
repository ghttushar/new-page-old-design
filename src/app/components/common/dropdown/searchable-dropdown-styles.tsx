import { hexToRGBA } from '@/utils';

export const inputLabelStyles = {
  fontSize: '1.2rem',
  color: '#000000',
  display: 'flex',
};

export const selectStyles = {
  '.MuiOutlinedInput-root': {
    paddingRight: '5rem !important',
  },

  '& input': {
    padding: '0rem',
    margin: '0rem',
  },

  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: '0rem 0.3rem 0rem 1.5rem',
    width: '100%',
  },

  '& .MuiAutocomplete-input': {
    padding: '0rem',
    borderRadius: '0rem',
    color: '#000000',
    fontWeight: 600,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  '& .MuiAutocomplete-endAdornment': {
    margin: '0.4rem 0rem',
  },

  '.MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #464646 !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
};

export const chipStyles = {
  '& input': {
    padding: '0rem',
    margin: '0rem',
  },

  '& .MuiAutocomplete-inputRoot': {
    padding: '0rem',
    margin: '0rem',
    boxShadow: 'none',
    borderRadius: '0rem',
    flex: '1 1 auto',
    color: '#000000',
    minHeight: '3rem',
    width: '24rem',
    fontSize: '1.2rem',
  },

  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: '0rem 0.5rem 0rem 1.5rem',
  },

  '& .MuiAutocomplete-input': {
    padding: '0rem',
    boxShadow: 'none',
    borderRadius: '0rem',
    color: '#000000',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  '& .MuiAutocomplete-endAdornment': {
    margin: '0.4rem 0rem',
  },

  '.MuiOutlinedInput-notchedOutline': {
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

  '&.MuiSvgIcon-fontSizeMedium .MuiChip-deleteIcon .MuiChip-deleteIconMedium': {
    fontSize: '0.6rem',
    color: 'red',
  },

  '& .MuiAutocomplete-popper': {
    margin: '10rem',
  },
};

export const customPaperStyle = {
  padding: '0.1rem',
  borderRadius: '0.4rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 0 0.4rem 0 rgba(0,0,0,0.2)',
  marginTop: '0.7rem',
  maxHeight: 'auto',
  fontSize: '1.2rem',
};

export const customOptionStyle = {
  boxShadow: 'none',
  borderRadius: '0rem',
  fontSize: '1.2rem',
  '& .MuiAutocomplete-popper': {
    boxShadow: 'none',
    borderRadius: '0rem',
  },
};

export const chipPropStyles = {
  '& .MuiChip-deleteIcon': {
    color: '#f1deff',
  },
  '&:hover .MuiChip-deleteIcon': {
    color: '#77469b',
  },
  '& .MuiAutocomplete-tag': {
    margin: '0.2rem',
  },
  '& .MuiButtonBase-root MuiChip-root .MuiChip-outlined': {
    borderColor: '#77469b !important',
    border: '1px solid #77469b !important',
  },
};

export const autocompleteStyles = {
  '& input': {
    padding: '0rem',
    margin: '0rem',
  },

  '& .MuiAutocomplete-inputRoot': {
    padding: '0rem',
    margin: '0rem',
    boxShadow: 'none',
    borderRadius: '0rem',
    flex: '1 1 auto',
    color: '#000000',
    fontSize: '1.2rem',
  },

  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: '0rem 0.5rem 0rem 1.5rem',
    width: 'auto',
  },

  '& .MuiAutocomplete-input': {
    padding: '0rem',
    boxShadow: 'none',
    borderRadius: '0rem',
    color: '#000000',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  '& .MuiAutocomplete-endAdornment': {
    margin: '0.4rem 0rem',
  },

  '.MuiOutlinedInput-notchedOutline': {
    border: '1px solid #dadeeb !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #8b8b8b !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469b !important',
  },
};

export const autoCompleteMenuStyles = {
  '& .MuiAutocomplete-listbox': {
    padding: 0,
    margin: 0,

    '& .MuiAutocomplete-option': {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      padding: '0.8rem 1.2rem',
      fontSize: '1.2rem',
      cursor: 'pointer',

      '&.Mui-disabled': {
        cursor: 'not-allowed !important',
      },

      '&:hover': {
        color: '#77469B',
      },

      '&.Mui-selected': {
        backgroundColor: hexToRGBA('#77469B', 0.2),
        color: '#77469B',

        '&.Mui-focused': {
          backgroundColor: hexToRGBA('#77469B', 0.4),
          color: '#77469B',
        },
        '&.Mui-focusVisible': {
          backgroundColor: hexToRGBA('#77469B', 0.4),
          color: '#77469B',
        },
      },
    },
  },
};
