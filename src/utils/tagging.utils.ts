import {
  TEXT_LEN_MAX_DEFAULT_LIMIT,
  TEXT_LEN_MIN_DEFAULT_LIMIT,
} from '@/constants/regex.constants';
import { isValidMaxStringLength, isValidMinStringLength } from '.';

export const TaggingUtils = {
  checkTagNameError: (tagName: string) => {
    if (!tagName) {
      return 'Tag cannot be empty.';
    } else if (!isValidMinStringLength(tagName, TEXT_LEN_MIN_DEFAULT_LIMIT)) {
      return `Tag must have atleast ${TEXT_LEN_MIN_DEFAULT_LIMIT} characters.`;
    } else if (!isValidMaxStringLength(tagName, TEXT_LEN_MAX_DEFAULT_LIMIT)) {
      return `Tag length should not exceed ${TEXT_LEN_MAX_DEFAULT_LIMIT} characters.`;
    } else {
      return '';
    }
  },
};
