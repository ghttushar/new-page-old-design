import NewTabsSelect from '@/app/components/common/tabs-select/new-tabs-select';
import SyncFilters from '@/app/components/hoc/sync-filters';
import { ConfigurationTableTitlesEnum } from '@/enums/configurations.enum';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { configurationUtils } from '@/utils/settings/configuration.utils';
import { useMemo } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import ConnectAccountStaticPage from '../../connect-account-static-page/connect-account-static-page';
import {
  CONFIGURATION_STEP_OPTIONS,
  ConfigurationPageRouteEnum,
  DEFAULT_CONFIGURATION_ROUTE,
} from './configuration-page.constants';
import styles from './configuration-page.module.scss';
import HeroItem from './hero-item/hero-item';
import Metrics from './metrics/metrics';
import SourceTargetMapping from './source-target-mapping/source-target-mapping';

const VALID_ROUTES = Object.values(ConfigurationPageRouteEnum);

export default function ConfigurationPage() {
  useAdsAccountSubHeader(
    PageTitleEnum.CONFIGURATION_WIZARD,
    PAGE_TITLE_TOOLTIPS.CONFIGURATION_WIZARD,
    false
  );
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRoute = useMemo((): ConfigurationPageRouteEnum => {
    const pathParts = location.pathname.split('/configuration/');
    const route = pathParts[1];
    if (route && VALID_ROUTES.includes(route as ConfigurationPageRouteEnum)) {
      return route as ConfigurationPageRouteEnum;
    }
    return DEFAULT_CONFIGURATION_ROUTE;
  }, [location.pathname]);

  const handleStepClick = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    navigate(
      configurationUtils.getConfigurationRoute(
        value as ConfigurationPageRouteEnum
      ),
      {
        replace: true,
      }
    );
  };

  const options = useMemo(() => {
    return CONFIGURATION_STEP_OPTIONS;
  }, []);

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

  if (!hasAccounts) return <ConnectAccountStaticPage />;

  return (
    <div className={styles.container}>
      <div className={styles.configurationContainer}>
        <div className={styles.navBar}>
          <NewTabsSelect
            tabValue={selectedRoute}
            handleTabChange={handleStepClick}
            tabData={options}
          />
        </div>
        <div className={styles.stepContent}>
          <Routes>
            <Route
              path={ConfigurationPageRouteEnum.SOURCE_TARGET_MAPPING}
              element={
                <SyncFilters
                  selectedNavTitle={
                    ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING
                  }
                >
                  <SourceTargetMapping />
                </SyncFilters>
              }
            />
            <Route
              path={ConfigurationPageRouteEnum.HERO_ITEM}
              element={<HeroItem />}
            />
            {/* TODO: Add COGS route when ready */}
            {/* <Route path={ConfigurationPageRouteEnum.COGS} element={<Cogs />} /> */}
            <Route
              path={ConfigurationPageRouteEnum.METRICS}
              element={<Metrics />}
            />
            <Route
              path={'*'}
              element={<Navigate to={ConfigurationPageRouteEnum.METRICS} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
