import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import { flexRender, Header } from '@tanstack/react-table';
import { ICustomTableStylesHelper } from 'src/interfaces/custom-table/custom-table.interfaces';
import customTableUtils from 'src/utils/custom-table.utils';
import styles from './custom-td.module.scss';

/* eslint-disable-next-line */
export interface CustomTdProps<T> {
  footer: Header<T, unknown>;
  customStyles?: ICustomTableStylesHelper;
  pinFooter?: boolean;
  isLoading?: boolean;
}

export function CustomTd<T>(props: CustomTdProps<T>) {
  const { footer, customStyles, pinFooter, isLoading } = props;

  if (!footer) return <td></td>;

  return (
    <td
      key={footer.id}
      style={{
        width: `calc(var(--col-${footer.column.id}-size) * 1px)`,
        ...customTableUtils.getCommonPinningStyles(
          footer.column,
          false,
          pinFooter
        ),
      }}
      className={`${styles.td} ${customStyles?.className}`}
    >
      <div className={`${styles.wrapper} ${customStyles?.wrapper}`}>
        {isLoading === true ? (
          <SkeletonComponent height={'4rem'} width={'10rem'} color="#f4f4f4" />
        ) : (
          <div className={`${styles.tdDiv} ${customStyles?.tdDiv}`}>
            {flexRender(footer.column.columnDef.footer, footer.getContext())}
          </div>
        )}
      </div>
    </td>
  );
}

export default CustomTd;
