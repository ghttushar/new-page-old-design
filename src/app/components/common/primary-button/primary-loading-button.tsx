import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { LoadingButton } from '@mui/lab';
import { primaryButtonStyles } from './primary-button-styles';

interface IPrimaryLoadingButtonProps {
  buttonText: string;
  buttonFunction: () => void;
  disabled: boolean;
  isLoading: boolean;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  isButtonIconRequired?: boolean;
  buttonIcon?: React.ReactNode;
  isHoverTooltipEnabled?: boolean;
  tooltipText?: string;
  tooltipPosition?: TooltipPlacement;
  bgColor?: string;
  textColor?: string;
  disableRipple?: boolean;
}

export default function PrimaryLoadingButton({
  buttonText,
  width,
  height,
  fontSize,
  fontWeight,
  buttonFunction,
  isButtonIconRequired,
  buttonIcon,
  disabled,
  isLoading,
  isHoverTooltipEnabled = false,
  tooltipText,
  tooltipPosition = TooltipPlacement.Top,
  bgColor,
  textColor = '#fff',
  disableRipple = true,
}: IPrimaryLoadingButtonProps) {
  return (
    <LoadingButton
      disableRipple={disableRipple}
      sx={{
        ...primaryButtonStyles(textColor, bgColor),
        height: height ? height : 'auto',
        width: width ? width : '6rem',
        fontSize: fontSize ? fontSize : '1.2rem',
        fontWeight: fontWeight ? fontWeight : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'none',
      }}
      variant="contained"
      startIcon={isButtonIconRequired === true && buttonIcon}
      onClick={buttonFunction}
      disabled={disabled}
      loading={isLoading}
    >
      {buttonText}
    </LoadingButton>
  );
}
