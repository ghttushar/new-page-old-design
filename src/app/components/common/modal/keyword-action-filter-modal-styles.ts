export const modalBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
  gap: '1rem',
  top: '42rem',
  left: '50%',
  width: 'auto',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #dadeeb',
  p: 2,

  '&:focus': {
    outline: 'none',
  },
};

export const applyButtonStyle = {
  backgroundColor: '#77469b',
  borderRadius: '0rem',
  height: '2.5rem',
  width: 'auto',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#77469b',
    boxShadow: 'none',
  },
  fontSize: '1.2rem',
};

export const modalInputStyle = {
  width: '15rem',
  height: '3rem',
  border: '1px solid #dadeeb',
  outline: 'none',
  padding: '0.5rem 1rem',
  fontSize: '1.2rem',
  fontWeight: 500,
  textAlign: 'start',
  paddingLeft: '4rem',
} as React.CSSProperties;

export const modalContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
};

export const modalLabelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#77469b',
  padding: '0 1rem',
  borderRight: '1px solid #dadeeb',
};

export const confirmationCancelButtonStyle = {
  ...applyButtonStyle,
  height: '2.2rem',
  fontSize: '1rem',
  backgroundColor: '#F4D5FF',
  color: '#77469B',
  '&:hover': {
    backgroundColor: '#F4D5FF',
    boxShadow: 'none',
  },
};

export const confirmationApplyButtonStyle = {
  ...applyButtonStyle,
  height: '2.2rem',
  fontSize: '1rem',
  marginRight: '1rem',
};

export const modalChildContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  marginBottom: '0.5rem',
};

export const customBidModalStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  borderRadius: '0.4rem',
  gap: '0.5rem',
  padding: '2rem',
  width: '28rem',
  zIndex: 80,
  top: '3.8rem',
  right: 0,
  boxShadow: '0 0 0.8rem rgba(0, 0, 0, 0.2)',
  textAlign: 'start',
};

export const errMessageStyles: React.CSSProperties = {
  color: '#ff0000',
  fontSize: '0.8rem',
  fontWeight: 600,
  alignSelf: 'end',
  marginTop: '-0.5rem',
};

export const confirmationModalStyle: React.CSSProperties = {
  ...customBidModalStyle,
  border: '1px solid #dadeeb',
  width: '25rem',
  right: '4rem',
  top: '2.4rem',
  gap: '0.4rem',
  padding: '1.2rem',
};

export const archiveConfirmationModalStyle: React.CSSProperties = {
  ...confirmationModalStyle,
  left: '1rem',
  top: '3.2rem',
};
