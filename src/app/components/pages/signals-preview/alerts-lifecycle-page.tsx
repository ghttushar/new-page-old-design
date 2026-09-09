import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { PreviewShell, Frame, noop, noopId, normalAlert } from './shared';

export default function AlertsLifecyclePreviewPage() {
  return (
    <PreviewShell current="/signals-preview/alerts-lifecycle">
      <Frame label="Detail panel — executing (in progress)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={40} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} onSelectAlert={noopId} />
        </div>
      </Frame>

      <Frame label="Detail panel — executing (completed, 100%)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} onSelectAlert={noopId} />
        </div>
      </Frame>

      <Frame label="Detail panel — impact report">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="report" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
        </div>
      </Frame>

      <Frame label="Detail panel — generative review (text)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="genReview" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
        </div>
      </Frame>
    </PreviewShell>
  );
}
