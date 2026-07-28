import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { GlobalDataTestIds } from 'cypress/enums/global';
import React from 'react';
import { FolderDashedIcon } from '@phosphor-icons/react';
import styles from './empty-state.module.scss';

export interface IEmptyStateProps {
  emptyTitle: string;
  emptyDescription: string;
  lottieFile?: string;
  emptyLottieOptions?: unknown;
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
    isButtonRequired,
    buttonText,
    isButtonIconRequired,
    buttonIcon,
    buttonFunction,
    height,
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
      <FolderDashedIcon size={96} color="#c1c7d0" weight="thin" />

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
