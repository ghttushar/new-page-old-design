import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingWalmartSPAccountLevel from './account-level/wmt-sp-account-level';

export default function AdvertisingWalmartSPRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={
            <PrivateRoute component={<AdvertisingWalmartSPAccountLevel />} />
          }
        />
      </Routes>
    </div>
  );
}
