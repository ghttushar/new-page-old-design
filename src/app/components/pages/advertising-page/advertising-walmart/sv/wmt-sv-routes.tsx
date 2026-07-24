import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingWalmartSVAccountLevel from './account-level/wmt-sv-account-level';

export default function AdvertisingWalmartSVRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={
            <PrivateRoute component={<AdvertisingWalmartSVAccountLevel />} />
          }
        />
      </Routes>
    </div>
  );
}
