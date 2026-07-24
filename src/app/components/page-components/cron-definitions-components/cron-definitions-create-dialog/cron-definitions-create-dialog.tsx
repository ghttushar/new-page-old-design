import {
  catchupPolicyOptions,
  handlerOptions,
  initialFormData,
} from '@/constants/cron-defintion.constants';
import { CRON_EXPRESSION_REGEX } from '@/constants/regex.constants';
import {
  ICronDefinitionsCreateDialogProps,
  ICronDefinitionsFormData,
  ICronDefinitionsInsert,
  IFieldErrors,
} from '@/interfaces/cron/cron-definitions.interface';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';

export default function CronDefinitionsCreateDialog({
  open,
  onClose,
  onSubmit,
  editData,
  isLoading = false,
  isEditMode = false,
}: ICronDefinitionsCreateDialogProps) {
  const [formData, setFormData] =
    useState<ICronDefinitionsFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<IFieldErrors>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        taskType: editData.taskType,
        description: editData.description || '',
        cronExpression: editData.cronExpression,
        handler: editData.handler,
        catchupPolicy: editData.catchupPolicy,
        enabled: editData.enabled,
        errorNotification: editData.errorNotification,
        payload: editData.payload
          ? JSON.stringify(editData.payload, null, 2)
          : '{}',
      });
    } else {
      setFormData(initialFormData);
    }
    setFieldErrors({});
  }, [editData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof IFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    };

  const validate = (): boolean => {
    const errors: IFieldErrors = {};

    if (!formData.taskType.trim()) {
      errors.taskType = 'Task type is required';
    } else if (formData.taskType.trim().length < 3) {
      errors.taskType = 'Task type must be at least 3 characters';
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.taskType.trim())) {
      errors.taskType =
        'Only letters, numbers, hyphens and underscores allowed';
    }

    if (!formData.cronExpression.trim()) {
      errors.cronExpression = 'Cron expression is required';
    } else if (!CRON_EXPRESSION_REGEX.test(formData.cronExpression.trim())) {
      errors.cronExpression = 'Invalid cron expression format';
    }

    if (formData.payload) {
      try {
        const parsed = JSON.parse(formData.payload);
        if (typeof parsed !== 'object' || parsed === null) {
          errors.payload = 'Payload must be a valid JSON object';
        }
      } catch {
        errors.payload = 'Invalid JSON format';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: ICronDefinitionsInsert = {
      taskType: formData.taskType.trim(),
      cronExpression: formData.cronExpression.trim(),
      handler: formData.handler,
      catchupPolicy: formData.catchupPolicy,
      enabled: formData.enabled,
      errorNotification: formData.errorNotification,
      description: formData.description.trim() || undefined,
      payload: formData.payload ? JSON.parse(formData.payload) : undefined,
    };

    onSubmit(payload);
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ '.MuiPaper-root': { maxHeight: '90vh' } }}
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
          {isEditMode ? 'Edit Cron Definition' : 'Create Cron Definition'}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 'auto', padding: '0.4rem' }}
          disabled={isLoading}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: '2.4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <InputLabel sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
              Task Type / Name
              <InfoIcon title="Unique identifier for the cron task" />
            </InputLabel>
            <TextField
              fullWidth
              name="taskType"
              value={formData.taskType}
              disabled={true}
              placeholder="e.g. AMAZON_SYNC_PRODUCTS"
              helperText={fieldErrors.taskType}
              size="small"
            />
          </div>

          <div>
            <InputLabel sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
              Cron Expression{' '}
              <InfoIcon title="Standard 5 or 6 field cron expression (e.g. 0 */4 * * *)" />
            </InputLabel>
            <TextField
              fullWidth
              name="cronExpression"
              value={formData.cronExpression}
              onChange={handleChange}
              placeholder="0 */4 * * *"
              error={!!fieldErrors.cronExpression}
              helperText={
                fieldErrors.cronExpression ||
                'Format: minute hour day month weekday'
              }
              size="small"
            />
          </div>

          <div>
            <InputLabel sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
              Handler
            </InputLabel>
            <TextField
              select
              fullWidth
              name="handler"
              value={formData.handler}
              onChange={handleChange}
              size="small"
            >
              {handlerOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div>
            <InputLabel sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
              Catchup Policy
            </InputLabel>
            <TextField
              select
              fullWidth
              name="catchupPolicy"
              value={formData.catchupPolicy}
              onChange={handleChange}
              size="small"
            >
              {catchupPolicyOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div>
            <InputLabel sx={{ fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
              Payload (JSON)
            </InputLabel>
            <TextField
              fullWidth
              name="payload"
              value={formData.payload}
              onChange={handleChange}
              multiline
              rows={3}
              error={!!fieldErrors.payload}
              helperText={fieldErrors.payload}
              placeholder='{"key": "value"}'
              size="small"
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                },
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '3rem' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enabled}
                  onChange={handleSwitchChange('enabled')}
                  color="primary"
                />
              }
              label={
                <Typography fontSize="1.3rem" fontWeight={500}>
                  Enabled
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.errorNotification}
                  onChange={handleSwitchChange('errorNotification')}
                  color="primary"
                />
              }
              label={
                <Typography fontSize="1.3rem" fontWeight={500}>
                  Error Notifications
                </Typography>
              }
            />
          </div>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '1.6rem 2.4rem', gap: '1rem' }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1.3rem',
            color: '#77469b',
            borderColor: '#77469b',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1.3rem',
            backgroundColor: '#77469b',
            '&:hover': { backgroundColor: '#623a82' },
          }}
        >
          {isLoading
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
            ? 'Update'
            : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
