import {
  CaretDownIcon,
  ChartBarIcon,
  CheckIcon,
  CheckCircleIcon,
  CopyIcon,
  KeyIcon,
  LightbulbIcon,
  LockIcon,
  SpinnerGapIcon,
  SparkleIcon,
  TrendUpIcon,
  XIcon,
} from '@phosphor-icons/react';
import { Collapse, Dialog, DialogContent } from '@mui/material';
import React, { useRef, useState } from 'react';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import CanvasConfetti from '@/app/components/shared/canvas-confetti/canvas-confetti';
import {
  ChatGptFlowerLogo,
  ClaudeLogo,
  JivaLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import styles from './mcp-connect-dialog.module.scss';

const MCP_SERVER_URL = 'https://mcp.anarix.ai/mcp/sse';
const LOGIN_COMMAND = 'use anarix mcp and login';

const STEPS = ['Choose', 'Setup', 'Authenticate', 'Verify'];

type ClientKey = 'claude' | 'codex';

const CLIENTS: {
  key: ClientKey;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
}[] = [
  {
    key: 'claude',
    name: 'Claude',
    icon: ClaudeLogo,
    desc: 'Anthropic\u2019s assistant in the web app, desktop, and Code.',
  },
  {
    key: 'codex',
    name: 'ChatGPT (Codex)',
    icon: ChatGptFlowerLogo,
    desc: 'OpenAI\u2019s agentic coding environment.',
  },
];

const REAUTH_TRIGGERS = [
  'Your session expires',
  'You switch accounts',
  'You clear browser or app data',
  'You\u2019ve been inactive for an extended period',
];

const VERIFY_CARDS = [
  {
    id: 'accounts',
    icon: KeyIcon,
    title: 'Verify Account Access',
    prompt: 'Show me the accounts I have access to.',
  },
  {
    id: 'campaigns',
    icon: ChartBarIcon,
    title: 'Verify Campaign Data',
    prompt: 'Show my top campaigns from the last month.',
  },
  {
    id: 'visuals',
    icon: TrendUpIcon,
    title: 'Verify Visualization',
    prompt: 'Create a chart showing weekly ad spend and ROAS.',
  },
];

interface IMcpConnectDialogProps {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}

// ---------- Primitives ----------

function CopyButton({
  onCopy,
  copied,
  label,
}: {
  onCopy: () => void;
  copied: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={onCopy}
      aria-label={label}
    >
      {copied ? (
        <CheckIcon size={14} weight="bold" />
      ) : (
        <CopyIcon size={14} />
      )}
    </button>
  );
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copy = (value: string, title: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      showSuccessToastMessage({ title, description: value });
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return { copied, copy };
}

function CopyField({ label, value }: { label: string; value: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className={styles.copyField}>
      {label && <span className={styles.copyFieldLabel}>{label}</span>}
      <div className={styles.copyFieldBox}>
        <code className={styles.monoText}>{value}</code>
        <CopyButton
          copied={copied}
          onCopy={() => copy(value, 'Copied to clipboard')}
          label={`Copy ${label || 'value'}`}
        />
      </div>
    </div>
  );
}

function CodeBlock({ value }: { value: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className={styles.codeBlock}>
      <code className={styles.codeBlockText}>{value}</code>
      <button
        type="button"
        className={styles.codeCopyBtn}
        onClick={() => copy(value, 'Command copied')}
        aria-label="Copy command"
      >
        {copied ? (
          <CheckIcon size={14} weight="bold" />
        ) : (
          <CopyIcon size={14} />
        )}
      </button>
    </div>
  );
}

function Timeline({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item, i) => (
        <li key={i} className={styles.timelineItem}>
          <div className={styles.timelineRail}>
            <span className={styles.timelineNum}>{i + 1}</span>
            {i < items.length - 1 && <span className={styles.timelineLine} />}
          </div>
          <div className={styles.timelineBody}>{item}</div>
        </li>
      ))}
    </ol>
  );
}

function Accordion({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.accordion} ${open ? styles.accordionOpen : ''}`}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.accordionTitleWrap}>
          <span className={styles.accordionIcon}>{icon}</span>
          <span className={styles.accordionTitle}>{title}</span>
        </span>
        <CaretDownIcon size={14} className={styles.accordionChevron} />
      </button>
      <Collapse in={open}>
        <div className={styles.accordionBody}>{children}</div>
      </Collapse>
    </div>
  );
}

// ---------- Dialog ----------

export default function McpConnectDialog({
  open,
  onClose,
  onConnected,
}: IMcpConnectDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientKey>('claude');
  const [openAccordion, setOpenAccordion] = useState<null | 'team' | 'individual' | 'codex'>(null);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  const reset = () => {
    setStep(1);
    setVerifying(false);
    setSuccess(false);
    setReauthOpen(false);
    setOpenAccordion(null);
  };

  const handleClose = () => {
    if (verifying) {
      return;
    }
    reset();
    onClose();
  };

  const handleDone = () => {
    if (verifying) {
      return;
    }
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
      onConnected();
      showSuccessToastMessage({
        title: 'MCP connected',
        description: 'Your AI assistant is now connected to JIVA.',
      });
      timerRef.current = window.setTimeout(() => {
        reset();
        onClose();
      }, 2400);
    }, 1500);
  };

  const handlePrimary = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    } else {
      handleDone();
    }
  };

  const selectedName = CLIENTS.find((c) => c.key === selectedClient)?.name;

  const renderStepper = () => (
    <div className={styles.stepper}>
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isCompleted = num < step;
        const isCurrent = num === step;
        return (
          <React.Fragment key={label}>
            <div className={styles.stepItem}>
              <div
                className={`${styles.stepCircle} ${
                  isCompleted
                    ? styles.stepCircleCompleted
                    : isCurrent
                    ? styles.stepCircleCurrent
                    : ''
                }`}
              >
                {isCompleted ? (
                  <CheckIcon size={12} weight="bold" />
                ) : (
                  <span>{num}</span>
                )}
              </div>
              <span
                className={`${styles.stepLabel} ${
                  isCurrent ? styles.stepLabelActive : ''
                } ${isCompleted ? styles.stepLabelCompleted : ''}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`${styles.stepLine} ${
                  num < step ? styles.stepLineCompleted : ''
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStepOne = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Choose your AI assistant</h2>
      <p className={styles.stepSubtitle}>
        Select which assistant will connect to JIVA.
      </p>

      <div className={styles.clientGrid}>
        {CLIENTS.map((client) => {
          const ClientLogo = client.icon;
          const isSelected = selectedClient === client.key;
          return (
            <button
              key={client.key}
              type="button"
              className={`${styles.clientCard} ${
                isSelected ? styles.clientCardSelected : ''
              }`}
              onClick={() => setSelectedClient(client.key)}
              aria-pressed={isSelected}
            >
              <span className={styles.clientTop}>
                <span className={styles.clientLogoWrap}>
                  <ClientLogo size={28} />
                </span>
                <span className={styles.clientRadio}>
                  {isSelected && <CheckIcon size={11} weight="bold" />}
                </span>
              </span>
              <span className={styles.clientName}>{client.name}</span>
              <span className={styles.clientDesc}>{client.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Set up your client</h2>
      <p className={styles.stepSubtitle}>
        Follow the steps below to connect <strong>{selectedName}</strong>.
      </p>

      {selectedClient === 'claude' ? (
        <div className={styles.accordionGroup}>
          <Accordion
            title="Team & Enterprise owners"
            icon={<SparkleIcon size={15} weight="fill" />}
            open={openAccordion === 'team'}
            onToggle={() =>
              setOpenAccordion((o) => (o === 'team' ? null : 'team'))
            }
          >
            <Timeline
              items={[
                <>
                  Go to <strong>Organization Settings</strong> {'\u2192'}{' '}
                  <strong>Connectors</strong>.
                </>,
                <>
                  Click <strong>Add</strong>, select <strong>Custom</strong>{' '}
                  {'\u2192'} <strong>Web</strong>.
                </>,
                <CopyField label="Paste the MCP server URL" value={MCP_SERVER_URL} />,
                <>
                  Click <strong>Save</strong> to add the connector.
                </>,
              ]}
            />
          </Accordion>
          <Accordion
            title="Individual users"
            icon={<SparkleIcon size={15} weight="fill" />}
            open={openAccordion === 'individual'}
            onToggle={() =>
              setOpenAccordion((o) => (o === 'individual' ? null : 'individual'))
            }
          >
            <Timeline
              items={[
                <>
                  Open <strong>Settings</strong> {'\u2192'}{' '}
                  <strong>Connectors</strong>.
                </>,
                <>
                  Click <strong>Add Custom Connector</strong>.
                </>,
                <CopyField label="Connector name" value="JIVA" />,
                <CopyField label="Paste the MCP server URL" value={MCP_SERVER_URL} />,
                <>
                  Click <strong>Save</strong>, then verify <strong>JIVA</strong>{' '}
                  appears in the connector list.
                </>,
              ]}
            />
          </Accordion>
        </div>
      ) : (
        <div className={styles.accordionGroup}>
          <Accordion
            title="ChatGPT (Codex)"
            icon={<SparkleIcon size={15} weight="fill" />}
            open={openAccordion === 'codex'}
            onToggle={() =>
              setOpenAccordion((o) => (o === 'codex' ? null : 'codex'))
            }
          >
            <Timeline
              items={[
                <>
                  Open <strong>Settings</strong> {'\u2192'}{' '}
                  <strong>MCP Servers</strong>.
                </>,
                <>
                  Click <strong>Add Server</strong>.
                </>,
                <CopyField label="Name" value="Anarix" />,
                <CopyField label="Transport" value="Streamable HTTP" />,
                <CopyField label="Paste the server URL" value={MCP_SERVER_URL} />,
                <>
                  Click <strong>Save</strong>.
                </>,
              ]}
            />
          </Accordion>
        </div>
      )}
    </div>
  );

  const renderStepThree = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Authenticate</h2>
      <p className={styles.stepSubtitle}>
        Authorize the connection to <strong>{selectedName}</strong>.
      </p>

      <div className={styles.authCard}>
        <Timeline
          items={[
            <>Open a new chat with {selectedName}.</>,
            <>
              <span className={styles.timelinePromptLabel}>
                Run the authentication command:
              </span>
              <CodeBlock value={LOGIN_COMMAND} />
            </>,
            <>Click the generated login link.</>,
            <>Sign in using your JIVA account.</>,
            <>Return to {selectedName}.</>,
            <>Authentication completes automatically.</>,
          ]}
        />
      </div>

      <Accordion
        title="Need to authenticate again?"
        icon={<LockIcon size={15} weight="fill" />}
        open={reauthOpen}
        onToggle={() => setReauthOpen((o) => !o)}
      >
        <p className={styles.reauthNote}>Repeat the login flow if:</p>
        <ul className={styles.bulletList}>
          {REAUTH_TRIGGERS.map((trigger) => (
            <li key={trigger} className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              {trigger}
            </li>
          ))}
        </ul>
      </Accordion>
    </div>
  );

  const renderStepFour = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Verify connection</h2>
      <p className={styles.stepSubtitle}>
        Run these prompts in <strong>{selectedName}</strong> to confirm
        everything works.
      </p>

      <div className={styles.verifyList}>
        {VERIFY_CARDS.map((card) => {
          const Icon = card.icon;
          return <VerifyCard key={card.id} icon={Icon} title={card.title} prompt={card.prompt} />;
        })}
      </div>

      <div className={styles.callout}>
        <LightbulbIcon size={18} weight="fill" />
        <div>
          <span className={styles.calloutTitle}>
            Your MCP connection is almost complete
          </span>
          <p className={styles.calloutText}>
            Run each prompt in your connected AI assistant. If all three
            prompts return valid results, your MCP connection is ready to
            use.
          </p>
        </div>
      </div>

      {success && (
        <div className={styles.statusRow}>
          <CheckCircleIcon size={16} color="#429488" weight="fill" />
          <span className={styles.statusSuccess}>
            MCP connected — your AI assistants are ready.
          </span>
        </div>
      )}
    </div>
  );

  const primaryLabel = step < STEPS.length ? 'Next' : 'Done';
  const isVerifying = verifying && step === STEPS.length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: styles.dialogPaper }}
    >
      <div className={styles.dialogHeader}>
        <div className={styles.dialogHeaderLeft}>
          <span className={styles.dialogIconWrap}>
            <JivaLogo size={22} />
          </span>
          <div>
            <h2 className={styles.dialogTitle}>Connect MCP</h2>
            <p className={styles.dialogCaption}>
              Connect your AI assistant to JIVA.
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>
      </div>

      {renderStepper()}

      <DialogContent className={styles.dialogContent}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
        {step === 4 && renderStepFour()}
      </DialogContent>

      <div className={styles.dialogFooter}>
        {step > 1 && (
          <button
            type="button"
            className={styles.previousBtn}
            onClick={() => setStep((s) => s - 1)}
          >
            Previous
          </button>
        )}
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handlePrimary}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <SpinnerGapIcon size={16} className={styles.spin} />
              Verifying…
            </>
          ) : (
            primaryLabel
          )}
        </button>
      </div>

      {success && <CanvasConfetti />}
    </Dialog>
  );
}

function VerifyCard({
  icon: Icon,
  title,
  prompt,
}: {
  icon: React.ComponentType<{ size?: number; weight?: 'fill' }>;
  title: string;
  prompt: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <div className={styles.verifyCard}>
      <div className={styles.verifyTop}>
        <span className={styles.verifyIcon}>
          <Icon size={16} weight="fill" />
        </span>
        <span className={styles.verifyTitle}>{title}</span>
      </div>
      <div className={styles.verifyPromptBox}>
        <code className={styles.monoText}>{prompt}</code>
        <CopyButton
          copied={copied}
          onCopy={() => copy(prompt, 'Prompt copied')}
          label={`Copy prompt: ${title}`}
        />
      </div>
    </div>
  );
}
