import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { UploadIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingNavTab } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectEditAccessFilters } from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import TextButton from '../../text-button/text-button';
import BulkUploadPopup from './bulk-upload-popup';

interface IBulkUploadActionProps extends IEditBulkActionProp {
  marketplace: string;
  exportData: unknown[];
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  filename: string;
  title: string;
}

export default function BulkUploadAction({
  setTableData,
  marketplace,
  exportData,
  handleDownload,
  filename,
  title,
}: IBulkUploadActionProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);

  const isEditActive =
    editAccessFilters.editAccess.value === EditAccessValues.Edit;

  const handleClick = () => {
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <TextButton
        label="Bulk Edit Upload"
        handleClick={handleClick}
        isVisible={true}
        buttonStartIcon={
          <UploadIcon size={16} color="#77469B" weight="bold" />
        }
        customStyles={{ fontSize: '1rem' }}
        isDisabled={!isEditActive}
        disableReason={
          !isEditActive ? 'Switch to Edit mode to use bulk upload' : ''
        }
        isNewDesign={true}
      />

      {isPopupOpen && (
        <BulkUploadPopup
          isOpen={isPopupOpen}
          onClose={handleClose}
          exportData={exportData}
          handleDownload={handleDownload}
          filename={filename}
          title={title}
          marketplace={marketplace}
        />
      )}
    </>
  );
}
