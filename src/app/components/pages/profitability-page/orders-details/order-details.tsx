import ImgComponent from '@/app/components/common/img-component/img-component';
import { getExpandToggleStyles } from '@/app/components/pages/profitability-page/profitability-styles';
import { DATE_FORMAT_13 } from '@/constants/datetime.constants';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOrderDetails } from '@/interfaces/profitability/profitability.interface';
import { displayValue, formatNum, getCountryFlagIcon } from '@/utils';
import {
  getFormattedCurrTimeZoneDate,
  getTimezoneTimeFromTimestamp,
} from '@/utils/datetime.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { CaretRightIcon } from '@phosphor-icons/react';
import React from 'react';
import ProfitabilityProductDetails from '../product-details/profitability-product-details';
import styles from './order-details.module.scss';

function OrderDetails({
  orderId,
  isLoading,
  isHome = false,
  canExpand,
  cogs,
  getToggleExpandedHandler,
  imgUrl,
  isExpanded,
  orderDate,
  productId,
  productName,
  productPrice,
  purchaseStatus,
  sku,
  countryCode = CountryCodeEnum.UnitedStates,
  marketplace = MarketplaceEnum.WALMART,
}: IOrderDetails) {
  const formattedDate = getFormattedCurrTimeZoneDate(
    orderDate ?? '',
    DATE_FORMAT_13
  );
  const formattedTime = getTimezoneTimeFromTimestamp(orderDate ?? '');
  const orderStatus = profitabilityUtils.getOrderStatus(purchaseStatus ?? '');
  const formattedPrice = displayValue(formatNum(productPrice), false);

  return (
    <React.Fragment>
      {canExpand === true && (
        <span
          onClick={getToggleExpandedHandler()}
          className={styles.expandToggle}
        >
          <CaretRightIcon
            weight="bold"
            style={getExpandToggleStyles(isExpanded)}
          />
        </span>
      )}

      <div className={styles.orderContainer}>
        {orderId && orderId !== '' && productName === null && (
          <div
            className={styles.orderSection}
            onClick={getToggleExpandedHandler()}
          >
            <ImgComponent
              imageURL={getCountryFlagIcon(countryCode)}
              alt=""
              className={styles.flagImage}
            />
            <span className={styles.vl}></span>
            <span className={styles.orderInfo}>
              <a
                className={styles.orderId}
                href={profitabilityUtils.getOrderDetailsUrlByMarketplace(
                  orderId,
                  marketplace
                )}
                target="_blank"
                rel="noreferrer"
              >
                {orderId ?? '-'}
              </a>
              <span className={styles.vl}></span>
              <span className={styles.orderMeta}>{formattedDate}</span>
              <span className={styles.vl}></span>
              <span className={styles.orderMeta}>{formattedTime}</span>
              <span className={styles.vl}></span>
              <span
                className={styles.orderMeta}
                style={{
                  color: profitabilityUtils.getStatusColor(orderStatus),
                }}
              >
                {orderStatus}
              </span>
              <span className={styles.vl}></span>
              <span className={styles.orderMeta}>{formattedPrice}</span>
            </span>
          </div>
        )}

        {productName && productName !== '' && (
          <ProfitabilityProductDetails
            isLoading={isLoading}
            name={productName ?? ''}
            sku={sku ?? ''}
            imgUrl={imgUrl ?? ''}
            itemId={productId ?? ''}
            productPrice={productPrice ?? 0}
            orderId={orderId ?? ''}
            cogs={cogs}
            isHome={isHome}
            marketplace={marketplace}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default OrderDetails;
