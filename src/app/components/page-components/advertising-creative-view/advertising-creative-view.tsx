import { AmazonSBCreativeTypeEnum } from '@/enums/advertising.enums';
import { IProductAdsEligibility } from '@/interfaces/column.interface';
import { useAppDispatch } from 'src/redux/hooks';
import {
  setCreativeAssetIds,
  setOpenCreativeDialog,
} from 'src/redux/slices/advertising/advertising-sb-filter.slice';
import TextButton from '../../common/text-button/text-button';
import styles from './advertising-creative-view.module.scss';

interface IAdvertisingCreativeViewProps {
  creativeType?: string;
  videoAssetIds: string[] | null;
  name: string;
  asinEligibility: IProductAdsEligibility[] | null;
}

export default function AdvertisingCreativeView({
  creativeType,
  videoAssetIds,
  name,
  asinEligibility,
}: IAdvertisingCreativeViewProps) {
  const dispatch = useAppDispatch();

  const asins = asinEligibility?.map((item) => item.asin ?? '');

  const handleViewMedia = () => {
    if (!videoAssetIds || !asins) return;

    dispatch(
      setCreativeAssetIds({
        videoAssetIds: videoAssetIds,
        products: asins,
      })
    );
    dispatch(setOpenCreativeDialog(true));
  };

  return (
    <div className={styles.creativeCellContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.titleName} title={name}>
          {name}
        </p>
      </div>

      <TextButton
        label="View Media"
        isDisabled={!videoAssetIds || !asins}
        disableReason="No creative assets or asins found"
        handleClick={handleViewMedia}
        customStyles={{
          fontSize: '1rem',
          fontWeight: 500,
          '&:hover': { textDecoration: 'underline' },
        }}
        isVisible={
          (creativeType !== undefined || creativeType !== null) &&
          (creativeType === AmazonSBCreativeTypeEnum.VIDEO ||
            creativeType === AmazonSBCreativeTypeEnum.BRAND_VIDEO)
        }
      />
    </div>
  );
}
