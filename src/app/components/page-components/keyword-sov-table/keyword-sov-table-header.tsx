import Button from '@mui/material/Button';
import { IKeywordSOVTable } from 'src/interfaces/keyword-sov.interface';
import { IProductSOVTableData } from 'src/interfaces/product-sov.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import DownloadTableButton from '../../common/download-button/download-table-button';
import styles from './keyword-sov-table-header.module.scss';

interface IKeywordSovTableHeaderProps {
  exportData: IKeywordSOVTable[] | IProductSOVTableData[];
  isGraphHidden: boolean;
  handleShowGraph: () => void;
  exportFileName: string;
}

export default function KeywordSovTableHeader({
  exportData,
  isGraphHidden,
  handleShowGraph,
  exportFileName,
}: IKeywordSovTableHeaderProps) {
  const dispatch = useAppDispatch();

  const handleDownload = () => {
    dispatch(
      showSuccessToastMessage({
        title: 'Downloaded Successfully',
      })
    );
  };

  return (
    <div className={styles.headerContainer}>
      <div onClick={handleDownload}>
        <DownloadTableButton
          data={exportData}
          filename={exportFileName}
          squareDimension={`2.5rem`}
        />
      </div>

      {isGraphHidden ? (
        <Button
          className={styles.showChartButton}
          disableRipple
          onClick={handleShowGraph}
        >
          Show Chart
        </Button>
      ) : (
        ''
      )}
    </div>
  );
}
