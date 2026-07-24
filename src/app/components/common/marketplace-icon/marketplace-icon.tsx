import { MarketplaceEnum } from '@/enums/serp.enums';

import { imageUrls } from '@/constants/assets/images.constants';
import ImgComponent from '../img-component/img-component';
import styles from './marketplace-icon.module.scss';

/* eslint-disable-next-line */
export interface MarketplaceIconProps {
  marketplace: MarketplaceEnum;
}

export function MarketplaceIcon(props: MarketplaceIconProps) {
  const { marketplace } = props;

  switch (marketplace) {
    case MarketplaceEnum.AMAZON:
      return (
        <ImgComponent
          imageURL={imageUrls.amazonIcon}
          className={`${styles.marketplaceIcon} ${styles.amazon}`}
          alt="amazon-icon"
        />
      );
    case MarketplaceEnum.WALMART:
      return (
        <ImgComponent
          imageURL={imageUrls.walmartIcon}
          className={`${styles.marketplaceIcon} ${styles.walmart}`}
          alt="walmart-icon"
        />
      );
    case MarketplaceEnum.All:
      return (
        <div className="flex items-center">
          <ImgComponent
            imageURL={imageUrls.walmartIcon}
            alt="walmart-icon"
            customStyles={{
              height: '2.4rem',
              width: 'auto',
            }}
          />
          <ImgComponent
            imageURL={imageUrls.amazonIcon}
            alt="walmart-icon"
            customStyles={{
              height: '3rem',
              width: 'auto',
            }}
          />
        </div>
      );
    default:
      break;
  }
}

export default MarketplaceIcon;
