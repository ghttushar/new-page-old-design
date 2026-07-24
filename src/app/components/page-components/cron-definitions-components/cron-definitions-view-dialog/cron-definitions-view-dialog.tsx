import { DATE_FORMAT_6 } from '@/constants/datetime.constants';
import { ICronDefinition } from '@/interfaces/cron/cron-definitions.interface';
import { getFormattedTimezoneDate } from '@/utils/datetime.utils';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

interface ICronDefinitionsViewDialogProps {
  open: boolean;
  onClose: () => void;
  definition: ICronDefinition | null;
}

function DetailRow({
  label,
  value,
  isCode,
}: {
  label: string;
  value: string | React.ReactNode;
  isCode?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '1rem 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div
        style={{
          width: '20rem',
          fontWeight: 600,
          fontSize: '1.3rem',
          color: '#555',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '1.3rem',
          color: '#222',
          fontFamily: isCode ? 'monospace' : 'inherit',
          fontWeight: isCode ? 600 : 400,
          wordBreak: 'break-word',
        }}
      >
        {value || '-'}
      </div>
    </div>
  );
}

export default function CronDefinitionsViewDialog({
  open,
  onClose,
  definition,
}: ICronDefinitionsViewDialogProps) {
  if (!definition) return null;

  const handlerLabel =
    definition.handler === 'schedule_runner' ? 'Schedule Runner' : 'Node Cron';

  const catchupLabel =
    definition.catchupPolicy === 'run_latest_only'
      ? 'Run Latest Only'
      : definition.catchupPolicy === 'run_all_missed'
      ? 'Run All Missed'
      : definition.catchupPolicy === 'skip'
      ? 'Skip'
      : definition.catchupPolicy;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ '.MuiPaper-root': { maxHeight: '85vh' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 2.4rem',
        }}
      >
        <Typography fontSize="2rem" fontWeight={700}>
          Cron Definition Details
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 'auto', padding: '0.4rem' }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: '2rem 2.4rem' }}>
        <DetailRow label="Task Type" value={definition.taskType} isCode />
        <DetailRow
          label="Description"
          value={definition.description || 'No description'}
        />
        <DetailRow
          label="Cron Expression"
          value={definition.cronExpression}
          isCode
        />
        <DetailRow
          label="Status"
          value={
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 1rem',
                borderRadius: '1.2rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                backgroundColor: definition.enabled ? '#e8f5e9' : '#f5f5f5',
                color: definition.enabled ? '#2e7d32' : '#9e9e9e',
              }}
            >
              <span
                style={{
                  width: '0.6rem',
                  height: '0.6rem',
                  borderRadius: '50%',
                  backgroundColor: definition.enabled ? '#2e7d32' : '#9e9e9e',
                }}
              />
              {definition.enabled ? 'Active' : 'Inactive'}
            </span>
          }
        />
        <DetailRow label="Handler" value={handlerLabel} />
        <DetailRow label="Catchup Policy" value={catchupLabel} />
        <DetailRow
          label="Error Notifications"
          value={definition.errorNotification ? 'Enabled' : 'Disabled'}
        />
        <DetailRow
          label="Payload"
          value={
            definition.payload
              ? JSON.stringify(definition.payload, null, 2)
              : 'No payload'
          }
          isCode
        />
        <DetailRow
          label="Created At"
          value={getFormattedTimezoneDate(
            definition.createdAt,
            undefined,
            DATE_FORMAT_6
          )}
        />
        <DetailRow
          label="Updated At"
          value={getFormattedTimezoneDate(
            definition.updatedAt,
            undefined,
            DATE_FORMAT_6
          )}
        />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '1.6rem 2.4rem' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1.3rem',
            color: '#77469b',
            borderColor: '#77469b',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
