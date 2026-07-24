import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import { IMenuItem } from '@/interfaces/side-bar/sidebar.interfaces';
import {
  AtomIcon,
  BellIcon,
  BookOpenTextIcon,
  ChartBarIcon,
  ChartPieSliceIcon,
  ClockCountdownIcon,
  ClockIcon,
  MegaphoneSimpleIcon,
  SoundcloudLogoIcon,
  SquaresFourIcon,
  UserCircleGearIcon,
} from '@phosphor-icons/react';
import styles from '../../app/components/layout/side-bar/sidebar-component.module.scss';

export const SIDEBAR_MENU_ITEMS = (isInternalUser = false): IMenuItem[] => {
  const dayPartingSubMenus: IMenuItem[] = [
    {
      key: FeatureRoutes.DAYPARTING_HOME,
      primaryText: 'Dayparting',
      feature: FeaturesEnum.DAYPARTING_HOME,
    },
    {
      key: FeatureRoutes.HISTORY,
      primaryText: 'History',
      feature: FeaturesEnum.DAYPARTING,
    },
    {
      key: FeatureRoutes.SCHEDULED_JOBS,
      primaryText: 'Scheduled Jobs',
      feature: FeaturesEnum.DAYPARTING,
    },
  ];

  const subMenuItems = [
    {
      key: FeatureRoutes.JIVA_CHATBOT_PAGE,
      primaryText: 'JIVA',
      icon: (
        <span className={styles.icon}>
          <ImgComponent imageURL={imageUrls.botIcon} alt="JiVA" />
        </span>
      ),
      feature: FeaturesEnum.JIVA_CHATBOT,
      divider: true,
    },
    {
      key: FeatureRoutes.PROFITABILITY,
      primaryText: 'Profitability',
      subMenu: [
        {
          key: FeatureRoutes.PROFITABILITY_HOME,
          primaryText: 'Dashboard',
          feature: FeaturesEnum.PROFITABILITY,
        },
        {
          key: FeatureRoutes.PROFITABILITY_TRENDS,
          primaryText: 'Trends',
          feature: FeaturesEnum.PROFITABILITY_TRENDS,
        },
        {
          key: FeatureRoutes.PROFITABILITY_PnL,
          primaryText: 'Profit & Loss',
          feature: FeaturesEnum.PROFITABILITY_PnL,
        },
      ],
      icon: <SquaresFourIcon className={styles.icon} />,
      feature: FeaturesEnum.PROFITABILITY,
    },
    {
      key: FeatureRoutes.ADVERTISING,
      primaryText: 'Advertising',
      subMenu: [
        {
          key: FeatureRoutes.CAMPAIGN_MANAGER,
          primaryText: 'Campaign Manager',
          feature: FeaturesEnum.ADVERTISING,
        },
        {
          key: FeatureRoutes.ADVERTISING_IMPACT_ANALYSIS,
          primaryText: 'Impact Analysis',
          feature: FeaturesEnum.ADVERTISING_IMPACT_ANALYSIS,
        },
        {
          key: FeatureRoutes.ADVERTISING_TARGETING_ACTIONS,
          primaryText: 'Targeting Actions',
          feature: FeaturesEnum.ADVERTISING_TARGETING_ACTIONS,
        },
      ],
      icon: <MegaphoneSimpleIcon className={styles.icon} />,
      feature: FeaturesEnum.ADVERTISING,
    },
    {
      key: FeatureRoutes.DAYPARTING,
      primaryText: 'Day Parting',
      subMenu: dayPartingSubMenus,
      feature: FeaturesEnum.DAYPARTING,
      icon: <ClockCountdownIcon className={styles.icon} />,
    },
    {
      key: FeatureRoutes.RULES,
      primaryText: 'Rules',
      subMenu: [
        {
          key: FeatureRoutes.RULES_AGENTS,
          primaryText: 'Agents',
          feature: FeaturesEnum.RULES_AGENTS,
        },
        {
          key: FeatureRoutes.APPLIED_RULES,
          primaryText: 'Applied Rules',
          feature: FeaturesEnum.APPLIED_RULES,
        },
      ],
      icon: <AtomIcon className={styles.icon} />,
      feature: FeaturesEnum.RULES,
    },
    {
      key: FeatureRoutes.CATALOG,
      primaryText: 'Catalog',
      subMenu: [
        {
          key: FeatureRoutes.CATALOG_PAGE,
          primaryText: 'Catalog',
          feature: FeaturesEnum.CATALOG_HOME,
        },
      ],
      icon: <BookOpenTextIcon className={styles.icon} />,
      feature: FeaturesEnum.CATALOG,
    },
    {
      key: FeatureRoutes.AMAZON_MARKETING_CLOUD,
      primaryText: 'AMC',
      subMenu: [
        {
          key: FeatureRoutes.QUERIES,
          primaryText: 'Queries',
          feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
        },
        {
          key: FeatureRoutes.EXECUTED_QUERIES,
          primaryText: 'Executed Queries',
          feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
        },
        {
          key: FeatureRoutes.SCHEDULED_WORKFLOW_EXECUTIONS,
          primaryText: 'Schedules',
          feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
        },
        {
          key: FeatureRoutes.AUDIENCE,
          primaryText: 'Audiences',
          feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
        },
        {
          key: FeatureRoutes.CREATED_AUDIENCE,
          primaryText: 'Created Audiences',
          feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
        },
        {
          key: FeatureRoutes.INSTANCES,
          primaryText: 'Instances',
          feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
        },
      ],
      icon: <SoundcloudLogoIcon className={styles.icon} />,
      feature: FeaturesEnum.AMAZON_MARKETING_CLOUD,
    },
    {
      key: FeatureRoutes.MARKET_INTELLIGENCE,
      primaryText: 'Business Intelligence',
      subMenu: [
        {
          key: FeatureRoutes.MARKET_INTELLIGENCE_BRAND_SOV,
          primaryText: 'Brand SOV',
          feature: FeaturesEnum.MARKET_INTELLIGENCE_BRAND_SOV,
        },
        {
          key: FeatureRoutes.MARKET_INTELLIGENCE_KEYWORD_TRACKER,
          primaryText: 'Keyword Tracker',
          feature: FeaturesEnum.MARKET_INTELLIGENCE_KEYWORD_TRACKER,
        },
        {
          key: FeatureRoutes.MARKET_INTELLIGENCE_KEYWORD_SOV,
          primaryText: 'Keyword SOV',
          feature: FeaturesEnum.MARKET_INTELLIGENCE_KEYWORD_SOV,
        },
        {
          key: FeatureRoutes.MARKET_INTELLIGENCE_PRODUCT_SOV,
          primaryText: 'Product SOV',
          feature: FeaturesEnum.MARKET_INTELLIGENCE_PRODUCT_SOV,
        },
      ],
      icon: <ChartPieSliceIcon className={styles.icon} />,
      feature: FeaturesEnum.MARKET_INTELLIGENCE,
    },
    {
      key: FeatureRoutes.SETTINGS,
      primaryText: 'Settings',
      subMenu: [
        {
          key: FeatureRoutes.ACCOUNTS,
          primaryText: 'Accounts',
          feature: FeaturesEnum.SETTINGS_INVITES,
        },
        {
          key: FeatureRoutes.LOGS,
          primaryText: 'Logs',
          feature: FeaturesEnum.SETTINGS_LOGS,
        },
        {
          key: FeatureRoutes.SETTINGS_INVITES,
          primaryText: 'Invites',
          feature: FeaturesEnum.SETTINGS_INVITES,
        },
        {
          key: FeatureRoutes.SETTINGS_USERS,
          primaryText: 'Users',
          feature: FeaturesEnum.SETTINGS_USERS,
        },
        {
          key: FeatureRoutes.CONFIGURATION,
          primaryText: 'Configuration',
          feature: FeaturesEnum.CONFIGURATION,
        },
      ],
      feature: FeaturesEnum.SETTINGS,
      icon: <UserCircleGearIcon className={styles.icon} />,
    },
    {
      key: FeatureRoutes.REPORTS,
      primaryText: 'Reports',
      subMenu: [
        {
          key: FeatureRoutes.REPORTS_LIST,
          primaryText: 'Reports',
          feature: FeaturesEnum.REPORTS,
        },
      ],
      icon: <ChartBarIcon className={styles.icon} />,
      feature: FeaturesEnum.REPORTS,
    },
  ];

  subMenuItems.unshift({
    key: FeatureRoutes.SIGNALS,
    primaryText: 'Signals',
    icon: <BellIcon className={styles.icon} />,
    feature: FeaturesEnum.SIGNALS,
    divider: false,
  });

  if (isInternalUser) {
    subMenuItems.push({
      key: FeatureRoutes.ADMIN,
      primaryText: 'Monitoring',
      subMenu: [
        {
          key: FeatureRoutes.MONITORING,
          primaryText: 'Dashboard',
          feature: FeaturesEnum.MONITORING,
        },
        {
          key: FeatureRoutes.MONITORING_HISTORY,
          primaryText: 'History',
          feature: FeaturesEnum.MONITORING,
        },
        {
          key: FeatureRoutes.CRON_DEFINITIONS,
          primaryText: 'Cron Definitions',
          feature: FeaturesEnum.MONITORING,
        },
        {
          key: FeatureRoutes.QUEUES_INFO,
          primaryText: 'Queues Info',
          feature: FeaturesEnum.MONITORING_QUEUES_INFO,
        },
      ],
      icon: <ClockIcon className={styles.icon} />,
      feature: FeaturesEnum.MONITORING,
    });
  }
  return subMenuItems;
};
