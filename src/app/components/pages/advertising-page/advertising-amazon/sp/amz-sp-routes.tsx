import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingAccountLevel from './account-level/amz-sp-account-level';

export default function AdvertisingSPRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={<PrivateRoute component={<AdvertisingAccountLevel />} />}
        />
      </Routes>
    </div>
  );
}
