import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  WhatsappLogoIcon,
  LightningIcon,
  XIcon,
  CopyIcon,
  ChecksIcon,
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import styles from './integrations-page.module.scss';

const MCP_SERVER_URL = 'https://app.anarix.ai/mcp';

const MCP_CLIENTS = [
  { name: 'Claude Code', command: 'claude mcp add anarix --transport http https://app.anarix.ai/mcp' },
  { name: 'Claude Desktop', description: 'Add to your Claude Desktop config under Settings > Connectors > Custom connector with URL.' },
  { name: 'Cursor', description: 'Add to ~/.cursor/mcp.json under mcpServers.' },
  { name: 'VS Code', description: 'Add to .vscode/mcp.json via MCP: Add Server command.' },
  { name: 'OpenCode', description: 'Add to opencode.json under mcp with type "remote".' },
];

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(MCP_SERVER_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Typography variant="h1" className={styles.pageTitle}>
          Integrations
        </Typography>
        <Typography variant="body1" className={styles.pageSubtitle}>
          Send Anarix alerts to the channels you actually check.
        </Typography>
      </div>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Available integrations
        </Typography>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardIconWrap}>
              <WhatsappLogoIcon size={32} weight="fill" color="#25D366" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  WhatsApp
                </Typography>
                <span className={styles.badge}>ALERTS</span>
              </div>
              <Typography variant="body2" className={styles.cardDescription}>
                Receive Anarix alerts and notifications on WhatsApp. Choose which
                services and accounts trigger messages.
              </Typography>
              <Button
                variant="contained"
                disableTouchRipple
                className={styles.connectButton}
              >
                Connect WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardIconWrap}>
              <LightningIcon size={32} weight="fill" color="#77469b" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  MCP
                </Typography>
                <span className={styles.badgeTools}>TOOLS</span>
              </div>
              <Typography variant="body2" className={styles.cardDescription}>
                Connect AI assistants like Claude, Cursor, and VS Code to Anarix
                via the Model Context Protocol for agent-driven workflows.
              </Typography>
              <Button
                variant="contained"
                disableTouchRipple
                className={styles.learnMoreButton}
                onClick={() => setMcpDialogOpen(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Your connections
        </Typography>

        <div className={styles.emptyCard}>
          <Typography variant="body1" className={styles.emptyTitle}>
            No integrations yet
          </Typography>
          <Typography variant="body2" className={styles.emptyDescription}>
            Connect WhatsApp or MCP to receive operational alerts — ACoS
            spikes, stockouts, rule triggers — for the accounts and services
            you care about.
          </Typography>
        </div>
      </div>

      <Dialog
        open={mcpDialogOpen}
        onClose={() => setMcpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: styles.dialogPaper }}
      >
        <DialogTitle className={styles.dialogTitle}>
          <div className={styles.dialogTitleContent}>
            <div className={styles.dialogIconWrap}>
              <LightningIcon size={24} weight="fill" color="#77469b" />
            </div>
            <Typography variant="h2" className={styles.dialogTitleText}>
              MCP (Model Context Protocol)
            </Typography>
          </div>
          <Button
            onClick={() => setMcpDialogOpen(false)}
            className={styles.dialogCloseBtn}
            disableTouchRipple
          >
            <XIcon size={20} />
          </Button>
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <Typography variant="body2" className={styles.dialogDescription}>
            MCP is an open protocol that lets AI assistants interact with external
            tools. By connecting Anarix via MCP, your AI agents can query advertising
            data, monitor campaigns, and surface insights programmatically.
          </Typography>

          <div className={styles.urlSection}>
            <Typography variant="body2" className={styles.urlLabel}>
              Server endpoint
            </Typography>
            <div className={styles.urlBox}>
              <Typography variant="body2" className={styles.urlText}>
                {MCP_SERVER_URL}
              </Typography>
              <Button
                onClick={handleCopyUrl}
                className={styles.copyBtn}
                disableTouchRipple
              >
                {copied ? <ChecksIcon size={16} /> : <CopyIcon size={16} />}
              </Button>
            </div>
          </div>

          <div className={styles.clientsSection}>
            <Typography variant="body2" className={styles.clientsLabel}>
              Supported clients
            </Typography>
            {MCP_CLIENTS.map((client) => (
              <div key={client.name} className={styles.clientItem}>
                <Typography variant="body1" className={styles.clientName}>
                  {client.name}
                </Typography>
                {client.command && (
                  <div className={styles.codeBlock}>
                    <Typography variant="body2" className={styles.codeText}>
                      {client.command}
                    </Typography>
                  </div>
                )}
                {client.description && (
                  <Typography variant="body2" className={styles.clientDesc}>
                    {client.description}
                  </Typography>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            fullWidth
            disableTouchRipple
            className={styles.dialogConnectBtn}
            onClick={() => window.open('https://www.anarix.ai/mcp', '_blank')}
          >
            Learn more on anarix.ai/mcp
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
