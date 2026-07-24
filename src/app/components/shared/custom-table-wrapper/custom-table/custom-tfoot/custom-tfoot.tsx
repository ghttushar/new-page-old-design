import { Row, Table } from '@tanstack/react-table';
import { ICustomTableFooterStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import CustomTd from './custom-td/custom-td';
import styles from './custom-tfoot.module.scss';

/* eslint-disable-next-line */
export interface CustomTfootProps<T> {
  table: Table<T>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  customStyles?: ICustomTableFooterStyles;
  pinFooter?: boolean;
  isLoading?: boolean;
}

export function CustomTfoot<T>(props: CustomTfootProps<T>) {
  const { table, enableRowSelection, customStyles, pinFooter, isLoading } =
    props;
  const groups = table.getFooterGroups();

  if (!groups.length) return;
  const footerGroup = groups[0];
  return (
    <tfoot className={`${styles.tfoot} ${customStyles?.className}`}>
      {/* {table.getFooterGroups().map((footerGroup) => ( */}
      <tr
        className={`${styles.tr} ${customStyles?.tr?.className}`}
        key={footerGroup.id}
        style={{ height: 'auto' }}
      >
        {footerGroup.headers.map((footer) => {
          return (
            <CustomTd
              footer={footer}
              key={footer.id}
              customStyles={customStyles?.tr?.td}
              pinFooter={pinFooter}
              isLoading={isLoading}
            />
          );
        })}
      </tr>
      {/* ))} */}
    </tfoot>
  );
}

export default CustomTfoot;
