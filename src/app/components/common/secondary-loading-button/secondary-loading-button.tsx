import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { LoadingButton } from '@mui/lab';
import { secondaryButtonStyles } from '../secondary-button/secondary-button-styles';

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
}

export default function SecondaryLoadingButton({
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
  bgColor = '#77469b',
  textColor = '#fff',
}: IPrimaryLoadingButtonProps) {
  return (
    <LoadingButton
      disableRipple
      sx={{
        ...secondaryButtonStyles(bgColor),
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
