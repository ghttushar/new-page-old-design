import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingWalmartSBAccountLevel from './account-level/wmt-sb-account-level';

export default function AdvertisingWalmartSBRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={
            <PrivateRoute component={<AdvertisingWalmartSBAccountLevel />} />
          }
        />
      </Routes>
    </div>
  );
}
