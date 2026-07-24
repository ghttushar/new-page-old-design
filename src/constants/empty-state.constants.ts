import { lottieFiles } from '@/constants/assets/lotties.utils';
import { getTitleByFeature } from '@/utils';
import { IEmptyStateProps } from 'src/app/components/common/empty-state/empty-state';

export const marketIntelligenceEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'Brand SOV (Share of Voice)',
  emptyDescription: `No data available for selected time frame. Retry with different filters to generate data.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const marketIntelligenceNoKeywords: IEmptyStateProps = {
  emptyTitle: 'Brand SOV (Share of Voice)',
  emptyDescription: `Track and analyze up to 5 keywords for free.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const keywordSOVEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'Keyword (SOV)',
  emptyDescription: `No SOV data found for the selected keywords and applied filters. Kindly change the filters or select other keywords.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const productSOVEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'Product (SOV)',
  emptyDescription: `No SOV data found for the selected products and applied filters. Kindly change the filters or select other products.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const brandAnalyticsEmptyStateConf = (
  brand: string,
  keywordCount?: number
): IEmptyStateProps => {
  if (keywordCount === 0) {
    return {
      emptyTitle: `Brand Analytics (${brand})`,
      emptyDescription: `Track and analyze up to 5 keywords for free.`,
      lottieFile: lottieFiles.emptyStateLottie,
      emptyLottieOptions: {
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      },
      isButtonRequired: false,
    };
  }
  return {
    emptyTitle: `Brand Analytics (${brand})`,
    emptyDescription: `No data available for selected time frame. Retry with different filters to generate data.`,
    lottieFile: lottieFiles.emptyStateLottie,
    emptyLottieOptions: {
      loop: true,
      autoplay: true,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    },
    isButtonRequired: false,
  };
};

export const keywordTrackerEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'Keyword Tracker',
  emptyDescription: `Track your chosen keyword hourly to monitor brand and competitor
  performance. Get data on Positions, Price, Reviews, and more. Make
  data-driven decisions to optimize your ads strategy and stay ahead!`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: true,
  isButtonIconRequired: true,
};

export const keywordTrackerSearchEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'No Result Found',
  emptyDescription: `Try adjusting your search`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const catalogNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'Catalog Not Available',
  emptyDescription: `The catalog for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};
export const reportsNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'Report Not Available',
  emptyDescription: `The Report Data for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const impactAnalysisNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'Impact Analysis Not Available',
  emptyDescription: `The impact analysis for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const amcNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'AMC Not Available',
  emptyDescription: `The amc for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const daypartingNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'Dayparting Not Available',
  emptyDescription: `The dayparting for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const keywordTrackerActiveEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'No Active Keywords Found',
  emptyDescription: `Add a few Active Keywords.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const keywordTrackerArchiveEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'No Archived Keywords Found',
  emptyDescription: `Add a few Archived Keywords.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const amcDefaultQueriesEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'Default Queries',
  emptyDescription:
    'No Default Queries found for this instance or for the search. Kindly create a Custom Query Request.',
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const amcDefaultAudienceEmptyStateConf: IEmptyStateProps = {
  emptyTitle: 'Default Audience',
  emptyDescription:
    'No Default Audience found for this instance or for the search. Kindly create a Custom Audience Request.',
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const advertisingNotConfigured: IEmptyStateProps = {
  emptyTitle: 'Advertising Access Not Configured',
  emptyDescription: `Oops! It seems like your advertising access hasn\'t been configured yet. Please reach out to your administrator to set it up.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const advertisingAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the advertising section. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const dayPartingAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the day parting feature. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const amcNotConfigured: IEmptyStateProps = {
  emptyTitle: 'AMC Access Not Set Up',
  emptyDescription: `Sorry, it looks like your AMC access hasn't been configured yet. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const settingsAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the settings. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const marketIntelligenceAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the market intelligence section. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const reportsNotConfigured: IEmptyStateProps = {
  emptyTitle: 'Reports Not Configured',
  emptyDescription: `Uh-oh! It appears that reports haven't been set up yet. Kindly get in touch with your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const reportsAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the reports section. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const daypartingNotConfigured: IEmptyStateProps = {
  emptyTitle: 'Dayparting Not Configured',
  emptyDescription: `It seems that dayparting hasn't been set up yet. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const creativeNotFound: IEmptyStateProps = {
  emptyTitle: 'Creative Ads not found',
  emptyDescription: `Oops! It seems like there is no active creative ads found. Create one to get the creative ads.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
  height: 'auto',
};

export const monitoringAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the monitoring section. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const bidderDashboardAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the bidder dashboard section. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const inviteUserEmptyState: IEmptyStateProps = {
  emptyTitle: 'Invites',
  emptyDescription: `Track the people whom you have invited to join Anarix.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: true,
  buttonText: 'Invite User',
};

export const userPageEmptyState: IEmptyStateProps = {
  emptyTitle: 'Users',
  emptyDescription: `No Users yet.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: true,
};

export const profitabilityHomeNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'Profit Dashboard Not Available',
  emptyDescription: `The Profit Dashboard for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const profitabilityTrendsNotConfiguredForMarketplace: IEmptyStateProps =
  {
    emptyTitle: 'Trends Not Available',
    emptyDescription: `The Trends Page for this marketplace is not yet configured. Please check back later.`,
    lottieFile: lottieFiles.emptyStateLottie,
    emptyLottieOptions: {
      loop: true,
      autoplay: true,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    },
    isButtonRequired: false,
  };

export const profitabilityPnLNotConfiguredForMarketplace: IEmptyStateProps = {
  emptyTitle: 'Profit & Loss Not Available',
  emptyDescription: `The Profit & Loss for this marketplace is not yet configured. Please check back later.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const profitabilityAccessDenied: IEmptyStateProps = {
  emptyTitle: 'Access Denied',
  emptyDescription: `Sorry, you do not have access to the profitability section. Please contact your administrator for assistance.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

export const advertisingPageNotFound: IEmptyStateProps = {
  emptyTitle: 'Not Found',
  emptyDescription: `Incorrect link. Campaign ID / Ad Group ID is incorrect.`,
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: true,
  buttonText: 'Back to Home',
};
export const featureUnderMaintanence = (feature?: string): IEmptyStateProps => {
  return {
    emptyTitle: `${getTitleByFeature(feature ?? 'Feature')} Under Maintenance`,
    emptyDescription: `Visit the page after some time.
    Sorry for the inconvenience`,
    lottieFile: lottieFiles.checkProgress,
    emptyLottieOptions: {
      loop: true,
      autoplay: true,
      rendererSettings: {},
    },
    isButtonRequired: false,
    buttonText: '',
  };
};
