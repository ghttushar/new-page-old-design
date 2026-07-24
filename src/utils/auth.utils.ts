import { MOBILE_CLIENT_REGEX } from '@/constants/regex.constants';
import { ClientTypeEnum } from 'src/enums/auth.enums';
import { Channel } from 'src/enums/marketplace.enums';
import {
  IBrandNameVariation,
  IDeviceContextFromClient,
  IUserAccountMapping,
} from 'src/interfaces/auth.interfaces';
import localStorageUtils from './local-storage/local-storage.utils';

export const filterBrandVariationsByMarketplace = (
  brandNameVariations: IBrandNameVariation[],
  marketplace: string
) => {
  return brandNameVariations.filter((item) =>
    item.channels.includes(marketplace as Channel)
  );
};

export const getSortedAccountsByPinValue = (
  accountMappings: IUserAccountMapping[]
) => {
  if (!accountMappings.length) return [];
  const data = [...accountMappings];
  data.sort((a, b) => {
    const pinnedA = Number(a.isPinned);
    const pinnedB = Number(b.isPinned);

    if (pinnedB !== pinnedA) {
      return pinnedB - pinnedA;
    }

    return a.accountId.brandName.localeCompare(b.accountId.brandName);
  });

  return data;
};

/**
 * Generate or retrieve a unique device ID
 * @returns Device ID string
 */
const getOrCreateDeviceId = (): string => {
  // Try to get existing device ID from localStorage
  let deviceId = localStorageUtils.getDeviceId();

  // If no device ID exists, generate a new one
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorageUtils.setDeviceId(deviceId);
  }

  return deviceId;
};

/**
 * Extract device name from user agent
 * @param userAgent - User agent string
 * @returns Device name string
 */
const getDeviceName = (userAgent: string | null): string => {
  if (!userAgent) return 'Unknown Device';

  // Detect browser
  let browser = 'Unknown Browser';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  let os = 'Unknown OS';
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (
    userAgent.includes('Mac OS X') ||
    userAgent.includes('Macintosh')
  ) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (
    userAgent.includes('iOS') ||
    userAgent.includes('iPhone') ||
    userAgent.includes('iPad')
  ) {
    os = 'iOS';
  }

  return `${browser} on ${os}`;
};

/**
 * Get device context information for authentication requests
 * @returns IDeviceContext object with device information
 */
export const getDeviceContext = (): IDeviceContextFromClient => {
  const userAgent = navigator.userAgent || null;

  // Determine client type based on user agent
  let clientType: ClientTypeEnum = ClientTypeEnum.WEB;
  if (MOBILE_CLIENT_REGEX.test(userAgent || '')) {
    clientType = ClientTypeEnum.MOBILE;
  }

  // Get or generate device ID
  const deviceId = getOrCreateDeviceId();

  // Get device name from user agent
  const deviceName = getDeviceName(userAgent);

  return {
    userAgent,
    deviceName,
    clientType,
    deviceId,
  };
};
