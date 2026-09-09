import { BriefFull } from '../../signals/brief/brief-full';
import { BriefDashboard } from '../../signals/brief/brief-dashboard';
import { BriefNoIntegration } from '../../signals/brief/brief-no-integration';
import { BriefOnboard } from '../../signals/brief/brief-onboard';
import { PreviewShell, Frame, noop, noopId } from './shared';

export default function BriefPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/brief">
      <Frame label="Brief — default">
        <div style={{ height: 760, display: 'flex' }}>
          <BriefFull onAlertClick={noopId} onMeetingClick={noop} subScreen="main" onNudgeOpen={noop} onNudgeClose={noop} onScopeChange={noop} />
        </div>
      </Frame>

      <Frame label="Brief — Nudge panel" note="subScreen='nudge' — no button reaches this in the live app yet, driven here directly">
        <div style={{ height: 760, display: 'flex' }}>
          <BriefFull onAlertClick={noopId} onMeetingClick={noop} subScreen="nudge" onNudgeOpen={noop} onNudgeClose={noop} onScopeChange={noop} />
        </div>
      </Frame>

      <Frame label="Brief — No-integration state" note="reachable only by editing signals-page.tsx's initial briefState; rendered directly here">
        <div style={{ height: 760, display: 'flex' }}>
          <BriefNoIntegration onAlertClick={noopId} />
        </div>
      </Frame>

      <Frame label="Brief — Onboarding, step 1 of 4" note="reachable only by editing signals-page.tsx's initial briefState; rendered directly here">
        <div style={{ height: 760, display: 'flex' }}>
          <BriefOnboard onComplete={noop} onSkip={noop} />
        </div>
      </Frame>

      <Frame label="Dashboard">
        <div style={{ height: 760, display: 'flex' }}>
          <BriefDashboard />
        </div>
      </Frame>
    </PreviewShell>
  );
}
