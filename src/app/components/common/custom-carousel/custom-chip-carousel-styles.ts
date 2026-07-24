export const navButtonStyles = {
  border: '0.5px solid #464646',
  width: '3.5rem',
  height: '3.5rem',
  background: '#fff',

  '&:hover': {
    border: '0.5px solid #77469B',
    background: '#fff',
    svg: {
      fill: '#77469B',
    },
  },

  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
    pointerEvents: 'initial',
    background: '#fff',
    opacity: 0.5,

    '&:hover': {
      borderColor: '#464646',
      svg: {
        fill: '#464646',
      },
    },
  },
};
