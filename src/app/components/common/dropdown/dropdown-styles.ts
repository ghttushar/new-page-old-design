import { fancyScrollbar } from 'src/assets/styles/scrollbar.styles';

const width = '';

export const noOutlineSelectStyles = {
  fontSize: '1.2rem',
  padding: '0rem',
  borderRadius: '0.4rem',
  height: '2rem',

  maxWidth: { width },
  color: '#000000',

  boxShadow: 'none',
  flex: '1 1 auto',

  '&.MuiOutlinedInput-input': {
    paddingRight: '2rem !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #77469B !important',
  },
  '&.Mui-active .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #f00 !important',
  },
  '& .MuiSelect-icon': {
    top: 'calc(20% - 1rem)',
    left: 'calc(100% - 2.5rem)',
    height: '3rem',
    width: '3rem',
  },
};

export const menuProps = (height?: string) => {
  return {
    PaperProps: {
      sx: {
        position: 'absolute',
        maxHeight: height ? height : '20rem',
      },
    },
    sx: {
      '& .MuiMenu-paper': {
        padding: 0,
        marginTop: '0.2rem',
        ...fancyScrollbar,
        boxShadow: '0 0 0.4rem 0 rgba(0,0,0,0.2)',
        border: 'none',
        borderRadius: '0.4rem',
      },
    },
  };
};

export const listItemStyles = {
  fontSize: '1.2rem',
  width: '100%',
  padding: '0rem',
  '& .MuiTypography-body1': {
    fontSize: '1.2rem',
    color: '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const formStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'auto',
};

export const inputLabelStyles = {
  fontSize: '1.2rem',
  color: '#000000',
  marginRight: '0.5rem',
  display: 'flex',
  width: '100%',
  marginBottom: '0.3rem',
};

export const inputLabelNewStyles = {
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: '144%',
  color: '#464646',
  marginRight: '0.5rem',
  display: 'flex',
  width: '100%',
  marginBottom: '0.3rem',
};

export const selectStyles = {
  fontSize: '1.2rem',
  padding: '0rem',
  height: '3rem',
  color: '#000000',
  boxShadow: 'none',
  flex: '1 1 auto',
  textAlign: 'left',
  fontWeight: '500',

  '.MuiOutlinedInput-input': {
    padding: 0,
    paddingRight: '2rem !important',
    paddingLeft: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
};

export const selectOldStyles = {
  borderRadius: '0.4rem',

  '&:hover': {
    border: '1px solid #464646 !important',
  },

  '&.Mui-active, &.Mui-focused': {
    border: '1px solid #77469B !important',
  },
};

export const selectNewStyles = {
  borderRadius: '0.8rem',
  fontWeight: '400 !important',

  '&:hover': {
    border: '0.5px solid #000000 !important',
    background: '#ffffff',
  },

  '&.Mui-active, &.Mui-focused': {
    border: '0.5px solid #000000 !important',
    background: '#ffffff',
  },
};

export const menuPropsStyles = {
  '& .MuiMenu-paper': {
    boxShadow: '0 0 0.4rem 0 rgba(0,0,0,0.2)',
    marginTop: '0.7rem',

    '& .MuiMenuItem-root': {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      '&.Mui-disabled': {
        cursor: 'not-allowed !important',
      },
      '&:hover .MuiTypography-body1': {
        color: '#77469B',
      },
      '&.Mui-selected': {
        backgroundColor: '#F1F2F3',
        '.MuiTypography-body1': {
          color: '#77469B',
          fontWeight: 500,
        },

        '&.Mui-focusVisible': {
          backgroundColor: '#F1F2F3',
          '.MuiTypography-body1': {
            color: '#77469B',
            fontWeight: 500,
          },
        },
      },
    },
  },
};

export const paperPropsStyles = {
  position: 'absolute',
  maxHeight: '18rem',
  minWidth: 'auto',
  marginTop: '0.7rem',
  ...fancyScrollbar,
};

export const paperPropsNewStyles = {
  borderRadius: '0.8rem',
  border: '0.5px solid transparent !important',
  background:
    'linear-gradient(#fff, #fff) padding-box, ' +
    'linear-gradient(90.2deg, rgba(122, 75, 235, 1) 0.09%, rgba(42, 109, 244, 1) 99.55%) border-box',
  boxShadow: '0 0 16px 3px rgba(42, 109, 244, 0.25)',
};

export const paperPropsOldStyles = {
  borderRadius: '0.4rem',
};

export const listItemTextStyles = {
  fontSize: '1.2rem',
  color: '#000000',
  padding: '0rem',
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  '& .MuiTypography-body1': {
    fontSize: '1.2rem',
    color: '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const formControlStyles = {
  borderRadius: '0.8rem',
  backgroundColor: '#fff',
  margin: 0,
  transition: 'all 0.2s ease',

  '& .Mui-disabled': {
    cursor: 'not-allowed',
  },

  '&.Mui-error': {
    border: '1px solid #foo',
  },
};

export const menuItemStyles = {
  '&.Mui-selected': {
    backgroundColor: '#F4E4FF',
    color: '#ffffff',
    margin: 0,
    '&:hover': {
      backgroundColor: '#F1F2F3',
      boxShadow: 'none',
    },
  },

  '&:hover': {
    backgroundColor: '#F1F2F3',
    boxShadow: 'none',
  },
};

export const checkboxStyles = {
  color: '#77469b',
  borderRadius: '0.4rem',
  '&.Mui-checked': {
    color: '#77469b',
  },
  '& .MuiSvgIcon-root': { fontSize: '1.6rem', borderRadius: '0.4rem' },
  padding: '0.2rem 0.5rem',
  '&.Mui-disabled': {
    color: '#464646',
  },
};

export const listSubHeaderStyles = {
  fontSize: '1.3rem',
  color: '#000',
  lineHeight: '2.8rem',
  fontWeight: 700,
};

export const checkBoxMenuItemStyles = {
  '&.Mui-selected': {
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  padding: '0.5rem',
  width: '100%',
};
