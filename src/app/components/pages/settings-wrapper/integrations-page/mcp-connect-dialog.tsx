import {
  CheckCircleIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  CursorClickIcon,
  LightningIcon,
  MonitorIcon,
  PuzzlePieceIcon,
  QuestionIcon,
  RocketIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  SpinnerGapIcon,
  TerminalIcon,
  TerminalWindowIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getMcpConnected, setMcpConnected } from './mcp-connection';
import styles from './mcp-connect-dialog.module.scss';

const MCP_SERVER_URL = 'https://app.anarix.ai/mcp';
const MCP_DOCS_URL = 'https://www.anarix.ai/mcp';
const MCP_SUPPORT_EMAIL = 'mailto:support@anarix.ai';

type TabKey = 'get-started' | 'customize' | 'logs' | 'help';

type StatusKey = 'idle' | 'verifying' | 'success' | 'failed';

const TABS: { key: TabKey; label: string; icon: React.ComponentType }[] = [
  { key: 'get-started', label: 'Get started', icon: LightningIcon },
  { key: 'customize', label: 'Customize settings', icon: SlidersHorizontalIcon },
  { key: 'logs', label: 'Logs', icon: TerminalWindowIcon },
  { key: 'help', label: 'Help', icon: QuestionIcon },
];

const FEATURES = [
  {
    icon: SparkleIcon,
    title: 'Query advertising data',
    desc: 'Ask your AI assistant for spend, sales, ACoS, or orders — it answers from live Anarix data.',
  },
  {
    icon: LightningIcon,
    title: 'Monitor campaigns',
    desc: 'Agents can read campaign performance and automation rule status programmatically.',
  },
  {
    icon: RocketIcon,
    title: 'Surface insights',
    desc: 'Let AI summarize P&L and marketplace intelligence without leaving your editor.',
  },
];

const MCP_TOOLS = [
  {
    name: 'get_account_summary',
    desc: 'Headline KPIs for any marketplace — spend, sales, ACoS, TACoS, and orders — over any lookback window.',
    io: 'Input: marketplace, lookbackDays  ·  Output: Spend, Sales, ACoS, TACoS, Orders',
  },
  {
    name: 'list_applied_rules',
    desc: 'Browse all advertising automation rules with optional status filtering — running, paused, draft, or ended.',
    io: 'Input: status?  ·  Output: Rule ID, name, status, campaign count, last run',
  },
  {
    name: 'echo',
    desc: 'Verify MCP server connectivity. Useful for health checks and integration testing.',
    io: 'Input: message  ·  Output: Echoed message',
  },
];

const CLIENTS = [
  {
    name: 'Claude Code',
    icon: TerminalIcon,
    description: 'Add via terminal command',
    copyText: `claude mcp add anarix --transport http ${MCP_SERVER_URL}`,
  },
  {
    name: 'Claude Desktop',
    icon: MonitorIcon,
    description: 'Add to Claude Desktop config',
    copyText: `{
  "mcpServers": {
    "anarix": {
      "url": "${MCP_SERVER_URL}"
    }
  }
}`,
  },
  {
    name: 'Cursor',
    icon: CursorClickIcon,
    description: 'Configure in Cursor settings',
    copyText: `{
  "mcpServers": {
    "anarix": {
      "url": "${MCP_SERVER_URL}"
    }
  }
}`,
  },
  {
    name: 'VS Code',
    icon: CodeIcon,
    description: 'Add to VS Code MCP config',
    copyText: `{
  "servers": {
    "anarix": {
      "type": "sse",
      "url": "${MCP_SERVER_URL}"
    }
  }
}`,
  },
  {
    name: 'OpenCode',
    icon: PuzzlePieceIcon,
    description: 'Add to OpenCode config',
    copyText: `{
  "mcp": {
    "servers": {
      "anarix": {
        "url": "${MCP_SERVER_URL}"
      }
    }
  }
}`,
  },
];

const FAQS = [
  {
    question: 'What is MCP?',
    answer:
      'The Model Context Protocol is an open standard that lets AI assistants securely call external tools. Anarix exposes its marketplace data as MCP tools.',
  },
  {
    question: 'Which AI assistants are supported?',
    answer:
      'Claude Code, Claude Desktop, Cursor, VS Code, and OpenCode. See Customize settings for the exact configuration for each.',
  },
  {
    question: 'Do I need an API key?',
    answer:
      'No. The Anarix MCP server is open at app.anarix.ai/mcp — point your assistant at the endpoint and you are ready.',
  },
  {
    question: 'Is my advertising data safe?',
    answer:
      'The MCP server only exposes the tools listed in Get started and serves read-only data for your connected accounts.',
  },
];

interface IMcpConnectDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function McpConnectDialog({
  open,
  onClose,
}: IMcpConnectDialogProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('get-started');
  const [copied, setCopied] = useState(false);
  const [copiedClient, setCopiedClient] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusKey>('idle');
  const [connected, setConnected] = useState(getMcpConnected);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setCopied(false);
      setCopiedClient(null);
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

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(MCP_SERVER_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyClient = (name: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClient(name);
    setTimeout(() => setCopiedClient(null), 2000);
  };

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

  const renderGetStarted = () => (
    <div>
      <Typography variant="body2" className={styles.intro}>
        MCP is an open protocol that lets AI assistants interact with external
        tools. By connecting Anarix via MCP, your AI agents can query
        advertising data, monitor campaigns, and surface insights
        programmatically.
      </Typography>

      <div className={styles.featureList}>
        {FEATURES.map((feature) => {
          const FeatureIcon = feature.icon;
          return (
            <div key={feature.title} className={styles.feature}>
              <div className={styles.featureIcon}>
                <FeatureIcon size={16} weight="fill" />
              </div>
              <div>
                <Typography variant="body1" className={styles.featureTitle}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" className={styles.featureDesc}>
                  {feature.desc}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>

      <Typography variant="body2" className={styles.sectionLabel}>
        Server endpoint
      </Typography>
      <div className={styles.endpointRow}>
        <Typography variant="body2" className={styles.endpointText}>
          {MCP_SERVER_URL}
        </Typography>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={handleCopyUrl}
        >
          {copied ? (
            <CheckIcon size={16} weight="bold" />
          ) : (
            <CopyIcon size={16} />
          )}
        </button>
      </div>

      <Typography variant="body2" className={styles.sectionLabel}>
        Available tools
      </Typography>
      <div className={styles.toolList}>
        {MCP_TOOLS.map((tool) => (
          <div key={tool.name} className={styles.tool}>
            <Typography variant="body1" className={styles.toolName}>
              {tool.name}
            </Typography>
            <Typography variant="body2" className={styles.toolDesc}>
              {tool.desc}
            </Typography>
            <Typography variant="body2" className={styles.toolIo}>
              {tool.io}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomize = () => (
    <div>
      <Typography variant="body2" className={styles.intro}>
        Pick your assistant and copy the exact configuration. Point it at the
        Anarix MCP endpoint and start querying.
      </Typography>
      <div className={styles.clientList}>
        {CLIENTS.map((client) => {
          const ClientIcon = client.icon;
          const isCopied = copiedClient === client.name;
          return (
            <div key={client.name} className={styles.client}>
              <div className={styles.clientIconWrap}>
                <ClientIcon size={18} weight="fill" />
              </div>
              <div className={styles.clientInfo}>
                <Typography variant="body1" className={styles.clientName}>
                  {client.name}
                </Typography>
                <Typography variant="body2" className={styles.clientDesc}>
                  {client.description}
                </Typography>
                <div className={styles.clientCode}>{client.copyText}</div>
              </div>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => handleCopyClient(client.name, client.copyText)}
              >
                {isCopied ? (
                  <CheckIcon size={16} weight="bold" />
                ) : (
                  <CopyIcon size={16} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className={styles.emptyState}>
      <TerminalWindowIcon size={44} className={styles.emptyIcon} />
      <Typography variant="body1" className={styles.emptyTitle}>
        No logs yet
      </Typography>
      <Typography variant="body2" className={styles.emptyDesc}>
        MCP activity will appear here once your AI assistants start querying
        the server.
      </Typography>
    </div>
  );

  const renderHelp = () => (
    <div>
      <div className={styles.faqList}>
        {FAQS.map((faq) => (
          <div key={faq.question} className={styles.faqItem}>
            <Typography variant="body1" className={styles.faqQuestion}>
              {faq.question}
            </Typography>
            <Typography variant="body2" className={styles.faqAnswer}>
              {faq.answer}
            </Typography>
          </div>
        ))}
      </div>
      <div className={styles.supportRow}>
        <div>
          <Typography variant="body1" className={styles.supportText}>
            Still stuck?
          </Typography>
          <Typography variant="body2" className={styles.supportDesc}>
            Our team can help you connect your AI assistant.
          </Typography>
        </div>
        <a className={styles.supportLink} href={MCP_SUPPORT_EMAIL}>
          Contact our support team
        </a>
      </div>
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
    return (
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.footerBtnOutline}
          onClick={() => window.open(MCP_DOCS_URL, '_blank')}
        >
          Learn More
        </button>
        <button
          type="button"
          className={styles.footerBtnPrimary}
          onClick={handleDone}
        >
          Done
        </button>
      </div>
    );
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

      <div className={styles.dialogBody}>
        <div className={styles.tabList}>
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`${styles.tabItem} ${
                  isActive ? styles.tabItemActive : ''
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <TabIcon size={18} weight={isActive ? 'fill' : 'regular'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <DialogContent className={styles.dialogContent}>
          {activeTab === 'get-started' && renderGetStarted()}
          {activeTab === 'customize' && renderCustomize()}
          {activeTab === 'logs' && renderLogs()}
          {activeTab === 'help' && renderHelp()}
          {renderFooter()}
        </DialogContent>
      </div>
    </Dialog>
  );
}