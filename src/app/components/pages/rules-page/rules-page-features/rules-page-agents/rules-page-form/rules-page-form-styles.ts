import { searchFieldStyles } from '@/app/components/page-components/advertising-create-dialogs/advertising-create-dialogs-styles';
import { outlinedTextBoxNewStyles } from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';

export const textboxNewStyles = {
  ...outlinedTextBoxNewStyles(),
  padding: '0.3rem',
  background: '#ffffff',
  fontSize: '1.1rem',
};

export const fieldTitleNewStyles = {
  fontWeight: '500',
  fontSize: '1rem',
  lineHeight: '144%',
  letterSpacing: '-2%',
  color: '#acacac',
  marginBottom: '0.2rem',
};

export const popupDropdownTitleStyles = {
  fontWeight: '500',
  fontSize: '0.8rem',
  lineHeight: '144%',
  letterSpacing: '-2%',
  color: '#464646',
};

export const bidderFieldNewStyles = {
  ...textboxNewStyles,
  height: '3.2rem',
  width: '16rem',
  display: 'flex',
};

export const searchTextFieldStyles = {
  ...searchFieldStyles,
  '& > :not(style)': {
    width: '100%',
    height: '3rem',
    borderRadius: '0.4rem',
    fontSize: '1.2rem',
    fontFamily: 'Inter, sans-serif !important',
    marginTop: '0rem',
    marginBottom: '1rem',
    padding: 0,
  },
};
