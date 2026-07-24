import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import ImgComponent from '@/app/components/common/img-component/img-component';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import {
  ADS_REGION_URL_MAPPINGS,
  AmazonSPSellerAvailableRegions,
  AmazonSPVendorAvailableRegions,
} from '@/constants/onboarding/amazon-onboarding.constants';
import { AmazonAccountType, MailIDEnum } from '@/enums/advertising.enums';
import { OnboardingTypeEnum } from '@/enums/onboarding.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAccountCardProps,
  IAmazonSPOnboardingTaskPayload,
} from '@/interfaces/onboarding.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsWmtConnectFormOpen,
  setIsWmtConnectFormOpen,
} from '@/redux/slices/onboarding/onboarding.slice';
import onboardingService from '@/services/onboarding.service';
import { generateRandomID } from '@/utils';
import { Typography } from '@mui/material';
import React, { useState } from 'react';
import styles from './onboarding-page.module.scss';
import SelectAmazonRegionModal from './select-region-modal/amazon-region-select-modal';
import WalmartConnectForm from './walmart-connect-form/walmart-connect-form';
const MarketplaceCard: React.FC<IAccountCardProps> = ({
  isDisabled,
  description,
  buttonFunction,
  marketplace,
  iconPath,
  iconSize,
  buttonText,
  customLogoStyles,
  redirectLink,
  onboardingType,
}) => {
  const dispatch = useAppDispatch();
  const isConnectFormOpen = useAppSelector(selectIsWmtConnectFormOpen);

  const availableRegions =
    onboardingType === OnboardingTypeEnum.AMAZON_ADS
      ? AmazonSPSellerAvailableRegions
      : onboardingType === OnboardingTypeEnum.AMAZON_SP_SELLER
      ? AmazonSPSellerAvailableRegions
      : AmazonSPVendorAvailableRegions;

  const [openRegionModal, setOpenRegionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [CSRFState, setCSRFState] = useState(generateRandomID());
  const [selectedSPRegion, setSelectedSPRegion] = useState<
    IDropdownItem<string>
  >(availableRegions[0]);
  const [selectedRegion, setSelectedRegion] = useState<IDropdownItem<string>>(
    availableRegions[0]
  );

  const handleClick = () => {
    if (onboardingType === OnboardingTypeEnum.WALMART_CONNECT) {
      dispatch(setIsWmtConnectFormOpen(true));
      return;
    }
    if (onboardingType === OnboardingTypeEnum.WALMART_ADS) {
      buttonFunction(redirectLink);
      return;
    }
    setOpenRegionModal(true);
  };

  const payload: IAmazonSPOnboardingTaskPayload = {
    region:
      onboardingType === OnboardingTypeEnum.AMAZON_ADS
        ? selectedRegion.tooltipText ?? ''
        : selectedSPRegion.tooltipText ?? '',
    state: CSRFState,
    accountType:
      onboardingType === OnboardingTypeEnum.AMAZON_SP_SELLER
        ? AmazonAccountType.SELLER
        : AmazonAccountType.VENDOR,
  };

  const handleAdsOnSelect = (option: IDropdownItem<string>) => {
    setSelectedRegion(option);
  };

  const handleAdsOnClick = () => {
    setIsLoading(true);
    buttonFunction(
      ADS_REGION_URL_MAPPINGS[selectedRegion.tooltipText ?? ''] ?? ''
    );
  };

  const handleSPRegionSelect = (option: IDropdownItem<string>) => {
    setCSRFState(generateRandomID());
    setSelectedSPRegion(option);
  };

  const handleSPOnClick = () => {
    setIsLoading(true);
    onboardingService
      .createOnboardingTask(payload)
      .then(() => {
        buttonFunction(
          selectedSPRegion.value +
            redirectLink +
            `&state=${CSRFState}` +
            `&region=${selectedSPRegion.tooltipText}`
        );
      })
      .catch(() => setIsLoading(false));
  };

  const handleClose = () => {
    setSelectedRegion(availableRegions[0]);
    setSelectedSPRegion(availableRegions[0]);
    setOpenRegionModal(false);
    setCSRFState(generateRandomID());
  };

  const handleFormClose = () => {
    dispatch(setIsWmtConnectFormOpen(false));
  };

  return (
    <div className={styles.onboardingSubWrapper}>
      <div className={styles.accountTypeLogo}>
        <ImgComponent
          customStyles={{
            height: 'auto',
            width: iconSize ? iconSize : '25rem',
            ...customLogoStyles,
          }}
          imageURL={iconPath}
          alt={`${marketplace}-logo`}
          className={styles.stepLogoImg}
        />
      </div>

      <Typography
        variant="body2"
        fontSize="1.3rem"
        fontWeight={400}
        lineHeight="144%"
        minHeight={'9rem'}
        align="center"
        letterSpacing={'-0.02rem'}
        width={'100%'}
      >
        {description}
      </Typography>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <PrimaryButton
            buttonFunction={handleClick}
            buttonText={buttonText as string}
            disabled={isDisabled}
            width="30rem"
            height="4rem"
            fontSize="1.4rem"
          />

          {marketplace === MarketplaceEnum.WALMART && (
            <span
              style={{
                fontSize: '1.1rem',
              }}
            >
              New to Walmart Ads?&nbsp;
              <a
                href={`https://mail.google.com/mail/?view=cm&to=${MailIDEnum.TECH},${MailIDEnum.SUNIL},${MailIDEnum.BHARATH}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#3385EA',
                  textDecoration: 'underline',
                }}
              >
                Get in touch
              </a>
            </span>
          )}
        </div>
        <WalmartConnectForm
          title={'Connect Walmart Ads Data'}
          openConfirmation={isConnectFormOpen}
          handleConfirmationClose={handleFormClose}
        />

        <SelectAmazonRegionModal
          title={'Select Region'}
          options={availableRegions}
          openConfirmation={
            openRegionModal &&
            onboardingType !== OnboardingTypeEnum.WALMART_ADS &&
            onboardingType !== OnboardingTypeEnum.WALMART_CONNECT
          }
          handleConfirmationClose={handleClose}
          selectedRegion={
            onboardingType === OnboardingTypeEnum.AMAZON_ADS
              ? selectedRegion
              : selectedSPRegion
          }
          onSelect={
            onboardingType === OnboardingTypeEnum.AMAZON_ADS
              ? handleAdsOnSelect
              : handleSPRegionSelect
          }
          onClick={
            onboardingType === OnboardingTypeEnum.AMAZON_ADS
              ? handleAdsOnClick
              : handleSPOnClick
          }
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MarketplaceCard;
