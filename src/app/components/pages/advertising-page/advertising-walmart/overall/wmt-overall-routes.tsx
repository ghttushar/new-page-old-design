import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingWalmartOverall from './account-level/wmt-overall-account-level';

export default function AdvertisingWalmartOverallRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={<PrivateRoute component={<AdvertisingWalmartOverall />} />}
        />
      </Routes>
    </div>
  );
}
