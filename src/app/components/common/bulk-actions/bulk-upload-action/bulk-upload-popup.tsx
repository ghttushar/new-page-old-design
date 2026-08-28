import { MarketplaceEnum } from '@/enums/serp.enums';
import { getCSVDownload } from '@/utils';
import {
  CheckCircleIcon,
  FileCsvIcon,
  UploadIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useCallback, useRef, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { useAppDispatch } from 'src/redux/hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import AltPrimaryButton from '../../alt-primary-button/alt-primary-button';
import PrimaryButton from '../../primary-button/primary-button';
import SecondaryButton from '../../secondary-button/secondary-button';
import styles from './bulk-upload-popup.module.scss';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ROWS = 25000;

interface IBulkUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: unknown[];
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  filename: string;
  title: string;
  marketplace: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BulkUploadPopup({
  isOpen,
  onClose,
  exportData,
  handleDownload,
  filename,
  title,
  marketplace,
}: IBulkUploadPopupProps) {
  const dispatch = useAppDispatch();
  const dropzoneRef = useRef<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleCancel = () => {
    setUploadedFile(null);
    setIsUploading(false);
    onClose();
  };

  const handleDownloadAll = useCallback(async () => {
    const data = exportData.length
      ? exportData
      : await handleDownload(true);
    getCSVDownload(data, filename, title, undefined, false, '', false);
  }, [exportData, handleDownload, filename, title]);

  const handleDownloadWithFilters = useCallback(async () => {
    const data = exportData.length
      ? exportData
      : await handleDownload(false);
    getCSVDownload(data, filename, title, undefined, false, '', false);
  }, [exportData, handleDownload, filename, title]);

  const validateFile = (file: File): boolean => {
    if (!file.name.endsWith('.csv')) {
      dispatch(
        showErrorToastMessage({
          title: 'Wrong File Type',
          description: 'Only CSV files are accepted.',
        })
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      dispatch(
        showErrorToastMessage({
          title: 'File Size Exceeded',
          description: 'File size must be less than 10 MB.',
        })
      );
      return false;
    }

    return true;
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setIsDragActive(false);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (validateFile(file)) {
          setUploadedFile(file);
        }
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);

    // Simulate upload — in real implementation this would call the backend API
    // For now, dispatch toast messages based on success/failure
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // Simulate mostly success

      if (isSuccess) {
        dispatch(
          showSuccessToastMessage({
            title: 'File Received',
            description:
              "Your file has been submitted and is now processing. You'll get an email once it's done.",
          })
        );
        handleCancel();
      } else {
        dispatch(
          showErrorToastMessage({
            title: 'File Upload Failed',
            description:
              "We couldn't accept your file. Check the format, size, and row count, then try again.",
          })
        );
      }

      setIsUploading(false);
    }, 1500);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      className={styles.popupContainer}
    >
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Bulk Edit File Upload</span>
        <button className={styles.closeButton} onClick={handleCancel}>
          <XIcon size={20} weight="bold" />
        </button>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <p className={styles.description}>
          Upload a CSV file to bulk edit your campaign data. Download your
          current data first, make changes in the CSV, then upload the updated
          file.
        </p>

        <div className={styles.downloadSection}>
          <span className={styles.downloadLabel}>Download Data</span>
          <div className={styles.downloadButtons}>
            <SecondaryButton
              buttonText="Download All"
              buttonFunction={handleDownloadAll}
              isButtonIconRequired={false}
              height="3rem"
              disabled={false}
            />
            <SecondaryButton
              buttonText="Download with Filters"
              buttonFunction={handleDownloadWithFilters}
              isButtonIconRequired={false}
              height="3rem"
              disabled={false}
            />
          </div>
        </div>

        <div className={styles.disclaimer}>
          <span className={styles.disclaimerTitle}>Accepted Format</span>
          <span className={styles.disclaimerText}>
            CSV only. Max file size: 10 MB. Max rows per file: 25,000 rows
            (applies to both Amazon and Walmart uploads).
          </span>
        </div>

        {uploadedFile ? (
          <div className={styles.filePreview}>
            <FileCsvIcon size={24} color="#22c55e" weight="fill" />
            <span className={styles.fileName}>{uploadedFile.name}</span>
            <span className={styles.fileSize}>
              {formatFileSize(uploadedFile.size)}
            </span>
            <button
              className={styles.removeFile}
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              <XIcon size={16} weight="bold" />
            </button>
          </div>
        ) : (
          <Dropzone
            accept={{ 'text/csv': ['.csv'] }}
            multiple={false}
            onDrop={handleDrop}
            onDragEnter={() => setIsDragActive(true)}
            onDragLeave={() => setIsDragActive(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={`${styles.uploadArea} ${
                  isDragActive ? styles.uploadAreaActive : ''
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon size={32} className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  Drag and drop your CSV file here, or{' '}
                  <span className={styles.uploadLink}>browse</span>
                </p>
                <span className={styles.uploadHint}>
                  CSV format only, max 10 MB
                </span>
              </div>
            )}
          </Dropzone>
        )}
      </DialogContent>

      <div className={styles.dialogActions}>
        <AltPrimaryButton
          buttonText="Cancel"
          buttonFunction={handleCancel}
          width="auto"
          height="3rem"
          disabled={isUploading}
          isNewDesign={true}
        />
        <PrimaryButton
          buttonText="Upload"
          buttonFunction={handleUpload}
          width="auto"
          height="3rem"
          disabled={!uploadedFile || isUploading}
          isButtonIconRequired={false}
        />
      </div>
    </Dialog>
  );
}
