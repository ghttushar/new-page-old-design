import { MarketplaceEnum } from '@/enums/serp.enums';
import { ReportTypeEnum } from 'src/enums/reports.enum';
import {
  getMarketplaceReportTabs,
  getReportsBaseUrl,
  getReportsViewUrl,
  normalizeReportsMarketplace,
} from './reports.utils';

describe('reports.utils', () => {
  it('builds reports picker and viewer URLs', () => {
    expect(getReportsBaseUrl(MarketplaceEnum.AMAZON)).toBe(
      '/reports/list/amazon'
    );
    expect(getReportsBaseUrl(MarketplaceEnum.All)).toBe(
      '/reports/list/all'
    );
    expect(getReportsViewUrl(MarketplaceEnum.WALMART, 'config-123')).toBe(
      '/reports/walmart/view/config-123'
    );
  });

  it('preserves all marketplace for the reports picker', () => {
    expect(normalizeReportsMarketplace(MarketplaceEnum.All)).toBe(
      MarketplaceEnum.All
    );
  });

  it('returns unique active report tabs for a marketplace', () => {
    expect(
      getMarketplaceReportTabs(
        [
          {
            _id: '1',
            accountId: 'a1',
            channel: MarketplaceEnum.AMAZON,
            reportKind: ReportTypeEnum.BUSINESS_PERFORMANCE,
            reportProvider: 'power-bi',
            externalReportId: 'r1',
            externalGroupId: 'g1',
            reportOwner: 'owner',
            isActive: true,
            createdAt: '',
            updatedAt: '',
            __v: 0,
          },
          {
            _id: '2',
            accountId: 'a1',
            channel: MarketplaceEnum.AMAZON,
            reportKind: ReportTypeEnum.BUSINESS_PERFORMANCE,
            reportProvider: 'power-bi',
            externalReportId: 'r2',
            externalGroupId: 'g2',
            reportOwner: 'owner',
            isActive: true,
            createdAt: '',
            updatedAt: '',
            __v: 0,
          },
          {
            _id: '3',
            accountId: 'a1',
            channel: MarketplaceEnum.WALMART,
            reportKind: ReportTypeEnum.HOURLY_PERFORMANCE,
            reportProvider: 'power-bi',
            externalReportId: 'r3',
            externalGroupId: 'g3',
            reportOwner: 'owner',
            isActive: true,
            createdAt: '',
            updatedAt: '',
            __v: 0,
          },
        ],
        MarketplaceEnum.AMAZON
      )
    ).toEqual([
      {
        label: 'Business Performance',
        value: '1',
        reportConfigId: '1',
        reportType: ReportTypeEnum.BUSINESS_PERFORMANCE,
      },
      {
        label: 'Business Performance',
        value: '2',
        reportConfigId: '2',
        reportType: ReportTypeEnum.BUSINESS_PERFORMANCE,
      },
    ]);
  });
});
