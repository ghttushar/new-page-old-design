import { IErrorResultDetails } from '@/interfaces/service.interface';
import { getMetaFieldBasedCampaignName } from '@/utils/toast-message.utils';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { XIcon } from '@phosphor-icons/react';
import styles from './toast-error-popup.module.scss';
import {
  closeIconButtonStyles,
  dialogContentStyles,
  errPopupTitleStyles,
} from './toast-message-styles';

interface IToastErrorPopupProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  errData: IErrorResultDetails;
}

export default function ToastErrorPopup({
  openDialog,
  handleCloseDialog,
  errData,
}: IToastErrorPopupProps) {
  return (
    <Dialog
      onClose={handleCloseDialog}
      aria-labelledby="error-popup"
      open={openDialog}
      sx={{
        '.MuiDialog-paper': {
          minWidth: '40rem',
          minHeight: '10vh',
          maxHeight: '80vh',
        },
      }}
      maxWidth="sm"
    >
      <DialogTitle
        sx={errPopupTitleStyles}
        id="confirmation-popup-title"
        className={styles.dialogTitle}
      >
        {getMetaFieldBasedCampaignName(errData.metaField)} Error Logs
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={closeIconButtonStyles}
        >
          <XIcon size={18} weight="bold" color="#ffffff" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={dialogContentStyles} dividers={false}>
        <Typography
          fontSize={'1.2rem'}
          fontWeight={400}
          sx={{
            mb: '1rem',
            display: 'inline-flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {errData.errorCount} out of{' '}
          {errData.successCount + errData.errorCount} failed. Please review the
          errors below.
        </Typography>

        <div className={styles.tableContainer}>
          <table className={styles.errTable}>
            <thead>
              <tr>
                <th>{getMetaFieldBasedCampaignName(errData.metaField)} ID</th>
                <th>{getMetaFieldBasedCampaignName(errData.metaField)} Name</th>
                <th>Error Reasons</th>
              </tr>
            </thead>

            <tbody>
              {errData.errors.map((item, index) => (
                <tr tabIndex={index}>
                  <td>{item.metaId || '-'}</td>
                  <td>{item.entityName || '-'}</td>
                  <td>{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
