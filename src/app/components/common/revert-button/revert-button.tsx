import { IconButton } from '@mui/material';
import { ArrowsCounterClockwiseIcon } from '@phosphor-icons/react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';

const revertIconStyles = {
  background: '#fff',
  borderRadius: '0.4rem',
  border: '1px solid #dadeeb;',
  display: 'inline-flex',
  padding: '0.3rem',
  alignItems: 'center',
  height: '3rem',
  width: '3rem',

  '&.Mui-disabled': {
    cursor: 'not-allowed !important',
  },
  '&:hover': {
    borderColor: '#8b8b8b',
  },
};

interface IRevertButtonProps {
  squareDimension: string;
  isLoading: boolean;
  handleRevert: () => void;
}

const RevertButton = (props: IRevertButtonProps) => {
  const { squareDimension, isLoading, handleRevert } = props;
  return (
    <div
      style={{
        cursor: isLoading ? 'not-allowed' : 'pointer',
      }}
    >
      <HoverInfoTooltip title={'Revert'} position={TooltipPlacement.Bottom}>
        <IconButton
          sx={{
            ...revertIconStyles,
            width: squareDimension,
            height: squareDimension,
          }}
          disableRipple
          disabled={isLoading}
          onClick={handleRevert}
        >
          <ArrowsCounterClockwiseIcon size={15} color="#444444" />
        </IconButton>
      </HoverInfoTooltip>
    </div>
  );
};

export default RevertButton;
