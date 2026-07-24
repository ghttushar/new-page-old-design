import Button from '@mui/material/Button';
import React from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import { newTextButtonStyles, textButtonOldStyles } from './text-button-styles';
import styles from './text-button.module.scss';

interface ITextButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
  handleClick?: () => void;
  customStyles?: any;
  isDisabled?: boolean;
  disableReason?: string;
  tooltipPosition?: string;
  isVisible?: boolean;
  buttonStartIcon?: React.ReactNode;
  buttonEndIcon?: React.ReactNode;
  isSelected?: boolean;
  isNewDesign?: boolean;
}

export default function TextButton({
  label,
  handleClick,
  customStyles,
  isDisabled = false,
  disableReason,
  tooltipPosition,
  isVisible = true,
  buttonStartIcon,
  buttonEndIcon,
  isSelected = false,
  isNewDesign = false,
  ...buttonProps
}: ITextButtonProps) {
  const customButton = (
    <Button
      {...buttonProps}
      sx={{
        ...(isNewDesign === true
          ? newTextButtonStyles(isDisabled, isSelected)
          : {
              ...textButtonOldStyles,
              '& .MuiButton-startIcon': {
                marginLeft: 0,
                marginRight: '0.2rem',
                svg: {
                  fill: isDisabled ? '#bdbdbd' : '',
                },
              },
            }),
        ...customStyles,
      }}
      disableRipple
      onClick={(e) => {
        if (handleClick) {
          e.stopPropagation();
          handleClick();
        }
      }}
      disabled={isDisabled}
      startIcon={buttonStartIcon ? buttonStartIcon : null}
      endIcon={buttonEndIcon ? buttonEndIcon : null}
    >
      <span>{label}</span>
    </Button>
  );

  if (!isVisible) return null;

  if (!isDisabled) {
    return customButton;
  }

  return (
    <HoverInfoTooltip
      title={disableReason ?? 'This feature is not available yet.'}
      disableTooltip={!isDisabled}
      position={(tooltipPosition ?? 'bottom') as TooltipPlacement}
    >
      <span
        className={
          isDisabled ? styles.disabledComponent : styles.enabledComponent
        }
      >
        {customButton}
      </span>
    </HoverInfoTooltip>
  );
}
