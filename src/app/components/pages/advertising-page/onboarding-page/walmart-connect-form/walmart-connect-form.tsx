import { confirmationBoxStyles } from '@/app/components/common/confirmation-box/confirmation-box-styles';
import ImgComponent from '@/app/components/common/img-component/img-component';
import { formControlLabelStyles } from '@/app/components/common/multiselect-option-box/multiselect-option-box-styles';
import OnboardingSuccessPopup from '@/app/components/common/onboarding-successfull-popup.tsx/onboarding-success-popup';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import PrimaryLoadingButton from '@/app/components/common/primary-button/primary-loading-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import { checkboxStyles } from '@/app/components/page-components/advertising-create-dialogs/advertising-create-dialogs-styles';
import { formHelperTextStyles } from '@/app/components/page-components/edit-access-components/edit-access-bidder/edit-access-bidder-styles';
import {
  ACCOUNTS_PAGE_URL,
  FIND_IDS_LINK,
  WALMART_CONNECT_AUTH_URL,
  WALMART_CONNECT_ONBOARDING_GUIDE_LINK,
} from '@/constants/urls.constants';
import { MailIDEnum } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  WalmartAccountReconnectEnum,
  WalmartAccountTypeEnum,
} from '@/enums/walmart.enums';
import { IWalmartConnectForm } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import walmartAccountService from '@/services/advertising/walmart/walmart-account.service';
import { checkIsEqual } from '@/utils/advertising.utils';

import {
  validateAdvertiserId,
  validateSellerId,
} from '@/utils/validations.utils';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { WarningCircleIcon, XIcon } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { imageUrls } from '@/constants/assets/images.constants';
import { selectStyles } from '../../../forgot-password/forgot-password-styles';
import { formBoxStyles } from '../../../login-page/login-page-styles';
import styles from './walmart-connect-form.module.scss';

interface IWalmartConnectFormProps {
  title?: string;
  openConfirmation: boolean;
  handleConfirmationClose: () => void;
}

const INITIAL_CONNECT_FORM_STATE: IWalmartConnectForm = {
  advertiserId: '',
  supplierId: '',
  sellerId: '',
};

const DEFAULT_TITLE = 'Connect Walmart Ads Data';

export default function WalmartConnectForm({
  title = DEFAULT_TITLE,
  openConfirmation,
  handleConfirmationClose,
}: IWalmartConnectFormProps) {
  const [connectForm, setConnectForm] = useState<IWalmartConnectForm>(
    INITIAL_CONNECT_FORM_STATE
  );

  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [formTitle, setFormTitle] = useState(title);
  const [advertiserIdErr, setAdvertiserIdErr] = useState(false);
  const [sellerIdErr, setSellerIdErr] = useState(false);
  const [supplierIdErr, setSupplierIdErr] = useState(false);
  const [activeTab, setActiveTab] = useState(
    WalmartAccountTypeEnum.THIRD_PARTY
  );
  const [stepCount, setStepCount] = useState(0);
  const [isReconnected, setIsReconnected] = useState(false);

  const modalPopupRef = useRef<HTMLDivElement | null>(null);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({
      ...connectForm,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setIsClicked(false);
    setIsChecked(false);
    setStepCount(0);
    setActiveTab(WalmartAccountTypeEnum.THIRD_PARTY);
    setFormTitle('Connect Walmart Ads Data');
  };

  const handleActiveTab = (id: WalmartAccountTypeEnum) => {
    clearForm();
    setConnectForm(INITIAL_CONNECT_FORM_STATE);
    setActiveTab(id);
  };

  const handleAdvertiserIdBlur = () => {
    setAdvertiserIdErr(
      connectForm.advertiserId !== '' &&
        !validateAdvertiserId(connectForm.advertiserId)
    );
  };

  const handleSellerIdBlur = () => {
    setSellerIdErr(
      connectForm.sellerId !== '' &&
        !validateSellerId(connectForm.sellerId ?? '')
    );
  };

  const handleSupplierIdBlur = () => {
    setSupplierIdErr(
      connectForm.supplierId !== '' &&
        !validateAdvertiserId(connectForm.supplierId ?? '')
    );
  };

  const {
    isFetched: isAccountFetched,
    isLoading: isAccountLoading,
    isSuccess,
    data: accountData,
    refetch: fetchWalmartAds,
  } = useAppQuery({
    options: {
      staleTime: 0,
      gcTime: 0,
    },
    queryFn: () =>
      walmartAccountService.getWalmartAdsAccountByAdvertiserId(
        connectForm.advertiserId
      ),
    queryKey: [
      QueryKeyEnums.WMT_ADS_ACCOUNT_FETCH_ADVERTISER_ID,
      connectForm.advertiserId,
    ],
    enabled: false,
  });

  const isDisabled =
    (isAccountFetched &&
      accountData?.data.data !== null &&
      connectForm.advertiserId !== '') ||
    (activeTab === WalmartAccountTypeEnum.THIRD_PARTY &&
      (connectForm.sellerId === '' ||
        !validateSellerId(connectForm.sellerId ?? '') ||
        sellerIdErr)) ||
    (activeTab === WalmartAccountTypeEnum.FIRST_PARTY &&
      (connectForm.supplierId === '' ||
        !validateAdvertiserId(connectForm.supplierId ?? ''))) ||
    supplierIdErr ||
    (connectForm.advertiserId === '' &&
      !validateAdvertiserId(connectForm.advertiserId)) ||
    advertiserIdErr;

  useEffect(() => {
    if (isSuccess) {
      if (
        (isAccountFetched === true &&
          accountData?.data.data === WalmartAccountReconnectEnum.CONTINUE) ||
        accountData.data.data === null
      ) {
        setStepCount(1);
        setFormTitle('Complete Setup on Walmart Connect Ad Center');
        return;
      }
      if (
        isAccountFetched === true &&
        accountData?.data.data === WalmartAccountReconnectEnum.BY_PASS
      ) {
        handleConfirmationClose();
        setIsReconnected(true);
      }
    }
  }, [accountData, isAccountFetched, isAccountLoading, isSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const resetIdErr = () => {
    setAdvertiserIdErr(false);
    setSupplierIdErr(false);
    setSellerIdErr(false);
  };
  const handleFormClose = () => {
    handleConfirmationClose();
    setTimeout(() => {
      resetIdErr();
      clearForm();
      setConnectForm(INITIAL_CONNECT_FORM_STATE);
    }, 100);
  };

  const handleConnect = () => {
    fetchWalmartAds();
  };

  const navigateToAccounts = () => {
    navigate(ACCOUNTS_PAGE_URL);
  };

  const getActiveTabStyles = (tab: WalmartAccountTypeEnum) => {
    const baseStyles = {
      fontSize: '1.4rem',
      display: 'flex',
      paddingBottom: '0.6rem',
      justifyContent: 'center',
      transition: 'all 0.3s ease-in-out',
      width: '100%',
    };

    return activeTab === tab
      ? {
          ...baseStyles,
          borderBottom: '2px solid #77469b',
          color: '#77469b',
          fontWeight: '600',
        }
      : {
          ...baseStyles,
          borderBottom: '2px solid white',
          background: '#fff',
          fontWeight: '400',
          color: '#949494',
        };
  };

  const inputLabelStyles = {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: 'black',
  };

  const errorStyles = {
    ...formHelperTextStyles,
    fontSize: '1rem',
    marginLeft: '-1rem',
    marginBottom: '0',
  };

  const textFieldStyles = {
    ...selectStyles,
    '& > :not(style)': {
      width: '100%',
      height: '4rem',
      padding: '0',
      fontSize: '1.2rem',
    },
    '& .MuiFormHelperText-root': {
      height: '1rem',
    },
  };

  const ErrorMessage = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#FFE9EB',
        padding: '1.6rem',
        borderRadius: '0.8rem',
        marginTop: '2rem',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '2rem',
          color: 'black',
          fontWeight: '700',
          fontSize: '1.4rem',
        }}
      >
        <WarningCircleIcon
          size="1.6rem"
          color="#FA3F4C"
          style={{
            margin: '0 1rem 0 0rem',
          }}
        />{' '}
        Account Already Exists
      </span>
      <span
        style={{
          minWidth: '35rem',
          display: 'flex',
          padding: '0 2.6rem',
          justifyContent: 'center',
          fontSize: '1rem',
        }}
      >
        <span>
          The Walmart Ads account you are trying to connect is already in use.
          Please check your details or
          <a
            href={`https://mail.google.com/mail/?view=cm&to=${MailIDEnum.TECH},${MailIDEnum.SUNIL},${MailIDEnum.BHARATH}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#3385EA',
              marginLeft: '0.2rem',
            }}
          >
            &nbsp;contact us
          </a>
        </span>
      </span>
    </div>
  );

  return (
    <React.Fragment>
      <OnboardingSuccessPopup
        title={'Successfully Reconnected'}
        description={'You have been reconnected successfully'}
        openConfirmation={isReconnected}
        handleConfirmationClose={navigateToAccounts}
      />
      <Dialog
        ref={modalPopupRef}
        open={openConfirmation}
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        className={styles.confirmationContainer}
        sx={{
          ...confirmationBoxStyles,
          '& .MuiDialog-paper': { padding: '0' },
        }}
      >
        <DialogTitle id="form-title" className={styles.formTitle}>
          {formTitle}
          <XIcon
            size={'2rem'}
            style={{ cursor: 'pointer' }}
            onClick={handleFormClose}
          />
        </DialogTitle>

        <DialogContent
          sx={{
            '& .MuiDialogContent-root': {
              margin: '1rem',
            },
          }}
        >
          {stepCount === 0 ? (
            <React.Fragment>
              <div className={styles.formContainer}>
                <div
                  id={WalmartAccountTypeEnum.THIRD_PARTY}
                  style={getActiveTabStyles(WalmartAccountTypeEnum.THIRD_PARTY)}
                  onClick={() =>
                    handleActiveTab(WalmartAccountTypeEnum.THIRD_PARTY)
                  }
                >
                  <h4>3P Seller</h4>
                </div>

                <div
                  id={WalmartAccountTypeEnum.FIRST_PARTY}
                  style={getActiveTabStyles(WalmartAccountTypeEnum.FIRST_PARTY)}
                  onClick={() =>
                    handleActiveTab(WalmartAccountTypeEnum.FIRST_PARTY)
                  }
                >
                  <h4>1P Vendor/Supplier</h4>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.formSubContainer}>
                <Box component="div" sx={formBoxStyles}>
                  {isSuccess &&
                  isAccountFetched &&
                  accountData?.data.data ===
                    WalmartAccountReconnectEnum.BLOCK ? (
                    <ErrorMessage />
                  ) : null}

                  <div style={{ marginTop: '2rem' }}>
                    <InputLabel htmlFor="advertiserId" sx={inputLabelStyles}>
                      Advertiser ID
                    </InputLabel>
                  </div>
                  <TextField
                    error={advertiserIdErr && connectForm.advertiserId !== ''}
                    data-test="advertiserId-input"
                    id="advertiserId"
                    variant="outlined"
                    name="advertiserId"
                    onChange={handleFormData}
                    onBlur={handleAdvertiserIdBlur}
                    sx={textFieldStyles}
                    value={connectForm.advertiserId}
                    helperText={
                      advertiserIdErr ? (
                        <FormHelperText sx={errorStyles}>
                          Please provide valid Advertiser Id
                        </FormHelperText>
                      ) : null
                    }
                  />

                  {activeTab === WalmartAccountTypeEnum.FIRST_PARTY ? (
                    <React.Fragment>
                      <div>
                        <InputLabel
                          htmlFor="supplierId"
                          sx={{ ...inputLabelStyles, marginTop: '1rem' }}
                        >
                          Supplier ID
                        </InputLabel>
                      </div>
                      <TextField
                        error={supplierIdErr && connectForm.supplierId !== ''}
                        data-test="supplierId-input"
                        id="supplierId"
                        variant="outlined"
                        name="supplierId"
                        onChange={handleFormData}
                        onBlur={handleSupplierIdBlur}
                        sx={textFieldStyles}
                        value={connectForm.supplierId}
                        helperText={
                          supplierIdErr && connectForm.supplierId !== '' ? (
                            <FormHelperText sx={errorStyles}>
                              Please provide valid Supplier Id
                            </FormHelperText>
                          ) : null
                        }
                      />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div>
                        <InputLabel
                          htmlFor="sellerId"
                          sx={{ ...inputLabelStyles, marginTop: '1rem' }}
                        >
                          Seller ID
                        </InputLabel>
                      </div>
                      <TextField
                        error={sellerIdErr && connectForm.sellerId !== ''}
                        data-test="sellerId-input"
                        id="sellerId"
                        variant="outlined"
                        name="sellerId"
                        onChange={handleFormData}
                        onBlur={handleSellerIdBlur}
                        sx={textFieldStyles}
                        value={connectForm.sellerId}
                        helperText={
                          sellerIdErr && connectForm.sellerId !== '' ? (
                            <FormHelperText sx={errorStyles}>
                              Please provide valid Seller Id
                            </FormHelperText>
                          ) : null
                        }
                      />
                    </React.Fragment>
                  )}

                  <span className="pt-[0.4rem]">
                    Find your&nbsp;
                    <a
                      href={FIND_IDS_LINK}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#3385EA',
                        textDecoration: 'underline',
                      }}
                    >
                      Advertiser ID and Seller ID
                    </a>
                  </span>

                  <span className={styles.formButtonContainer}>
                    <PrimaryLoadingButton
                      buttonText={'Continue'}
                      buttonFunction={handleConnect}
                      disabled={isDisabled}
                      isLoading={isAccountLoading || checkIsEqual(stepCount, 1)}
                      width="100%"
                      height="4rem"
                    />
                  </span>
                </Box>
              </form>
            </React.Fragment>
          ) : stepCount === 1 && connectForm.advertiserId !== '' ? (
            <Box component="div" sx={formBoxStyles}>
              <div className={styles.authorizeContainer}>
                <div className={styles.logoContainer}>
                  <ImgComponent
                    imageURL={imageUrls.anarixLogoLarge}
                    alt="anarix-logo"
                    customStyles={{
                      height: '3rem',
                      width: 'auto',
                    }}
                  />
                  <ImgComponent
                    imageURL={imageUrls.connectionLogo}
                    alt="connection-logo"
                    customStyles={{
                      height: '2rem',
                      width: 'auto',
                    }}
                  />
                  <ImgComponent
                    imageURL={imageUrls.walmartConnectIcon}
                    alt="walmart-connect-logo"
                    customStyles={{
                      height: '5rem',
                      width: 'auto',
                    }}
                  />
                </div>

                <span className={styles.description}>
                  Grant Anarix Access to Optimize Your Ads
                </span>
                <span className={styles.descriptionMessage}>
                  To provide full optimization of your Walmart Ads, Anarix
                  requires write permissions in your Walmart Connect account.{' '}
                  <br />
                  <a
                    href={WALMART_CONNECT_ONBOARDING_GUIDE_LINK}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#3385EA',
                      textDecoration: 'underline',
                    }}
                  >
                    View step-by-guide
                  </a>
                </span>

                <a
                  href={WALMART_CONNECT_AUTH_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.authorizeLink}
                  onClick={() => {
                    setIsClicked(true);
                  }}
                >
                  Authorize API access on Walmart Ad Center
                </a>

                <FormControlLabel
                  disabled={!isClicked}
                  style={{
                    color: isClicked ? 'black' : '#aaa',
                    cursor: isClicked ? 'pointer' : 'not-allowed',
                    marginTop: '1rem',
                  }}
                  control={
                    <Checkbox
                      size="small"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                      disableRipple
                      name={'Checkbox'}
                      sx={{
                        ...checkboxStyles,
                        marginLeft: '0.4rem',
                        padding: '0.1rem 0.4rem 0 0.4rem',
                        borderRadius: '0.4rem',
                      }}
                    />
                  }
                  label={
                    <Typography
                      lineHeight={'1.5rem'}
                      fontSize={'1.1rem'}
                      fontWeight={'500'}
                    >
                      I authorize Anarix as a trusted partner with write
                      permissions in my Walmart Connect Ad Center.
                    </Typography>
                  }
                  sx={{
                    ...formControlLabelStyles(false),
                    display: 'flex',
                    alignItems: 'start',
                  }}
                />
                <span className={styles.vl}></span>
                <span className={styles.authorizeButtonContainer}>
                  <SecondaryButton
                    buttonText={'Cancel'}
                    buttonFunction={handleFormClose}
                    disabled={false}
                    height="3.2rem"
                    width="8rem"
                  />
                  <PrimaryButton
                    buttonText="Connect"
                    buttonFunction={() => {
                      navigate(
                        `${ACCOUNTS_PAGE_URL}/onboarding-page/connecting/walmart-connect/${connectForm.advertiserId}`,
                        {
                          replace: true,
                        }
                      );
                      clearForm();
                      setConnectForm(INITIAL_CONNECT_FORM_STATE);
                    }}
                    disabled={!isChecked || !isClicked}
                    width="8rem"
                  />
                </span>
              </div>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
