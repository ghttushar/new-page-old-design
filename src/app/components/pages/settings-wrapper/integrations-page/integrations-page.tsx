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
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import styles from './integrations-page.module.scss';

const MCP_SERVER_URL = 'https://app.anarix.ai/mcp';

const MCP_CLIENTS = [
  {
    name: 'Claude Code',
    command:
      'claude mcp add anarix --transport http https://app.anarix.ai/mcp',
  },
  {
    name: 'Claude Desktop',
    description:
      'Add to your Claude Desktop config under Settings > Connectors > Custom connector with URL.',
  },
  {
    name: 'Cursor',
    description:
      'Add to ~/.cursor/mcp.json under mcpServers.',
  },
  {
    name: 'VS Code',
    description:
      'Add to .vscode/mcp.json via MCP: Add Server command.',
  },
  {
    name: 'OpenCode',
    description:
      'Add to opencode.json under mcp with type "remote".',
  },
];

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(MCP_SERVER_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.page}>
      <Typography variant="body1" className={styles.pageSubtitle}>
        Send Anarix alerts to the channels you actually check.
      </Typography>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Available integrations
        </Typography>

        <div className={styles.card}>
          <div className={styles.cardIconWrap}>
            <WhatsappLogoIcon size={24} weight="fill" color="#25D366" />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardTitleRow}>
              <Typography variant="body1" className={styles.cardTitle}>
                WhatsApp
              </Typography>
              <span className={styles.badge}>ALERTS</span>
            </div>
            <Typography variant="body2" className={styles.cardDesc}>
              Receive Anarix alerts and notifications on WhatsApp. Choose which
              services and accounts trigger messages.
            </Typography>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
            <Box
              component="button"
              onClick={() => setWhatsappDialogOpen(true)}
              sx={{
                bgcolor: '#77469b',
                color: '#fff',
                border: 'none',
                borderRadius: '0.8rem',
                px: '1.6rem',
                py: '0.7rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                textTransform: 'none',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: '#9551ab' },
              }}
            >
              Connect WhatsApp
            </Box>
          </Box>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIconWrap}>
            <LightningIcon size={24} weight="fill" color="#77469b" />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardTitleRow}>
              <Typography variant="body1" className={styles.cardTitle}>
                MCP
              </Typography>
              <span className={styles.badge}>TOOLS</span>
            </div>
            <Typography variant="body2" className={styles.cardDesc}>
              Connect AI assistants like Claude, Cursor, and VS Code to Anarix
              via the Model Context Protocol for agent-driven workflows.
            </Typography>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
            <Box
              component="button"
              onClick={() => setMcpDialogOpen(true)}
              sx={{
                bgcolor: '#77469b',
                color: '#fff',
                border: 'none',
                borderRadius: '0.8rem',
                px: '1.6rem',
                py: '0.7rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                textTransform: 'none',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: '#9551ab' },
              }}
            >
              Learn More
            </Box>
          </Box>
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
          <Typography variant="body2" className={styles.emptyDesc}>
            Connect WhatsApp or MCP to receive operational alerts — ACoS
            spikes, stockouts, rule triggers — for the accounts and services
            you care about.
          </Typography>
        </div>
      </div>

      <WhatsAppConnectDialog
        open={whatsappDialogOpen}
        onClose={() => setWhatsappDialogOpen(false)}
      />

      <Dialog
        open={mcpDialogOpen}
        onClose={() => setMcpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '1.2rem' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: '1.6rem 2rem',
            borderBottom: '1px solid #e1e4e8',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Box
              sx={{
                width: '3.6rem',
                height: '3.6rem',
                borderRadius: '50%',
                bgcolor: '#f7edfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LightningIcon size={20} weight="fill" color="#77469b" />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#23272d',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              MCP (Model Context Protocol)
            </Typography>
          </Box>
          <Box
            component="button"
            onClick={() => setMcpDialogOpen(false)}
            sx={{
              minWidth: 'auto',
              p: '0.4rem',
              color: '#9a9a9a',
              bgcolor: 'transparent',
              border: 'none',
              borderRadius: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              '&:hover': { bgcolor: '#f3f4f6' },
            }}
          >
            <XIcon size={20} />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: '2rem' }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '1.3rem',
              fontWeight: 400,
              color: '#676f7e',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.7,
              mb: '2rem',
            }}
          >
            MCP is an open protocol that lets AI assistants interact with
            external tools. By connecting Anarix via MCP, your AI agents can
            query advertising data, monitor campaigns, and surface insights
            programmatically.
          </Typography>

          <Box sx={{ mb: '2rem' }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#23272d',
                fontFamily: "'Inter', sans-serif",
                mb: '0.6rem',
              }}
            >
              Server endpoint
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#f3f4f6',
                border: '1px solid #e1e4e8',
                borderRadius: '0.6rem',
                p: '0.8rem 1rem',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '1.3rem',
                  fontWeight: 500,
                  color: '#23272d',
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {MCP_SERVER_URL}
              </Typography>
              <Box
                component="button"
                onClick={handleCopyUrl}
                sx={{
                  minWidth: 'auto',
                  p: '0.4rem',
                  color: '#77469b',
                  bgcolor: 'transparent',
                  border: 'none',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  '&:hover': { bgcolor: '#f7edfe' },
                }}
              >
                {copied ? (
                  <ChecksIcon size={16} />
                ) : (
                  <CopyIcon size={16} />
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: '2rem' }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#23272d',
                fontFamily: "'Inter', sans-serif",
                mb: '1rem',
              }}
            >
              Supported clients
            </Typography>
            {MCP_CLIENTS.map((client) => (
              <Box
                key={client.name}
                sx={{
                  py: '1rem',
                  borderBottom: '1px solid #e1e4e8',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#23272d',
                    fontFamily: "'Inter', sans-serif",
                    mb: '0.4rem',
                  }}
                >
                  {client.name}
                </Typography>
                {client.command && (
                  <Box
                    sx={{
                      bgcolor: '#f3f4f6',
                      border: '1px solid #e1e4e8',
                      borderRadius: '0.4rem',
                      p: '0.6rem 1rem',
                      mb: '0.4rem',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 400,
                        color: '#23272d',
                        fontFamily: "'Courier New', monospace",
                        wordBreak: 'break-all',
                      }}
                    >
                      {client.command}
                    </Typography>
                  </Box>
                )}
                {client.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 400,
                      color: '#676f7e',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {client.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          <Box
            component="button"
            onClick={() =>
              window.open('https://www.anarix.ai/mcp', '_blank')
            }
            sx={{
              width: '100%',
              bgcolor: '#77469b',
              color: '#fff',
              border: 'none',
              borderRadius: '0.8rem',
              p: '1rem',
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              textTransform: 'none',
              transition: 'background 0.15s',
              '&:hover': { bgcolor: '#9551ab' },
            }}
          >
            Learn more on anarix.ai/mcp
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
