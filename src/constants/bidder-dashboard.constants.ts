import type {
  IBidderDashboardStats,
  IStatCardMeta,
} from '@/interfaces/bidder-dashboard.interface';
import {
  ActivityIcon,
  CheckCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  TrendUpIcon,
} from '@phosphor-icons/react';

export const BIDDER_DASHBOARD_PAGE_TITLE_TOOLTIPS = {
  BIDDER_DASHBOARD:
    'Monitor and track all bidder automation schedules and their execution history across your advertising accounts.',
};

export const getBidderStatCards = (
  _stats: IBidderDashboardStats
): IStatCardMeta[] => [
  {
    title: 'Total Jobs',
    getValue: (s) => s.totalRecords,
    Icon: ActivityIcon,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    subtitle: 'All bidder jobs',
  },
  {
    title: 'Active Jobs',
    getValue: (s) => s.activeJobs,
    Icon: CheckCircleIcon,
    color: '#059669',
    bgColor: '#ECFDF5',
    subtitle: 'Currently running',
  },
  {
    title: 'Inactive Jobs',
    getValue: (s) => s.inactiveJobs,
    Icon: ClockIcon,
    color: '#6c757d',
    bgColor: '#F8F9FA',
    subtitle: 'Not running',
  },
  {
    title: 'Amazon Jobs',
    getValue: (s) => s.amazonJobs,
    Icon: ShoppingBagIcon,
    color: '#DC2626',
    bgColor: '#FEF2F2',
    subtitle: 'Amazon marketplace',
  },
  {
    title: 'Walmart Jobs',
    getValue: (s) => s.walmartJobs,
    Icon: TrendUpIcon,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    subtitle: 'Walmart marketplace',
  },
];

export const FLEX_CENTER_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
};
