export const dialogPaperProps = {
  borderRadius: '16px',
  padding: '1rem',
  position: 'relative',
  overflow: 'visible',
};

export const closeIconStyles = {
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: '50%',
  position: 'absolute',
  right: '-1.5rem',
  top: '-1.6rem',
  zIndex: 1,
  background: 'rgb(255, 255, 255, 0.6)',
  backdropFilter: 'blur(1px)',
  WebkitBackdropFilter: 'blur(1px)',
  border: '1px solid rgb(255, 255, 255, 0.1)',
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',

  '&:hover': {
    background: 'rgb(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',

    svg: {
      fill: 'rgb(255, 255, 255, 0.8)',
    },
  },
};

export const titleStyles = {
  p: '1rem',
  m: 0,
  fontSize: '2.4rem',
  lineHeight: '144%',
  fontWeight: 600,
};
