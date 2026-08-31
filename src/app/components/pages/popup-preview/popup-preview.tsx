import BulkUploadAction from '../../common/bulk-actions/bulk-upload-action/bulk-upload-action';
import BulkUploadPopup from '../../common/bulk-actions/bulk-upload-action/bulk-upload-popup';

const MOCK_DATA = [
  { campaignName: 'Campaign 1', status: 'Enabled', budget: 100 },
  { campaignName: 'Campaign 2', status: 'Paused', budget: 200 },
];

export default function PopupPreviewPage() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Bulk Upload Popup Preview</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        Use HTML-to-Figma plugin to export this popup design.
      </p>
      <BulkUploadPopup
        isOpen={true}
        onClose={() => {}}
        exportData={MOCK_DATA}
        handleDownload={async () => MOCK_DATA}
        filename="campaign-data"
        title="Campaign Manager"
        marketplace="amazon"
      />
    </div>
  );
}
