import { DetailedHTMLProps, HTMLAttributes } from 'react';

export const wrapperStyle = {
  position: 'absolute',
  backgroundColor: '#fff',
  bottom: 0,
  borderRadius: '1rem 1rem 0 0',
  width: '100%',
  padding: '1rem',
  boxShadow: '0 0 1rem 0 rgba(0, 0, 0, 0.2)',
} as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
