import { imageUrls } from '@/constants/assets/images.constants';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ISOV, ISovFilter } from 'src/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectSelectedBrands,
  setSelectedBrands,
} from 'src/redux/slices/market-intelligence/market-intelligence.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { getFileNameDateTime } from 'src/utils';
import ButtonFilter from '../button-filter/button-filter';
import DownloadTableButton from '../download-button/download-table-button';
import ImgComponent from '../img-component/img-component';
import styles from './table-header.module.scss';

export interface ISOVExportData {
  id?: number;
  brand: string;
  organic_sov: number | string;
  sponsored_sov: number | string;
  total_sov: number | string;
  appearance: number | string;
  product_count: number | string;
}
interface ITableHeaderProps {
  sovData: ISOV[];
  filters: ISovFilter;
  isHidden: boolean;
  handleToggleHide: () => void;
}
const TableHeader: React.FC<ITableHeaderProps> = ({
  sovData,
  filters,
  isHidden,
  handleToggleHide,
}) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [exportData, setExportData] = useState<ISOVExportData[]>([]);
  const selectedBrands = useAppSelector(selectSelectedBrands);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const brandList: string[] = sovData.map((item) => item.brand);
    const uniqueBrands = Array.from(new Set(brandList));
    setBrands(uniqueBrands);
    const _sovData = sovData.map((item) => {
      const { label, ...rest } = item;
      return rest;
    });
    setExportData(_sovData);
  }, [sovData]);

  const handleClearFilter = () => {
    dispatch(setSelectedBrands([]));
  };

  const handleClearSingleFilter = (value: string) => {
    const _brands = [...selectedBrands];
    const idx = _brands.indexOf(value);
    _brands.splice(idx, 1);
    dispatch(setSelectedBrands(_brands));
  };

  const handleDownload = () => {
    dispatch(
      showSuccessToastMessage({
        title: 'Downloaded Successfully',
      })
    );
  };

  return (
    <div className={styles.container} data-test="table-header">
      <div>
        <div className={styles.title}>
          <h4>All Brand Coverage</h4>
        </div>

        {selectedBrands.length > 0 && (
          <div className={styles.filterList} data-test="filter-list">
            <Typography
              variant="body1"
              fontSize="1.2rem"
              fontWeight={500}
              sx={{ opacity: 0.5 }}
            >
              Filters
            </Typography>

            {selectedBrands.map((brand) => (
              <div key={brand} className={styles.singleFilterContainer}>
                <Typography fontSize="1.2rem" fontWeight={500}>
                  {brand}
                </Typography>
                <IconButton
                  disableRipple
                  sx={{ width: 'auto', height: 'auto', padding: '0.2rem' }}
                  onClick={() => handleClearSingleFilter(brand)}
                >
                  <ImgComponent imageURL={imageUrls.closeIcon} alt="close" />
                </IconButton>
              </div>
            ))}

            <Button
              className={styles.filterClearButton}
              disableRipple
              sx={{
                height: '2.5rem',
              }}
              onClick={handleClearFilter}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className={styles.options}>
        {isHidden === true && (
          <Button
            className={styles.showChartButton}
            disableRipple
            onClick={handleToggleHide}
          >
            Show Chart
          </Button>
        )}

        <ButtonFilter title={'Brand'} brands={brands} />

        <div onClick={handleDownload}>
          <DownloadTableButton
            data={exportData}
            filename={`all-brands-sov-data_${getFileNameDateTime(filters)}.csv`}
            squareDimension={`2.5rem`}
          />
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
