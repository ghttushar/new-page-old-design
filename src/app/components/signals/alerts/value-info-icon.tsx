import { HoverTip } from './hover-tip';
import { InfoIcon } from './icons';

export function ValueInfoIcon({ label, size = 16 }: { label: string; size?: number }) {
  return (
    <HoverTip label={label} wrap>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', cursor: 'default' }}>
        <InfoIcon size={size} color="#9a7fb8" />
      </span>
    </HoverTip>
  );
}
