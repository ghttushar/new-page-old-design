import { IconButton } from '@mui/material';

import { imageUrls } from '@/constants/assets/images.constants';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '../img-component/img-component';

const archiveIconStyles = {
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

interface IArchiveButtonProps {
  squareDimension: string;
  isLoading: boolean;
  handleArchive: () => void;
}

const ArchiveButton = (props: IArchiveButtonProps) => {
  const { squareDimension, isLoading, handleArchive } = props;
  return (
    <div
      style={{
        cursor: isLoading ? 'not-allowed' : 'pointer',
      }}
    >
      <HoverInfoTooltip title={'Archive'} position={TooltipPlacement.Bottom}>
        <IconButton
          sx={{
            ...archiveIconStyles,
            width: squareDimension,
            height: squareDimension,
          }}
          disableRipple
          disabled={isLoading}
          onClick={handleArchive}
        >
          <ImgComponent imageURL={imageUrls.archiveIcon} alt="archive" />
        </IconButton>
      </HoverInfoTooltip>
    </div>
  );
};

export default ArchiveButton;
