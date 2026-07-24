import { applyButtonStyle } from '../modal/keyword-action-filter-modal-styles';

export const filterCancelButtonStyle = {
  ...applyButtonStyle,
  height: '3rem',
  fontSize: '1.2rem',
  backgroundColor: '#F4D5FF',
  color: '#77469B',
  '&:hover': {
    backgroundColor: '#F4D5FF',
    boxShadow: 'none',
  },
};

export const filterApplyButtonStyle = {
  ...applyButtonStyle,
  height: '3rem',
  fontSize: '1.2rem',

  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
    pointerEvents: 'initial !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
};

export const signStyles = {
  position: 'absolute',
  color: '#77469b',
  padding: '0 1rem',
  borderRight: '1px solid #dadeeb',
  fontSize: '1.3rem',
  fontWeight: 700,
  marginTop: '0.4rem',
} as React.CSSProperties;

export const textboxNewStyles = {
  borderRadius: '0.4rem',
  width: '18rem',
  border: '1px solid #acacac',
  padding: '0.5rem',
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  background: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 400,
  fontSize: '1.2rem',

  '.MuiOutlinedInput-input': {
    padding: '0.1rem',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },

  '&.Mui-error': {
    border: '0.5px solid #ff0000',
  },
  '&:hover': {
    border: '1px solid #464646 !important',
  },
  '&:active': {
    border: '1px solid #77469b !important',
  },
  '&:focus': {
    border: '1px solid #77469b !important',
  },
};
