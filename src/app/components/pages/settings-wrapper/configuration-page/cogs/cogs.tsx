import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import UploadFileInfo from '@/app/components/common/upload-file/upload-file-info';
import RuleCriteriaInfo from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-criteria-info/rule-criteria-info';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { COGS_DOWNLOAD_TEMPLATE } from '@/constants';
import {
  COGS_MAXIMUM_FILE_SIZE,
  UPLOAD_COGS_INVALIDATE_QUERIES,
} from '@/constants/catalog/catalog.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { invalidateQueries, useAppMutation } from '@/redux/react-query-hooks';
import { selectCatalogAccount } from '@/redux/slices/auth/auth.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { amazonCatalogService } from '@/services/catalog/amazon/amazon-catalog.service';
import { walmartCatalogService } from '@/services/catalog/walmart/walmart-catalog.service';
import { profitabilityHomeService } from '@/services/profitability/profitability-home.service';
import { getCSVDownload } from '@/utils';
import { Box, Typography } from '@mui/material';
import { CloudArrowUpIcon, FloppyDiskIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import Dropzone from 'react-dropzone';
import styles from './cogs.module.scss';

export default function ConfigurationCogs() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const catalogAccount = useAppSelector(selectCatalogAccount);

  const catalogMarketplace = useMemo(
    () =>
      (catalogAccount.marketplace as MarketplaceEnum) ?? MarketplaceEnum.AMAZON,
    [catalogAccount.marketplace]
  );

  const { mutateAsync: uploadCOGSFile, isPending: isUploadPending } =
    useAppMutation({
      mutationFn: async (file: File) => {
        return catalogMarketplace === MarketplaceEnum.WALMART
          ? await walmartCatalogService.uploadBulkCogsData(file)
          : await amazonCatalogService.bulkUploadCOGS(file);
      },
      options: {
        onSuccess: (data) => {
          invalidateQueries(queryClient, UPLOAD_COGS_INVALIDATE_QUERIES);
          dispatch(
            showSuccessToastMessage({
              title: data?.data.message ?? 'COGS uploaded successfully',
              description: data?.data.description,
            })
          );
          setUploadedFile(null);
        },
        onError: () => {
          dispatch(
            showErrorToastMessage({
              title: 'COGS upload failed',
            })
          );
        },
      },
    });

  const handleCOGSUpload = async () => {
    if (uploadedFile) {
      await uploadCOGSFile(uploadedFile);
    }
  };

  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    if (file.size === 0) {
      dispatch(
        showErrorToastMessage({
          title: 'Empty File',
          description: 'File size should be greater than 0 MB',
        })
      );
    } else if (file.size > COGS_MAXIMUM_FILE_SIZE) {
      dispatch(
        showErrorToastMessage({
          title: 'File Size Exceeded',
          description: 'File size should be less than 10 MB',
        })
      );
    } else {
      setUploadedFile(file);
    }
  };

  const handleDownload = useCallback(async () => {
    dispatch(
      showSuccessToastMessage({
        title: 'Download Started',
        description: 'This may take a few seconds.',
      })
    );

    const data = await (catalogMarketplace === MarketplaceEnum.AMAZON
      ? amazonCatalogService.downloadCOGSFile()
      : profitabilityHomeService.getAllProductData());

    const exportData = data.data.data as unknown as Record<string, unknown>[];
    const filename = `${catalogAccount.label}-${catalogMarketplace}-cogs-file`;

    getCSVDownload(
      exportData,
      filename,
      COGS_DOWNLOAD_TEMPLATE,
      undefined,
      false,
      '',
      false
    );

    return exportData;
  }, [dispatch, catalogMarketplace, catalogAccount.label]);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    await handleDownload();
  };

  return (
    <div className={styles.container}>
      {isUploadPending && (
        <CustomEditLoader overlayText="Uploading COGS Data" />
      )}

      <div className={styles.controlsRow}>
        <div className={styles.pageStepTitle}>COGs Configuration</div>
      </div>
      <RuleCriteriaInfo
        title="Strategic Business Intent:"
        description="This goal helps align advertising decisions with your broader profitability objectives, ensuring optimization goes beyond just ROAS and revenue metrics."
        inline={true}
      />

      <div className={styles.uploadContainer}>
        <div className={styles.uploadFormCard}>
          <div className={styles.uploadLabel}>Upload COGs Data</div>

          <div className={styles.dropZoneWrapper}>
            <Dropzone
              accept={{
                'text/csv': ['.csv'],
              }}
              multiple={false}
              onDrop={handleFileDrop}
            >
              {({ getRootProps, getInputProps }) => (
                <Box {...getRootProps()} className={styles.dropZone}>
                  <input {...getInputProps()} />
                  {uploadedFile ? (
                    <UploadFileInfo uploadedFile={uploadedFile} />
                  ) : (
                    <div className={styles.dropZoneContent}>
                      <CloudArrowUpIcon size={32} color="#A1A1A1" />
                      <Typography className={styles.dropZoneText}>
                        Drag and drop or{' '}
                        <span className={styles.highlightText}>
                          attach .csv
                        </span>{' '}
                        file
                      </Typography>
                      <Typography className={styles.dropZoneSubtext}>
                        XLSX format | 10 MB max
                      </Typography>
                    </div>
                  )}
                </Box>
              )}
            </Dropzone>
          </div>

          <div className={styles.footerSection}>
            <Typography className={styles.bulkUploadText}>
              For bulk upload{' '}
              <div className={styles.templateRow}>
                <button onClick={handleClick} className={styles.templateButton}>
                  Download Template
                </button>
                <span>&nbsp;for bulk COGs upload</span>
              </div>
            </Typography>
          </div>
        </div>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.bottomControls}>
          <PrimaryButton
            buttonText="Save COGS Config."
            buttonFunction={handleCOGSUpload}
            disabled={!uploadedFile || isUploadPending}
            height="3.2rem"
            width="18rem"
            fontSize="1.1rem"
            isNewDesign={true}
            isButtonIconRequired={true}
            buttonIcon={<FloppyDiskIcon size={20} />}
          />
        </div>
      </div>
    </div>
  );
}
