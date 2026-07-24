import {
  confirmationApplyButtonStyle,
  confirmationCancelButtonStyle,
} from '../modal/keyword-action-filter-modal-styles';

export const matchTypeContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  alignSelf: 'center',
  flexDirection: 'column',
  padding: '0.8rem',
} as React.CSSProperties;

export const customBidContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  flexDirection: 'column',
  padding: '0.8rem',
  gap: '0.8rem',
} as React.CSSProperties;

export const matchTypeBoxStyle = {
  width: 'auto',
  headerAlign: 'center',
  align: 'center',
  height: '1.8rem',
  padding: '1.6rem',
  color: '#77469B',
  fontSize: '1.1rem',
  fontWeight: '500',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '0.5rem',
};

export const keywordActionsTableStyles = {
  fontSize: '1.1rem',
  borderRadius: '0rem',
  border: '1px solid #DADEEB',
  backgroundColor: '#fff',
  height: '100%',
  '& .MuiDataGrid-root': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiDataGrid-virtualScrollerContent': {
    minHeight: '20rem !important',
  },
  '& .MuiDataGrid-overlay': {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#666666',
    background: '#F2F5F9',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '1.1rem !important',
    color: '#474747',
  },
  '& .MuiDataGrid-cell': {
    fontWeight: '500',
    borderRight: '1px solid #DADEEB',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .Mui-selected': {
    backgroundColor: '#f6edfc !important',
  },
  '& .Mui-checked': {
    color: '#77469B',
  },

  '& .css-1b74o31-MuiInputBase-root-MuiDataGrid-editInputCell input': {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#77469B',
  },

  '& .css-16ir09t-MuiDataGrid-root .MuiDataGrid-cell.MuiDataGrid-cell--editing:focus-within':
    {
      outline: 'solid #77469B 1px',
    },

  '& .MuiDataGrid-cell.MuiDataGrid-cell--editing': {
    boxShadow: 'none',
    backgroundColor: '#fff',
  },
};

export const keywordActionAddKeywordStyles = {
  backgroundColor: '#fff',
  color: '#77469b',
  border: '1px solid #77469b',
  borderRadius: '0rem',
  height: '3rem',
  width: '15rem',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
  fontSize: '1.2rem',
};

export const tableHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  fontSize: '1.2rem',
};

export const textWrappingStyles = {
  whiteSpace: 'normal',
  textAlign: 'center',
} as React.CSSProperties;

export const searchTermContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '1rem',
  width: '100%',
  padding: '2rem 0.5rem',
  fontSize: '1.1rem',
} as React.CSSProperties;

export const taggingContainerStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
} as React.CSSProperties;

export const tagStyles = {
  padding: '0.4rem 0.6rem',
  borderRadius: '0.2rem',
  color: '#4E4E4E',
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.04rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  width: '10rem',
  gap: '0.5rem',
} as React.CSSProperties;

export const brandedTagStyles = {
  ...tagStyles,
  backgroundColor: '#F4E5FF',
} as React.CSSProperties;

export const competitorTagStyles = {
  ...tagStyles,
  backgroundColor: '#FFE3E4',
} as React.CSSProperties;

export const genericTagStyles = {
  ...tagStyles,
  backgroundColor: '#D8EFF8',
} as React.CSSProperties;

export const adGroupCountStyles = {
  fontSize: '1rem',
  fontWeight: 500,
  letterSpacing: '0.04rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
} as React.CSSProperties;

export const tagCancelBtn = {
  ...confirmationCancelButtonStyle,
  width: '3rem',
  color: '#77469B',
  '&.Mui-disabled': {
    border: '1px solid #F4D5FF',
    cursor: 'not-allowed !important',
    background: 'rgba(0, 0, 0, 0.12)',
  },
} as React.CSSProperties;

export const tagApplyBtn = {
  ...confirmationApplyButtonStyle,
  width: '3rem',
  color: '#fff',
  '&.Mui-disabled': {
    border: '1px solid #F4D5FF',
    cursor: 'not-allowed !important',
    background: 'rgba(0, 0, 0, 0.12)',
  },
} as React.CSSProperties;

export const tagModalStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '1.5rem',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  position: 'absolute',
  zIndex: 2, //TODO: Need to check the z-index
  transition: 'all 0.3s ease-in-out',
} as React.CSSProperties;

export const bidErrorMessageStyles = {
  color: '#ff0000',
  fontSize: '0.8rem',
  fontWeight: 600,
} as React.CSSProperties;

export const normalizedKeywordStyles = {
  padding: '0.6rem',
  backgroundColor: '#FFF5D2',
  borderRadius: '0.4rem',
  ...textWrappingStyles,
} as React.CSSProperties;

export const keywordActionSearchTermKeywordStyles = {
  ...textWrappingStyles,
  textAlign: 'start',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1.2rem',
} as React.CSSProperties;
