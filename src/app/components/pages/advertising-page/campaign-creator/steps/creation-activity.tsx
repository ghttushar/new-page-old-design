import { CheckCircleIcon, ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import { BAD, BORDER, BRAND, GOOD, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, TextButton } from '../campaign-creator-ui';
import { COUNT_ROWS, stageOf, type CreationRun } from './creation-runs.mock';
import { TD, TH } from './step-result';

/** Opens Creation activity. A purple dot on the corner says something is running or needs a look. */
export function ActivityButton({ processing, failed, onClick }: { processing: number; failed: number; onClick: () => void }) {
  const pending = processing + failed;
  const label = pending > 0 ? `Creation activity: ${processing} in process, ${failed} failed` : 'Creation activity';
  return (
    <button type="button" className="ccd-act-btn" onClick={onClick} aria-label={label} title={pending > 0 ? label.replace('Creation activity: ', '') : undefined}>
      <ClockCounterClockwiseIcon size={16} />
      <span>Creation activity</span>
      {pending > 0 && <i className="ccd-act-dot" aria-hidden />}
    </button>
  );
}

/** "1/2 campaigns" per entity type. Short counts are red on a failed run and purple while it is still running. */
function Created({ run }: { run: CreationRun }) {
  return (
    <ul className="ccd-act-made">
      {COUNT_ROWS.map(({ key, label }) => {
        const [done, of] = run.created[key];
        const short = done < of;
        const tone = !short ? TEXT_MUTED : run.status === 'processing' ? BRAND : BAD;
        return (
          <li key={key}>
            <b className="ccd-num" style={{ color: tone }}>{done}/{of}</b> {label}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Campaign creations still running or that did not finish, in one table with the same columns as the result's
 * "What needs attention", plus what each one created so far.
 */
export default function CreationActivity({ runs, finished, onRetry }: {
  runs: CreationRun[];
  /** The run that just finished after a retry, for a short confirmation. */
  finished: CreationRun | null;
  onRetry: (run: CreationRun) => void;
}) {
  // One table: what is still running first, then what failed.
  const rows = [...runs.filter((r) => r.status === 'processing'), ...runs.filter((r) => r.status === 'failed')];

  return (
    <div>
      <StepHeading title="Creation activity" />

      {finished && (
        <p role="status" className="ccd-act-done">
          <CheckCircleIcon size={16} weight="fill" color={GOOD} />
          <span><strong>{finished.entity.replace(/^Campaign — /, '')}</strong> finished. {COUNT_ROWS.map(({ key, label }) => `${finished.created[key][1]} ${label}`).join(', ')} created.</span>
        </p>
      )}

      <div className="ccd-act-panel">
        {rows.length === 0 ? (
          <p className="ccd-act-empty">Nothing is being created and nothing has failed.</p>
        ) : (
          <div className="ccd-scroll" style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'auto', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={TH}>Entity</th>
                  <th style={TH}>Error</th>
                  <th style={TH}>Reason</th>
                  <th style={TH}>Next step</th>
                  <th style={TH}>What was created</th>
                  <th style={{ ...TH, width: 70 }} aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {rows.map((run) => {
                  const running = run.status === 'processing';
                  return (
                    <tr key={run.id}>
                      <td style={{ ...TD, color: TEXT_PRIMARY, fontWeight: 500 }}>{run.entity}</td>
                      <td style={{ ...TD, whiteSpace: 'nowrap', color: running ? BRAND : BAD, fontWeight: running ? 600 : 400 }}>
                        {running ? <span className="ccd-act-live">In process</span> : run.error}
                      </td>
                      <td style={TD}>{running ? stageOf(run.created) : run.reason}</td>
                      <td style={TD}>{running ? "Nothing to do. We'll let you know when it finishes." : run.nextStep}</td>
                      <td style={{ ...TD, whiteSpace: 'nowrap' }}><Created run={run} /></td>
                      <td style={{ ...TD, textAlign: 'right' }}>
                        {!running && run.kind !== 'info'
                          ? <TextButton onClick={() => onRetry(run)}>Retry</TextButton>
                          : <span style={{ color: TEXT_FAINT }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
