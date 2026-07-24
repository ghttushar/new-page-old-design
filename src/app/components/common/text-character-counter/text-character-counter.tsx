import {
  TEXT_LEN_MAX_DEFAULT_LIMIT,
  TEXT_LEN_MIN_DEFAULT_LIMIT,
} from '@/constants/regex.constants';
import styles from './text-character-counter.module.scss';

interface ITextCharacterCounterProps {
  textStr: string | undefined;
  minLenLimit?: number;
  maxLenLimit?: number;
}

export default function TextCharacterCounter({
  textStr,
  minLenLimit = TEXT_LEN_MIN_DEFAULT_LIMIT,
  maxLenLimit = TEXT_LEN_MAX_DEFAULT_LIMIT,
}: ITextCharacterCounterProps) {
  return (
    <span
      className={`${styles.textCount} ${
        Boolean(textStr) &&
        ((textStr || '').length < minLenLimit ||
          (textStr || '').length > maxLenLimit)
          ? styles.errorTextCount
          : ''
      }`}
    >
      {(textStr || '').length ?? 0}/{maxLenLimit}
    </span>
  );
}
