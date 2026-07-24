import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import styles from './custom-chip-carousel.module.scss';

interface ICustomChipCarouselDotsProps<T> {
  itemsList: Array<T>;
  itemsPerPage: number;
  currItemIndex: number;
  isJIVADisabled: boolean;
}

export default function CustomChipCarouselDots<T>({
  itemsList,
  itemsPerPage,
  currItemIndex,
  isJIVADisabled,
}: ICustomChipCarouselDotsProps<T>) {
  const totalPages = useMemo(
    () => Math.ceil(itemsList.length / itemsPerPage),
    [itemsList, itemsPerPage]
  );

  const activePage = useMemo(
    () => Math.floor(currItemIndex / itemsPerPage),
    [currItemIndex, itemsPerPage]
  );

  return (
    <Stack direction="row" spacing={0.8}>
      {Array.from({ length: totalPages }).map((_, i) => (
        <div
          key={i}
          className={styles.actionDot}
          style={{
            width: i === activePage ? '32px' : '6px',
            backgroundColor:
              i === activePage && !isJIVADisabled ? '#77469B' : '#D9D9D9',
          }}
        />
      ))}
    </Stack>
  );
}
