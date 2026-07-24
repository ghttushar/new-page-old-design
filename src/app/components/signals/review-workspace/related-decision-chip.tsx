import { ArrowRight } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import { RELATIONSHIP_LABEL, type RelationshipType } from '@/utils/signals/relationships';

interface Props {
  decision: Decision;
  type: RelationshipType;
  onOpen: (id: string) => void;
}

const TONE: Record<RelationshipType, React.CSSProperties> = {
  blocks: { borderColor: '#ff000040', color: '#ff0000' },
  depends_on: { borderColor: 'rgba(241,160,58,0.4)', color: '#e6a817' },
  duplicates: { borderColor: '#e1e4e8', color: '#7c7c7c' },
  merged_into: { borderColor: 'rgba(119,70,155,0.3)', color: '#77469b' },
  caused_by: { borderColor: '#e1e4e8', color: '#7c7c7c' },
  related: { borderColor: '#e1e4e8', color: '#7c7c7c' },
};

export function RelatedDecisionChip({ decision, type, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(decision.id)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        padding: '0 6px 0 8px',
        borderRadius: 999,
        border: '1px solid',
        background: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
        ...TONE[type],
      }}
    >
      <span style={{ fontWeight: 500 }}>{RELATIONSHIP_LABEL[type]}</span>
      <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{decision.insight}</span>
      <ArrowRight size={12} style={{ opacity: 0.6 }} />
    </button>
  );
}