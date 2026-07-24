import ImgComponent from '@/app/components/common/img-component/img-component';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import { bidFieldStyles } from '@/app/components/page-components/edit-access-components/edit-access-bidder/edit-access-bidder-styles';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { UPLOAD_COGS_INVALIDATE_QUERIES } from '@/constants/catalog/catalog.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IAmazonCOGSUploadBody } from '@/interfaces/catalog/amazon/amazon-catalog.interface';
import { IUpdateCOGSPayload } from '@/interfaces/catalog/walmart/walmart-catalog.interface';
import { IUploadCOGSDialogProps } from '@/interfaces/profitability/profitability.interface';
import { useAppDispatch } from '@/redux/hooks';
import { invalidateQueries, useAppMutation } from '@/redux/react-query-hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { amazonCatalogService } from '@/services/catalog/amazon/amazon-catalog.service';
import { walmartCatalogService } from '@/services/catalog/walmart/walmart-catalog.service';
import {
  displayValue,
  formatNum,
  getCurrencySymbolByCountry,
  getValidNumber,
  parseNum,
} from '@/utils';
import { checkIsEqual } from '@/utils/advertising.utils';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import styles from './upload-cogs-dialog.module.scss';

function UploadCOGSDialog({
  open,
  onClose,
  imgUrl,
  name,
  sku,
  itemId,
  cogs,
  marketplace,
}: IUploadCOGSDialogProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const [updatedCOGS, setUpdatedCOGS] = useState(parseNum(cogs));

  const handleClose = () => {
    setUpdatedCOGS(parseNum(cogs));
    onClose();
  };

  const {
    mutateAsync: updateCOGSByItemId,
    isIdle,
    isPending,
  } = useAppMutation({
    mutationFn: (body: IUpdateCOGSPayload) =>
      walmartCatalogService.updateCogsDataByItemId(body),
    options: {
      onSuccess: (data) => {
        invalidateQueries(queryClient, UPLOAD_COGS_INVALIDATE_QUERIES);
        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
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

  const {
    mutateAsync: updateCOGSByAsin,
    isIdle: isAmazonCogsUploadIdle,
    isPending: isAmazonCogsUploadPending,
  } = useAppMutation({
    mutationFn: (body: IAmazonCOGSUploadBody) =>
      amazonCatalogService.updateCOGSByAsinSku(body),
    options: {
      onSuccess: (data) => {
        invalidateQueries(queryClient, UPLOAD_COGS_INVALIDATE_QUERIES);
        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
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

  const isLoading = useMemo(
    () =>
      (isPending === true && isIdle === false) ||
      (isAmazonCogsUploadIdle === false && isAmazonCogsUploadPending === true),
    [isAmazonCogsUploadIdle, isAmazonCogsUploadPending, isIdle, isPending]
  );

  const handleCOGSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getValidNumber(event.target.value);
    setUpdatedCOGS(value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  const handleUpdateCOGS = async () => {
    if (marketplace === MarketplaceEnum.WALMART) {
      const body: IUpdateCOGSPayload = {
        cogs: `${updatedCOGS}`,
        itemId,
      };

      await updateCOGSByItemId(body);
    } else {
      const body: IAmazonCOGSUploadBody = {
        cogs: updatedCOGS ?? 0,
        asin: itemId,
        sku,
      };

      await updateCOGSByAsin(body);
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          padding: '0',
          margin: 0,
          maxWidth: '40rem',
          minHeight: '20rem',
        },
      }}
    >
      {isLoading === true && <CustomEditLoader overlayText="Saving..." />}
      <DialogTitle>
        <span className={styles.title}>Upload Default Cost</span>
      </DialogTitle>
      <DialogContent>
        <div className={styles.productInfo}>
          <ImgComponent
            imageURL={imgUrl}
            alt={name}
            className={styles.productImage}
          />

          <div className={styles.productCard}>
            <div className={styles.productName}>{name}</div>
            <div className={styles.productDetails}>
              <span className={styles.cogsText}>
                COG <span>{displayValue(formatNum(cogs), false)}</span>
              </span>
              <span className={styles.divider}></span>
              <span className={styles.detailsText}>
                SKU <span className={styles.detailsValue}>{sku}</span>
              </span>
              <span className={styles.divider}></span>
              <span className={styles.detailsText}>
                ID <span className={styles.detailsValue}>{itemId}</span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <TextField
            type="number"
            value={updatedCOGS}
            sx={{
              ...bidFieldStyles,
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.4rem',
                fontSize: '1.2rem',
                fontWeight: 500,
                paddingLeft: '0.5em',
                height: '3rem',
                width: '35.5rem',
              },
            }}
            variant="outlined"
            onChange={handleCOGSChange}
            onKeyDown={handleInputKeyDown}
            InputProps={{
              inputProps: {
                inputMode: 'decimal',
                min: 0,
                step: 0.01,
              },
              startAdornment: getCurrencySymbolByCountry(),
            }}
          />
        </div>
        <div className={styles.disclaimer}>
          This cost will apply only to future inbound shipments of the product
          and will not override the data of existing listings shown on this
          page.
        </div>
        <div className={styles.buttonContainer}>
          <SecondaryButton
            buttonText={'Cancel'}
            buttonFunction={handleClose}
            disabled={false}
          />
          <PrimaryButton
            buttonText={'Change Cost'}
            buttonFunction={handleUpdateCOGS}
            disabled={checkIsEqual(cogs, updatedCOGS)}
            width="auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadCOGSDialog;
