import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import CustomChipCarouselDots from './custom-chip-carousel-dots';
import { navButtonStyles } from './custom-chip-carousel-styles';
import styles from './custom-chip-carousel.module.scss';

interface ICustomChipCarouselProps {
  suggestions: string[];
  onSuggestionClick: (text: string) => void;
  isJIVADisabled: boolean;
}

export default function CustomChipCarousel({
  suggestions,
  onSuggestionClick,
  isJIVADisabled,
}: ICustomChipCarouselProps) {
  const [index, setIndex] = useState<number>(0);
  const itemsPerPage = 2;

  const visibleItems = useMemo(
    () => suggestions.slice(index, index + itemsPerPage),
    [suggestions, index]
  );

  const handleNext = () => {
    setIndex((prev) => {
      const nextIndex = index + itemsPerPage;
      if (nextIndex >= suggestions.length) return prev;
      return nextIndex;
    });
  };

  const handlePrev = () => setIndex((prev) => Math.max(prev - itemsPerPage, 0));

  const handleSuggestionClick = (text: string) => {
    if (isJIVADisabled) return;
    onSuggestionClick(text);
  };

  return (
    <div
      className={styles.carouselContainer}
      style={{
        display: suggestions.length > 0 ? 'flex' : 'none',
      }}
    >
      <div className={styles.carouselActionContainer}>
        <IconButton
          onClick={handlePrev}
          disabled={index === 0 || isJIVADisabled}
          sx={navButtonStyles}
        >
          <CaretLeftIcon size={'1.5rem'} color="#464646" />
        </IconButton>

        {/* Suggestions */}
        <Stack
          direction="row"
          spacing="1rem"
          sx={{
            flex: 1,
            overflow: 'hidden',
            justifyContent: 'center',
            mx: '1rem',
          }}
        >
          {visibleItems.map((text, i) => (
            <div
              key={i}
              className={`${styles.suggestionChip} ${
                isJIVADisabled ? styles.suggestionChipDisabled : ''
              }`}
              title={text}
              onClick={() => handleSuggestionClick(text)}
            >
              {text}
            </div>
          ))}
        </Stack>

        <IconButton
          onClick={handleNext}
          disabled={
            index + itemsPerPage >= suggestions.length || isJIVADisabled
          }
          sx={navButtonStyles}
        >
          <CaretRightIcon size={'1.5rem'} color="#464646" />
        </IconButton>
      </div>

      {/* Dots */}
      <CustomChipCarouselDots
        itemsList={suggestions}
        itemsPerPage={itemsPerPage}
        currItemIndex={index}
        isJIVADisabled={isJIVADisabled}
      />
    </div>
  );
}
