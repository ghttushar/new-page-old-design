import { imageUrls } from '@/constants/assets/images.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { displayValue, formatNum } from '@/utils';
import { getProductImgUrl, getProductUrl } from '@/utils/advertising.utils';
import ImgComponent from '../../img-component/img-component';
import styles from './product-actions-details.module.scss';

interface IProductActionDetails {
  brandName: string;
  searchTerm: string;
  title: string;
  price: string;
  ratings: number;
  reviews: number;
}

export function ProductActionDetails(props: IProductActionDetails) {
  return (
    <div className={styles.productDetailParentContainer}>
      <div className={styles.imageContainer}>
        <a
          href={getProductUrl(props.searchTerm, MarketplaceEnum.AMAZON)}
          target="_blank"
          rel="noreferrer"
        >
          <ImgComponent
            imageURL={getProductImgUrl(props.searchTerm)}
            alt="bed-icon"
            customStyles={{
              width: '5rem',
              height: 'auto',
              borderRadius: '0.8rem',
            }}
            isProduct={true}
          />
        </a>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.productNameContainer}>
          <span className={styles.brandName}>
            {props.brandName ? <b>{props.brandName}</b> : null}
            <p className={`${styles.searchTerm} commonCell`}>
              <b> ASIN - </b> {props.searchTerm.toUpperCase()}
            </p>
          </span>
          <div className={styles.productTitle}>
            <a
              href={getProductUrl(props.searchTerm, MarketplaceEnum.AMAZON)}
              target="_blank"
              rel="noreferrer"
            >
              <span>{props.title}</span>
            </a>
          </div>
        </div>

        <div className={styles.productMetaData}>
          <div className={styles.subText}>
            <p>{displayValue(props.price, false)}</p>
          </div>{' '}
          <span className={styles.vl}>|</span>
          <div className={styles.subText}>
            <p>Ratings: {props.ratings ? props.ratings : '-'}</p>
            {Boolean(props.ratings) && (
              <ImgComponent
                imageURL={imageUrls.starIcon}
                alt={'star-icon'}
                customStyles={{
                  width: '1.4rem',
                  height: 'auto',
                  marginLeft: '0.2rem',
                  marginBottom: '0.2rem',
                }}
              />
            )}
          </div>
          <span className={styles.vl}>|</span>
          <div className={styles.subText}>
            <p>Reviews: {formatNum(props.reviews).toString().split('.')[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
