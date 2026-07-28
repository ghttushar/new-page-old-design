import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CRITICAL_ONLY_DECISION } from '@/constants/signals/criticalOnlyDecision';
import { ReviewWorkspace } from '../../signals/review-workspace/review-workspace';
import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';

const ALL_DECISIONS = [CRITICAL_ONLY_DECISION];

export default function SignalDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useCatalogAccountSubHeader(PageTitleEnum.ALERTS, '');

  const decision = useMemo(
    () => ALL_DECISIONS.find((d) => d.id === id) ?? ALL_DECISIONS[0],
    [id],
  );

  useEffect(() => {
    if (!id || !ALL_DECISIONS.find((d) => d.id === id)) {
      navigate(`/signal/${ALL_DECISIONS[0].id}`, { replace: true });
    }
  }, [id, navigate]);

  return (
    <div style={{ height: '100%', padding: '2rem', maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <ReviewWorkspace
        decision={decision}
        decisions={ALL_DECISIONS}
        onClose={() => navigate('/signals')}
        onOpenDecision={(nextId) => navigate(`/signal/${nextId}`)}
        defaultSummaryExpanded={true}
      />
    </div>
  );
}
