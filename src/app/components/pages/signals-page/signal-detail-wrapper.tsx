import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CRITICAL_ONLY_DECISION } from '@/constants/signals/criticalOnlyDecision';
import { SignalsPage } from './signals-page';
import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';

export default function SignalDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useCatalogAccountSubHeader(PageTitleEnum.ALERTS, '');

  useEffect(() => {
    if (!id || id !== CRITICAL_ONLY_DECISION.id) {
      navigate(`/signal/${CRITICAL_ONLY_DECISION.id}`, { replace: true });
    }
  }, [id, navigate]);

  return (
    <SignalsPage
      defaultSummaryExpanded={true}
      defaultSelectedDecisionId={CRITICAL_ONLY_DECISION.id}
    />
  );
}
