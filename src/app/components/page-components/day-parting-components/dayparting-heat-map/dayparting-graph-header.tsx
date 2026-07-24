import { AntSwitch } from 'src/app/components/common/ant-switch/ant-switch';
import styles from './dayparting-graph.module.scss';

interface IDaypartingGraphHeaderProps {
  isChecked: boolean;
  handleAntSwitchChange: () => void;
}

const DaypartingGraphHeader = (props: IDaypartingGraphHeaderProps) => {
  const { isChecked, handleAntSwitchChange } = props;
  return (
    <div className={styles.headerContainer}>
      <div className={styles.content}>
        <div className={styles.contentTitles}>
          <h5>Show Line Chart</h5>
        </div>
        <AntSwitch
          disabled={false}
          checked={isChecked}
          onChange={handleAntSwitchChange}
          inputProps={{ 'aria-label': 'ant design' }}
          sx={{ '&:hover': { cursor: 'not-allowed' } }}
        />
      </div>
    </div>
  );
};

export default DaypartingGraphHeader;
