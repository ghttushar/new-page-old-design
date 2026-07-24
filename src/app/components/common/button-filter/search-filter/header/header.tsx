import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import sxStyles from '../styles';
import styles from './header.module.scss';

export interface IHeaderProps {
  handleApplyClick: () => void;
  selectedCount: number;
}

export function Header(props: IHeaderProps) {
  const { handleApplyClick, selectedCount } = props;
  return (
    <div
      className={styles.optionFilterOptionsHeader}
      data-test="options-header"
    >
      <Typography fontSize="1rem" fontWeight={600}>
        {selectedCount} Selected
      </Typography>
      <Button
        size="small"
        disableRipple
        onClick={handleApplyClick}
        sx={sxStyles.buttonStyles}
      >
        Apply
      </Button>
    </div>
  );
}

export default Header;
