import { SignalsPage } from '../signals-page/signals-page';
import { PreviewShell, Frame } from './shared';

export default function AlertsPreviewPage() {
  return (
    <PreviewShell
      current="/signals-preview/alerts"
      intro="The real, fully interactive Alerts tab — click through anything reachable by clicking (filters, source badges, the detail card, Ask Jiva, the affected-items table)."
    >
      <Frame label="Alerts — live, interactive">
        <div style={{ height: 860, width: '100%', background: '#f6f5f8', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
          <SignalsPage initialTab="alerts" />
        </div>
      </Frame>
    </PreviewShell>
  );
}
