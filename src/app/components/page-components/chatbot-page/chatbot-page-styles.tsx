import React from 'react';

export const containerStyles = (isExpanded: boolean): React.CSSProperties => {
  return {
    right: isExpanded ? '0.5%' : undefined,
    left: isExpanded ? '0.5%' : undefined,
    top: isExpanded ? '6.5rem' : '8%',
    height: isExpanded ? 'calc(100vh - 8rem)' : '100%',
    width: isExpanded ? 'calc(100vw - 6rem)' : '100%',
    backgroundColor: isExpanded ? 'transparent' : undefined,
    marginLeft: isExpanded ? '5.5rem' : undefined,
    pointerEvents: isExpanded ? 'auto' : undefined,
  };
};

export const subContainerStyles = (
  isExpanded: boolean,
  isSidebarOpen = true
): React.CSSProperties => {
  return {
    flex: isExpanded ? '1 1 auto' : undefined,
    maxWidth: isExpanded ? (isSidebarOpen ? '83%' : '95%') : undefined,
    height: isExpanded ? '100%' : '100%',
    width: isExpanded ? '100%' : undefined,
    flexGrow: !isExpanded ? 1 : undefined,
    backgroundColor: 'white',
    borderRadius: isExpanded ? '0.8rem' : undefined,
    alignItems: isExpanded ? 'center' : undefined,
    transition: 'max-width 0.3s ease-in-out',
    padding: isExpanded ? '1rem' : '',
    paddingRight: isExpanded ? '1.6rem' : '',
  };
};

export const chatbotContainerStyles = (isExpanded: boolean) => {
  return {
    justifyContent: isExpanded ? '10%' : 'start',
    alignItems: isExpanded ? 'center' : 'start',
    marginTop: isExpanded ? '0' : undefined,
    padding: !isExpanded ? '1rem' : undefined,
  };
};

export const botMessageContainerStyles = (
  isExpanded: boolean,
  isPreviewOpen: boolean
): React.CSSProperties => {
  return {
    width: isExpanded ? (isPreviewOpen ? '90%' : '65%') : '100%',
    margin: isExpanded ? 'auto' : '0',
    marginLeft: isExpanded ? (isPreviewOpen ? '2rem' : '17%') : '0',
    padding: isExpanded ? '0' : '1rem',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  };
};

export const bulbIconBadgeStyles = {
  background: '#F26E77',
  border: 'none !important',
  borderRadius: '50%',
  width: '1.6rem',
  height: '1.6rem',
  right: '0.2rem',
  top: 0,
  cursor: 'pointer',
};

export const insightTabStyles = (isExpanded: boolean): React.CSSProperties => {
  return {
    width: 'auto',
    borderRadius: '2rem',
    padding: '0.3rem 0.8rem',
    height: 'auto',
    fontSize: isExpanded ? '1.2rem' : undefined,
  };
};
