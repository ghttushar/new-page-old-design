import Button from '@mui/material/Button';
import React from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import { secondaryButtonStyles } from './secondary-button-styles';
interface ISecondaryButtonProps {
  buttonText: string;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  buttonFunction: () => void | undefined;
  disabled: boolean;
  isButtonIconRequired?: boolean;
  buttonIcon?: React.ReactNode;
  isHoverTooltipEnabled?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPlacement;
  borderRadius?: string;
  hoverColor?: string;
  stopPropagation?: boolean;
}

export default function SecondaryButton({
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
  tooltipPosition = TooltipPlacement.Top,
  borderRadius = '0.4rem',
  hoverColor,
  stopPropagation = false,
}: ISecondaryButtonProps) {
  return (
    <HoverInfoTooltip
      title={isHoverTooltipEnabled && tooltipText ? tooltipText : ''}
      disableTooltip={!isHoverTooltipEnabled}
      position={tooltipPosition}
    >
      <div
        style={{
          height: height ? height : 'auto',
          width: width ? width : 'auto',
          padding: 0,
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <Button
          disableRipple
          sx={{
            ...secondaryButtonStyles(hoverColor),
            height: height ? height : 'auto',
            width: width ? width : 'auto',
            fontSize: fontSize ? fontSize : '1.2rem',
            fontWeight: fontWeight ? fontWeight : 400,
            cursor: disabled ? 'not-allowed' : 'pointer',
            borderRadius,
          }}
          startIcon={isButtonIconRequired === true && buttonIcon}
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
