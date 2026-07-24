import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingOverall from './account-level/amz-overall-account-level';

export default function AdvertisingOverallRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={<PrivateRoute component={<AdvertisingOverall />} />}
        />
      </Routes>
    </div>
  );
}
