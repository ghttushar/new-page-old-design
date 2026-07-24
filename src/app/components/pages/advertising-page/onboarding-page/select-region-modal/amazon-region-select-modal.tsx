import { confirmationBoxStyles } from '@/app/components/common/confirmation-box/confirmation-box-styles';

import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import SearchableDropdown from '@/app/components/common/dropdown/searchable-dropdown';
import PrimaryLoadingButton from '@/app/components/common/primary-button/primary-loading-button';
import { Dialog, DialogContentText, DialogTitle } from '@mui/material';
import { XIcon } from '@phosphor-icons/react';
import { useRef } from 'react';
import styles from './select-region-modal.module.scss';

interface ISelectSPRegionModalProps {
  title: string;
  openConfirmation: boolean;
  options: IDropdownItem<string>[];
  handleConfirmationClose: () => void;
  selectedRegion: IDropdownItem<string>;
  onSelect: (option: IDropdownItem<string>) => void;
  onClick: () => void;
  isLoading: boolean;
}

export default function SelectAmazonRegionModal({
  title,
  openConfirmation,
  options,
  handleConfirmationClose,
  selectedRegion,
  onClick,
  onSelect,
  isLoading,
}: ISelectSPRegionModalProps) {
  const modalPopupRef = useRef<HTMLDivElement | null>(null);

  return (
    <Dialog
      ref={modalPopupRef}
      open={openConfirmation}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      className={styles.confirmationContainer}
      sx={{
        ...confirmationBoxStyles,
        '& .MuiDialog-paper': {
          padding: '1.6rem 2rem',
        },
      }}
    >
      <DialogTitle id="confirmation-title" className={styles.confirmationTitle}>
        {title}
        <XIcon
          size={'2rem'}
          style={{ cursor: 'pointer' }}
          onClick={handleConfirmationClose}
        />
      </DialogTitle>
      <DialogContentText
        id="confirmation-description"
        className={styles.confirmationDescription}
      >
        <SearchableDropdown
          options={options}
          label={''}
          selected={selectedRegion}
          onSelect={onSelect}
          showImg={true}
        />
        <span className="flex justify-end">
          <PrimaryLoadingButton
            buttonText={'Continue'}
            buttonFunction={onClick}
            width="7rem"
            height="3rem"
            disabled={false}
            isLoading={isLoading}
          />
        </span>
      </DialogContentText>
    </Dialog>
  );
}
