export const listItemStyles = {
  fontSize: '1.2rem',
  fontWeight: 600,
  lineHeight: '14.52px',
  height: '4rem',
};

export const searchBarStyles = {
  width: '100%',
  '.MuiOutlinedInput-root': {
    p: 0,
    pl: 1,
    background: '#ffffff',

    fieldset: {
      borderColor: '#dadeeb',
    },

    '&:hover fieldset': {
      borderColor: '#dadeeb !important',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dadeeb !important',
      borderWidth: '1px !important',
      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.15)',
    },
  },
  '.MuiOutlinedInput-input': {
    fontSize: '1.2rem',
    fontWeight: 400,
    lineHeight: '1.4rem',
  },
  '.MuiAutocomplete-endAdornment': {
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

export const optionsPopperStyles = {
  '& .MuiAutocomplete-paper': {
    borderRadius: '0 0 4px 4px',
  },

  '& .MuiAutocomplete-listbox': {
    maxHeight: '20vh',
    overflow: 'auto',
  },
};

export const avatarStyles = {
  backgroundColor: '#77469B',
  width: '3.4rem',
  height: '3.4rem',
  fontSize: '1.2rem',
  fontWeight: 500,
  lineHeight: '1.2rem',
  padding: '5px',
};

export const pinTooltipStyles = {
  backgroundColor: '#333',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 400,
  borderRadius: '4px',
  marginTop: '0 !important',
  padding: '5px',
};
