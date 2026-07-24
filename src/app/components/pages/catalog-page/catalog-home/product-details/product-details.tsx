import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '@/app/components/common/img-component/img-component';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { Divider } from '@mui/material';
import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react';
import { GlobalDataTestIds } from 'cypress/enums/global';
import React from 'react';
import styles from 'src/app/components/page-components/catalog-table-wrapper/catalog-table-wrapper.module.scss';
import {
  getMappedAmazonTableFulfillmentType,
  getProductUrl,
} from 'src/utils/advertising.utils';
/* eslint-disable-next-line */
export interface ProductDetailsProps {
  canSomeRowsExpand: boolean;
  sku: string | null;
  productName: string | null;
  itemId: string | null;
  imageUrl: string | null;
  getToggleExpandedHandler: () => void;
  canRowExpand: boolean;
  isRowExpanded: boolean;
  marketplace: MarketplaceEnum;
  depth: number;
  fulfillmentType: string | null;
  upcCode?: string | null;
}

export function ProductDetails(props: ProductDetailsProps) {
  const {
    canSomeRowsExpand,
    canRowExpand,
    getToggleExpandedHandler,
    imageUrl,
    isRowExpanded,
    itemId,
    productName,
    sku,
    marketplace,
    depth,
    fulfillmentType,
    upcCode,
  } = props;

  return (
    <React.Fragment>
      <div>
        {canRowExpand === true ? (
          <a
            {...{
              onClick: getToggleExpandedHandler,
              style: { cursor: 'pointer' },
            }}
          >
            {isRowExpanded === true ? (
              <CaretDownIcon className={styles.expandIcon} />
            ) : (
              <CaretRightIcon className={styles.expandIcon} />
            )}
          </a>
        ) : (
          canSomeRowsExpand === true && (
            <div style={{ minWidth: '1.7rem' }}></div>
          )
        )}
      </div>
      <div
        className={styles.productContainer}
        style={{
          paddingLeft:
            canSomeRowsExpand === true
              ? depth > 0
                ? '3.1rem'
                : `${depth * 2}rem`
              : '0',
        }}
        data-test={GlobalDataTestIds.PRODUCT_CONTAINER}
      >
        <a
          className={styles.productImgContainer}
          href={itemId ? getProductUrl(itemId, marketplace) : ''}
          target="_blank"
          rel="noreferrer"
        >
          <ImgComponent
            imageURL={imageUrl ?? ''}
            alt={productName ?? sku ?? itemId ?? '-'}
            className={styles.productImg}
            isProduct={true}
          />
        </a>

        <div
          className={styles.productData}
          data-test={GlobalDataTestIds.PRODUCT_DATA}
        >
          {!productName || !itemId ? (
            <div className="no-data-view">-</div>
          ) : (
            <div className={styles.productNameContainer}>
              <a
                className={styles.productName}
                href={getProductUrl(itemId, marketplace)}
                target="_blank"
                rel="noreferrer"
                title={productName}
                data-test={GlobalDataTestIds.PRODUCT_NAME}
              >
                {productName}
              </a>
            </div>
          )}
          <Divider />
          <div
            className={styles.productMetaData}
            data-test={GlobalDataTestIds.PRODUCT_META_DATA}
          >
            <p className={styles.subText}>
              <b>{marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'ID'}</b>
              &nbsp;
              {!itemId ? '-' : `${itemId}`}
            </p>
            <div className={styles.vl}>|</div>
            <HoverInfoTooltip title={sku ?? '-'}>
              <p className={styles.subText}>
                <b>SKU</b>&nbsp;
                <span>{sku ?? '-'}</span>
              </p>
            </HoverInfoTooltip>

            {upcCode !== undefined && (
              <React.Fragment>
                <div className={styles.vl}>|</div>
                <p className={styles.subText}>
                  <b>UPC</b>&nbsp;
                  {upcCode}
                </p>
              </React.Fragment>
            )}
            <div className={styles.vl}>|</div>
            <p className={styles.subText}>
              <b>
                {getMappedAmazonTableFulfillmentType(fulfillmentType ?? '')}
              </b>
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProductDetails;
