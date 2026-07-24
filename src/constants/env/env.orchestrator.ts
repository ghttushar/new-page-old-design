import { EnvironmentEnum } from '@/enums/index.enums';
import { DEV_ENV_VARIABLES } from './env.dev';
import { DEVELOPMENT_ENV_VARIABLES } from './env.development';
import { PROD_ENV_VARIABLES } from './env.prod';
import { TEST_ENV_VARIABLES } from './env.test';
import { IEnvVariables } from './env.types';

const ENV_CONFIGS: Record<EnvironmentEnum, IEnvVariables> = {
  dev: DEV_ENV_VARIABLES,
  development: DEVELOPMENT_ENV_VARIABLES,
  test: TEST_ENV_VARIABLES,
  production: PROD_ENV_VARIABLES,
};

// Change only this value to switch environment config.
export const ACTIVE_ENV: EnvironmentEnum = EnvironmentEnum.PROD;

export const ENV_VARIABLES = ENV_CONFIGS[ACTIVE_ENV];
