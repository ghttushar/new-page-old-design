import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { AskJivaPanel } from '../../signals/alerts/ask-jiva-panel';
import { PreviewShell, Frame, noop, noopId, firstAlert, imageAlert } from './shared';

export default function AlertsStatesPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/alerts-states" intro="The list panel is paired with the right-hand content every time, matching how the real page composes them.">
      <Frame label="Normal mode — nothing selected">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
        </div>
      </Frame>

      <Frame label="Normal mode — first alert (Ask Jiva variation)" note="the trimmed header + 'Ask Jiva' entry point, only on this one alert">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={firstAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} isFirstAlert onOpenAskJiva={noop} onSelectAlert={noopId} />
        </div>
      </Frame>

      <Frame label="Normal mode — Ask Jiva panel open" note="list column disappears; the detail card shifts left, Jiva chat takes the right column at the list's width">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} isFirstAlert onOpenAskJiva={noop} onSelectAlert={noopId} />
          <AskJivaPanel alert={firstAlert} onClose={noop} />
        </div>
      </Frame>

      <Frame label="Normal mode — a repeated alert selected" note="badge row shows the repeat state; also the alert whose recommended action generates an image">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={imageAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={imageAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
        </div>
      </Frame>
    </PreviewShell>
  );
}
