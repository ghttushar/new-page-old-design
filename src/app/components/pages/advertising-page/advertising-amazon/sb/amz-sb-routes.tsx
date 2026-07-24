import { Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import styles from '../../advertising-page.module.scss';
import AdvertisingSBAccountLevel from './account-level/amz-sb-account-level';

export default function AdvertisingSBRoutes() {
  return (
    <div className={styles.SubContainer}>
      <Routes>
        <Route
          path="/*"
          element={<PrivateRoute component={<AdvertisingSBAccountLevel />} />}
        />
      </Routes>
    </div>
  );
}
