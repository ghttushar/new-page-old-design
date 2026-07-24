import { fancyScrollbar } from '@/assets/styles/scrollbar.styles';
import { newHoverFocusActiveMuiStylesWithShadow } from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';

export const outlineInputNewStyles = {
  borderRadius: '12px',
  border: '0.5px solid #8b8b8b',
  padding: '1rem',
  overflow: 'hidden',
  transition: 'all 0.25s ease',

  '.MuiOutlinedInput-input': {
    padding: '0.5rem',

    '&.Mui-disabled': {
      cursor: 'not-allowed',
    },
  },

  '&.Mui-disabled': {
    cursor: 'not-allowed',
    border: '0.5px solid #acacac',
    boxShadow: 'none',
  },

  '& .MuiInputBase-inputMultiline': {
    ...fancyScrollbar,
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },

  ...newHoverFocusActiveMuiStylesWithShadow(),
};
