import { imageUrls } from '@/constants/assets/images.constants';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ImgComponent from '../img-component/img-component';
import styles from './selected-filter-list.module.scss';

interface ISelectedFilterListProps {
  selectedList: string[];
  handleClearSingleFilter: (value: string) => void;
  handleClearFilter: () => void;
}

export default function SelectedFilterList({
  selectedList,
  handleClearSingleFilter,
  handleClearFilter,
}: ISelectedFilterListProps) {
  const isAllSelected = (selectedOptions: string[]) =>
    selectedOptions.some((opt) => opt.toLowerCase() === 'all');

  return (
    <div className={styles.filterContainer}>
      {selectedList.length > 0 && (
        <div className={styles.filterList}>
          <Typography
            variant="body1"
            fontSize="1.2rem"
            fontWeight={500}
            sx={{ opacity: 0.5 }}
          >
            Filters
          </Typography>

          {!isAllSelected(selectedList) ? (
            selectedList.map((item) => (
              <div key={item} className={styles.singleFilterContainer}>
                <Typography
                  className={styles.singleFilter}
                  fontSize="1.2rem"
                  fontWeight={500}
                >
                  {item}
                </Typography>
                <IconButton
                  disableRipple
                  sx={{ width: 'auto', height: 'auto', padding: '0.2rem' }}
                  onClick={() => handleClearSingleFilter(item)}
                >
                  <ImgComponent imageURL={imageUrls.closeIcon} alt="close" />
                </IconButton>
              </div>
            ))
          ) : (
            <div className={styles.singleFilterContainer}>
              <Typography
                className={styles.singleFilter}
                fontSize="1.2rem"
                fontWeight={500}
              >
                All
              </Typography>
              <IconButton
                disableRipple
                sx={{ width: 'auto', height: 'auto', padding: '0.2rem' }}
                onClick={handleClearFilter}
              >
                <ImgComponent imageURL={imageUrls.closeIcon} alt="close" />
              </IconButton>
            </div>
          )}

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
  );
}
