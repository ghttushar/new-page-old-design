import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import React from 'react';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import SingleDatePicker from 'src/app/components/common/single-date-picker/single-date-picker';
import SingleTimePicker from 'src/app/components/common/single-time-picker/single-time-picker';
import { getCurrentDateTime } from 'src/utils';
import { textFieldStyles } from './custom-query-form-styles';
import styles from './custom-query-form.module.scss';

interface ICustomQueryFormProps {
  formHeading: string;
  subHeading: string;
  titleHeading: string;
  title: string;
  description: string;
  contactDate: string;
  contactTime: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleContactDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleContactTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomSubmit: () => void;
  disableSubmitButton: boolean;
}

export default function CustomQueryForm({
  formHeading,
  subHeading,
  titleHeading,
  title,
  description,
  contactDate,
  contactTime,
  handleTitleChange,
  handleDescriptionChange,
  handleContactDateChange,
  handleContactTimeChange,
  handleCustomSubmit,
  disableSubmitButton,
}: ICustomQueryFormProps) {
  const currentTime = contactTime;

  return (
    <div className={styles.customQueryFormContainer}>
      <div className={styles.headingInfo}>
        <Typography variant="h2" className={styles.heading}>
          {formHeading}
        </Typography>
        <Typography variant="body1" className={styles.contactText}>
          {subHeading}
        </Typography>
        <Typography variant="h4" className={styles.contactInfo}>
          Email ID : tech@anarix.ai
        </Typography>
      </div>

      <Typography variant="h3" className={styles.subHeading}>
        Send Request
      </Typography>

      <div className={styles.formFieldsContainer}>
        <InputLabel
          htmlFor="query-title"
          required
          className={styles.labelHeading}
        >
          {titleHeading}
        </InputLabel>
        <TextField
          value={title}
          required
          id="query-title"
          variant="outlined"
          type="text"
          name="queryTitle"
          placeholder="Name of the Query title"
          className={styles.textField}
          sx={textFieldStyles}
          onChange={handleTitleChange}
        />

        <InputLabel
          htmlFor="query-description"
          required
          className={styles.labelHeading}
        >
          Description
        </InputLabel>
        <TextField
          value={description}
          multiline
          rows={6}
          required
          id="query-description"
          variant="outlined"
          type="text"
          name="queryDescription"
          placeholder="Some Description about the request you're looking for..."
          className={styles.textField}
          sx={textFieldStyles}
          onChange={handleDescriptionChange}
        />

        <InputLabel
          htmlFor="query-time-date"
          required
          className={styles.labelHeading}
        >
          Select Your Available Time and Date
        </InputLabel>
        <div className={styles.timeDateContainer}>
          <SingleDatePicker
            label=""
            value={contactDate}
            onChange={handleContactDateChange}
            isMaxDateRequired={false}
            minDate={getCurrentDateTime().split('_')[0]}
            isDisabled={false}
          />

          <SingleTimePicker
            label=""
            value={contactTime}
            onChange={handleContactTimeChange}
            minTime={currentTime}
          />
        </div>

        <PrimaryButton
          buttonText="Submit"
          width="10rem"
          buttonFunction={handleCustomSubmit}
          isButtonIconRequired={false}
          disabled={disableSubmitButton}
        />
      </div>
    </div>
  );
}
