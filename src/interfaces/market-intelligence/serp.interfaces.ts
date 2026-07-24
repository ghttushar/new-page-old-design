import { ISovFilterForm } from 'src/redux/slices/market-intelligence/sov-filter.slice';

export interface IStoreMarketIntelligenceFilter {
  filters: ISovFilterForm;
  isInitialFilters: boolean;
}
