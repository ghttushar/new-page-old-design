import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingSDAccountLevel from './account-level/amz-sd-account-level';

export default function AdvertisingSDRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={<PrivateRoute component={<AdvertisingSDAccountLevel />} />}
        />
      </Routes>
    </div>
  );
}
