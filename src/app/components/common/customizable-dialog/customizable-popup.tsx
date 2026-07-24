import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Breakpoint } from '@mui/system';
import { XIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import CustomEditLoader from '../../shared/custom-edit-loader/custom-edit-loader';
import {
  closeIconButtonStyles,
  dialogContentStyles,
  popupTitleStyles,
} from './customizable-popup-styles';
import styles from './customizable-popup.module.scss';

export interface IPopupDescription {
  content: string;
  isHeading: boolean;
  headingStartIcon?: JSX.Element;
  headingEndIcon?: JSX.Element;
}

export interface ICustomizablePopupDetails {
  description: IPopupDescription[];
  wantBodyDivider: boolean;
  wantGutters: boolean;
  title?: string;
  confirmationButtonText?: string;
  cancelButtonText?: string;
  maxWidth?: Breakpoint;
  minWidth?: string;
  hideConfirmationButton?: boolean;
  isLoading?: boolean;
  disableConfirmationButton?: boolean;
  disableConfirmationButtonTooltip?: string;
}

interface ICustomizablePopupProps extends ICustomizablePopupDetails {
  openModal: boolean;
  handleClose: () => void;
  handleConfirmationAction: () => void;
}

export default function CustomizablePopup({
  openModal,
  handleClose,
  handleConfirmationAction,
  confirmationButtonText,
  cancelButtonText,
  title,
  description,
  wantBodyDivider,
  wantGutters,
  maxWidth,
  minWidth,
  hideConfirmationButton = false,
  isLoading = false,
  disableConfirmationButton = false,
  disableConfirmationButtonTooltip = '',
}: ICustomizablePopupProps) {
  const isTitlePresent = useMemo(
    () => title !== undefined && title !== '',
    [title]
  );

  const handlePopupClose = () => {
    if (isLoading === false) handleClose();
    return;
  };

  return (
    <Dialog
      onClose={handlePopupClose}
      aria-labelledby="confirmation-popup"
      open={openModal}
      sx={{
        '.MuiDialog-paper': {
          minWidth: minWidth ? minWidth : '20rem',
        },
      }}
      maxWidth={maxWidth ? maxWidth : 'sm'}
    >
      {isLoading === true && <CustomEditLoader />}
      {isTitlePresent === true && (
        <DialogTitle
          sx={popupTitleStyles}
          id="confirmation-popup-title"
          className={styles.dialogTitle}
        >
          {title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={closeIconButtonStyles}
          >
            <XIcon size={18} weight="bold" color="#ffffff" />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent dividers={wantBodyDivider} sx={dialogContentStyles}>
        {description.map((item, index) => (
          <Typography
            key={`${item.content}-${index}`}
            fontSize={item.isHeading === true ? '1.3rem' : '1.2rem'}
            fontWeight={item.isHeading === true ? 700 : 400}
            sx={{
              mb:
                item.isHeading === true
                  ? '1.5rem'
                  : wantGutters === true
                  ? '1rem'
                  : 0,

              display: 'inline-flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {item.headingStartIcon !== undefined && item.headingStartIcon}
            {/<(strong|b)>/.test(item.content)
              ? (() => {
                  const tag = item.content.includes('<strong>')
                    ? 'strong'
                    : 'b';
                  const [boldText, restText] = item.content.split(`</${tag}>`);
                  const cleanedBoldText = boldText.replace(`<${tag}>`, '');
                  const BoldTag = tag;

                  return (
                    <span>
                      <BoldTag>{cleanedBoldText}</BoldTag>
                      {restText}
                    </span>
                  );
                })()
              : item.content}

            {item.headingEndIcon !== undefined && item.headingEndIcon}
          </Typography>
        ))}
      </DialogContent>

      <DialogActions sx={{ gap: '1rem', px: 2 }}>
        {isTitlePresent === false && (
          <SecondaryButton
            buttonText={cancelButtonText ? cancelButtonText : 'Cancel'}
            buttonFunction={handleClose}
            disabled={false}
            fontWeight="500"
          />
        )}

        {hideConfirmationButton === false && (
          <PrimaryButton
            buttonText={
              confirmationButtonText ? confirmationButtonText : 'Continue'
            }
            buttonFunction={handleConfirmationAction}
            width="auto"
            disabled={disableConfirmationButton}
            isHoverTooltipEnabled={disableConfirmationButton}
            tooltipText={disableConfirmationButtonTooltip}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}
