import { COGS_DOWNLOAD_TEMPLATE } from '@/constants';
import { lottieFiles } from '@/constants/assets/lotties.utils';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IUploadCogsResult } from '@/interfaces/advertising/advertising.interface';
import { invalidateQueries, useAppMutation } from '@/redux/react-query-hooks';
import {
  selectAdvertisingAccount,
  selectCatalogAccount,
} from '@/redux/slices/auth/auth.slice';
import { amazonCatalogService } from '@/services/catalog/amazon/amazon-catalog.service';
import { walmartCatalogService } from '@/services/catalog/walmart/walmart-catalog.service';
import { profitabilityHomeService } from '@/services/profitability/profitability-home.service';
import {
  getCSVDownload,
  parseNum,
  removeKeysFromArrayOfObjects,
} from '@/utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { Box, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UploadIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { GlobalDataTestIds } from 'cypress/enums/global';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Dropzone, { DropEvent, FileRejection } from 'react-dropzone';
import {
  COGS_MAXIMUM_FILE_SIZE,
  UPLOAD_COGS_INVALIDATE_QUERIES,
} from 'src/constants/catalog/catalog.constants';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import GenericTable from '../../shared/custom-table-wrapper/custom-table/generic-table';
import InfoIcon from '../info-icon/info-icon';
import BaseLottieAnimation from '../loader/base-lottie-animation';
import PrimaryLoadingButton from '../primary-button/primary-loading-button';
import ConflictPopup from '../rule-conflict-popup/rule-conflict-popup';
import SecondaryButton from '../secondary-button/secondary-button';
import UploadFileInfo from './upload-file-info';
import { uploadBoxStyles, uploadFileStyles } from './upload-file-styles';
import styles from './upload-file.module.scss';
interface IUploadBoxProps {
  title: string;
  openUploadModal: boolean;
  handleUploadClose: () => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

export default function UploadFile({
  uploadedFile,
  setUploadedFile,
  title,
  openUploadModal,
  handleUploadClose,
}: IUploadBoxProps) {
  const handleCancel = () => {
    handleUploadClose();
    setUploadedFile(null);
  };
  const dropzoneRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const catalogAccount = useAppSelector(selectCatalogAccount);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const [cogsUploadErr, setCogsUploadErr] = useState<IUploadCogsResult | null>(
    null
  );
  const [isConflictOpen, setIsConflictOpen] = useState(false);

  const catalogMarketplace = useMemo(
    () => catalogAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [catalogAccount.marketplace]
  );

  const handleDialogClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const {
    mutateAsync: uploadCOGSFile,
    isPending: isUploadPending,
    isIdle: isUploadIdle,
  } = useAppMutation({
    mutationFn: async (file: File) => {
      return catalogMarketplace === MarketplaceEnum.WALMART
        ? await walmartCatalogService.uploadBulkCogsData(file)
        : await amazonCatalogService.bulkUploadCOGS(file);
    },
    options: {
      onError: (data) => {
        dispatch(
          showErrorToastMessage({
            title: 'COGS upload failed',
          })
        );
      },

      onSettled(data, error, variables, context) {
        const response = data?.data.data;
        if (parseNum(response?.unsuccessfulRecords) === 0) {
          invalidateQueries(queryClient, UPLOAD_COGS_INVALIDATE_QUERIES);
          handleUploadClose();
          setUploadedFile(null);
        } else if (response?.errors && response.errors.length > 0) {
          setCogsUploadErr(response);
          setIsConflictOpen(true);
        }
      },
    },
  });

  const isLoading = useMemo(
    () => isUploadIdle === false && isUploadPending === true,
    [isUploadIdle, isUploadPending]
  );

  const handleCOGSUploadFile = async () => {
    if (uploadedFile) await uploadCOGSFile(uploadedFile);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    const data = await (catalogMarketplace === MarketplaceEnum.AMAZON
      ? amazonCatalogService.downloadCOGSFile()
      : profitabilityHomeService.getAllProductData());

    const exportData = data.data.data as unknown as Record<string, unknown>[];
    const formattedData =
      catalogMarketplace === MarketplaceEnum.AMAZON
        ? exportData
        : removeKeysFromArrayOfObjects(exportData, [
            'primaryImageUrl',
            'partnerId',
          ]);
    const filename = `${advertisingAccount.label}-${advertisingAccount.marketplace}-cogs-file`;

    getCSVDownload(
      formattedData,
      filename,
      COGS_DOWNLOAD_TEMPLATE,
      undefined,
      false,
      '',
      false
    );

    return exportData;
  }, [catalogMarketplace, advertisingAccount]);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    dispatch(
      showSuccessToastMessage({
        title: 'Download Started',
        description: 'This may take a few seconds.',
      })
    );
    setIsDownloading(true);
    e.stopPropagation();
    await handleDownload();
    dispatch(
      showSuccessToastMessage({
        title: 'Downloaded Successfully',
        description: 'Data downloaded successfully.',
      })
    );
    setIsDownloading(false);
  };

  const handleDrop = <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    try {
      if (acceptedFiles[0].size === 0)
        dispatch(
          showErrorToastMessage({
            title: 'Empty File',
            description: 'File size should be greater than 0 MB',
          })
        );
      else if (acceptedFiles[0].size > COGS_MAXIMUM_FILE_SIZE)
        dispatch(
          showErrorToastMessage({
            title: 'File Size Exceeded',
            description: 'File size should be less than 10 MB',
          })
        );
      else setUploadedFile(acceptedFiles[0]);
    } catch (err) {
      dispatch(
        showErrorToastMessage({
          title: 'Wrong File Type',
          description: 'Only CSV files are allowed',
        })
      );
    }
  };

  const handleClearAndUpload = () => {
    setUploadedFile(null);
    if (dropzoneRef.current) dropzoneRef.current.open();
  };

  const formattedErr = useMemo(
    () =>
      cogsUploadErr === null
        ? []
        : profitabilityUtils.getFormattedCogsErrResponse(
            cogsUploadErr.errors,
            advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON
          ),
    [advertisingAccount.marketplace, cogsUploadErr]
  );

  return (
    <Dialog
      onClick={handleDialogClick}
      open={openUploadModal}
      onClose={handleCancel}
      aria-labelledby="upload-title"
      className={styles.uploadContainer}
      sx={uploadBoxStyles(
        isLoading ||
          (cogsUploadErr !== null && cogsUploadErr.unsuccessfulRecords > 0)
      )}
      data-test={GlobalDataTestIds.UPLOAD_FILE_DIALOG}
    >
      {cogsUploadErr && cogsUploadErr?.unsuccessfulRecords > 0 ? (
        <ConflictPopup
          isOpen={isConflictOpen}
          handlePopupClose={function (): void {
            throw new Error('Function not implemented.');
          }}
          handleConfirm={() => {
            getCSVDownload(
              formattedErr,
              `${advertisingAccount.label}-${advertisingAccount.marketplace}-cogs-error-file`,
              ''
            );
          }}
          confirmButtonText="Download CSV Report"
          handleCancel={() => {
            if (cogsUploadErr?.successfulRecords !== 0)
              invalidateQueries(queryClient, UPLOAD_COGS_INVALIDATE_QUERIES);
            handleCancel();
          }}
          isLoading={false}
          title="Bulk COGs Upload Summary"
          isNewDesign={true}
        >
          <span>
            <b>
              {cogsUploadErr.unsuccessfulRecords +
                cogsUploadErr.successfulRecords}{' '}
              COGs rows
            </b>
            &nbsp;has been processed.
            <b>
              {cogsUploadErr.successfulRecords} COGs are successfully processed
            </b>{' '}
            and <b>{cogsUploadErr.unsuccessfulRecords} conflicts </b>has been
            found which are shown below.
          </span>
          <GenericTable data={formattedErr} isCompact />
        </ConflictPopup>
      ) : isLoading === true ? (
        <div className={styles.loadingState}>
          <BaseLottieAnimation
            lottieFile={lottieFiles.checkProgress}
            className={styles.loadingAnimation}
            lottieOptions={{ loop: true, autoplay: true }}
          />
          <span className={styles.loadingMessage}>
            COGs Uploaded data is being auditing for conflicts.
            <br />
            Please wait for few seconds.
          </span>
          <span className={styles.loadingNote}>
            <b>Note:</b> Do not switch page or close tab or the data will get
            lost.
          </span>
        </div>
      ) : (
        <React.Fragment>
          <DialogTitle id="upload-title" className={styles.uploadTitle}>
            {title}
            <InfoIcon
              position={TooltipPlacement.Right}
              title={
                'You can only upload COGs in Bulk. To upload product level COGs, click on “COGs” in product table.'
              }
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="upload-description"
              className={styles.uploadDescription}
            >
              <Box className={styles.bulkUploadContainer}>
                <Dropzone
                  accept={{
                    'text/csv': ['.csv'],
                  }}
                  ref={dropzoneRef}
                  multiple={false}
                  onDrop={handleDrop}
                  disabled={false}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      className={`${styles.bulkUploadBox} ${
                        uploadedFile === null
                          ? ''
                          : styles.bulkUploadBoxWithFile
                      }`}
                    >
                      <input {...getInputProps()} />
                      {uploadedFile === null ? (
                        <div className={styles.emptyUploadState}>
                          <div className={styles.uploadIconWrapper}>
                            <UploadIcon size={'3.2rem'} color="#A1A1A1" />
                          </div>
                          <div className={styles.templateRow}>
                            <button
                              onClick={handleClick}
                              disabled={isDownloading}
                              className={styles.templateButton}
                            >
                              Download Template
                            </button>
                            <span>&nbsp;for bulk COGs upload</span>
                          </div>
                          <Typography
                            variant="caption"
                            className={styles.uploadMetaText}
                          >
                            <br />
                            CSV format | 10 MB max
                          </Typography>
                        </div>
                      ) : (
                        <UploadFileInfo uploadedFile={uploadedFile} />
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={uploadFileStyles}>
            <SecondaryButton
              buttonText={'Clear & Upload again'}
              buttonFunction={handleClearAndUpload}
              disabled={uploadedFile === null}
              width="auto"
            />
            <div className={styles.actionsGroup}>
              <SecondaryButton
                buttonText={'Cancel'}
                buttonFunction={handleCancel}
                disabled={false}
                width="auto"
              />

              <PrimaryLoadingButton
                buttonText={'Upload Bulk COGs'}
                buttonFunction={handleCOGSUploadFile}
                disabled={uploadedFile === null}
                isLoading={isLoading}
                width="auto"
              />
            </div>
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
}
