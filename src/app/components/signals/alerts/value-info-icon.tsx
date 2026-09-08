import { HoverTip } from './hover-tip';

export function ValueInfoIcon({ label, size = 16 }: { label: string; size?: number }) {
  return (
    <HoverTip label={label} wrap>
      <span
        style={{
          width: size, height: size, borderRadius: '50%', border: '1.4px solid #b9a9cc', color: '#77469b',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', cursor: 'default',
          font: `700 ${Math.round(size * 0.62)}px/1 Georgia,serif`, fontStyle: 'italic',
        }}
      >
        i
      </span>
    </HoverTip>
  );
}
