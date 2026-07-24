import { Route, Routes } from 'react-router-dom';
import ClientSideCustomTable from './client-side-custom-table/client-side-custom-table';
import styles from './custom-table-page.module.scss';
import ServerSideCustomTable from './server-side-custom-table/server-side-custom-table';
/* eslint-disable-next-line */
export interface CustomTablePageProps {}

export function CustomTablePage(props: CustomTablePageProps) {
  return (
    <div className={styles.wrapper}>
      <Routes>
        <Route path="/server/*" element={<ServerSideCustomTable />} />

        <Route path="/client/*" element={<ClientSideCustomTable />} />
      </Routes>
    </div>
  );
}

export default CustomTablePage;
