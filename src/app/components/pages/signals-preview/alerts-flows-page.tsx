import { useState } from 'react';
import { ACTION_TYPES } from '@/constants/signals/action-types.constants';
import { ActionPicker } from '../../signals/alerts/action-picker';
import { ComposeMail } from '../../signals/alerts/compose-mail';
import { ImageGenStudio } from '../../signals/alerts/image-gen-studio';
import { ItemsModal } from '../../signals/alerts/items-modal';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES } from '../../signals/alerts/assign-menu';
import { getDisplayItems } from '../../signals/alerts/items-util';
import { PreviewShell, Frame, noop, normalAlert, imageAlert, MANY_ASSIGNEES, containFixed } from './shared';

export default function AlertsFlowsPreviewPage() {
  const [itemsModalOpen, setItemsModalOpen] = useState(true);

  return (
    <PreviewShell current="/signals-preview/alerts-flows">
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

      <Frame label="Items Modal" note="uses position:fixed internally — contained to this frame with a CSS transform trick">
        <div style={{ height: 500, ...containFixed }}>
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
