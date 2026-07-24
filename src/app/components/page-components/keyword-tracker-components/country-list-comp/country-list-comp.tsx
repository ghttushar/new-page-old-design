import ImgComponent from '@/app/components/common/img-component/img-component';
import { getCountryFlagIcon } from '@/utils';
import styles from './country-list-comp.module.scss';
interface CountryListWrapperProps {
  countryCodes: string[];
}
export function CountryListWrapper(props: CountryListWrapperProps) {
  const { countryCodes } = props;

  return (
    <div className={styles.container}>
      {countryCodes.map((countryCode, index) => {
        return (
          <div key={`${countryCode}-${index}`} className={styles.iconContainer}>
            <ImgComponent
              imageURL={getCountryFlagIcon(countryCode ?? '')}
              alt={`${countryCode}-flag`}
              customStyles={{
                width: '1.8rem',
                height: 'auto',
              }}
            />
            {countryCode ?? ''}
          </div>
        );
      })}
    </div>
  );
}
