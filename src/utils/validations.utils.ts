import { IWalmartConnectForm } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { IRoleOptions } from 'src/app/components/pages/settings-wrapper/invites-page/add-user-page/add-user-page';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
} from 'src/constants/regex.constants';
import {
  BRAND_VALIDATION_TEXT,
  EMAIL_VALIDATION_TEXT,
  NAME_VALIDATION_TEXT,
  PASSWORD_VALIDATION_TEXT,
  ROLE_VALIDATION_TEXT,
} from 'src/enums/validations.enums';

export const validateEmail = (email: string, type: string) => {
  const checkEmail = EMAIL_REGEX.test(String(email).toLowerCase());
  let errorText = '';

  if (type.toLowerCase() === 'login') {
    if (!email.length) {
      errorText = EMAIL_VALIDATION_TEXT.REQUIRED;
    } else {
      errorText = '';
    }
  } else {
    if (!email.length) {
      errorText = EMAIL_VALIDATION_TEXT.REQUIRED;
    } else if (checkEmail === false) {
      errorText = EMAIL_VALIDATION_TEXT.INVALID;
    } else if (email.length < 6) {
      errorText = EMAIL_VALIDATION_TEXT.CHARACTERS;
    } else {
      errorText = '';
    }
  }

  return errorText;
};

export const validatePassword = (password: string, type: string) => {
  const checkPass = PASSWORD_REGEX.test(password);
  let errorText = '';

  if (type.toLowerCase() === 'login') {
    if (!password.length) {
      errorText = PASSWORD_VALIDATION_TEXT.REQUIRED;
    } else {
      errorText = '';
    }
  } else {
    if (!password.length) {
      errorText = PASSWORD_VALIDATION_TEXT.REQUIRED;
    } else if (checkPass === false || password.length < 8) {
      errorText = PASSWORD_VALIDATION_TEXT.CHARACTERS;
    } else {
      errorText = '';
    }
  }

  return errorText;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  const checkConfirmPass = password === confirmPassword;
  let errorText = '';

  if (!confirmPassword.length) {
    errorText = `Confirm ${PASSWORD_VALIDATION_TEXT.REQUIRED}`;
  } else if (checkConfirmPass === false) {
    errorText = PASSWORD_VALIDATION_TEXT.NOT_MATCHING;
  } else {
    errorText = '';
  }

  return errorText;
};

export const validateName = (name: string, msgLabel: string) => {
  const checkName = NAME_REGEX.test(name);
  let errorText = '';

  if (!name.length) {
    errorText = `${msgLabel} ${NAME_VALIDATION_TEXT.REQUIRED}`;
  } else if (name.length < 1) {
    errorText = `${msgLabel} ${NAME_VALIDATION_TEXT.CHARACTERS}`;
  } else if (checkName === false) {
    errorText = `${NAME_VALIDATION_TEXT.INVALID} ${msgLabel}`;
  } else {
    errorText = '';
  }

  return errorText;
};

export const validateBrand = (brandName: string) => {
  let errorText = '';

  if (!brandName.length) {
    errorText = BRAND_VALIDATION_TEXT.REQUIRED;
  } else if (brandName.length < 2) {
    errorText = BRAND_VALIDATION_TEXT.CHARACTERS;
  } else {
    errorText = '';
  }

  return errorText;
};

export const validateRole = (role: string, options: IRoleOptions[]) => {
  let errorText = '';
  const findRole = options.find((option) => option.value === role);
  const isRoleDefined = findRole !== undefined;

  if (role === '') {
    errorText = ROLE_VALIDATION_TEXT.REQUIRED;
  } else if (!isRoleDefined || role === 'choose') {
    errorText = ROLE_VALIDATION_TEXT.INVALID;
  } else {
    errorText = '';
  }

  return errorText;
};

export const validateWalmartOnboardingFormData = (
  sellersForm: IWalmartConnectForm
) => {
  return sellersForm;
};

export const validateAdvertiserId = (advertiserId: string) => {
  if (advertiserId.length !== 6) return false;
  if (isNaN(Number(advertiserId))) return false;
  return true;
};

export const validateSellerId = (sellerId: string) => {
  if (sellerId.length !== 11) return false;
  if (isNaN(Number(sellerId))) return false;
  return true;
};

export const hasBudget = (obj: any): obj is { budget: any } => {
  return obj && 'budget' in obj;
};

export const hasTargetingType = (obj: any): obj is { targetingType: any } => {
  return obj && 'targetingType' in obj;
};

export const hasMinBid = (obj: any): obj is { minBid: any } => {
  return obj && 'minBid' in obj;
};

export const hasMaxBid = (obj: any): obj is { maxBid: any } => {
  return obj && 'maxBid' in obj;
};

export const hasTroas = (obj: any): obj is { troas: any } => {
  return obj && 'troas' in obj;
};

export const hasAdType = (obj: any): obj is { adType: any } => {
  return obj && 'adType' in obj;
};

export const numberFieldBasicValidation = (
  value: number | undefined,
  fieldName: string
): string | undefined => {
  if (!Number.isFinite(value)) {
    return `${fieldName || 'Value'} is required`;
  }

  if (typeof value === 'number' && Number.isFinite(value) && value < 0) {
    return `${fieldName || 'Value'} cannot be less than 0`;
  }

  return undefined;
};
