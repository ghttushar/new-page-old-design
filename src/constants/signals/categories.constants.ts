export interface SignalCategory {
  key: string;
  label: string;
  icon: string;
  children?: SignalCategory[];
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  { key: 'advertising', label: 'Advertising', icon: 'megaphone' },
  { key: 'inventory', label: 'Inventory', icon: 'box' },
  { key: 'profitability', label: 'Profitability', icon: 'trend-up' },
  { key: 'customer-service', label: 'Customer Service', icon: 'chat-circle' },
  { key: 'buyer-accounts', label: 'Buyer / Accounts', icon: 'users' },
  { key: 'retail-listings', label: 'Retail Listings', icon: 'tag' },
  { key: 'competitor', label: 'Competitor Updates', icon: 'lightning' },
  { key: 'market-changes', label: 'Market Changes', icon: 'trend-up' },
  { key: 'insights', label: 'Insights', icon: 'sparkle' },
  { key: 'completed', label: 'Completed Today', icon: 'check-circle' },
];