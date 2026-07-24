import { MarketplaceEnum } from '@/enums/serp.enums';
import { IChannel } from 'src/interfaces/serp.interface';
import MarketplaceIcon from '../marketplace-icon/marketplace-icon';
import styles from './marketplace-icon-list.module.scss';

/* eslint-disable-next-line */
export interface MarketplaceIconListProps {
  channels: IChannel[];
  selectedMarketplace: string;
}

export function MarketplaceIconList(props: MarketplaceIconListProps) {
  const { channels, selectedMarketplace } = props;
  const formattedChannels =
    selectedMarketplace !== MarketplaceEnum.All
      ? channels.filter(
          (marketplace) => marketplace.channel === selectedMarketplace
        )
      : channels;
  return (
    <ul className={styles.marketplaceList}>
      {formattedChannels.map((marketplace) => (
        <li key={marketplace.channel} className={styles.marketplace}>
          <MarketplaceIcon marketplace={marketplace.channel} />
        </li>
      ))}
    </ul>
  );
}

export default MarketplaceIconList;
