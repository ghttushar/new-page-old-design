import { getCSVDownload } from '@/utils';
import {
  CaretDownIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useMemo, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AltPrimaryButton from '../../alt-primary-button/alt-primary-button';
import PrimaryButton from '../../primary-button/primary-button';
import SecondaryButton from '../../secondary-button/secondary-button';
import styles from './bulk-upload-popup.module.scss';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ROWS = 25000;

type FileStatus = 'validating' | 'failed' | 'validated' | 'uploading' | 'uploaded';

interface UploadItem {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  errors: string[];
  rows?: number;
}

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

function makeId(): string {
  return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

// A handful of pre-populated rows so every state (validating, failed, validated)
// is visible together without needing to upload three separate files first.
const DEMO_SEED: UploadItem[] = [
  { id: 'demo-progress', name: 'bid_adjustments_oct.csv', size: 84_200, status: 'validating', errors: [] },
  {
    id: 'demo-failed',
    name: 'sku_mapping_update.csv',
    size: 132_500,
    status: 'failed',
    errors: [
      "Row 14: Missing required column 'campaignId'",
      "Row 88: Budget value '—' is not numeric",
      "Row 145: Bid exceeds the ₹500 account cap",
      "Row 203: Duplicate SKU 'B08P4X2Z1'",
    ],
  },
  { id: 'demo-success', name: 'campaign_budgets_q3.csv', size: 61_000, status: 'validated', errors: [], rows: 1204 },
];

async function readValidationErrors(file: File): Promise<{ errors: string[]; rows: number }> {
  const errors: string[] = [];

  if (!file.name.toLowerCase().endsWith('.csv')) {
    errors.push('File type not supported — only .csv files are accepted');
    return { errors, rows: 0 };
  }
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File is ${formatFileSize(file.size)} — the limit is ${formatFileSize(MAX_FILE_SIZE)}`);
    return { errors, rows: 0 };
  }

  const text = await file.text();
  const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
  const rows = Math.max(lines.length - 1, 0);

  if (lines.length === 0) {
    errors.push('File is empty — no header row found');
  } else if (rows === 0) {
    errors.push('File has a header row but no data rows');
  } else if (rows > MAX_ROWS) {
    errors.push(`File has ${rows.toLocaleString()} rows — the limit is ${MAX_ROWS.toLocaleString()} per file`);
  }

  return { errors, rows };
}

const STATUS_META: Record<FileStatus, { label: string; color: string; bg: string }> = {
  validating: { label: 'Validating…', color: '#77469b', bg: '#f3eefa' },
  uploading: { label: 'Uploading…', color: '#77469b', bg: '#f3eefa' },
  failed: { label: 'Failed', color: '#b3453f', bg: '#fbebea' },
  validated: { label: 'Validated', color: '#3f7d6a', bg: '#eaf5f1' },
  uploaded: { label: 'Uploaded', color: '#3f7d6a', bg: '#eaf5f1' },
};

function StatusIcon({ status }: { status: FileStatus }) {
  if (status === 'failed') return <WarningCircleIcon size={18} weight="fill" color="#b3453f" />;
  if (status === 'validated' || status === 'uploaded') return <CheckCircleIcon size={18} weight="fill" color="#3f7d6a" />;
  return <FileCsvIcon size={18} weight="fill" color="#77469b" />;
}

export default function BulkUploadPopup({
  isOpen,
  onClose,
  exportData,
  handleDownload,
  filename,
  title,
}: IBulkUploadPopupProps) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<UploadItem[]>(DEMO_SEED);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isDragActive, setIsDragActive] = useState(false);
  const busyRef = useRef(false);

  const validatedCount = useMemo(() => items.filter((i) => i.status === 'validated').length, [items]);
  const isBusy = items.some((i) => i.status === 'uploading') || busyRef.current;

  const handleCancel = () => {
    setItems(DEMO_SEED);
    onClose();
  };

  const handleDownloadAll = useCallback(async () => {
    const data = exportData.length ? exportData : await handleDownload(true);
    getCSVDownload(data, filename, title, undefined, false, '', false);
  }, [exportData, handleDownload, filename, title]);

  const handleDownloadWithFilters = useCallback(async () => {
    const data = exportData.length ? exportData : await handleDownload(false);
    getCSVDownload(data, filename, title, undefined, false, '', false);
  }, [exportData, handleDownload, filename, title]);

  const runValidation = useCallback((id: string, file: File) => {
    readValidationErrors(file).then(({ errors, rows }) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, status: errors.length ? 'failed' : 'validated', errors, rows } : it
        )
      );
    });
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragActive(false);
      if (acceptedFiles.length === 0) return;

      const newItems: UploadItem[] = acceptedFiles.map((file) => ({
        id: makeId(),
        name: file.name,
        size: file.size,
        status: 'validating',
        errors: [],
      }));
      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item, i) => runValidation(item.id, acceptedFiles[i]));
    },
    [runValidation]
  );

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleUploadAll = () => {
    const readyIds = items.filter((i) => i.status === 'validated').map((i) => i.id);
    if (readyIds.length === 0) return;

    busyRef.current = true;
    setItems((prev) => prev.map((i) => (readyIds.includes(i.id) ? { ...i, status: 'uploading' } : i)));

    readyIds.forEach((id, i) => {
      window.setTimeout(() => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'uploaded' } : it)));
        if (i === readyIds.length - 1) {
          busyRef.current = false;
          dispatch(
            showSuccessToastMessage({
              title: 'Upload complete',
              description: `${readyIds.length} file${readyIds.length === 1 ? '' : 's'} submitted for processing.`,
            })
          );
        }
      }, 900 + i * 500);
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      sx={{ '& .MuiDialog-paper': { minHeight: '70vh', borderRadius: '1.6rem' } }}
      className={styles.popupContainer}
    >
      <DialogTitle className={styles.dialogTitle}>
        <div>
          <span className={styles.titleText}>Bulk edit file upload</span>
          <span className={styles.subtitleText}>Download, edit, then re-upload — every file is validated before it's applied.</span>
        </div>
        <button className={styles.closeButton} onClick={handleCancel}>
          <XIcon size={20} weight="bold" />
        </button>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <div className={styles.downloadSection}>
          <span className={styles.downloadLabel}>Download data</span>
          <div className={styles.downloadButtons}>
            <SecondaryButton
              buttonText="Download All"
              buttonFunction={handleDownloadAll}
              isButtonIconRequired={true}
              buttonIcon={<DownloadSimpleIcon size={16} weight="bold" />}
              height="3rem"
              disabled={false}
            />
            <SecondaryButton
              buttonText="Download with Filters"
              buttonFunction={handleDownloadWithFilters}
              isButtonIconRequired={true}
              buttonIcon={<DownloadSimpleIcon size={16} weight="bold" />}
              height="3rem"
              disabled={false}
            />
          </div>
        </div>

        <Dropzone accept={{ 'text/csv': ['.csv'] }} multiple onDrop={handleDrop} onDragEnter={() => setIsDragActive(true)} onDragLeave={() => setIsDragActive(false)}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className={`${styles.uploadArea} ${isDragActive ? styles.uploadAreaActive : ''}`}>
              <input {...getInputProps()} />
              <span className={styles.uploadIconWrap}>
                <UploadSimpleIcon size={22} weight="bold" />
              </span>
              <p className={styles.uploadText}>
                Drag and drop CSV files here, or <span className={styles.uploadLink}>browse</span>
              </p>
              <span className={styles.uploadHint}>CSV only · max 10 MB · up to 25,000 rows per file</span>
            </div>
          )}
        </Dropzone>

        {items.length > 0 && (
          <div className={styles.fileList}>
            {items.map((item) => {
              const meta = STATUS_META[item.status];
              const isBar = item.status === 'validating' || item.status === 'uploading';
              const showAllErrors = expanded.has(item.id);
              const visibleErrors = showAllErrors ? item.errors : item.errors.slice(0, 3);

              return (
                <div key={item.id} className={styles.fileItem} data-status={item.status}>
                  <div className={styles.fileItemMain}>
                    <span className={styles.fileIconWrap}>
                      <StatusIcon status={item.status} />
                    </span>
                    <div className={styles.fileMeta}>
                      <span className={styles.fileNameText}>{item.name}</span>
                      <span className={styles.fileSubText}>
                        {formatFileSize(item.size)}
                        {typeof item.rows === 'number' ? ` · ${item.rows.toLocaleString()} rows` : ''}
                      </span>
                    </div>
                    <span className={styles.statusPill} style={{ color: meta.color, background: meta.bg }}>
                      {meta.label}
                    </span>
                    {item.status !== 'uploading' && (
                      <button className={styles.removeFile} onClick={() => handleRemove(item.id)} aria-label="Remove file">
                        <XIcon size={14} weight="bold" />
                      </button>
                    )}
                  </div>

                  {isBar && (
                    <div className={styles.linearTrack}>
                      <div className={styles.linearFill} />
                    </div>
                  )}

                  {item.status === 'failed' && (
                    <div className={styles.errorBox}>
                      <div className={styles.errorHeader}>
                        {item.errors.length} issue{item.errors.length === 1 ? '' : 's'} found
                      </div>
                      <ul className={styles.errorList}>
                        {visibleErrors.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                      {item.errors.length > 3 && (
                        <button className={styles.errorToggle} onClick={() => toggleExpanded(item.id)}>
                          {showAllErrors ? 'Show less' : `Show all ${item.errors.length} issues`}
                          <CaretDownIcon size={11} weight="bold" className={showAllErrors ? styles.caretUp : ''} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>

      <div className={styles.dialogActions}>
        {validatedCount > 0 && (
          <span className={styles.readyCount}>
            {validatedCount} file{validatedCount === 1 ? '' : 's'} ready to upload
          </span>
        )}
        <AltPrimaryButton buttonText="Cancel" buttonFunction={handleCancel} width="auto" height="3rem" disabled={isBusy} isNewDesign={true} />
        <PrimaryButton
          buttonText={isBusy ? 'Uploading…' : 'Upload'}
          buttonFunction={handleUploadAll}
          width="auto"
          height="3rem"
          disabled={validatedCount === 0 || isBusy}
          isButtonIconRequired={false}
        />
      </div>
    </Dialog>
  );
}
