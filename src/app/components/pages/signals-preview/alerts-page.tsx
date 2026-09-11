import { useState } from 'react';
import { ACTION_TYPES } from '@/constants/signals/action-types.constants';
import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { AskJivaPanel } from '../../signals/alerts/ask-jiva-panel';
import { ActionPicker } from '../../signals/alerts/action-picker';
import { ComposeMail } from '../../signals/alerts/compose-mail';
import { ImageGenStudio } from '../../signals/alerts/image-gen-studio';
import { ItemsModal } from '../../signals/alerts/items-modal';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES } from '../../signals/alerts/assign-menu';
import { getDisplayItems } from '../../signals/alerts/items-util';
import { PreviewShell, Frame, noop, noopId, firstAlert, normalAlert, imageAlert, MANY_ASSIGNEES, containFixed } from './shared';

export default function AlertsPreviewPage() {
  const [itemsModalOpen, setItemsModalOpen] = useState(true);

  return (
    <PreviewShell current="/signals-preview/alerts" intro="Every Alerts screen, panel and menu as its own static frame — nothing here needs to be clicked to reveal the next state.">
      <Frame label="List + Detail — nothing selected">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Filter panel open">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel initialFilterOpen selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="List + Detail — alert selected" note="the Ask Jiva entry point, brand name in the header, source-badge cluster">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={firstAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onOpenAskJiva={noop} />
        </div>
      </Frame>

      <Frame label="Ask Jiva panel open" note="list column disappears; the detail card shifts left, Jiva chat takes the right column at the list's width">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onOpenAskJiva={noop} />
          <AskJivaPanel alert={firstAlert} onClose={noop} />
        </div>
      </Frame>

      <Frame label="Detail — executing (in progress)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={40} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} />
        </div>
      </Frame>

      <Frame label="Detail — executing (completed, 100%)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} />
        </div>
      </Frame>

      <Frame label="Detail — impact report">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="report" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Detail — generative review (text)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="genReview" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Image Studio" note="reached by executing imageAlert's recommended (image-generating) strategy">
        <div style={{ height: 760, display: 'flex' }}>
          <ImageGenStudio alert={imageAlert} onBack={noop} onPublish={noop} />
        </div>
      </Frame>

      <Frame label="Action Picker — search list">
        <div style={{ height: 680, width: 560, display: 'flex' }}>
          <ActionPicker alert={normalAlert} variant="inline" onClose={noop} onRequestEmail={noop} onRequestImageGen={noop} onSave={noop} />
        </div>
      </Frame>

      <Frame label="Compose Mail">
        <div style={{ height: 680, width: 640, display: 'flex' }}>
          <ComposeMail alert={normalAlert} actionType={ACTION_TYPES.find((a) => a.isEmailAction)!} variant="inline" onClose={noop} onSend={noop} />
        </div>
      </Frame>

      <Frame label="Affected items — table with pagination" note="uses position:fixed internally — contained to this frame with a CSS transform trick">
        <div style={{ height: 560, ...containFixed }}>
          {itemsModalOpen && (
            <ItemsModal items={getDisplayItems(normalAlert)} itemCount={normalAlert.itemsCount} breakdown={normalAlert.itemsBreakdown} onClose={() => setItemsModalOpen(false)} />
          )}
          {!itemsModalOpen && (
            <span onClick={() => setItemsModalOpen(true)} style={{ font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Reopen</span>
          )}
        </div>
      </Frame>

      <Frame label="Assign — inline dropdown" note="the small list that appears inside a floating panel; border/shadow here stand in for that panel">
        <div style={{ width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6 }}>
          <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={noop} />
        </div>
      </Frame>

      <Frame label="Assign — full popup (>15 people)">
        <div style={{ height: 620, width: 480, display: 'flex' }}>
          <AssignPopupModal assignees={MANY_ASSIGNEES} variant="inline" onSelect={noop} onClose={noop} />
        </div>
      </Frame>
    </PreviewShell>
  );
}
