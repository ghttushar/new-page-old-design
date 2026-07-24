export const statusBoxStyle = (boxColor: string, textColor: string) => {
  return {
    minWidth: '5rem',
    padding: '3px',
    headerAlign: 'center',
    align: 'center',
    height: '1.8rem',
    backgroundColor: boxColor,
    color: textColor,
    fontSize: '0.8rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
};

export const targetingTypeContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '60%',
  alignSelf: 'center',
};

export const targetingTypeBoxStyle = {
  width: 'auto',
  headerAlign: 'center',
  align: 'center',
  height: '1.5rem',
  padding: '0rem 0.3rem',
  color: '#77469B',
  border: '1px solid #77469B',
  fontSize: '0.8rem',
  fontWeight: '500',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '0.5rem',
};

export const itemNameContainerStyles = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontWeight: 'bold',
  paddingRight: '1rem',
};

export const bidCellStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const bidTextStyle = {
  color: '#77469B',
  textDecoration: 'underline',
};
