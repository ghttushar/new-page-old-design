import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React, { useState } from 'react';
import { AntSwitch } from '../../common/ant-switch/ant-switch';
import ConfirmationBox from '../../common/confirmation-box/confirmation-box';

interface IToggleSwitchProps {
  isChecked: boolean;
  handleChange: (value: boolean) => void;
  customProps?: SxProps<Theme>;
  isConfirmationRequired: boolean;
  confirmationBoxTitle?: string;
  confirmationBoxDescription?: string;
  confirmButtonText?: string;
}

export default function ToggleSwitch({
  isChecked,
  handleChange,
  customProps,
  isConfirmationRequired,
  confirmationBoxTitle,
  confirmationBoxDescription,
  confirmButtonText,
}: IToggleSwitchProps) {
  const [isValueChecked, setIsValueChecked] = useState<boolean>(isChecked);
  const [openUpdateConfirmation, setOpenUpdateConfirmation] =
    useState<boolean>(false);

  const handleConfirmationClose = () => {
    setOpenUpdateConfirmation(false);
    return;
  };

  const handleConfirm = () => {
    setIsValueChecked(!isValueChecked);
    handleChange(!isValueChecked);
    handleConfirmationClose();
  };

  const handleOnChange = () => {
    if (isConfirmationRequired) {
      setOpenUpdateConfirmation(!openUpdateConfirmation);
    } else {
      handleConfirm();
    }
  };

  return (
    <React.Fragment>
      <AntSwitch
        checked={isValueChecked}
        onChange={handleOnChange}
        inputProps={{ 'aria-label': 'ant design' }}
        sx={{ '&:hover': { cursor: 'not-allowed' }, ...customProps }}
      />

      {isConfirmationRequired === true && openUpdateConfirmation === true && (
        <ConfirmationBox
          title={confirmationBoxTitle ? confirmationBoxTitle : 'Dummy title?'}
          description={
            confirmationBoxDescription
              ? confirmationBoxDescription
              : 'Dummy description'
          }
          openConfirmation={openUpdateConfirmation}
          handleConfirmationClose={handleConfirmationClose}
          handleConfirmClick={handleConfirm}
          confirmButtonText={confirmButtonText ? confirmButtonText : 'Confirm'}
          isConfirmButtonRequired={true}
        />
      )}
    </React.Fragment>
  );
}
