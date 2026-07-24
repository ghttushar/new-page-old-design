import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAmcSubHeader from '@/hooks/use-amc-sub-header.hook';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS, PAGINATION_MODEL } from 'src/constants';
import { amcInstancesColumns } from './instances-page-columns';
import styles from './instances-page.module.scss';

export default function InstancesPage() {
  useAmcSubHeader(PageTitleEnum.INSTANCES, PAGE_TITLE_TOOLTIPS.INSTANCES);
  const allInstances = localStorageUtils.getAllInstances();

  return (
    <div className={styles.instanceContainer}>
      <div className={styles.subContainer}>
        <div className={styles.wrapper}>
          <CustomTableWrapper
            data={allInstances || []}
            columns={amcInstancesColumns}
            width="100%"
            height="50rem"
            pageSizes={PAGE_SIZE_OPTIONS}
            initialPagination={{
              pageIndex: PAGINATION_MODEL.page,
              pageSize: PAGINATION_MODEL.pageSize,
            }}
          />
        </div>
      </div>
    </div>
  );
}
