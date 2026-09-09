import { SignalsPage } from '../signals-page/signals-page';
import { PreviewShell, Frame } from './shared';

export default function LivePreviewPage() {
  return (
    <PreviewShell
      current="/signals-preview/live"
      intro="The real, fully interactive Signals app — click through Brief / Alerts / Meetings / Work-station directly here for anything reachable by clicking (filters, menus, hover states, Speed Mode, task status changes). Everything on the other pages is a state that needs a specific alert, meeting or phase forced in, so it's rendered separately."
    >
      <Frame label="Signals — live, interactive">
        <div style={{ height: 860, width: '100%', background: '#f6f5f8', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
          <SignalsPage />
        </div>
      </Frame>
    </PreviewShell>
  );
}
