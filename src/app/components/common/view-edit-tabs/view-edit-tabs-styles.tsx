const TAB_BORDER_RADIUS = '3rem';

export const tabsWithoutIndicatorStyles = {
  minHeight: 'auto',
  width: '11rem',
  flexShrink: 0,
  button: {
    textTransform: 'none',
    textAlign: 'start',
    padding: 0,
    fontSize: '1rem',
    fontWeight: 400,
    minWidth: 'auto',
    minHeight: 'auto',
  },

  '.MuiTabs-flexContainer': {
    height: '2.5rem',
    border: '0.5px solid #d1d5db',
    borderRadius: TAB_BORDER_RADIUS,
  },

  '.MuiTabs-indicator': {
    height: '100%',
    borderRadius: TAB_BORDER_RADIUS,
    backgroundColor: '#77469B',
    transitionProperty: 'left, width, background-color',
    transitionDuration: '300ms, 300ms, 300ms',
    transitionTimingFunction:
      'cubic-bezier(0.65, 0, 0.35, 1), cubic-bezier(0.65, 0, 0.35, 1), linear',
    willChange: 'left, width',
    zIndex: 0,
  },

  '.MuiTab-root': {
    color: '#77469B',
    padding: '0.5rem 1rem',
    width: '4.5rem',
    position: 'relative',
    zIndex: 1,
    transition: 'color 500ms cubic-bezier(0.65, 0, 0.35, 1)',

    '&.Mui-disabled': {
      color: '#9E9FA2',
    },
  },

  '.MuiTab-root.Mui-selected': {
    color: '#ffffff',

    '&.Mui-disabled': {
      color: '#9E9FA2',
    },
  },

  '&:has(.Mui-selected.Mui-disabled) .MuiTabs-indicator': {
    backgroundColor: '#D4D7DB',
  },

  '.MuiTabs-scroller': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    position: 'relative',
  },

  '&:hover': { cursor: 'not-allowed' },
};
