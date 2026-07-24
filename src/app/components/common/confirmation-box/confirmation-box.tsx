import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Breakpoint } from '@mui/system';
import { GlobalDataTestIds } from 'cypress/enums/global';
import CustomEditLoader from '../../shared/custom-edit-loader/custom-edit-loader';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import PrimaryButton from '../primary-button/primary-button';
import {
  confirmationBoxStyles,
  newConfirmationBoxStyles,
} from './confirmation-box-styles';

interface IConfirmationBoxProps {
  maxWidth?: Breakpoint;
  titleStartIcon?: JSX.Element;
  title: string | JSX.Element;
  description: string | JSX.Element;
  openConfirmation: boolean;
  handleConfirmationClose: () => void;
  handleConfirmClick?: () => void;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  isConfirmButtonRequired: boolean;
  isLoading?: boolean;
  loadingText?: string;
  cancelButtonText?: string;
  isNewDesign?: boolean;
  fullWidthActionButtons?: boolean;
}

export default function ConfirmationBox({
  maxWidth = 'sm',
  title,
  titleStartIcon,
  description,
  openConfirmation,
  handleConfirmationClose,
  handleConfirmClick,
  isLoading = false,
  confirmButtonText,
  confirmButtonColor,
  isConfirmButtonRequired,
  loadingText = '',
  cancelButtonText = 'Cancel',
  isNewDesign = false,
  fullWidthActionButtons = false,
}: IConfirmationBoxProps) {
  const handleCancel = () => {
    if (isLoading === false) handleConfirmationClose();
    return;
  };

  const handleConfirm = () => {
    if (isConfirmButtonRequired && handleConfirmClick) {
      handleConfirmClick();
    }
  };

  return (
    <Dialog
      data-test={GlobalDataTestIds.CONFIRMATION_POPUP}
      open={openConfirmation}
      onClose={handleCancel}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      sx={
        isNewDesign ? newConfirmationBoxStyles(maxWidth) : confirmationBoxStyles
      }
      maxWidth={maxWidth}
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading === true && <CustomEditLoader overlayText={loadingText} />}
      <DialogTitle id="confirmation-title">
        {titleStartIcon}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: '1rem' }}>
        <AltPrimaryButton
          data-test={GlobalDataTestIds.CONFIRMATION_POPUP_CANCEL_ACTION_BUTTON}
          buttonText={cancelButtonText}
          buttonFunction={handleCancel}
          disabled={false}
          width={fullWidthActionButtons ? '100%' : undefined}
          height="3rem"
          fontSize="1.1rem"
          isNewDesign={isNewDesign}
        />
        {isConfirmButtonRequired === true && (
          <PrimaryButton
            data-test={
              GlobalDataTestIds.CONFIRMATION_POPUP_CONFIRM_ACTION_BUTTON
            }
            buttonText={confirmButtonText as string}
            buttonFunction={handleConfirm}
            disabled={false}
            width={fullWidthActionButtons ? '100%' : undefined}
            height="3rem"
            fontSize="1.1rem"
            isNewDesign={isNewDesign}
            bgColor={confirmButtonColor}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}
