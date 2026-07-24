import { Action, Store, ThunkAction, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import createAxiosInstance from '../services/axios-instance';
import chatbotReducer from './chatbot/chatbot.slice';
import advertisingCreateEntityReducer from './slices/advertising/advertising-create-entity.slice';
import advEditAccessReducer from './slices/advertising/advertising-edit-access.slice';
import advertisingFilterReducer from './slices/advertising/advertising-filter.slice';
import advertisingOverallFilterReducer from './slices/advertising/advertising-overall-filter.slice';
import advertisingSBFilterReducer from './slices/advertising/advertising-sb-filter.slice';
import advertisingSDFilterReducer from './slices/advertising/advertising-sd-filter.slice';
import subHeaderOptionReducer from './slices/advertising/sub-header.slice';
import walmartOverallAdvertisingFilterReducer from './slices/advertising/walmart/advertising-walmart-overall.slice';
import walmartSBAdvertisingFilterReducer from './slices/advertising/walmart/advertising-walmart-sb.slice';
import walmartSPAdvertisingFilterReducer from './slices/advertising/walmart/advertising-walmart-sp.slice';
import walmartSVAdvertisingFilterReducer from './slices/advertising/walmart/advertising-walmart-sv.slice';
import walmartAdvertisingReducer from './slices/advertising/walmart/advertising-walmart.slice';
import amcReducer from './slices/amc/amc.slice';
import authSliceReducer from './slices/auth/auth.slice';
import bidderDashboardReducer from './slices/bidder-dashboard/bidder-dashboard.slice';
import catalogReducer from './slices/catalog/catalog.slice';
import configurationsReducer from './slices/configurations/configurations.slice';
import dayPartingFilterReducer from './slices/day-parting/day-parting.slice';
import rowFilterReducer from './slices/filters/filter.slice';
import analysisReducer from './slices/impact-analysis/impact-analysis.slice';
import keywordNegationFilterReducer from './slices/keyword-action/amazon/keyword-action-negation.slice';
import keywordActionFilterReducer from './slices/keyword-action/amazon/keyword-action.slice';
import productActionFilterReducer from './slices/keyword-action/amazon/product-action.slice';
import productNegationFilterReducer from './slices/keyword-action/amazon/product-negation.slice';
import walmartKeywordActionFilterReducer from './slices/keyword-action/walmart/keyword-action.slice';
import logsReducer from './slices/logs/logs.slice';
import keywordSovFilterReducer from './slices/market-intelligence/keyword-sov-filter.slice';
import marketIntelligenceReducer from './slices/market-intelligence/market-intelligence.slice';
import productSovFilterReducer from './slices/market-intelligence/product-sov-filter.slice';
import sovFilterReducer from './slices/market-intelligence/sov-filter.slice';
import monitoringReducer from './slices/monitoring/monitoring.slice';
import toastMessageReducer from './slices/notifications/toast-message.slice';
import {
  default as onboardingReducer,
  default as onboardingSlice,
} from './slices/onboarding/onboarding.slice';
import profitabilityReducer from './slices/profitability/profitability.slice';
import ruleReducer from './slices/rules/rules.slice';
import taggingReducer from './slices/tagging/tagging.slice';
import signalsReducer from './slices/signals/signals.slice';

export interface IRootState {
  sovFilter: ReturnType<typeof sovFilterReducer>;
  auth: ReturnType<typeof authSliceReducer>;
  toastMessage: ReturnType<typeof toastMessageReducer>;
  marketIntelligence: ReturnType<typeof marketIntelligenceReducer>;
  advertisingOverallFilter: ReturnType<typeof advertisingOverallFilterReducer>;
  advertisingFilter: ReturnType<typeof advertisingFilterReducer>;
  analysis: ReturnType<typeof analysisReducer>;
  advertisingSBFilter: ReturnType<typeof advertisingSBFilterReducer>;
  advertisingSDFilter: ReturnType<typeof advertisingSDFilterReducer>;
  keywordSovFilter: ReturnType<typeof keywordSovFilterReducer>;
  productSovFilter: ReturnType<typeof productSovFilterReducer>;
  keywordActionFilter: ReturnType<typeof keywordActionFilterReducer>;
  walmartKeywordActionFilter: ReturnType<
    typeof walmartKeywordActionFilterReducer
  >;
  keywordNegationFilter: ReturnType<typeof keywordNegationFilterReducer>;
  productNegationFilter: ReturnType<typeof productNegationFilterReducer>;
  productActionFilter: ReturnType<typeof productActionFilterReducer>;
  advEditAccess: ReturnType<typeof advEditAccessReducer>;
  amc: ReturnType<typeof amcReducer>;
  rowFilter: ReturnType<typeof rowFilterReducer>;
  onboarding: ReturnType<typeof onboardingSlice>;
  dayparting: ReturnType<typeof dayPartingFilterReducer>;
  walmartAdvertising: ReturnType<typeof walmartAdvertisingReducer>;
  walmartSPAdvertisingFilter: ReturnType<
    typeof walmartSPAdvertisingFilterReducer
  >;
  walmartSBAdvertisingFilter: ReturnType<
    typeof walmartSBAdvertisingFilterReducer
  >;
  walmartSVAdvertisingFilter: ReturnType<
    typeof walmartSVAdvertisingFilterReducer
  >;
  walmartOverallAdvertisingFilter: ReturnType<
    typeof walmartOverallAdvertisingFilterReducer
  >;
  catalog: ReturnType<typeof catalogReducer>;
  subHeaderOptions: ReturnType<typeof subHeaderOptionReducer>;
  logs: ReturnType<typeof logsReducer>;
  profitability: ReturnType<typeof profitabilityReducer>;
  monitoring: ReturnType<typeof monitoringReducer>;
  bidderDashboard: ReturnType<typeof bidderDashboardReducer>;
  advertisingCreateEntity: ReturnType<typeof advertisingCreateEntityReducer>;
  chatbot: ReturnType<typeof chatbotReducer>;
  rule: ReturnType<typeof ruleReducer>;
  configurations: ReturnType<typeof configurationsReducer>;
  tagging: ReturnType<typeof taggingReducer>;
  signals: ReturnType<typeof signalsReducer>;
}

const store: Store<IRootState> = configureStore({
  reducer: {
    sovFilter: sovFilterReducer,
    auth: authSliceReducer,
    toastMessage: toastMessageReducer,
    marketIntelligence: marketIntelligenceReducer,
    advertisingOverallFilter: advertisingOverallFilterReducer,
    advertisingFilter: advertisingFilterReducer,
    analysis: analysisReducer,
    advertisingSBFilter: advertisingSBFilterReducer,
    advertisingSDFilter: advertisingSDFilterReducer,
    keywordSovFilter: keywordSovFilterReducer,
    productSovFilter: productSovFilterReducer,
    keywordActionFilter: keywordActionFilterReducer,
    keywordNegationFilter: keywordNegationFilterReducer,
    productNegationFilter: productNegationFilterReducer,
    productActionFilter: productActionFilterReducer,
    walmartKeywordActionFilter: walmartKeywordActionFilterReducer,
    advEditAccess: advEditAccessReducer,
    amc: amcReducer,
    rowFilter: rowFilterReducer,
    onboarding: onboardingReducer,
    dayparting: dayPartingFilterReducer,
    walmartAdvertising: walmartAdvertisingReducer,
    walmartSPAdvertisingFilter: walmartSPAdvertisingFilterReducer,
    walmartSBAdvertisingFilter: walmartSBAdvertisingFilterReducer,
    walmartSVAdvertisingFilter: walmartSVAdvertisingFilterReducer,
    walmartOverallAdvertisingFilter: walmartOverallAdvertisingFilterReducer,
    catalog: catalogReducer,
    subHeaderOptions: subHeaderOptionReducer,
    logs: logsReducer,
    profitability: profitabilityReducer,
    monitoring: monitoringReducer,
    bidderDashboard: bidderDashboardReducer,
    advertisingCreateEntity: advertisingCreateEntityReducer,
    chatbot: chatbotReducer,
    rule: ruleReducer,
    configurations: configurationsReducer,
    tagging: taggingReducer,
    signals: signalsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export const axiosInstance = createAxiosInstance(store);
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  IRootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;

export default store;
