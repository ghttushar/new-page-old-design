import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { selectBidErrorMessage } from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import { selectWalmartBidErrorMessage } from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import { bidErrorMessageStyles } from '../keyword-actions-table-styles';
import styles from './custom-bid-input.module.scss';

interface ICustomBidInputProps {
  customBid: number;
  rowId: number;
  itemId: number;
  onBidChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  invalidIdx: number | null;
}
const CustomBidInput: React.FC<ICustomBidInputProps> = ({
  customBid,
  rowId,
  itemId,
  onBidChange,
  invalidIdx,
}) => {
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const walmartBidErrorMsg = useAppSelector(selectWalmartBidErrorMessage);
  const amazonBidErrorMsg = useAppSelector(selectBidErrorMessage);

  const marketplace = advertisingAccount;
  const stepSize =
    marketplace.marketplace === MarketplaceEnum.AMAZON ? 0.02 : 0.01;
  const errText =
    marketplace.marketplace === MarketplaceEnum.AMAZON
      ? amazonBidErrorMsg
      : walmartBidErrorMsg;

  return (
    <div className={styles.customBid}>
      <input
        key={rowId}
        type="number"
        value={customBid}
        step={stepSize}
        onChange={(e) => onBidChange(e, itemId)}
      />
      {invalidIdx === itemId && errText !== null ? (
        <p style={bidErrorMessageStyles}>{errText}</p>
      ) : null}
    </div>
  );
};

export default CustomBidInput;
