import { SignalsPage } from '../signals-page/signals-page';
import { PreviewShell, Frame } from './shared';

export default function MeetingsPreviewPage() {
  return (
    <PreviewShell
      current="/signals-preview/meetings"
      intro="The real, fully interactive Meetings tab — click through anything reachable by clicking (day grouping, the filter panel, meeting detail, and the completed-meeting MOM)."
    >
      <Frame label="Meetings — live, interactive">
        <div style={{ height: 860, width: '100%', background: '#f6f5f8', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
          <SignalsPage initialTab="meetings" />
        </div>
      </Frame>
    </PreviewShell>
  );
}
