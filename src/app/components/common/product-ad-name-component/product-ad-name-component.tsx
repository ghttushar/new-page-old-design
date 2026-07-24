import {
  imageStyles,
  itemNameContainerStyles,
} from '@/app/components/pages/advertising-page/advertising-amazon/overall/account-level/amz-overall-account-level-styles';
import { textStartStyles } from '@/constants/table-columns/new-column-names.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { getProductImgUrl, getProductUrl } from '@/utils/advertising.utils';
import Typography from '@mui/material/Typography';
import React from 'react';
import ImgComponent from '../img-component/img-component';
import { textWrappingStyles } from '../keyword-actions-table/keyword-actions-table-styles';
import styles from './product-ad-name-component.module.scss';

interface IProductAdNameComponentProps {
  itemImageUrl: string | null;
  itemName: string;
  itemId: string;
  sku: string | null;
  marketplace: MarketplaceEnum;
}

export default function ProductAdNameComponent({
  itemImageUrl,
  itemName,
  itemId,
  marketplace,
  sku,
}: IProductAdNameComponentProps) {
  return (
    <div className={`commonCell`} style={textStartStyles}>
      <div style={itemNameContainerStyles}>
        <ImgComponent
          imageURL={itemImageUrl ?? getProductImgUrl(itemId)}
          alt="bed-icon"
          customStyles={imageStyles}
          isProduct={true}
        />
        <div
          className={styles.productNameContainer}
          style={
            {
              ...textWrappingStyles,
              textAlign: 'left',
            } as React.CSSProperties
          }
        >
          <a
            className={styles.productTitle}
            href={getProductUrl(itemId, marketplace)}
            target="_blank"
            rel="noreferrer"
          >
            <p title={itemName}>{itemName}</p>
          </a>

          <Typography
            variant="subtitle1"
            fontSize="1rem"
            fontWeight={400}
            className={styles.productSubtitle}
          >
            Item Id - {itemId} |{' '}
            {sku !== null && sku !== '' ? `SKU - ${sku}` : '-'}
          </Typography>
        </div>
      </div>
    </div>
  );
}
