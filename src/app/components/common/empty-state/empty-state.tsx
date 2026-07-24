import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { GlobalDataTestIds } from 'cypress/enums/global';
import { LottieOptions } from 'lottie-react';
import React from 'react';
import BaseLottieAnimation from '../loader/base-lottie-animation';
import styles from './empty-state.module.scss';

export interface IEmptyStateProps {
  emptyTitle: string;
  emptyDescription: string;
  lottieFile: string;
  emptyLottieOptions: Omit<LottieOptions, 'animationData'>;
  isButtonRequired: boolean;
  buttonText?: string;
  isButtonIconRequired?: boolean;
  buttonIcon?: React.ReactNode;
  buttonFunction?: () => void;
  height?: string;
}

const EmptyState: React.FC<IEmptyStateProps> = (props) => {
  const {
    emptyTitle,
    emptyDescription,
    emptyLottieOptions,
    isButtonRequired,
    buttonText,
    isButtonIconRequired,
    buttonIcon,
    buttonFunction,
    height,
    lottieFile,
  } = props;

  const buttonStyles = {
    '.MuiButton-startIcon': {
      marginRight: 0,
    },
  };

  return (
    <Box
      className={styles.emptyContainer}
      sx={{ height: height ? height : '80vh' }}
      data-test={GlobalDataTestIds.EMPTY_PLACEHOLDER}
    >
      <BaseLottieAnimation
        lottieFile={lottieFile}
        lottieOptions={emptyLottieOptions}
        style={{ height: '16rem', width: '25rem' }}
      />

      <div className={styles.emptyDialog}>
        <Typography variant="h3" fontSize="2.4rem" fontWeight={700} mb={1}>
          {emptyTitle}
        </Typography>
        <Typography
          variant="subtitle1"
          color="#475467"
          fontSize="1.4rem"
          fontWeight={400}
          className={styles.emptyDescription}
        >
          {emptyDescription}
        </Typography>
      </div>
      {isButtonRequired && (
        <Button
          className={styles.addButton}
          variant="contained"
          startIcon={isButtonIconRequired ? buttonIcon : undefined}
          sx={buttonStyles}
          onClick={buttonFunction}
          disableTouchRipple
        >
          {buttonText || 'Add Keyword'}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
