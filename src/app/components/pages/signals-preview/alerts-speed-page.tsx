import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertSpeedCard } from '../../signals/alerts/alert-speed-card';
import { PreviewShell, Frame, noop, noopId, normalAlert } from './shared';

export default function AlertsSpeedPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/alerts-speed">
      <Frame label="Speed Mode — card">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertSpeedCard alert={normalAlert} position={4} total={12} onLogAction={noop} onAdvance={noop} onResolve={noopId} />
        </div>
      </Frame>

      <Frame label="Speed Mode — all caught up">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertSpeedCard alert={null} position={12} total={12} onLogAction={noop} onAdvance={noop} onResolve={noopId} />
        </div>
      </Frame>
    </PreviewShell>
  );
}
