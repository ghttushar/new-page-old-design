import { getMarketplaceIcon } from 'src/utils/advertising.utils';
import ImgComponent from '../../common/img-component/img-component';

interface IMarketplaceLogoProps {
  marketplace?: string;
}
const MarketplaceLogo = (props: IMarketplaceLogoProps) => {
  if (!props.marketplace) return <div></div>;
  return (
    <ImgComponent
      customStyles={{
        width: '1.6rem',
        height: '1.6rem',
        marginTop: '0.2rem',
      }}
      imageURL={getMarketplaceIcon(props.marketplace) ?? ''}
      alt="marketplace-logo"
    />
  );
};

export default MarketplaceLogo;
