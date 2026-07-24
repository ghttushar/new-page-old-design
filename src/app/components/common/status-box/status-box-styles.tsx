export const statusBoxStyle = (
  boxColor: string,
  textColor: string,
  borderColor: string = boxColor
) => {
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
    border: `1px solid ${borderColor}`,
  };
};
