// import { ColumnDef } from '@tanstack/react-table';
// import { ICampaign } from 'src/interfaces/advertising/sp-advertising.interface';

import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { ColumnDef } from '@tanstack/react-table';
import { ISOVWithRank } from 'src/interfaces/serp.interface';

// // Assuming columnHelper is some utility you have for creating columns

// export const columns: ColumnDef<ICampaign>[] = [
//   {
//     id: 'campaignName',
//     header: 'Campaign Name',
//     accessorKey: 'campaignName',
//     size: 150,
//     enableResizing: true,
//     enablePinning: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'status',
//     header: 'Status',
//     accessorKey: 'status',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'impressions',
//     header: 'Impressions',
//     accessorKey: 'impressions',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'clicks',
//     header: 'Clicks',
//     accessorKey: 'clicks',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'adSpend',
//     header: 'Ad Spend',
//     accessorKey: 'adSpend',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'adSales',
//     header: 'Ad Sales',
//     accessorKey: 'adSales',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'roas',
//     header: 'ROAS',
//     accessorKey: 'roas',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'acos',
//     header: 'ACOS',
//     accessorKey: 'acos',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'cvr',
//     header: 'CVR',
//     accessorKey: 'cvr',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
//   {
//     id: 'ctr',
//     header: 'CTR',
//     accessorKey: 'ctr',
//     size: 150,
//     enableResizing: true,
//     sortingFn: 'alphanumeric',
//   },
// ];

export const customServerTableColumns: Array<ColumnDef<ICampaign>> = [
  {
    header: 'Campaign Name',
    accessorKey: 'campaignName',
    id: 'campaignName',
    size: 250,
  },

  {
    header: 'Status',
    accessorKey: 'status',
    id: 'status',
  },
  {
    header: 'Campaign ID',
    accessorKey: 'campaignId',
    id: 'campaignId',
  },
  {
    header: 'Budget',
    accessorKey: 'budget.budget',
    id: 'budget.budget',
  },
  {
    header: 'Budget Type',
    accessorKey: 'budgetType',
    id: 'budgetType',
  },
  {
    header: 'Strategy',
    accessorKey: 'strategy',
    id: 'strategy',
  },
  {
    header: 'Start Date',
    accessorKey: 'startDate',
    id: 'startDate',
  },
  {
    header: 'End Date',
    accessorKey: 'endDate',
    id: 'endDate',
  },
  {
    header: 'Targeting Type',
    accessorKey: 'targetingType',
    id: 'targetingType',
  },
  {
    header: 'Impressions',
    accessorKey: 'impressions',
    id: 'impressions',
  },
  {
    header: 'Clicks',
    accessorKey: 'clicks',
    id: 'clicks',
  },
  {
    header: 'Ad Spend',
    accessorKey: 'adSpend',
    id: 'adSpend',
  },
  {
    header: 'CPC',
    accessorKey: 'cpc',
    id: 'cpc',
  },
  {
    header: 'CTR',
    accessorKey: 'ctr',
    id: 'ctr',
  },
  {
    header: 'CVR',
    accessorKey: 'cvr',
    id: 'cvr',
  },
  {
    header: 'Units Sold',
    accessorKey: 'unitsSold',
    id: 'unitsSold',
  },
  // {
  //   header: 'Ad Sales',
  //   accessorKey: 'adSales',
  //   id: 'adSales',
  // },
  // {
  //   header: 'ACoS',
  //   accessorKey: 'acos',
  //   id: 'acos',
  // },
  // {
  //   header: 'RoAS',
  //   accessorKey: 'roas',
  //   id: 'roas',
  // },
];

export const customClientTableColumns: Array<ColumnDef<ISOVWithRank>> = [
  {
    accessorKey: 'rank',
    id: 'rank',
    header: 'Rank',
    size: 100,
  },
  {
    accessorKey: 'brand',
    id: 'brand',
    header: 'Brand',
  },
  {
    accessorKey: 'appearance',
    id: 'appearance',
    header: 'Appearance',
  },
  {
    accessorKey: 'organic_sov',
    id: 'organic_sov',
    header: 'Organic SOV',
  },
  // {
  //   accessorKey: 'sponsored_sov',
  //   id: 'sponsored_sov',
  //   header: 'Sponsored SOV',
  // },
  // {
  //   accessorKey: 'total_sov',
  //   id: 'total_sov',
  //   header: 'Total SOV',
  // },
  // {
  //   accessorKey: 'product_count',
  //   id: 'product_count',
  //   header: 'Product Count',
  // },
];
