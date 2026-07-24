export const avatarStyle = {
  backgroundColor: '#808080',
  color: 'white',
  fontSize: '1.6rem',
  fontWeight: 500,
  borderRadius: '0.6rem',
  height: '3.2rem',
  width: '3.2rem',
};

export const dividerStyles = {
  margin: '0.8rem 0',
};

export const headerMenuStyles = {
  '& .MuiMenu-paper': {
    borderRadius: '0.8rem',
    marginTop: '0.8rem',
    border: 'none',
    boxShadow: '0rem 0rem 0.4rem 0rem rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '0.8rem',

    '.MuiList-root': {
      width: '100%',
      padding: 0,
    },
  },
};

export const buttonStyles = {
  fontWeight: 400,
  fontSize: '1.2rem',
  lineHeight: '1.2rem',
  color: '#464646',
  textTransform: 'none',
  padding: '0.8rem 0.8rem',
  width: '100%',
  transition: 'all 0.3s',
  '&:hover': {
    borderRadius: 'none',
    backgroundColor: '#f2f2f2',
    color: '#77469B',
  },

  '&.MuiButtonBase-root': {
    justifyContent: 'flex-start',
    borderRadius: '0',
  },
};
