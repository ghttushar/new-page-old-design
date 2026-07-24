import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { KeywordTrackerDataTestIds } from 'cypress/enums/keyword-tracker';
import AltPrimaryButton from 'src/app/components/common/alt-primary-button/alt-primary-button';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import {
  confirmationPopupChannelCheckboxStyles,
  confirmationPopupLabelStyles,
} from './action-confirmation-popup-styles';
import styles from './action-confirmation-popup.module.scss';

interface ActionConfirmationPopupProps<T> {
  rowChannelCount: number;
  channelOptions: IDropdownItem<T>[];
  handleOptionSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancelConfirmation: () => void;
  handleConfirmationAction: () => void;
  isActionDisabled: boolean;
  actionButtonText?: string;
  confirmationHeaderText?: string;
  confirmationDescription?: string;
}

export default function ActionConfirmationPopup<T>({
  rowChannelCount,
  channelOptions,
  handleOptionSelect,
  handleCancelConfirmation,
  handleConfirmationAction,
  isActionDisabled,
  actionButtonText,
  confirmationHeaderText,
  confirmationDescription,
}: ActionConfirmationPopupProps<T>) {
  return (
    <div
      className={styles.statusConfirmation}
      data-test={KeywordTrackerDataTestIds.STATUS_CONFIRMATION_POPUP}
    >
      <Typography variant="h4" fontSize="1.4rem" fontWeight={700}>
        {confirmationHeaderText ? confirmationHeaderText : 'Confirmation'}
      </Typography>
      <Typography
        variant="body1"
        fontSize="1.2rem"
        fontWeight={400}
        sx={{ mt: 1 }}
      >
        {confirmationDescription ? confirmationDescription : 'Are you sure?'}
      </Typography>

      <FormGroup
        className={styles.optionContainer}
        sx={{
          display: 'flex',
          flexDirection: 'row !important',
        }}
      >
        {rowChannelCount > 1 &&
          channelOptions.length > 0 &&
          channelOptions.map((option, index) => (
            <FormControlLabel
              key={`${option.value}-${index}`}
              control={
                <Checkbox
                  checked={option.selected}
                  onChange={handleOptionSelect}
                  name={option.value as string}
                  sx={confirmationPopupChannelCheckboxStyles}
                />
              }
              label={option.label}
              className={styles.option}
              sx={confirmationPopupLabelStyles}
            />
          ))}
      </FormGroup>

      <div className={styles.buttonContainer}>
        <AltPrimaryButton
          buttonText="Cancel"
          buttonFunction={handleCancelConfirmation}
          disabled={false}
          height="2.3rem"
        />
        <PrimaryButton
          buttonText={actionButtonText ? actionButtonText : 'Apply'}
          buttonFunction={handleConfirmationAction}
          disabled={isActionDisabled}
          height="2.3rem"
          fontSize="1rem"
        />
      </div>
    </div>
  );
}
