export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const NAME_REGEX = /^[a-zA-Z]+((['][a-zA-Z])?[a-zA-Z]*)*$/;

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const EXECUTION_NAME = /^[A-Za-z0-9_ -]*$/;

export const ASIN_REGEX = /^(B0[A-Z\d]{8}|\d{8}[X\d])$/;

export const WALMART_BRAND_PROFILE_TEXT_REGEX =
  /^[A-Za-z0-9]+(?: +[A-Za-z0-9]+)*$/;

export const S3_FILE_REGEX = /^s3:\/\/anarix-llm\/[A-Za-z0-9_-]+\.csv$/;

export const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

export const DAY_PARTING_CAMPAIGNS_REGEX_FORMAT =
  /\/day-parting\/.*\/(amazon|walmart)\/(sp|sb|sd|sv|all)/;

export const MOBILE_CLIENT_REGEX = /mobile/i;

export const STRING_DELIMITER_REGEX_FORMAT = /[,\s\r\n]+/;

export const STRING_DELIMITER_REGEX_WITHOUT_SPACE_FORMAT = /[,\r\n]+/;

export const NAME_STRING_SPECIAL_CHARACTER_REGEX =
  /^(?=.{2,255}$)[A-Za-z0-9](?:[A-Za-z0-9._&:()/%#+,'-]| (?! ))*$/;

export const STRING_WITH_ALL_CHARACTERS_REGEX = /^[A-Za-z](?:[^ ]| (?! ))*$/;

export const LEADING_ZERO_REGEX = /^0\d+$/;

export const TEXT_LEN_MIN_DEFAULT_LIMIT = 2;
export const TEXT_LEN_MAX_DEFAULT_LIMIT = 255;

const FIELD = String.raw`(?:\*|(?:\d+(?:-\d+)?)(?:,\d+(?:-\d+)?)*)(?:\/\d+)?`;
export const CRON_EXPRESSION_REGEX = new RegExp(
  `^${FIELD}\\s+${FIELD}\\s+${FIELD}\\s+${FIELD}\\s+${FIELD}$`
);
