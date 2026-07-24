export enum FeaturesEnum {
  ALL = 'all',

  //Profitability
  PROFITABILITY = 'profitability',
  PROFITABILITY_AMAZON = 'profitability_amazon',
  PROFITABILITY_WALMART = 'profitability_walmart',
  PROFITABILITY_GEO = 'geo',
  PROFITABILITY_PnL = 'pnl',
  PROFITABILITY_TRENDS = 'trends',
  // ADS Feature
  ADVERTISING = 'advertising',
  ADVERTISING_AMAZON = 'advertising-amazon',
  ADVERTISING_WALMART = 'advertising-walmart',
  ADVERTISING_TARGETING_ACTIONS = 'advertising-targeting-actions',
  ADVERTISING_TARGETING_ACTIONS_AMAZON = 'advertising-targeting-actions-amazon',
  ADVERTISING_TARGETING_ACTIONS_WALMART = 'advertising-targeting-actions-walmart',
  ADVERTISING_IMPACT_ANALYSIS = 'advertising-impact-analysis',
  ADVERTISING_IMPACT_ANALYSIS_AMAZON = 'advertising-impact-analysis-amazon',
  ADVERTISING_IMPACT_ANALYSIS_WALMART = 'advertising-impact-analysis-walmart',
  AMAZON_MARKETING_CLOUD = 'amazon-marketing-cloud',

  // Dayparting
  DAYPARTING = 'dayparting',
  DAYPARTING_AMAZON = 'dayparting-amazon',
  DAYPARTING_WALMART = 'dayparting-walmart',
  DAYPARTING_HOURLY_TRENDS = 'dayparting-hourly-trends',
  DAYPARTING_SETUP = 'day-parting-setup',
  JIVA_CHATBOT = 'jiva-chatbot',
  DAYPARTING_HOME = 'home',

  // Reports
  REPORTS = 'reports',

  // Catalog Feature
  CATALOG = 'catalog',
  CATALOG_HOME = 'catalog-home',

  // MI
  MARKET_INTELLIGENCE = 'market-intelligence',
  MARKET_INTELLIGENCE_BRAND_SOV = 'market-intelligence-brand-sov',
  MARKET_INTELLIGENCE_PRODUCT_SOV = 'market-intelligence-product-sov',
  MARKET_INTELLIGENCE_KEYWORD_SOV = 'market-intelligence-keyword-sov',
  MARKET_INTELLIGENCE_KEYWORD_TRACKER = 'market-intelligence-keyword-tracker',

  // Settings
  SETTINGS = 'settings',
  SETTINGS_USERS = 'settings-users',
  SETTINGS_INVITES = 'settings-invites',
  SETTINGS_LOGS = 'settings-logs',
  CONFIGURATION = 'configuration',

  // Monitoring - Admin
  MONITORING = 'monitoring',
  MONITORING_HISTORY = 'history',
  MONITORING_CRON_DEFINITIONS = 'cron-definitions',
  MONITORING_QUEUES_INFO = 'queues-info',

  //Rules
  RULES = 'rules',
  RULES_AGENTS = 'rules-agents',
  APPLIED_RULES = 'applied-rules',
  RULE_CREATION = 'rule-creation',

  // Signals
  SIGNALS = 'signals',
}

export enum FeatureRoutes {
  ALL = `/`,
  PROFITABILITY = 'profitability',
  PROFITABILITY_HOME = 'dashboard',
  PROFITABILITY_GEO = 'geo',
  PROFITABILITY_PnL = 'profit&loss',
  PROFITABILITY_TRENDS = 'trends',
  ADVERTISING = `advertising`,
  ADVERTISING_AMAZON = `/${FeatureRoutes.ADVERTISING}/amazon`,
  ADVERTISING_WALMART = `/${FeatureRoutes.ADVERTISING}/walmart`,
  ADVERTISING_TARGETING_ACTIONS = `targeting-actions`,
  ADVERTISING_TARGETING_ACTIONS_AMAZON = `/${FeatureRoutes.ADVERTISING}/${FeatureRoutes.ADVERTISING_TARGETING_ACTIONS}/amazon`,
  ADVERTISING_TARGETING_ACTIONS_WALMART = `/${FeatureRoutes.ADVERTISING}/${FeatureRoutes.ADVERTISING_TARGETING_ACTIONS}/walmart`,
  ADVERTISING_IMPACT_ANALYSIS = `analysis`,
  ADVERTISING_IMPACT_ANALYSIS_AMAZON = `/${FeatureRoutes.ADVERTISING}/${FeatureRoutes.ADVERTISING_IMPACT_ANALYSIS}/amazon`,
  ADVERTISING_IMPACT_ANALYSIS_WALMART = `/${FeatureRoutes.ADVERTISING}/${FeatureRoutes.ADVERTISING_IMPACT_ANALYSIS}/walmart`,
  AMAZON_MARKETING_CLOUD = `amc`,
  MARKET_INTELLIGENCE = `market-intelligence`,
  MARKET_INTELLIGENCE_KEYWORD_SOV = `keyword-sov`,
  MARKET_INTELLIGENCE_PRODUCT_SOV = `product-sov`,
  MARKET_INTELLIGENCE_BRAND_SOV = `brand-sov`,
  MARKET_INTELLIGENCE_KEYWORD_TRACKER = `keyword-tracker`,
  DAYPARTING = `day-parting`,
  DAYPARTING_AMAZON = `/${FeatureRoutes.DAYPARTING}/amazon`,
  DAYPARTING_WALMART = `/${FeatureRoutes.DAYPARTING}/walmart`,
  SETTINGS = `settings`,
  SETTINGS_USERS = `users`,
  SETTINGS_INVITES = `invites`,
  CONFIGURATION = 'configuration',
  REPORTS = `reports`,
  REPORTS_LIST = `list`,
  ADMIN = `admin`,
  MONITORING = 'monitoring',
  MONITORING_HISTORY = `monitoring-history`,
  CRON_DEFINITIONS = `cron-definitions`,
  QUEUES_INFO = `queues-info`,
  ACCOUNTS = `accounts`,
  DAYPARTING_HOME = `home`,
  DAYPARTING_HOURLY_TRENDS = `hourly-trends`,
  DAYPARTING_SETUP = 'day-parting-setup',
  DAYPARTING_CAMPAIGNS = 'campaigns',
  CAMPAIGN_MANAGER = `campaign-manager`,
  QUERIES = `queries`,
  JOB_LIST = `job-list`,
  HISTORY = `history`,
  SCHEDULED_JOBS = `scheduled-jobs`,
  EXECUTED_QUERIES = `executed-queries`,
  SCHEDULED_WORKFLOW_EXECUTIONS = `scheduled-workflow-execution`,
  AUDIENCE = `audience`,
  CREATED_AUDIENCE = `created-audience`,
  INSTANCES = `instances`,
  CATALOG = `catalog`,
  CATALOG_PAGE = `catalog-page`,
  LOGS = 'logs',
  NOT_DEFINED = '',
  RULES = 'rules',
  RULES_AGENTS = 'agents',
  APPLIED_RULES = 'applied-rules',
  RULE_CREATION = 'rule-creation',
  JIVA_CHATBOT_PAGE = 'jiva-page',
  SIGNALS = 'signals',
}

export enum PermissionsEnum {
  ALL = 'ALL',
}

export enum AccessScopeEnum {
  SCOPED = 'scoped',
  ALL = 'all',
}

export enum ClientTypeEnum {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  API = 'api', // optional, for API clients
  CLI = 'cli', // optional, dev tools
}

export enum UserTypeEnum {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}
