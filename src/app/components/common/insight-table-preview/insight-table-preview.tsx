import { useAppQuery } from '@/redux/react-query-hooks';
import chatbotServices from '@/services/bidder/llm-chatbot/chatbot.service';
import { checkIsNull, getComparisonDetails } from '@/utils/advertising.utils';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { XIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import GenericTable from '../../shared/custom-table-wrapper/custom-table/generic-table';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import ConfirmationBox from '../confirmation-box/confirmation-box';
import GraphHoverClick from '../graph-hover-click/graph-hover-click';
import PrimaryButton from '../primary-button/primary-button';
import styles from './insight-table-preview.module.scss';

interface InsightTablePreviewProps {
  s3Link?: string;
  frontendS3Link?: string;
  data?: any[];
  isChatbotExpanded: boolean;
  isCompact?: boolean;
  maxPreviewRows?: number;
  maxPreviewColumns?: number;
  hasActions?: boolean;
  hasCheckboxes?: boolean;
  isLocked?: boolean;
  isLoading?: boolean;
  onSave?: (tableData: any[]) => void;
  onDiscard?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  title?: string;
}

const InsightTablePreview: React.FC<InsightTablePreviewProps> = ({
  s3Link,
  frontendS3Link,
  data,
  isChatbotExpanded,
  isCompact = false,
  maxPreviewRows = 2,
  maxPreviewColumns,
  hasActions = true,
  hasCheckboxes,
  isLocked = false,
  isLoading: isLoadingProp,
  onSave,
  onDiscard,
  onExpand,
  onClose,
  title,
}) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [originalTableData, setOriginalTableData] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const dataSource = frontendS3Link || s3Link;
  const shouldFetchData = !data && !!dataSource;

  const {
    data: response,
    isRefetching,
    isLoading: isDownloading,
  } = useAppQuery({
    queryFn: () =>
      chatbotServices.postGetDownloadCSVData({ csv_url: dataSource ?? '' }),
    queryKey: [dataSource],
    enabled: shouldFetchData && checkIsNull(dataSource) === false,
    options: {
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
      setOriginalTableData([...data]);
    } else if (response?.data.data) {
      const fetchedData = response.data.data || [];

      setTableData(fetchedData);
      setOriginalTableData([...fetchedData]);
    }
  }, [data, response?.data.data]);

  const isLoading = useMemo(
    () => isLoadingProp ?? (isDownloading === true || isRefetching === true),
    [isLoadingProp, isDownloading, isRefetching]
  );

  const toggleExpanded = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded((prev) => !prev);
    if (onExpand && !isExpanded) {
      onExpand();
    }
  };

  const handleCloseRequest = (e?: any, reason?: string) => {
    if (e) e.stopPropagation();
    if (getComparisonDetails(tableData, originalTableData).size > 0) {
      setIsConfirmOpen(true);
    } else {
      setTableData([...originalTableData]);
      toggleExpanded();
      if (onClose) {
        onClose();
      }
    }
  };

  const handleDiscardAndClose = () => {
    setTableData([...originalTableData]);
    if (onDiscard) {
      onDiscard();
    }
    setIsConfirmOpen(false);
    setIsExpanded(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmOpen(false);
  };

  const handleSaveAndClose = () => {
    setOriginalTableData([...tableData]);

    if (onSave) {
      onSave(tableData);
    }
    setIsExpanded(false);
    if (onClose) {
      onClose();
    }
  };

  const hasSelectionColumn = useMemo(() => {
    if (hasCheckboxes !== undefined) return hasCheckboxes;
    return tableData.length > 0 && 'isSelected' in tableData[0];
  }, [hasCheckboxes, tableData]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className={styles.insightTableWrapper} onClick={toggleExpanded}>
        <span style={{ position: 'relative' }}>
          <GraphHoverClick />
          <GenericTable
            data={tableData}
            isLoading={isLoading}
            maxColumns={
              maxPreviewColumns ||
              (!isChatbotExpanded && !isCompact ? 2 : undefined)
            }
            hasCheckboxes={hasSelectionColumn}
            isDisabled={isLocked}
            maxRows={maxPreviewRows}
            isCompact={isCompact}
            setTableData={setTableData}
          />
        </span>
      </div>
      <Dialog
        open={isExpanded}
        onClose={handleCloseRequest}
        maxWidth="lg"
        sx={{
          '& .MuiDialog-paper': {
            minWidth: '50rem',
            padding: '0',
            borderRadius: '0.4rem',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0.5rem 0.5rem 2rem',
            fontSize: '1.4rem',
            fontWeight: 'bold',
          }}
        >
          <span>{title ?? 'Insight Data'}</span>
          <IconButton onClick={handleCloseRequest}>
            <XIcon size={'2rem'} />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '0rem 1.8rem 1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '10rem',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <GenericTable
            data={tableData}
            isLoading={isLoading}
            setTableData={setTableData}
            hasCheckboxes={hasSelectionColumn}
            isDisabled={isLocked}
          />
        </DialogContent>
        {hasActions && onSave && !isLocked && (
          <DialogActions className={styles.dialogActions}>
            <AltPrimaryButton
              buttonText="Discard"
              buttonFunction={handleCloseRequest}
              disabled={
                getComparisonDetails(tableData, originalTableData).size === 0
              }
              height="2.5rem"
              fontSize="0.9rem"
              stopPropagation={true}
            />
            <PrimaryButton
              buttonText="Save"
              buttonFunction={handleSaveAndClose}
              disabled={
                getComparisonDetails(tableData, originalTableData).size === 0
              }
              height="2.5rem"
              fontSize="0.9rem"
            />
          </DialogActions>
        )}
      </Dialog>

      <ConfirmationBox
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to discard?"
        openConfirmation={isConfirmOpen}
        handleConfirmationClose={handleCancelConfirmation}
        handleConfirmClick={handleDiscardAndClose}
        confirmButtonText="Yes"
        isConfirmButtonRequired={true}
        cancelButtonText="No"
      />
    </div>
  );
};

export default InsightTablePreview;
