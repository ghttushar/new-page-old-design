import { Clock, ClockAfternoon, CalendarDots } from '@phosphor-icons/react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

export type SnoozeChoice = '1h' | 'tomorrow' | 'next_week';

interface Props {
  onSelect: (c: SnoozeChoice) => void;
  compact?: boolean;
}

const CHOICES: { key: SnoozeChoice; label: string; hint: string; Icon: any }[] = [
  { key: '1h', label: '1 hour', hint: 'Snooze for one hour', Icon: Clock },
  { key: 'tomorrow', label: 'Tomorrow', hint: 'Resumes at 8am', Icon: ClockAfternoon },
  { key: 'next_week', label: 'Next week', hint: 'Resumes Monday 8am', Icon: CalendarDots },
];

export function SnoozeMenu({ onSelect, compact = false }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  return (
    <>
      <Button
        size="small"
        variant="text"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ minWidth: 0, gap: 0.5, fontSize: '1.1rem', color: '#7c7c7c', textTransform: 'none', '&:hover': { color: '#23272d' } }}
        startIcon={compact ? undefined : <Clock size={14} />}
      >
        {compact ? <Clock size={14} /> : 'Snooze'}
      </Button>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { width: 200, mt: 0.5 } } }}>
        {CHOICES.map((c) => (
          <MenuItem key={c.key} onClick={() => { setAnchor(null); onSelect(c.key); }} sx={{ gap: 1.5, py: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem', fontWeight: 500 }}>
              <c.Icon size={14} /> {c.label}
            </span>
            <span style={{ fontSize: '1rem', color: '#9a9a9a', marginTop: -2 }}>{c.hint}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}