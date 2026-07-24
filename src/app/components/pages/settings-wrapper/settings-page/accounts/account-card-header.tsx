import { Typography } from '@mui/material';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';

import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '@/app/components/common/img-component/img-component';
import { getCountryFlagIcon } from '@/utils';
import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DISCONNECT_ADVERTISING,
  DISCONNECT_PRODUCT_CATALOG,
} from 'src/constants/settings/settings.constants';
import { ISettingsAccount } from 'src/interfaces/settings.interface';
import accountUtils from 'src/utils/settings/accounts/account.utils';
import MarketplaceLogo from '../../../advertising-page/marketplace-logo';
import styles from '../account-card.module.scss';
interface IAccountCardHeaderProps {
  accountData: ISettingsAccount;
  handleSelectedOption: (option: string | null) => void;
  handleOpenModal: () => void;
}
const AccountCardHeader = (props: IAccountCardHeaderProps) => {
  const { accountData, handleSelectedOption, handleOpenModal } = props;
  const displayNames = useMemo(
    () => accountUtils.getNamesToDisplay(accountData),
    [accountData]
  );
  const country = useMemo(
    () => accountUtils.getCountryCode(accountData),
    [accountData]
  );

  const [isDisconnectClicked, setIsDisconnectClicked] =
    useState<boolean>(false);

  const handleOptionClick = (option: string) => {
    handleSelectedOption(option);
    handleOpenModal();
  };

  const handleDisconnectClick = () => {
    setIsDisconnectClicked(!isDisconnectClicked);
  };

  const handleDisconnectOptions = () => {
    setIsDisconnectClicked(false);
    handleSelectedOption(null);
  };

  return (
    <div className={styles.header}>
      <div className={styles.subHeader}>
        <span className={styles.merchantLabel}>
          Merchant
          <InfoIcon title={'Merchant'} />
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className={styles.dotsThreeVertical}
          onClick={handleDisconnectClick}
        >
          <DotsThreeVerticalIcon size={16} weight="bold" />

          {isDisconnectClicked && (
            <DisconnectOptions
              onOptionClick={handleOptionClick}
              handleCloseDisconnectOptions={handleDisconnectOptions}
              accountData={accountData}
            />
          )}
        </span>
      </div>
      <div className={styles.merchantInfo}>
        <MarketplaceLogo marketplace={accountData.marketplace} />
        <div className={styles.vl} />
        <ImgComponent
          imageURL={getCountryFlagIcon(country)}
          alt={`${country}-flag`}
          customStyles={{
            width: '1.8rem',
            height: '2rem',
          }}
        />
        <div className={styles.vl} />

        <Typography className={styles.merchantName}>
          <HoverInfoTooltip title={displayNames[0]}>
            <span>
              {displayNames[0]} ({country})&nbsp;
            </span>
          </HoverInfoTooltip>
          <br />
          <span className={styles.subText}>{displayNames[1]}</span>
        </Typography>
      </div>
    </div>
  );
};

interface IDisconnectOptionsProps {
  onOptionClick: (option: string) => void;
  handleCloseDisconnectOptions: () => void;
  accountData: ISettingsAccount;
}

const DisconnectOptions = ({
  onOptionClick,
  handleCloseDisconnectOptions,
  accountData,
}: IDisconnectOptionsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  const handleDisconnectAdvertising = () => {
    if (
      !accountData.advertising?.amazonProfileId &&
      !accountData.advertising?.walmartAdvertiserId
    )
      return;
    onOptionClick(DISCONNECT_ADVERTISING);
  };
  const handleDisconnectProductCatalog = () => {
    if (!accountData.catalog?.partnerId) return;
    onOptionClick(DISCONNECT_PRODUCT_CATALOG);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        handleCloseDisconnectOptions();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleCloseDisconnectOptions]);

  return (
    <div className={styles.optionsContainer} ref={containerRef}>
      <div
        className={
          accountData.advertising?.amazonProfileId ||
          accountData.advertising?.walmartAdvertiserId
            ? styles.option
            : `${styles.option} ${styles.disabled}`
        }
        onClick={handleDisconnectAdvertising}
      >
        <span>Disconnect Advertising</span>
      </div>
      <div
        className={
          accountData.catalog?.partnerId
            ? styles.option
            : `${styles.option} ${styles.disabled}`
        }
        onClick={handleDisconnectProductCatalog}
      >
        <span>Disconnect Product Catalog</span>
      </div>
    </div>
  );
};

export default AccountCardHeader;
