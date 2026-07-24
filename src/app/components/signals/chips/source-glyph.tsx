import { Tooltip } from '@mui/material';
import styles from './chips.module.scss';
import { getSourceMeta, type DecisionSource } from '@/utils/signals/sourceRegistry';
import { cn } from '@/lib/utils';

interface Props {
  source: DecisionSource;
  refLabel?: string;
  size?: number;
  className?: string;
  withLabel?: boolean;
}

export function SourceGlyph({ source, refLabel, size = 12, className, withLabel = false }: Props) {
  const meta = getSourceMeta(source);
  const tip = refLabel ? `${meta.label} · ${refLabel}` : meta.description;

  if (withLabel) {
    return (
      <span className={cn(styles.sourceGlyph, className)}>
        <i className={styles.icon} style={{ fontSize: size }} />
        <span className={styles.glyphLabel}>{meta.label}</span>
      </span>
    );
  }

  return (
    <Tooltip title={tip} arrow placement="top">
      <span className={cn(styles.sourceGlyphIcon, className)} style={{ width: size + 6, height: size + 6 }}>
        <span className={styles.glyphIconInner}>{meta.icon.charAt(0).toUpperCase()}</span>
      </span>
    </Tooltip>
  );
}