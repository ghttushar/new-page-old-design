import { imageUrls } from '@/constants/assets/images.constants';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import styles from './info-icon.module.scss';

interface IInfoIconProps {
  title: string;
  position?: TooltipPlacement;
  customIconStyles?: React.CSSProperties;
  customTooltipStyles?: any;
  disabled?: boolean;
}

export default function InfoIcon(props: IInfoIconProps) {
  const {
    title,
    position,
    customTooltipStyles,
    customIconStyles,
    disabled = false,
  } = props;
  const BootstrapTooltip = styled((tooltipProps: TooltipProps) => (
    <Tooltip
      {...tooltipProps}
      arrow
      classes={{ popper: tooltipProps.className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#322F35',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#322F35',
      fontSize: '1rem',
      padding: '1rem',
      borderRadius: '0.4rem',
      maxWidth: '30rem',
      whiteSpace: 'pre-wrap',
      border: '1px solid #322F35',
    },
  }));

  return (
    <span style={{ display: 'inline-block', verticalAlign: 'top' }}>
      <BootstrapTooltip
        title={title}
        placement={position ? position : 'top'}
        sx={{
          cursor: 'pointer',
          [`& .${tooltipClasses.tooltip}`]: {
            ...customTooltipStyles,
          },
        }}
        disableHoverListener={disabled}
      >
        <img
          src={imageUrls.info}
          alt={title}
          style={customIconStyles}
          className={styles.info}
        />
      </BootstrapTooltip>
    </span>
  );
}
