import { UNDER_MAINTENANCE } from '@/constants';
import { SessionTimeoutProvider } from '@/services/session-timeout/session-timeout';
import useMediaQuery from '@mui/material/useMediaQuery';
import MaintenancePage from './components/pages/maintenance-page/maintenance-page';
import DesktopView from './components/screen-components/desktop-view/desktop-view';
import MobileView from './components/screen-components/mobile-view/mobile-view';

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Show maintenance page if UNDER_MAINTENANCE is true
  // if (UNDER_MAINTENANCE) {
  //   return <MaintenancePage />;
  // }

  if (isDesktop) {
    return (
      <SessionTimeoutProvider>
        <DesktopView />
      </SessionTimeoutProvider>
    );
  }
  return (
    <SessionTimeoutProvider>
      <MobileView />
    </SessionTimeoutProvider>
  );
}

export default App;
