import Button from '@mui/material/Button';
import React from 'react';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import {
  altPrimaryButtonNewStyles,
  altPrimaryButtonStyles,
} from './alt-primary-button-styles';

interface IAltPrimaryButtonProps {
  buttonText: string;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  buttonFunction: () => void;
  disabled: boolean;
  isButtonIconRequired?: boolean;
  buttonIcon?: React.ReactNode;
  isHoverTooltipEnabled?: boolean;
  tooltipText?: string;
  stopPropagation?: boolean;
  bgColor?: string;
  textColor?: string;
  disableRipple?: boolean;
  isNewDesign?: boolean;
}

export default function AltPrimaryButton({
  buttonText,
  width,
  height,
  fontSize,
  fontWeight,
  buttonFunction,
  isButtonIconRequired,
  buttonIcon,
  disabled,
  isHoverTooltipEnabled = false,
  tooltipText,
  stopPropagation = false,
  bgColor = '#fbf3ff',
  textColor = '#77469b',
  disableRipple = true,
  isNewDesign,
}: IAltPrimaryButtonProps) {
  return (
    <HoverInfoTooltip
      title={isHoverTooltipEnabled && tooltipText ? tooltipText : ''}
      disableTooltip={!isHoverTooltipEnabled}
    >
      <div
        style={{
          height: height ? height : 'auto',
          width: width ? width : '6rem',
          padding: 0,
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
        }}
      >
        <Button
          disableRipple={disableRipple}
          sx={{
            height: height ? height : 'auto',
            width: width ? width : '6rem',
            fontSize: fontSize ? fontSize : '1.1rem',
            fontWeight: fontWeight ? fontWeight : isNewDesign ? 400 : 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...(isNewDesign
              ? altPrimaryButtonNewStyles
              : altPrimaryButtonStyles(bgColor, textColor)),
          }}
          variant="contained"
          startIcon={isButtonIconRequired === true && buttonIcon}
          onClick={buttonFunction}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>
    </HoverInfoTooltip>
  );
}
