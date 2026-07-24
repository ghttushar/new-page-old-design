import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import InfoIcon from '../info-icon/info-icon';
import styles from './ant-switch.module.scss';

interface AntSwitchProps {
  switchWidth?: number;
  switchHeight?: number;
  trackBg?: string;
  checkedTrackBg?: string;
  isNewDesign?: boolean;
}

export const AntSwitch = styled(Switch, {
  shouldForwardProp: (prop) =>
    ![
      'switchWidth',
      'switchHeight',
      'trackBg',
      'checkedTrackBg',
      'isNewDesign',
    ].includes(prop as string),
})<AntSwitchProps>(
  ({
    theme,
    switchWidth = 28,
    switchHeight = 16,
    trackBg = 'rgba(0,0,0,.25)',
    checkedTrackBg = '#77469B',
    isNewDesign = false,
  }) => {
    const thumbSize = switchHeight - 4;
    const translateX = switchWidth - thumbSize - 4;

    return {
      width: switchWidth,
      height: switchHeight,
      padding: 0,
      display: 'flex',

      '&:active': {
        '& .MuiSwitch-thumb': {
          width: thumbSize + 3,
        },

        '& .MuiSwitch-switchBase.Mui-checked': {
          transform: 'translateX(9px)',
        },
      },

      '& .MuiSwitch-switchBase': {
        padding: 2,

        '&.Mui-checked': {
          transform: `translateX(${translateX}px)`,
          color: '#fff',

          '& + .MuiSwitch-track': {
            opacity: 1,
            background: isNewDesign
              ? 'linear-gradient(99.66deg, #894DB5 4.22%, #6205A7 89%)'
              : checkedTrackBg,
          },

          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.95)',
            '& + .MuiSwitch-track': {
              opacity: 0.5,
              background: isNewDesign
                ? 'linear-gradient(99.66deg, #894DB5 4.22%, #6205A7 89%)'
                : checkedTrackBg,
              cursor: 'not-allowed ',
            },
          },
        },
      },

      '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: thumbSize,
        height: thumbSize,
        borderRadius: thumbSize / 2,
        transition: theme.transitions.create(['width'], {
          duration: 200,
        }),
      },
      '& .MuiSwitch-track': {
        borderRadius: switchHeight / 2,
        opacity: 1,
        background:
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : trackBg,
        boxSizing: 'border-box',
      },

      '&.paused': {
        '& .MuiSwitch-switchBase': {
          '&.Mui-disabled': {
            '& + .MuiSwitch-track': {
              opacity: 0.75,
              background: '#BFBFBF',
              cursor: 'not-allowed ',
            },
          },
        },
        '& .MuiSwitch-track': {
          opacity: 1,
          background: '#BFBFBF',
        },
      },
    };
  }
);

/* 
NOTE: If toggling switch needs to be enabled then tooltip needs to be disabled.
*/
interface ICustomAntSwitchTooltipProps {
  isSwitchDisabled?: boolean;
  isTooltipDisabled?: boolean;
  isChecked: boolean;
  onChange: () => void;
  className: string;
  tooltipTitle: string;
  tooltipPosition: TooltipPlacement;
  isNewDesign?: boolean;
  switchWidth?: number;
  switchHeight?: number;
  trackBg?: string;
  checkedTrackBg?: string;
}

export default function CustomAntSwitchTooltip({
  isNewDesign = false,
  ...props
}: ICustomAntSwitchTooltipProps) {
  return (
    <div
      className={styles.customAntSwitchContainer}
      style={{ cursor: props.isSwitchDisabled ? 'not-allowed' : 'pointer' }}
    >
      <AntSwitch
        disabled={props.isSwitchDisabled}
        checked={props.isChecked}
        inputProps={{ 'aria-label': 'ant design' }}
        sx={{
          '&:hover': { cursor: 'not-allowed' },
        }}
        isNewDesign={isNewDesign}
        {...props}
      />
      <div
        className={styles.infoIconWrapper}
        style={{
          pointerEvents: props.isTooltipDisabled ? 'none' : 'all',
          zIndex: props.isTooltipDisabled ? '-1' : '',
        }}
      >
        <InfoIcon
          title={props.tooltipTitle}
          position={props.tooltipPosition}
          customIconStyles={{
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}
