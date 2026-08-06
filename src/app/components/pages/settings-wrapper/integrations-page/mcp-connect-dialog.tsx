import {
  ChartBarIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  LightbulbIcon,
  LockIcon,
  SparkleIcon,
  SpinnerGapIcon,
  TrendUpIcon,
  XCircleIcon,
  XIcon,
  CaretDownIcon,
  KeyIcon,
} from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import {
  ClaudeLogo,
  GptLogo,
  JivaLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import { getMcpConnected, setMcpConnected } from './mcp-connection';
import styles from './mcp-connect-dialog.module.scss';

const MCP_SERVER_URL = 'https://mcp.anarix.ai/mcp/sse';
const MCP_SUPPORT_EMAIL = 'mailto:support@anarix.ai';
const LOGIN_COMMAND = 'use anarix mcp and login';

const STEPS = ['Choose Client', 'Setup', 'Authentication', 'Verify'];

type ClientKey = 'claude' | 'codex';

type StatusKey = 'idle' | 'verifying' | 'success' | 'failed';

const CLIENTS: {
  key: ClientKey;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
  chips: string[];
}[] = [
  {
    key: 'claude',
    name: 'Claude',
    icon: ClaudeLogo,
    desc: 'Anthropic\u2019s assistant in the web app, desktop, and Code.',
    chips: ['Desktop', 'Web', 'Code'],
  },
  {
    key: 'codex',
    name: 'ChatGPT (Codex)',
    icon: GptLogo,
    desc: 'OpenAI\u2019s agentic coding environment.',
    chips: ['Desktop', 'Projects', 'Codex'],
  },
];

const REAUTH_TRIGGERS = [
  'Your session expires',
  'You switch accounts',
  'You clear browser/app data',
  'You\u2019ve been inactive for an extended period',
];

const VERIFY_CARDS = [
  {
    id: 'accounts',
    icon: KeyIcon,
    title: 'Verify Account Access',
    desc: 'Confirm your connected accounts are visible to the assistant.',
    prompt: 'Show me the accounts I have access to.',
  },
  {
    id: 'campaigns',
    icon: ChartBarIcon,
    title: 'Verify Campaign Data',
    desc: 'Check that real campaign data comes through the connection.',
    prompt:
      'What were my top 5 campaigns by ad spend from 2026-04-01 to 2026-04-30?',
  },
  {
    id: 'visuals',
    icon: TrendUpIcon,
    title: 'Verify Visualizations',
    desc: 'Make sure charts and reports render correctly.',
    prompt:
      'Create a chart showing weekly ad spend and ROAS for the last 8 weeks.',
  },
];

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      showSuccessToastMessage({
        title: 'Copied to clipboard',
        description: value,
      });
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.copyField}>
      <span className={styles.copyFieldLabel}>{label}</span>
      <div className={styles.copyFieldBox}>
        <code className={styles.copyFieldText}>{value}</code>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={onCopy}
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <CheckIcon size={16} weight="bold" />
          ) : (
            <CopyIcon size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

function CodeBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      showSuccessToastMessage({
        title: 'Copied to clipboard',
        description: value,
      });
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.codeBlock}>
      <code className={styles.codeBlockText}>{value}</code>
      <button
        type="button"
        className={styles.copyBtn}
        onClick={onCopy}
        aria-label="Copy command"
      >
        {copied ? (
          <CheckIcon size={16} weight="bold" />
        ) : (
          <CopyIcon size={16} />
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
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.accordion} ${open ? styles.accordionOpen : ''}`}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={styles.accordionTitleWrap}>
          <span className={styles.accordionIcon}>{icon}</span>
          <span className={styles.accordionTitle}>{title}</span>
        </span>
        <CaretDownIcon size={18} className={styles.accordionChevron} />
      </button>
      <div className={styles.accordionBodyWrap}>
        <div className={styles.accordionBody}>{children}</div>
      </div>
    </div>
  );
}

function VerifyCard({
  icon: Icon,
  title,
  desc,
  prompt,
}: {
  icon: React.ComponentType<{ size?: number; weight?: 'fill' }>;
  title: string;
  desc: string;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      showSuccessToastMessage({
        title: 'Copied to clipboard',
        description: prompt,
      });
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={`${styles.verifyCard} ${
        copied ? styles.verifyCardDone : ''
      }`}
    >
      <div className={styles.verifyTop}>
        <span className={styles.verifyIcon}>
          <Icon size={20} weight="fill" />
        </span>
        <div className={styles.verifyInfo}>
          <h4 className={styles.verifyTitle}>{title}</h4>
          <p className={styles.verifyDesc}>{desc}</p>
        </div>
        {copied && (
          <span className={styles.verifyDoneBadge}>
            <CheckIcon size={12} weight="bold" />
            Copied
          </span>
        )}
      </div>
      <div className={styles.verifyPromptBox}>
        <code className={styles.verifyPromptText}>{prompt}</code>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={onCopy}
          aria-label={`Copy prompt: ${title}`}
        >
          {copied ? (
            <CheckIcon size={16} weight="bold" />
          ) : (
            <CopyIcon size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

interface IMcpConnectDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function McpConnectDialog({
  open,
  onClose,
}: IMcpConnectDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientKey>('claude');
  const [status, setStatus] = useState<StatusKey>('idle');
  const [connected, setConnected] = useState(getMcpConnected);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setStatus('idle');
      setConnected(getMcpConnected());
    }
  }, [open]);

  useEffect(() => {
    if (status === 'success') {
      timerRef.current = window.setTimeout(() => onClose(), 1400);
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [status, onClose]);

  const handleDone = () => {
    if (status === 'verifying') {
      return;
    }
    setStatus('verifying');
    window.setTimeout(() => {
      if (Math.random() < 0.9) {
        setMcpConnected(true);
        setConnected(true);
        setStatus('success');
      } else {
        setStatus('failed');
      }
    }, 1500);
  };

  const selectedName = CLIENTS.find((c) => c.key === selectedClient)?.name;

  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isCompleted = num < step;
        const isCurrent = num === step;
        return (
          <div key={label} className={styles.stepCell}>
            <div
              className={`${styles.stepCircle} ${
                isCompleted
                  ? styles.stepCompleted
                  : isCurrent
                  ? styles.stepCurrent
                  : ''
              }`}
            >
              {isCompleted ? (
                <CheckIcon size={16} weight="bold" />
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
            {i < STEPS.length - 1 && (
              <div
                className={`${styles.stepLine} ${
                  num < step ? styles.stepLineCompleted : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepOne = () => (
    <div className={styles.stepPane}>
      <Typography variant="h2" className={styles.stepTitle}>
        Choose your client
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Select the AI assistant you want to connect to JIVA.
      </Typography>

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
              <span className={styles.clientLogoWrap}>
                <ClientLogo size={44} />
              </span>
              <span className={styles.clientRadio}>
                {isSelected && <CheckIcon size={14} weight="bold" />}
              </span>
              <h3 className={styles.clientName}>{client.name}</h3>
              <p className={styles.clientDesc}>{client.desc}</p>
              <span className={styles.clientChips}>
                {client.chips.map((chip) => (
                  <span key={chip} className={styles.clientChip}>
                    {chip}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className={styles.stepPane}>
      <Typography variant="h2" className={styles.stepTitle}>
        Set up your client
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Follow the steps below to connect {selectedName}.
      </Typography>

      {selectedClient === 'claude' ? (
        <>
          <Accordion
            title="Team & Enterprise Owners"
            icon={<ChatCircleDotsIcon size={20} weight="fill" />}
          >
            <Timeline
              items={[
                <>
                  Go to <strong>Organization Settings</strong> {'\u2192'}{' '}
                  <strong>Connectors</strong>.
                </>,
                <>
                  Click <strong>Add</strong> and select <strong>Custom</strong>{' '}
                  {'\u2192'} <strong>Web</strong>.
                </>,
                <CopyField
                  label="Enter the MCP server URL"
                  value={MCP_SERVER_URL}
                />,
                <>
                  Click <strong>Add</strong> to save the connector.
                </>,
              ]}
            />
          </Accordion>
          <Accordion
            title="Individual Users"
            icon={<ChatCircleDotsIcon size={20} weight="fill" />}
          >
            <Timeline
              items={[
                <>
                  Open <strong>Settings</strong> and navigate to{' '}
                  <strong>Connectors</strong>.
                </>,
                <>
                  Click <strong>Add Custom Connector</strong>.
                </>,
                <CopyField label="Connector name" value="JIVA" />,
                <CopyField label="Remote MCP URL" value={MCP_SERVER_URL} />,
                <>
                  Click <strong>Add</strong>.
                </>,
                <>
                  Verify <strong>JIVA</strong> appears in the connector list.
                </>,
              ]}
            />
          </Accordion>
        </>
      ) : (
        <Accordion
          title="ChatGPT (Codex)"
          icon={<SparkleIcon size={20} weight="fill" />}
        >
          <Timeline
            items={[
              <>
                Open <strong>Settings</strong> and navigate to{' '}
                <strong>MCP Servers</strong>.
              </>,
              <>
                Click <strong>Add Server</strong>.
              </>,
              <CopyField label="Name" value="Anarix" />,
              <CopyField label="Transport" value="Streamable HTTP" />,
              <CopyField label="Server URL" value={MCP_SERVER_URL} />,
              <>
                Save the server.
              </>,
            ]}
          />
        </Accordion>
      )}
    </div>
  );

  const renderStepThree = () => (
    <div className={styles.stepPane}>
      <Typography variant="h2" className={styles.stepTitle}>
        Authentication
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Complete the login flow to connect {selectedName}.
      </Typography>

      <div className={styles.authCard}>
        <Timeline
          items={[
            <>
              Open a new chat with <strong>{selectedName}</strong>.
            </>,
            <>
              <span className={styles.timelinePromptLabel}>Run this command:</span>
              <CodeBlock value={LOGIN_COMMAND} />
            </>,
            <>
              Click the <strong>generated login URL</strong>.
            </>,
            <>
              Sign in using your <strong>Anarix credentials</strong>.
            </>,
            <>
              Return to {selectedName} — authentication completes and your
              available accounts are loaded.
            </>,
          ]}
        />
      </div>

      <Accordion
        title="Advanced Information"
        icon={<LockIcon size={20} weight="fill" />}
      >
        <p className={styles.advancedNote}>Repeat the login flow if:</p>
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
    <div className={styles.stepPane}>
      <Typography variant="h2" className={styles.stepTitle}>
        Verify your connection
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Run these prompts in {selectedName} to confirm everything works.
      </Typography>

      {VERIFY_CARDS.map((card) => (
        <VerifyCard
          key={card.id}
          icon={card.icon}
          title={card.title}
          desc={card.desc}
          prompt={card.prompt}
        />
      ))}

      <div className={styles.infoCard}>
        <LightbulbIcon size={24} weight="fill" />
        <div>
          <h4 className={styles.infoTitle}>
            Your MCP connection is almost complete
          </h4>
          <p className={styles.infoText}>
            If all three prompts return valid responses, your MCP connection is
            complete. Click Done after confirming the prompts have executed
            successfully.
          </p>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => {
    if (status === 'verifying') {
      return (
        <div className={styles.footer}>
          <div className={styles.footerStatus}>
            <SpinnerGapIcon size={18} className={styles.spin} />
            <span className={styles.footerStatusText}>
              Verifying connection…
            </span>
          </div>
          <button type="button" className={styles.btnPrimary} disabled>
            <SpinnerGapIcon size={16} className={styles.spin} />
            Verifying…
          </button>
        </div>
      );
    }
    if (status === 'success') {
      return (
        <div className={styles.footer}>
          <div className={styles.footerStatus}>
            <CheckCircleIcon size={20} color="#429488" weight="fill" />
            <span className={styles.footerStatusSuccess}>
              MCP connected — your AI assistants are ready.
            </span>
          </div>
        </div>
      );
    }
    if (status === 'failed') {
      return (
        <div className={styles.footer}>
          <div className={styles.footerStatus}>
            <XCircleIcon size={20} color="#ff0000" weight="fill" />
            <span className={styles.footerStatusError}>
              Connection failed. Please try again.
            </span>
          </div>
          <button
            type="button"
            className={styles.btnOutline}
            onClick={() => window.open(MCP_SUPPORT_EMAIL)}
          >
            Contact support
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleDone}
          >
            Try again
          </button>
        </div>
      );
    }
    const nextLabel = ['', 'Continue', 'Continue', 'Next', 'Done'][step];
    return (
      <div className={styles.footer}>
        {step > 1 && (
          <button
            type="button"
            className={styles.btnOutline}
            onClick={() => setStep((s) => s - 1)}
          >
            Previous
          </button>
        )}
        <div className={styles.footerSpacer} />
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() =>
            step < STEPS.length ? setStep((s) => s + 1) : handleDone()
          }
        >
          {nextLabel}
        </button>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogHeader}>
        <div className={styles.dialogHeaderLeft}>
          <div className={styles.dialogIconWrap}>
            <JivaLogo size={40} />
          </div>
          <div>
            <div className={styles.dialogTitleRow}>
              <span className={styles.dialogTitle}>MCP Connection</span>
              {connected && <span className={styles.connectedBadge}>ACTIVE</span>}
            </div>
            <span className={styles.dialogSubtitle}>
              Connect your AI assistant to JIVA in a few steps.
            </span>
          </div>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <XIcon size={20} />
        </button>
      </DialogTitle>

      {renderStepIndicator()}

      <DialogContent className={styles.dialogContent}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
        {step === 4 && renderStepFour()}
      </DialogContent>

      {renderFooter()}
    </Dialog>
  );
}
