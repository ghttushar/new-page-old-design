export const fancyScrollbar = {
  '&::-webkit-scrollbar': {
    width: '0.6rem',
    height: '1rem',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(to bottom, #d7d7d7, #c0c0c0)',
    borderRadius: '0.5rem',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(to bottom, #bfbfbf, #a8a8a8)', // 10% darker
  },
  '&::-webkit-scrollbar-thumb:active': {
    background: 'linear-gradient(to bottom, #a6a6a6, #8c8c8c)', // 20% darker
  },
  '&::-webkit-scrollbar-thumb:horizontal': {
    background: 'linear-gradient(to right, #d7d7d7, #c0c0c0)',
  },
  '&::-webkit-scrollbar-thumb:horizontal:hover': {
    background: 'linear-gradient(to right, #bfbfbf, #a8a8a8)', // 10% darker
  },
  '&::-webkit-scrollbar-thumb:horizontal:active': {
    background: 'linear-gradient(to right, #a6a6a6, #8c8c8c)', // 20% darker
  },
};
