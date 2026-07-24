import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';

interface IHoverInfoTooltipProps {
  title: string | ReactElement;
  children: ReactElement<any>;
  position?: TooltipPlacement;
  disableTooltip?: boolean;
  backgroundColor?: string;
  padding?: string;
  fontSize?: string;
}

export default function HoverInfoTooltip(props: IHoverInfoTooltipProps) {
  const {
    title,
    children,
    position,
    disableTooltip = false,
    backgroundColor = '#322F35',
    padding = '1rem',
    fontSize = '1rem',
  } = props;

  const BootstrapHoverInfoTooltip = styled((tooltipProps: TooltipProps) => (
    <Tooltip
      {...tooltipProps}
      arrow
      classes={{ popper: tooltipProps.className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: backgroundColor,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor,
      fontSize: fontSize,
      padding: padding,
      borderRadius: '0.4rem',
      maxWidth: '20rem',
      border: `1px solid ${backgroundColor}`,
      boxShadow: '0 0.4rem 0.4rem 0 rgba(0,0,0,0.15)',
    },
  }));

  return (
    <BootstrapHoverInfoTooltip
      title={title}
      placement={position ? position : 'top'}
      disableHoverListener={disableTooltip}
    >
      {children}
    </BootstrapHoverInfoTooltip>
  );
}
