import {
  ChatCircleDotsIcon,
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  LightningIcon,
  LockIcon,
  SparkleIcon,
  SpinnerGapIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getMcpConnected, setMcpConnected } from './mcp-connection';
import styles from './mcp-connect-dialog.module.scss';

const MCP_SERVER_URL = 'https://mcp.anarix.ai/mcp/sse';
const MCP_SUPPORT_EMAIL = 'mailto:support@anarix.ai';

const STEPS = ['Choose Client', 'Setup', 'Authentication', 'Verify'];

type ClientKey = 'claude' | 'codex';

type StatusKey = 'idle' | 'verifying' | 'success' | 'failed';

const CLIENTS: {
  key: ClientKey;
  name: string;
  icon: React.ComponentType;
  desc: string;
}[] = [
  {
    key: 'claude',
    name: 'Claude',
    icon: ChatCircleDotsIcon,
    desc: 'Anthropic\u2019s assistant in the web app, desktop, and Code.',
  },
  {
    key: 'codex',
    name: 'ChatGPT (Codex)',
    icon: SparkleIcon,
    desc: 'OpenAI\u2019s agentic coding environment.',
  },
];

const REAUTH_TRIGGERS = [
  'Your session expires',
  'You switch accounts',
  'You clear browser/app data',
  'You\u2019ve been inactive for an extended period',
];

const VERIFY_PROMPTS = [
  {
    title: 'Verify Account Access',
    prompt: 'Show me the accounts I have access to.',
  },
  {
    title: 'Verify Campaign Data',
    prompt:
      'What were my top 5 campaigns by ad spend from 2026-04-01 to 2026-04-30?',
  },
  {
    title: 'Verify Visualizations',
    prompt:
      'Create a chart showing weekly ad spend and ROAS for the last 8 weeks.',
  },
];

function CopyRow({
  label,
  value,
  monospace = true,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.copyRow}>
      <Typography variant="body2" className={styles.copyLabel}>
        {label}
      </Typography>
      <div className={styles.copyBox}>
        <Typography
          variant="body2"
          className={`${styles.copyText} ${
            monospace ? styles.copyMonospace : ''
          }`}
        >
          {value}
        </Typography>
        <button type="button" className={styles.copyBtn} onClick={onCopy}>
          {copied ? (
            <CheckIcon size={15} weight="bold" />
          ) : (
            <CopyIcon size={15} />
          )}
        </button>
      </div>
    </div>
  );
}

function StepList({ children }: { children: React.ReactNode[] }) {
  return (
    <ol className={styles.stepList}>
      {children.map((child, index) => (
        <li key={index} className={styles.stepItem}>
          <span className={styles.stepNum}>{index + 1}</span>
          <div className={styles.stepContent}>{child}</div>
        </li>
      ))}
    </ol>
  );
}

function VerifyPrompt({ title, prompt }: { title: string; prompt: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.prompt}>
      <Typography variant="body1" className={styles.promptTitle}>
        {title}
      </Typography>
      <div className={styles.promptBox}>
        <Typography variant="body2" className={styles.promptText}>
          {prompt}
        </Typography>
        <button type="button" className={styles.copyBtn} onClick={onCopy}>
          {copied ? (
            <CheckIcon size={15} weight="bold" />
          ) : (
            <CopyIcon size={15} />
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
    setTimeout(() => {
      if (Math.random() < 0.9) {
        setMcpConnected(true);
        setConnected(true);
        setStatus('success');
      } else {
        setStatus('failed');
      }
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
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
                    ? styles.stepCompleted
                    : isCurrent
                    ? styles.stepCurrent
                    : ''
                }`}
              >
                {isCompleted ? (
                  <CheckIcon size={14} weight="bold" />
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
              <div
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
      <Typography variant="h2" className={styles.stepTitle}>
        Choose your client
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Select the AI assistant you want to connect to Anarix.
      </Typography>

      <div className={styles.clientGrid}>
        {CLIENTS.map((client) => {
          const ClientIcon = client.icon;
          const isSelected = selectedClient === client.key;
          return (
            <button
              key={client.key}
              type="button"
              className={`${styles.clientCard} ${
                isSelected ? styles.clientCardSelected : ''
              }`}
              onClick={() => setSelectedClient(client.key)}
            >
              <div
                className={`${styles.clientRadio} ${
                  isSelected ? styles.clientRadioSelected : ''
                }`}
              >
                {isSelected && <CheckIcon size={12} weight="bold" />}
              </div>
              <div className={styles.clientIconWrap}>
                <ClientIcon size={22} weight="fill" />
              </div>
              <div className={styles.clientInfo}>
                <Typography variant="body1" className={styles.clientName}>
                  {client.name}
                </Typography>
                <Typography variant="body2" className={styles.clientDesc}>
                  {client.desc}
                </Typography>
              </div>
            </button>
          );
        })}
      </div>

      <Box
        component="button"
        onClick={() => setStep(2)}
        sx={{
          width: '100%',
          bgcolor: '#77469b',
          color: '#fff',
          border: 'none',
          borderRadius: '0.8rem',
          px: '1rem',
          py: '1rem',
          fontSize: '1.4rem',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          textTransform: 'none',
          transition: 'background 0.15s',
          '&:hover': { bgcolor: '#9551ab' },
        }}
      >
        Continue
      </Box>
    </div>
  );

  const renderStepTwo = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Set up your client
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Follow the setup guide for {CLIENTS.find((c) => c.key === selectedClient)?.name}.
      </Typography>

      {selectedClient === 'claude' && (
        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <ChatCircleDotsIcon size={18} weight="fill" />
            <Typography variant="body1" className={styles.subSectionTitle}>
              Claude
            </Typography>
          </div>
          <div className={styles.setupBlock}>
            <div className={styles.setupBlockTitle}>
              For Team &amp; Enterprise Owners
            </div>
            <StepList>
              <span>
                Go to Organization Settings {'\u2192'} Connectors
              </span>
              <span>Click Add</span>
              <span>Select Custom {'\u2192'} Web</span>
              <CopyRow label="Enter the MCP server URL:" value={MCP_SERVER_URL} />
              <span>Click Add</span>
            </StepList>
          </div>
          <div className={styles.setupBlock}>
            <div className={styles.setupBlockTitle}>For Individual Users</div>
            <StepList>
              <span>Open Settings</span>
              <span>Navigate to Connectors</span>
              <span>Click Add Custom Connector</span>
              <CopyRow label="Name" value="JIVA" monospace={false} />
              <CopyRow label="Remote MCP URL" value={MCP_SERVER_URL} />
              <span>Click Add</span>
              <span>Verify JIVA appears in the connector list.</span>
            </StepList>
          </div>
        </div>
      )}

      {selectedClient === 'codex' && (
        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <SparkleIcon size={18} weight="fill" />
            <Typography variant="body1" className={styles.subSectionTitle}>
              ChatGPT (Codex)
            </Typography>
          </div>
          <div className={styles.setupBlock}>
            <StepList>
              <span>Open Settings</span>
              <span>Navigate to MCP Servers</span>
              <span>Click Add Server</span>
              <CopyRow label="Name" value="Anarix" monospace={false} />
              <CopyRow label="Transport" value="Streamable HTTP" monospace={false} />
              <CopyRow label="URL" value={MCP_SERVER_URL} />
              <span>Save the server.</span>
            </StepList>
          </div>
        </div>
      )}

      <Box
        component="button"
        onClick={() => setStep(3)}
        sx={{
          width: '100%',
          bgcolor: '#77469b',
          color: '#fff',
          border: 'none',
          borderRadius: '0.8rem',
          px: '1rem',
          py: '1rem',
          fontSize: '1.4rem',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          textTransform: 'none',
          transition: 'background 0.15s',
          '&:hover': { bgcolor: '#9551ab' },
        }}
      >
        Continue
      </Box>
    </div>
  );

  const renderStepThree = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Authentication
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Complete the login flow to connect {CLIENTS.find((c) => c.key === selectedClient)?.name}.
      </Typography>

      <div className={styles.subSection}>
        <div className={styles.subSectionHeader}>
          <LockIcon size={18} weight="fill" />
          <Typography variant="body1" className={styles.subSectionTitle}>
            Login Flow
          </Typography>
        </div>
        <StepList>
          <span>Open a new chat.</span>
          <CopyRow label="Run:" value="use anarix mcp and login" />
          <span>Click the generated login URL.</span>
          <span>Sign in using your Anarix credentials.</span>
          <span>Return to Claude/Codex.</span>
          <span>
            Authentication completes and your available accounts are loaded.
          </span>
        </StepList>
      </div>

      <div className={styles.subSection}>
        <div className={styles.subSectionHeader}>
          <LockIcon size={18} weight="fill" />
          <Typography variant="body1" className={styles.subSectionTitle}>
            Re-authentication
          </Typography>
        </div>
        <Typography variant="body2" className={styles.reauthNote}>
          Repeat the login flow if:
        </Typography>
        <ul className={styles.bulletList}>
          {REAUTH_TRIGGERS.map((trigger) => (
            <li key={trigger} className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              {trigger}
            </li>
          ))}
        </ul>
      </div>

      <Box
        component="button"
        onClick={() => setStep(4)}
        sx={{
          width: '100%',
          bgcolor: '#77469b',
          color: '#fff',
          border: 'none',
          borderRadius: '0.8rem',
          px: '1rem',
          py: '1rem',
          fontSize: '1.4rem',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          textTransform: 'none',
          transition: 'background 0.15s',
          '&:hover': { bgcolor: '#9551ab' },
        }}
      >
        Continue
      </Box>
    </div>
  );

  const renderStepFour = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Verify connection
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Run the following prompts to confirm everything is working.
      </Typography>

      {VERIFY_PROMPTS.map((item) => (
        <VerifyPrompt key={item.title} title={item.title} prompt={item.prompt} />
      ))}
      <div className={styles.successNote}>
        <CheckCircleIcon size={18} weight="fill" />
        If all three prompts return results, your MCP connection is working
        correctly.
      </div>

      <Box
        component="button"
        onClick={handleDone}
        sx={{
          width: '100%',
          bgcolor: status === 'verifying' ? '#d9d9d9' : '#77469b',
          color: status === 'verifying' ? 'rgba(0,0,0,0.38)' : '#fff',
          border: 'none',
          borderRadius: '0.8rem',
          px: '1rem',
          py: '1rem',
          fontSize: '1.4rem',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: status === 'verifying' ? 'not-allowed' : 'pointer',
          textTransform: 'none',
          transition: 'background 0.15s',
          '&:hover': status === 'verifying' ? {} : { bgcolor: '#9551ab' },
        }}
      >
        {status === 'verifying' ? 'Verifying…' : 'Done'}
      </Box>
    </div>
  );

  const renderFooter = () => {
    if (status === 'verifying') {
      return (
        <div className={styles.footer}>
          <div className={styles.statusBlock}>
            <SpinnerGapIcon size={18} className={styles.spin} />
            <span className={styles.verifyText}>Verifying connection…</span>
          </div>
        </div>
      );
    }
    if (status === 'success') {
      return (
        <div className={styles.footer}>
          <div className={styles.statusBlock}>
            <CheckCircleIcon size={20} color="#429488" weight="fill" />
            <span className={styles.statusSuccess}>
              MCP connected — your AI assistants are ready.
            </span>
          </div>
        </div>
      );
    }
    if (status === 'failed') {
      return (
        <div className={styles.footer}>
          <div className={styles.statusBlock}>
            <XCircleIcon size={20} color="#ff0000" weight="fill" />
            <span className={styles.statusFailed}>
              Connection failed. Please try again.
            </span>
          </div>
          <button
            type="button"
            className={styles.footerBtnOutline}
            onClick={() => window.open(MCP_SUPPORT_EMAIL)}
          >
            Contact our support team
          </button>
          <button
            type="button"
            className={styles.footerBtnPrimary}
            onClick={handleDone}
          >
            Try again
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ className: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogHeader}>
        <div className={styles.dialogHeaderLeft}>
          <div className={styles.dialogIconWrap}>
            <LightningIcon size={22} weight="fill" color="#77469b" />
          </div>
          <div>
            <div className={styles.dialogTitleRow}>
              <Typography variant="body1" className={styles.dialogTitle}>
                MCP (Model Context Protocol)
              </Typography>
              {connected && <span className={styles.connectedBadge}>ACTIVE</span>}
            </div>
            <Typography variant="body2" className={styles.dialogSubtitle}>
              Connect AI assistants to Anarix via the Model Context Protocol.
            </Typography>
          </div>
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
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
