import Button from '@mui/material/Button';
import React from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import {
  primaryButtonNewDesignStyles,
  primaryButtonStyles,
} from './primary-button-styles';

interface IPrimaryButtonProps {
  buttonText: string;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  buttonFunction: () => void;
  disabled: boolean;
  isButtonIconRequired?: boolean;
  buttonIcon?: React.ReactNode;
  isEndIcon?: boolean;
  isHoverTooltipEnabled?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPlacement;
  bgColor?: string;
  textColor?: string;
  disableRipple?: boolean;
  stopPropagation?: boolean;
  isNewDesign?: boolean;
  borderRadius?: string;
}

export default function PrimaryButton({
  buttonText,
  width,
  height,
  fontSize,
  fontWeight,
  buttonFunction,
  isButtonIconRequired,
  buttonIcon,
  isEndIcon = false,
  disabled,
  isHoverTooltipEnabled = false,
  tooltipText,
  tooltipPosition = TooltipPlacement.Top,
  bgColor,
  textColor = '#fff',
  disableRipple = true,
  stopPropagation = false,
  isNewDesign = false,
  borderRadius,
}: IPrimaryButtonProps) {
  return (
    <HoverInfoTooltip
      title={isHoverTooltipEnabled && tooltipText ? tooltipText : ''}
      disableTooltip={!isHoverTooltipEnabled}
      position={tooltipPosition}
    >
      <div
        data-test="primary-button"
        style={{
          height: height ? height : 'auto',
          width: width ? width : '6rem',
          padding: 0,
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <Button
          disableRipple={disableRipple}
          sx={{
            ...(isNewDesign
              ? primaryButtonNewDesignStyles(textColor, bgColor)
              : primaryButtonStyles(textColor, bgColor)),
            height: height ? height : 'auto',
            width: width ? width : '6rem',
            fontSize: fontSize ? fontSize : '1.1rem',
            fontWeight: fontWeight ? fontWeight : isNewDesign ? 400 : 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...(borderRadius && { borderRadius }),
          }}
          variant="contained"
          startIcon={
            isButtonIconRequired === true && isEndIcon === false && buttonIcon
          }
          endIcon={
            isButtonIconRequired === true && isEndIcon === true && buttonIcon
          }
          onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
            buttonFunction();
          }}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>
    </HoverInfoTooltip>
  );
}
