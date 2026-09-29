import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';

export interface CcProduct {
  id: string;
  name: string;
  asin: string;
  sku: string;
  brand: string;
  category: string;
  eligible: boolean;
  ineligibleReason?: string;
  inventory: number;
  sales: number;
  adSpend: number;
  adSales: number;
  acos: number;
  hasExistingCampaign: boolean;
  thumbnailColor: string;
}

export const MOCK_AMAZON_PRODUCTS: CcProduct[] = [
  { id: 'asin-1', name: 'Stainless Steel Water Bottle 1L', asin: 'B0D2K8F3L9', sku: 'WB-001', brand: 'Nutrabay', category: 'Sports Nutrition > Accessories', eligible: true, inventory: 342, sales: 42380, adSpend: 8240, adSales: 21180, acos: 38.9, hasExistingCampaign: true, thumbnailColor: '#7c4dff' },
  { id: 'asin-2', name: 'Non-Slip Yoga Mat with Carry Strap', asin: 'B0C7J4N9D1', sku: 'YM-005', brand: 'Boldfit', category: 'Sports & Fitness > Yoga & Pilates', eligible: true, inventory: 118, sales: 31220, adSpend: 6480, adSales: 18900, acos: 34.3, hasExistingCampaign: true, thumbnailColor: '#27ae60' },
  { id: 'asin-3', name: 'Resistance Bands Set — 5 Levels', asin: 'B0DF7H2K3M', sku: 'RB-010', brand: 'Boldfit', category: 'Sports & Fitness > Strength Training', eligible: true, inventory: 276, sales: 28910, adSpend: 5310, adSales: 14880, acos: 35.7, hasExistingCampaign: false, thumbnailColor: '#2f6fed' },
  { id: 'asin-4', name: 'Adjustable Dumbbell Set 20kg', asin: 'B0C9L1V4Q2', sku: 'DB-002', brand: 'Boldfit', category: 'Sports & Fitness > Strength Training', eligible: true, inventory: 64, sales: 26540, adSpend: 7120, adSales: 15880, acos: 44.8, hasExistingCampaign: true, thumbnailColor: '#a8763f' },
  { id: 'asin-5', name: 'Gym Duffle Bag with Shoe Compartment', asin: 'B0D8M3Z7K1', sku: 'GB-007', brand: 'Boldfit', category: 'Sports & Fitness > Accessories', eligible: true, inventory: 412, sales: 22780, adSpend: 4980, adSales: 12340, acos: 40.4, hasExistingCampaign: false, thumbnailColor: '#f3465d' },
  { id: 'asin-6', name: 'Whey Protein Isolate 1kg — Chocolate', asin: 'B0C1R8P6T4', sku: 'PS-004', brand: 'Nutrabay', category: 'Sports Nutrition > Protein Supplements', eligible: true, inventory: 510, sales: 18650, adSpend: 3210, adSales: 9420, acos: 34.1, hasExistingCampaign: false, thumbnailColor: '#febc2a' },
  { id: 'asin-7', name: 'Workout Gloves — Breathable Grip', asin: 'B0DJ6N9L8P', sku: 'WG-011', brand: 'Boldfit', category: 'Sports & Fitness > Accessories', eligible: false, ineligibleReason: 'Out of stock', inventory: 0, sales: 0, adSpend: 0, adSales: 0, acos: 0, hasExistingCampaign: false, thumbnailColor: '#0aa542' },
  { id: 'asin-8', name: 'High-Density Foam Roller', asin: 'B0C4P2X9J6', sku: 'FR-003', brand: 'Boldfit', category: 'Sports & Fitness > Recovery', eligible: true, inventory: 198, sales: 16320, adSpend: 2840, adSales: 7910, acos: 35.9, hasExistingCampaign: false, thumbnailColor: '#7450ed' },
  { id: 'asin-9', name: 'Plant Protein Blend 900g', asin: 'B0C2P9B900', sku: 'PPB-900', brand: 'Wellbeing Nutrition', category: 'Sports Nutrition > Protein Supplements', eligible: true, inventory: 231, sales: 19340, adSpend: 3540, adSales: 10120, acos: 35.0, hasExistingCampaign: false, thumbnailColor: '#e74c3c' },
  { id: 'asin-10', name: 'Multivitamin Gummies — 60 Count', asin: 'B0C3M8G060', sku: 'MVG-60', brand: 'Wellbeing Nutrition', category: 'Health & Personal Care > Vitamins & Supplements', eligible: true, inventory: 480, sales: 8420, adSpend: 1450, adSales: 3980, acos: 36.4, hasExistingCampaign: false, thumbnailColor: '#4a6cf7' },
  { id: 'asin-11', name: 'Omega-3 Fish Oil — 90 Softgels', asin: 'B0C3O3F090', sku: 'OM3-90', brand: 'Wellbeing Nutrition', category: 'Health & Personal Care > Vitamins & Supplements', eligible: true, inventory: 356, sales: 11200, adSpend: 1980, adSales: 5340, acos: 37.1, hasExistingCampaign: false, thumbnailColor: '#9551ab' },
  { id: 'asin-12', name: 'BCAA Powder 300g — Watermelon', asin: 'B0C1B300WM', sku: 'BCAA-WM', brand: 'Nutrabay', category: 'Sports Nutrition > Amino Acids', eligible: false, ineligibleReason: 'Not advertising eligible', inventory: 84, sales: 6210, adSpend: 0, adSales: 0, acos: 0, hasExistingCampaign: false, thumbnailColor: '#5e02a2' },
];

export const MOCK_WALMART_PRODUCTS: CcProduct[] = [
  { id: 'wi-1', name: 'Whey Protein Isolate 2lb — Chocolate', asin: 'WM-WPI-CHOC', sku: 'WM-WPI-CHOC', brand: 'Nutrabay', category: 'Sports Nutrition > Protein Supplements', eligible: true, inventory: 220, sales: 15400, adSpend: 2980, adSales: 8100, acos: 36.8, hasExistingCampaign: true, thumbnailColor: '#7c4dff' },
  { id: 'wi-2', name: 'Plant Protein Blend 2lb', asin: 'WM-PPB-2LB', sku: 'WM-PPB-2LB', brand: 'Wellbeing Nutrition', category: 'Sports Nutrition > Protein Supplements', eligible: true, inventory: 145, sales: 9800, adSpend: 1720, adSales: 4650, acos: 37.0, hasExistingCampaign: false, thumbnailColor: '#27ae60' },
  { id: 'wi-3', name: 'Multivitamin Gummies — 90 Count', asin: 'WM-MVG-90', sku: 'WM-MVG-90', brand: 'Wellbeing Nutrition', category: 'Health & Personal Care > Vitamins & Supplements', eligible: true, inventory: 302, sales: 6200, adSpend: 980, adSales: 2740, acos: 35.8, hasExistingCampaign: false, thumbnailColor: '#e74c3c' },
  { id: 'wi-4', name: 'Resistance Bands Set (5 Levels)', asin: 'WM-RBS-05', sku: 'WM-RBS-05', brand: 'Boldfit', category: 'Sports & Fitness > Strength Training', eligible: true, inventory: 190, sales: 7100, adSpend: 1240, adSales: 3400, acos: 36.5, hasExistingCampaign: false, thumbnailColor: '#2f6fed' },
  { id: 'wi-5', name: 'Adjustable Dumbbell Set 44lb', asin: 'WM-ADS-44', sku: 'WM-ADS-44', brand: 'Boldfit', category: 'Sports & Fitness > Strength Training', eligible: true, inventory: 38, sales: 12900, adSpend: 3100, adSales: 6820, acos: 45.5, hasExistingCampaign: true, thumbnailColor: '#a8763f' },
  { id: 'wi-6', name: 'BCAA Powder 10.5oz — Watermelon', asin: 'WM-BCAA-WM', sku: 'WM-BCAA-WM', brand: 'Nutrabay', category: 'Sports Nutrition > Amino Acids', eligible: false, ineligibleReason: 'Out of stock', inventory: 0, sales: 0, adSpend: 0, adSales: 0, acos: 0, hasExistingCampaign: false, thumbnailColor: '#febc2a' },
];

export const MOCK_CATEGORY_OPTIONS: IDropdownItem<string>[] = [
  { value: 'all', label: 'All categories' },
  { value: 'Sports Nutrition > Protein Supplements', label: 'Protein Supplements' },
  { value: 'Sports Nutrition > Amino Acids', label: 'Amino Acids' },
  { value: 'Sports & Fitness > Strength Training', label: 'Strength Training' },
  { value: 'Sports & Fitness > Yoga & Pilates', label: 'Yoga & Pilates' },
  { value: 'Sports & Fitness > Recovery', label: 'Recovery' },
  { value: 'Sports & Fitness > Accessories', label: 'Fitness Accessories' },
  { value: 'Health & Personal Care > Vitamins & Supplements', label: 'Vitamins & Supplements' },
];

export const MOCK_BRAND_OPTIONS: IDropdownItem<string>[] = [
  { value: 'all', label: 'All brands' },
  { value: 'Nutrabay', label: 'Nutrabay' },
  { value: 'Wellbeing Nutrition', label: 'Wellbeing Nutrition' },
  { value: 'Boldfit', label: 'Boldfit' },
];

export const MOCK_KEYWORD_POOL: Record<string, string[]> = {
  'asin-1': ['steel water bottle', 'insulated water bottle 1l', 'leak proof water bottle'],
  'asin-2': ['non slip yoga mat', 'yoga mat with strap', 'thick yoga mat'],
  'asin-3': ['resistance bands set', 'exercise bands with handles', 'workout resistance bands'],
  'asin-4': ['adjustable dumbbells 20kg', 'home gym dumbbell set', 'weight adjustable dumbbell'],
  'asin-5': ['gym duffle bag', 'gym bag with shoe compartment', 'sports duffle bag'],
  'asin-6': ['whey protein isolate chocolate', 'whey protein 1kg', 'isolate protein powder'],
  'asin-8': ['foam roller for muscles', 'high density foam roller', 'muscle recovery roller'],
  'asin-9': ['plant based protein powder', 'vegan protein blend', 'pea protein powder'],
  'asin-10': ['multivitamin gummies adults', 'daily multivitamin gummy', 'vitamin gummies 60 count'],
  'asin-11': ['omega 3 fish oil softgels', 'fish oil supplement', 'omega 3 90 count'],
  'wi-1': ['whey protein isolate chocolate', 'whey protein 2lb', 'isolate protein powder'],
  'wi-2': ['plant based protein powder', 'vegan protein blend'],
  'wi-3': ['multivitamin gummies adults', 'daily multivitamin gummy'],
  'wi-4': ['resistance bands set', 'exercise bands with handles'],
  'wi-5': ['adjustable dumbbells 44lb', 'home gym dumbbell set'],
};

export const DEFAULT_KEYWORDS = ['best seller alternative', 'top rated product', 'related search term'];

export interface CcRule {
  id: string;
  name: string;
  type: 'Budget' | 'Placement' | 'Inventory' | 'Bid' | 'Performance';
  description: string;
  status: 'Active' | 'Inactive';
  conditions: string;
  actions: string;
  scope: 'Campaign' | 'Ad Group' | 'Account';
  assignedCampaigns: number;
  compatible: boolean;
  incompatibleReason?: string;
  recommendedReason?: string;
}

export const MOCK_RULES: CcRule[] = [
  {
    id: 'rule-1',
    name: 'Budget Allocation — High Performers',
    type: 'Budget',
    description: 'Automatically reallocates budget toward campaigns meeting the defined performance conditions.',
    status: 'Active',
    conditions: 'ACOS below target for 3+ consecutive days',
    actions: 'Increase daily budget by up to 20%',
    scope: 'Campaign',
    assignedCampaigns: 14,
    compatible: true,
  },
  {
    id: 'rule-2',
    name: 'Placement Optimization',
    type: 'Placement',
    description: 'Adjusts placement bid modifiers based on top-of-search conversion performance.',
    status: 'Active',
    conditions: 'Top-of-search CVR exceeds account average',
    actions: 'Raise top-of-search placement bid by 15–25%',
    scope: 'Campaign',
    assignedCampaigns: 9,
    compatible: true,
  },
  {
    id: 'rule-3',
    name: 'Inventory Protection',
    type: 'Inventory',
    description: 'Pauses or reduces spend on campaigns for products running low on inventory.',
    status: 'Active',
    conditions: 'Inventory falls below 7 days of cover',
    actions: 'Pause campaign until inventory is replenished',
    scope: 'Campaign',
    assignedCampaigns: 5,
    compatible: true,
    recommendedReason: 'products with limited inventory',
  },
  {
    id: 'rule-4',
    name: 'Low ACOS Bid Optimization',
    type: 'Bid',
    description: 'Gradually increases bids on keywords converting well below target ACOS.',
    status: 'Active',
    conditions: 'Keyword ACOS below 70% of target for 7 days',
    actions: 'Increase keyword bid by 10%',
    scope: 'Ad Group',
    assignedCampaigns: 21,
    compatible: true,
  },
  {
    id: 'rule-5',
    name: 'Campaign Performance Monitor',
    type: 'Performance',
    description: 'Flags campaigns whose ACOS exceeds target for review, without taking automatic action.',
    status: 'Active',
    conditions: 'ACOS exceeds target for 5+ consecutive days',
    actions: 'Send alert, no automatic bid/budget change',
    scope: 'Account',
    assignedCampaigns: 27,
    compatible: true,
  },
  {
    id: 'rule-6',
    name: 'Sponsored Brands Placement Rule',
    type: 'Placement',
    description: 'Adjusts placement bidding specifically for Sponsored Brands headline placements.',
    status: 'Active',
    conditions: 'Headline search placement CTR below account average',
    actions: 'Reduce headline placement bid modifier',
    scope: 'Campaign',
    assignedCampaigns: 3,
    compatible: false,
    incompatibleReason: 'This Rule is configured for Sponsored Brands and cannot be assigned to Sponsored Products.',
  },
];

export const MOCK_WALMART_ADVERTISERS: IDropdownItem<string>[] = [
  { value: 'adv-1', label: 'Anarix Client — Nutrabay LLC' },
  { value: 'adv-2', label: 'Anarix Client — Wellbeing Nutrition Inc' },
  { value: 'adv-3', label: 'Anarix Client — Boldfit Corp' },
];
