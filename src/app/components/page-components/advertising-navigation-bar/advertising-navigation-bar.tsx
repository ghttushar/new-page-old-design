import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import Button from '@mui/material/Button';
import { useMemo } from 'react';
import styles from './advertising-navigation-bar.module.scss';

interface IAdvertisingNavigationBarProps {
  data: IAdvertisingNavigationBarOption[];
  selectedOption: IAdvertisingNavigationBarOption;
  handleSelectedOption?: (option: IAdvertisingNavigationBarOption) => void;
  isTableLoading: boolean;
}
export default function AdvertisingNavigationBar(
  props: IAdvertisingNavigationBarProps
) {
  const { data, selectedOption, handleSelectedOption, isTableLoading } = props;

  const handleSelect = (option: IAdvertisingNavigationBarOption) => {
    if (handleSelectedOption) {
      handleSelectedOption(option);
    }
  };

  const updatedNavBarOptions = useMemo(() => {
    return data.filter((item) => item.isVisible ?? true);
  }, [data]);

  const isComponentDisabled = useMemo(() => {
    return !updatedNavBarOptions.length;
  }, [updatedNavBarOptions]);

  return (
    <div className={styles.container}>
      <div
        className={styles.containerItem}
        aria-disabled={isComponentDisabled}
        style={{
          pointerEvents: isComponentDisabled ? 'none' : 'auto',
          opacity: isComponentDisabled ? '0.7' : '1',
        }}
        onClick={isComponentDisabled ? (e) => e.stopPropagation() : undefined}
        onKeyDown={isComponentDisabled ? (e) => e.preventDefault() : undefined}
      >
        {isComponentDisabled === false &&
          updatedNavBarOptions.map((item) => (
            <div
              key={item.value}
              className={
                item.isDisabled || isTableLoading
                  ? styles.disabledContainerItems
                  : styles.notDisabledContainerItems
              }
            >
              <Button
                className={styles.containerItemButton}
                variant="text"
                onClick={() => {
                  handleSelect(item);
                }}
                sx={{
                  color:
                    selectedOption.value === item.value ? '#77469B' : '#000',
                  fontWeight:
                    selectedOption.value === item.value ? '700' : '500',
                  textTransform: 'none',
                  fontSize: '1.2rem',
                }}
                disableRipple
                disabled={item.isDisabled || isTableLoading}
              >
                {item.label}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
