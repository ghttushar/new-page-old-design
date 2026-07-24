import { getCountryFlagIcon } from '@/utils';
import ImgComponent from '../../common/img-component/img-component';

interface ICountryFlagLogoProps {
  countryCode?: string;
}
const CountryFlagLogo = (props: ICountryFlagLogoProps) => {
  if (!props.countryCode) return <div></div>;
  return (
    <ImgComponent
      customStyles={{
        width: '1.8rem',
        height: '1.6rem',
      }}
      imageURL={getCountryFlagIcon(props.countryCode)}
      alt="marketplace-logo"
    />
  );
};

export default CountryFlagLogo;
