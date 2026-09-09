import { WorkStation } from '../../signals/work-station/work-station';
import { PreviewShell, Frame } from './shared';

export default function WorkstationPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/workstation">
      <Frame label="Work-station">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation />
        </div>
      </Frame>
    </PreviewShell>
  );
}
