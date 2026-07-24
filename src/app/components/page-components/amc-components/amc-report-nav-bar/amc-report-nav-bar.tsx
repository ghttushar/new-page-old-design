import { useParams } from 'react-router-dom';
import AMCCustomBreadcrumbs from 'src/app/components/common/breadcrumb/amc-breadcrumb';
import { convertUtcToTimezoneDate } from 'src/utils/datetime.utils';
import styles from './amc-report-nav-bar.module.scss';

interface IAMCReportNavBarProps {
  startDate: string;
  endDate: string;
}

const AMCReportNavBar: React.FC<IAMCReportNavBarProps> = ({
  startDate,
  endDate,
}) => {
  const { workflowName } = useParams();
  const formattedStartDate = convertUtcToTimezoneDate(startDate);
  const formattedEndDate = convertUtcToTimezoneDate(endDate);

  return (
    <div className={styles.amcNavContainer}>
      <AMCCustomBreadcrumbs workflowName={workflowName as string} />
      <p className={styles.dateRange}>
        <b>Date Range:</b> {formattedStartDate} - {formattedEndDate}
      </p>
    </div>
  );
};

export default AMCReportNavBar;
