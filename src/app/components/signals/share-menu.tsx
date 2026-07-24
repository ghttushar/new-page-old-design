import { useState } from 'react';
import { ShareNetwork, SlackLogo, MicrosoftTeamsLogo, Envelope, Link as LinkIcon, Check } from '@phosphor-icons/react';
import { Button, Menu, MenuItem, Divider } from '@mui/material';

interface Props {
  itemLabel: string;
  compact?: boolean;
}

export function ShareMenu({ itemLabel, compact = false }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const open = Boolean(anchor);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setAnchor(null);
  };

  return (
    <>
      <Button
        size="small"
        variant="text"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ minWidth: 0, gap: 0.5, fontSize: '1.1rem', color: '#7c7c7c', textTransform: 'none', '&:hover': { color: '#23272d' } }}
        startIcon={compact ? undefined : <ShareNetwork size={14} />}
      >
        {compact ? <ShareNetwork size={14} /> : 'Share'}
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { width: 220, mt: 0.5 } } }}>
        <MenuItem onClick={copyLink} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
          {copied ? <Check size={16} color="#429488" /> : <LinkIcon size={16} />}
          {copied ? 'Copied!' : 'Copy link'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchor(null)} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
          <SlackLogo size={16} /> Share to Slack
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
          <MicrosoftTeamsLogo size={16} /> Share to Teams
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
          <Envelope size={16} /> Share via Email
        </MenuItem>
      </Menu>
    </>
  );
}