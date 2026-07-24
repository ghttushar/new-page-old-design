export const tabsWithoutIndicatorStyles = {
  button: {
    textTransform: 'none',
    textAlign: 'start',
    padding: 0,
    fontSize: '1.2rem',
    fontWeight: 400,

    '&:hover': {
      fontWeight: 500,
    },
  },

  '.MuiTabs-flexContainer': {
    gap: '1rem',
  },

  '.MuiTabs-indicator': {
    display: 'none',
  },

  '.MuiTab-root': {
    color: 'rgba(0, 0, 0, 0.5) !important',
  },

  '.MuiTab-root.Mui-selected': {
    color: '#000000 !important',
    fontWeight: 600,
  },

  '.MuiTabs-scroller': {
    height: '3.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const tabsWithIndicatorStyles = {
  button: {
    textTransform: 'none',
    textAlign: 'start',
    padding: '0 1rem',
    fontSize: '1.2rem',
    fontWeight: 400,
    letterSpacing: '-0.02px',

    '&:hover': {
      fontWeight: 500,
    },
  },

  '.MuiTabs-flexContainer': {
    gap: '1rem',
  },

  '.MuiTabs-indicator': {
    height: '2px',
    backgroundColor: '#77469b',
  },

  '.MuiTab-root': {
    color: '#292438 !important',
  },

  '.MuiTab-root.Mui-selected': {
    color: '#77469b !important',
    fontWeight: 700,
  },

  '.MuiTabs-scroller': {
    height: '40px',
  },
};

export const tabsNewStyles = (
  isNewDesign: boolean,
  width: string,
  height: string
) => ({
  width: width ?? '100%',
  maxWidth: '100%',
  minHeight: 0,
  padding: '5px',
  backgroundColor: 'rgba(244, 242, 242, 0.2)',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
  borderRadius: '0.8rem',
  overflow: 'hidden',

  '& .MuiTabs-scroller': {
    overflow: 'hidden !important',
  },

  '& .MuiTabs-flexContainer': {
    display: 'flex',
    gap: '0.5rem',
  },

  '& .MuiTabs-indicator': {
    display: 'none',
  },

  '& .MuiTab-root': {
    flex: 1,
    maxWidth: 'none',
    minWidth: 0,
    minHeight: height,
    height,
    textTransform: 'none',
    fontSize: '1.1rem',
    lineHeight: '250%',
    fontWeight: 400,
    borderRadius: '0.8rem',
    transition: 'all 0.25s ease',
    color: '#464646',
    zIndex: 1,

    '&:hover': {
      fontWeight: 700,
    },

    '&.Mui-disabled': {
      fontWeight: 400,
      opacity: '0.6',
      background: '#dadeeb',
    },
  },

  '& .Mui-selected': {
    color: '#fff !important',
    background: isNewDesign
      ? 'linear-gradient(97.44deg, #7A4BEB 3.56%, #2A6DF4 100.35%)'
      : 'linear-gradient(99.66deg, #894DB5 4.22%, #6205A7 89%)',

    '&:hover': {
      fontWeight: 400,
    },
  },
});
