import { IconButton } from '@mui/material';
import React from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import {
  altPrimaryButtonNewStyles,
  noBorderIconButtonStyles,
} from '../alt-primary-button/alt-primary-button-styles';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import { secondaryButtonStyles } from '../secondary-button/secondary-button-styles';
interface IPrimaryIconButtonProps {
  width?: string;
  height?: string;
  buttonFunction: () => void;
  disabled: boolean;
  buttonIcon: JSX.Element;
  isHoverTooltipEnabled?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPlacement;
  borderRadius?: string;
  hoverColor?: string;
  customStyles?: React.CSSProperties;
  IsNewDesign?: boolean;
  isBorderlessButton?: boolean;
}

export default function PrimaryIconButton({
  width,
  height,
  buttonFunction,
  disabled,
  buttonIcon,
  isHoverTooltipEnabled = false,
  tooltipText,
  tooltipPosition = TooltipPlacement.Top,
  borderRadius = '0.4rem',
  hoverColor,
  customStyles,
  IsNewDesign,
  isBorderlessButton = false,
}: IPrimaryIconButtonProps) {
  const icon = React.cloneElement(buttonIcon, {
    ...buttonIcon.props,
    color: disabled ? '#ddd' : buttonIcon.props.color,
  });
  return (
    <HoverInfoTooltip
      title={isHoverTooltipEnabled && tooltipText ? tooltipText : ''}
      disableTooltip={!isHoverTooltipEnabled}
      position={tooltipPosition}
      padding="0.5rem"
      fontSize="0.8rem"
    >
      <div
        style={{
          height: height ?? 'auto',
          width: width ?? 'auto',
          padding: 0,
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <IconButton
          disableRipple
          sx={{
            height: height ?? 'auto',
            width: width ?? 'auto',
            cursor: disabled ? 'not-allowed' : 'pointer',
            borderRadius: IsNewDesign ? '0.8rem' : borderRadius,
            ...(isBorderlessButton
              ? noBorderIconButtonStyles
              : IsNewDesign
              ? altPrimaryButtonNewStyles
              : secondaryButtonStyles(hoverColor)),
            ...customStyles,
          }}
          onClick={(e) => {
            e.stopPropagation();
            buttonFunction();
          }}
          disabled={disabled}
        >
          {icon}
        </IconButton>
      </div>
    </HoverInfoTooltip>
  );
}
