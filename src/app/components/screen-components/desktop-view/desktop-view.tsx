import { JIVA_PAGE_URL } from '@/constants/urls.constants';
import { useChatbotData } from '@/hooks/chatbot/use-chatbot-hook';
import { selectPageDetails } from '@/redux/chatbot/chatbot.slice';
import { useAppSelector } from '@/redux/hooks';
import { selectSubHeaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import {
  selectIsChatbotExpanded,
  selectIsChatbotOpen,
} from '@/redux/slices/auth/auth.slice';
import { shouldShowHeader, shouldShowSidebar } from '@/utils';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { FeatureRoutes, FeaturesEnum } from 'src/enums/auth.enums';
import styles from '../../../app.module.scss';
import AdvertisingWrapper from '../../../components/pages/advertising-page/advertising-wrapper';
import DashboardPage from '../../../components/pages/dashboard-page/dashboard-page';
import DayPartingWrapper from '../../../components/pages/day-parting-wrapper/day-parting-wrapper';
import HelpPage from '../../../components/pages/help-page/help-page';
import Home from '../../../components/pages/home/home';
import InventoryPage from '../../../components/pages/inventory-page/inventory-page';
import MarketIntelligenceWrapper from '../../../components/pages/market-intelligence-wrapper/market-intelligence-wrapper';
import UserAuthWrapper from '../../../components/pages/user-auth-wrapper/user-auth-wrapper';
import PrivateRoute from '../../../components/private-route/private-route';
import SubHeader from '../../common/sub-header/sub-header';
import ToastMessageQueue from '../../common/toast-message-queue/toast-message-queue';
import Sidebar from '../../layout/side-bar/side-bar';
import ChatbotDrawer from '../../page-components/chatbot-page/chatbot-drawer';
import AmcWrapper from '../../pages/amc-page/amc-wrapper';
import BidderDashboardWrapper from '../../pages/bidder-dashboard-page/bidder-dashboard-wrapper';
import CatalogPageRoutes from '../../pages/catalog-page/catalog-wrapper';
import CustomTablePage from '../../pages/custom-table-page/custom-table-page';
import JivaPage from '../../pages/jiva-page/jiva-page';
import SignalsPageWrapper from '../../pages/signals-page/signals-page-wrapper';
import SignalDetailWrapper from '../../pages/signals-page/signal-detail-wrapper';
import MaintenancePage from '../../pages/maintenance-page/maintenance-page';

import MonitoringWrapper from '../../pages/monitoring-page/monitoring-wrapper';
import ProfitabilityPageWrapper from '../../pages/profitability/profitability-page-wrapper';
import ReportsWrapper from '../../pages/reports-wrapper/reports-wrapper';
import ReviewAnalysisPage from '../../pages/review-analysis-page/review-analysis-page';
import RulesPageWrapper from '../../pages/rules-page/rules-page-wrapper';
import SettingsWrapper from '../../pages/settings-wrapper/settings-wrapper';

export default function DesktopView() {
  const location = useLocation();
  const subHeaderOptions = useAppSelector(selectSubHeaderOptions);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const isChatbotExpanded = useAppSelector(selectIsChatbotExpanded);
  const pageDetails = useAppSelector(selectPageDetails);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useChatbotData({ enabled: isSidebarVisible && isHeaderVisible, pageDetails });
  const [isJivaPage, setisJivaPage] = useState(false);

  useEffect(() => {
    setIsSidebarVisible(shouldShowSidebar(location.pathname));
    setIsHeaderVisible(shouldShowHeader(location.pathname));
    setisJivaPage(location.pathname.includes(JIVA_PAGE_URL) === true);
  }, [location.pathname]);

  return (
    <div className={styles.app}>
      <ToastMessageQueue />
      <div className={styles.body}>
        {isSidebarVisible === true ? (
          <Sidebar isHover={isChatbotOpen === true || isJivaPage} />
        ) : null}
        <div className={styles.main}>
          {isHeaderVisible && isJivaPage === false && (
            <SubHeader
              title={subHeaderOptions.title}
              titleTooltip={subHeaderOptions.titleTooltip}
              dropdownOptions={subHeaderOptions.dropdownOptions}
              isDropdownRequired={subHeaderOptions.isDropdownRequired}
              height={subHeaderOptions.height}
              subTitle={subHeaderOptions.subTitle}
              isSettingsPage={subHeaderOptions.isSettingsPage}
              defaultPreset={subHeaderOptions.defaultPreset}
              goBackButton={subHeaderOptions.goBackButton}
              selectedCustomDateRange={subHeaderOptions.selectedCustomDateRange}
            />
          )}
          <div
            style={{
              width:
                isChatbotOpen === true &&
                isChatbotExpanded === false &&
                isSidebarVisible === true &&
                isHeaderVisible === true &&
                isJivaPage === false
                  ? 'calc(100% - 36rem)'
                  : '100%',
              transition: 'width 0.2s ease-in',
              display: isChatbotExpanded ? 'none' : 'block',
            }}
          >
            <Routes>
              <Route
                path="/dashboard"
                element={<PrivateRoute component={<DashboardPage />} />}
              />
              <Route
                path={`/${FeatureRoutes.CATALOG}/*`}
                element={
                  <PrivateRoute
                    component={<CatalogPageRoutes />}
                    feature={FeaturesEnum.CATALOG}
                  />
                }
              />
              <Route
                path="/inventory"
                element={<PrivateRoute component={<InventoryPage />} />}
              />
              <Route
                path="/amc/*"
                element={
                  <PrivateRoute
                    component={<AmcWrapper />}
                    feature={FeaturesEnum.AMAZON_MARKETING_CLOUD}
                  />
                }
              />
              <Route
                path="/profitability/*"
                element={
                  <PrivateRoute
                    component={<ProfitabilityPageWrapper />}
                    feature={FeaturesEnum.PROFITABILITY}
                  />
                }
              />
              <Route
                path="/advertising/*"
                element={
                  <PrivateRoute
                    component={<AdvertisingWrapper />}
                    feature={FeaturesEnum.ADVERTISING}
                  />
                }
              />
              <Route
                path="/market-intelligence/*"
                element={
                  <PrivateRoute
                    component={<MarketIntelligenceWrapper />}
                    feature={FeaturesEnum.MARKET_INTELLIGENCE}
                  />
                }
              />
              {/* TODO: need to discuss whether it is still required or not */}
              {/* <Route
                path="/brand-page"
                element={<PrivateRoute component={<BrandPage />} />}
              /> */}
              <Route
                path="/settings/*"
                element={
                  <PrivateRoute
                    component={<SettingsWrapper />}
                    feature={FeaturesEnum.SETTINGS}
                  />
                }
              />
              <Route
                path={`/${FeatureRoutes.ADMIN}/*`}
                element={
                  <PrivateRoute
                    component={<MonitoringWrapper />}
                    checkIsAuthenticatedOnly={true}
                    checkHasMonitoringAccess={true}
                  />
                }
              />
              <Route
                path="/admin/bidder-dashboard/*"
                element={
                  <PrivateRoute
                    component={<BidderDashboardWrapper />}
                    checkIsAuthenticatedOnly={true}
                    checkHasMonitoringAccess={true}
                  />
                }
              />
              <Route
                path="/day-parting/*"
                element={
                  <PrivateRoute
                    component={<DayPartingWrapper />}
                    feature={FeaturesEnum.DAYPARTING}
                  />
                }
              />
              <Route
                path="/reports/*"
                element={
                  <PrivateRoute
                    component={<ReportsWrapper />}
                    feature={FeaturesEnum.REPORTS}
                  />
                }
              />
              <Route
                path="/rules/*"
                element={
                  <PrivateRoute
                    component={<RulesPageWrapper />}
                    feature={FeaturesEnum.RULES}
                  />
                }
              />

              <Route
                path="/help"
                element={<PrivateRoute component={<HelpPage />} />}
              />
              <Route
                path="/review-analysis"
                element={<PrivateRoute component={<ReviewAnalysisPage />} />}
              />
              <Route
                path={JIVA_PAGE_URL}
                element={
                  <PrivateRoute
                    component={<JivaPage />}
                    feature={FeaturesEnum.JIVA_CHATBOT}
                  />
                }
              />
              <Route path="/user/*" element={<UserAuthWrapper />} />
              <Route path="/custom-table/*" element={<CustomTablePage />} />
              <Route path="/signals" element={<SignalsPageWrapper />} />
              <Route path="/signal/:id" element={<PrivateRoute component={<SignalDetailWrapper />} />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="*" element={<PrivateRoute component={<Home />} />} />
            </Routes>
          </div>
        </div>
        {isHeaderVisible === true &&
          isSidebarVisible === true &&
          isJivaPage === false && <ChatbotDrawer />}
      </div>
    </div>
  );
}
