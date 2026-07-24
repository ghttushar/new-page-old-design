import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { Breakpoint } from '@mui/system';
import { XIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import CustomEditLoader from '../../shared/custom-edit-loader/custom-edit-loader';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import PrimaryButton from '../primary-button/primary-button';
import {
  closeIconStyles,
  dialogPaperProps,
  titleStyles,
} from './reusable-dialog-popup-skeleton.styles';

interface IReusableDialogPopupProps {
  dialogMaxWidth: Breakpoint;
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
  needTitleBox: boolean;
  title?: string;
  needConfirmActionButton: boolean;
  confirmActionButtonText?: string;
  onConfirmActionButtonClick?: () => void;
  disableConfirmActionButton?: boolean;
  needCancelActionButton: boolean;
  isLoading: boolean;
  popupWrapperPadding?: string;
  popupContentBodyPadding?: string;
}

export default function ReusableDialogPopupSkeleton({
  dialogMaxWidth,
  open,
  onClose,
  children,
  needTitleBox,
  title,
  needConfirmActionButton,
  confirmActionButtonText,
  onConfirmActionButtonClick,
  disableConfirmActionButton,
  needCancelActionButton,
  isLoading,
  popupWrapperPadding,
  popupContentBodyPadding,
}: IReusableDialogPopupProps) {
  const needConfirmAction = useMemo(
    () =>
      needConfirmActionButton === true &&
      confirmActionButtonText !== undefined &&
      confirmActionButtonText !== '' &&
      onConfirmActionButtonClick !== undefined,
    [
      confirmActionButtonText,
      onConfirmActionButtonClick,
      needConfirmActionButton,
    ]
  );

  const needActions = useMemo(
    () => needConfirmAction === true || needCancelActionButton === true,
    [needCancelActionButton, needConfirmAction]
  );

  const handleConfirmClick = () => {
    if (onConfirmActionButtonClick) onConfirmActionButtonClick();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      PaperProps={{
        sx: { ...dialogPaperProps, padding: popupWrapperPadding ?? '' },
      }}
      maxWidth={dialogMaxWidth}
      fullWidth
    >
      {isLoading === true && <CustomEditLoader />}

      {needCancelActionButton === false && (
        <IconButton disableRipple sx={closeIconStyles} onClick={onClose}>
          <XIcon size={'1.6rem'} color="$464646" />
        </IconButton>
      )}

      {needTitleBox === true && title !== undefined && title !== '' && (
        <DialogTitle sx={titleStyles}>{title}</DialogTitle>
      )}

      <DialogContent sx={{ p: popupContentBodyPadding ?? '1rem', m: 0 }}>
        {children}
      </DialogContent>

      {needActions === true && (
        <DialogActions sx={{ gap: '1rem' }}>
          {needCancelActionButton === true && (
            <AltPrimaryButton
              buttonText="Cancel"
              buttonFunction={onClose}
              disabled={false}
              width="auto"
              height="2.5rem"
              bgColor="#F0F0F01A"
              textColor="#464646"
            />
          )}

          {needConfirmAction === true && (
            <PrimaryButton
              buttonText={confirmActionButtonText ?? 'Confirm'}
              buttonFunction={handleConfirmClick}
              disabled={disableConfirmActionButton ? true : false}
              width="auto"
              height="2.5rem"
            />
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
