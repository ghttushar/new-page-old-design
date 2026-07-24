import { useState } from 'react';
import { UserPlus, Sparkle } from '@phosphor-icons/react';
import { Button, Menu, MenuItem } from '@mui/material';

const MEMBERS = [
  { key: 'aan', label: 'Aan', role: 'AI', Icon: Sparkle },
  { key: 'mike', label: 'Mike', role: 'Ops', Icon: UserPlus },
  { key: 'sarah', label: 'Sarah', role: 'Marketing', Icon: UserPlus },
  { key: 'dorothy', label: 'Dorothy', role: 'Buyer', Icon: UserPlus },
  { key: 'design', label: 'Design', role: 'Team', Icon: UserPlus },
  { key: 'me', label: 'Myself', role: 'You', Icon: UserPlus },
];

interface Props {
  onAssign: (memberKey: string, memberLabel: string) => void;
}

export function AssignMenu({ onAssign }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ minWidth: 0, gap: 0.8, fontSize: '1.1rem', textTransform: 'none', borderColor: '#e1e4e8', color: '#7c7c7c', '&:hover': { borderColor: '#77469b', color: '#77469b' } }}
        startIcon={<UserPlus size={14} />}
      >
        Assign
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { width: 240, mt: 0.5, p: 0.5 } } }}>
        <MenuItem disabled sx={{ fontSize: '1rem', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          Assign to
        </MenuItem>
        {MEMBERS.map((m) => (
          <MenuItem key={m.key} onClick={() => { setAnchor(null); onAssign(m.key, m.label); }} sx={{ gap: 1.5, py: 0.8 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.key === 'aan' ? 'rgba(119,70,155,0.1)' : '#f6f6f7', color: m.key === 'aan' ? '#77469b' : '#676f7e' }}>
              <m.Icon size={12} />
            </span>
            <span style={{ flex: 1, fontSize: '1.2rem', color: '#23272d' }}>{m.label}</span>
            <span style={{ fontSize: '1rem', color: '#9a9a9a' }}>{m.role}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}