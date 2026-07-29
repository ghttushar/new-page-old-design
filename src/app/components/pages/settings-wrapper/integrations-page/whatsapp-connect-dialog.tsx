import {
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import {
  WhatsappLogoIcon,
  XIcon,
  CheckIcon,
  TrendUpIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  PackageIcon,
  ChartBarIcon,
  ClockIcon,
  StorefrontIcon,
  CaretDownIcon,
  CaretUpIcon,
  LightningIcon,
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import styles from './whatsapp-connect-dialog.module.scss';

const STEPS = ['Phone', 'Verify', 'Services', 'Accounts'];

const SERVICES = [
  {
    id: 'profitability',
    name: 'Profitability',
    desc: 'Margin drops, COGS swings, P&L anomalies.',
    icon: TrendUpIcon,
  },
  {
    id: 'advertising',
    name: 'Advertising',
    desc: 'ACoS spikes, budget pacing, campaign issues.',
    icon: MegaphoneIcon,
  },
  {
    id: 'rules',
    name: 'Rules',
    desc: 'Rule triggers, execution errors, applied changes.',
    icon: ShieldCheckIcon,
  },
  {
    id: 'catalog',
    name: 'Catalog',
    desc: 'Stockouts, listing suppressions, inventory risks.',
    icon: PackageIcon,
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    desc: 'Share of voice shifts, keyword anomalies.',
    icon: ChartBarIcon,
  },
  {
    id: 'day-parting',
    name: 'Day Parting',
    desc: 'Schedule changes, missed windows, overrides.',
    icon: ClockIcon,
  },
];

const MARKETPLACES = [
  {
    id: 'amazon',
    name: 'Amazon',
    accounts: [],
    emptyMsg:
      'No Amazon accounts connected. Connect one from Settings \u2192 Accounts.',
  },
  {
    id: 'walmart',
    name: 'Walmart',
    accounts: [
      {
        id: 'demo-store',
        name: 'Demo Store',
        detail: 'US \u00b7 seller \u00b7 DEMO123',
      },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    accounts: [],
    emptyMsg:
      'No Shopify accounts connected. Connect one from Settings \u2192 Accounts.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    accounts: [],
    emptyMsg:
      'No TikTok accounts connected. Connect one from Settings \u2192 Accounts.',
  },
];

interface IWhatsAppConnectDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function WhatsAppConnectDialog({
  open,
  onClose,
}: IWhatsAppConnectDialogProps) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [expandedMarketplaces, setExpandedMarketplaces] = useState<string[]>([
    'walmart',
  ]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !verifyCode[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleMarketplace = (id: string) => {
    setExpandedMarketplaces((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAllAccounts = (marketplaceAccounts: string[]) => {
    setSelectedAccounts((prev) => {
      const allSelected = marketplaceAccounts.every((a) =>
        prev.includes(a)
      );
      if (allSelected) {
        return prev.filter((a) => !marketplaceAccounts.includes(a));
      }
      return [...new Set([...prev, ...marketplaceAccounts])];
    });
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

  const renderPhoneStep = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Add your phone number
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        We'll send a 6-digit verification code to confirm the number.
      </Typography>

      <div className={styles.phoneRow}>
        <TextField
          select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className={styles.countrySelect}
          SelectProps={{ native: true }}
        >
          <option value="+91">IN India...</option>
          <option value="+1">US United States</option>
          <option value="+44">GB United Kingdom</option>
        </TextField>
        <TextField
          placeholder="9876543210"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={styles.phoneInput}
        />
      </div>

      <div className={styles.infoBox}>
        <Typography variant="body1" className={styles.infoBoxTitle}>
          What WhatsApp will be used for
        </Typography>
        <Typography variant="body2" className={styles.infoBoxDesc}>
          Anarix sends operational alerts to the number you connect. No
          marketing, no chat replies.
        </Typography>
        <div className={styles.infoFeatures}>
          <div className={styles.infoFeature}>
            <LightningIcon size={16} className={styles.infoFeatureIcon} />
            <div>
              <Typography variant="body1" className={styles.infoFeatureTitle}>
                Real-time alerts
              </Typography>
              <Typography variant="body2" className={styles.infoFeatureDesc}>
                ACoS spikes, stockouts, rule triggers — pushed the moment they
                happen.
              </Typography>
            </div>
          </div>
          <div className={styles.infoFeature}>
            <LightningIcon size={16} className={styles.infoFeatureIcon} />
            <div>
              <Typography variant="body1" className={styles.infoFeatureTitle}>
                Daily digests
              </Typography>
              <Typography variant="body2" className={styles.infoFeatureDesc}>
                Morning recap of yesterday's profitability and pacing for
                chosen accounts.
              </Typography>
            </div>
          </div>
          <div className={styles.infoFeature}>
            <LightningIcon size={16} className={styles.infoFeatureIcon} />
            <div>
              <Typography variant="body1" className={styles.infoFeatureTitle}>
                You stay in control
              </Typography>
              <Typography variant="body2" className={styles.infoFeatureDesc}>
                Anarix never replies on your behalf. Mute, edit, or remove
                anytime.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        fullWidth
        disableTouchRipple
        className={styles.primaryBtn}
        onClick={() => setStep(2)}
        disabled={!phoneNumber}
      >
        Continue
      </Button>
    </div>
  );

  const renderVerifyStep = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Verify your number
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Enter the 6-digit code sent to {countryCode} {phoneNumber}.
      </Typography>
      <Typography variant="body2" className={styles.stepHint}>
        (Demo: use 123456)
      </Typography>

      <div className={styles.codeRow}>
        {verifyCode.map((digit, i) => (
          <input
            key={i}
            id={`code-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(i, e.target.value)}
            onKeyDown={(e) => handleCodeKeyDown(i, e)}
            className={styles.codeInput}
          />
        ))}
      </div>

      <button className={styles.resendLink}>Resend code</button>

      <Button
        variant="contained"
        fullWidth
        disableTouchRipple
        className={styles.primaryBtn}
        onClick={() => setStep(3)}
        disabled={verifyCode.some((d) => !d)}
      >
        Verify
      </Button>
    </div>
  );

  const renderServicesStep = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Choose which services send alerts
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Select one or more. You can change this anytime.
      </Typography>

      <div className={styles.servicesGrid}>
        {SERVICES.map((svc) => {
          const Icon = svc.icon;
          const isSelected = selectedServices.includes(svc.id);
          return (
            <div
              key={svc.id}
              className={`${styles.serviceCard} ${
                isSelected ? styles.serviceCardSelected : ''
              }`}
              onClick={() => toggleService(svc.id)}
            >
              <div className={styles.serviceCardTop}>
                <Icon size={20} className={styles.serviceIcon} />
                <Checkbox
                  checked={isSelected}
                  disableRipple
                  className={styles.serviceCheckbox}
                />
              </div>
              <Typography variant="body1" className={styles.serviceName}>
                {svc.name}
              </Typography>
              <Typography variant="body2" className={styles.serviceDesc}>
                {svc.desc}
              </Typography>
            </div>
          );
        })}
      </div>

      <Button
        variant="contained"
        fullWidth
        disableTouchRipple
        className={styles.primaryBtn}
        onClick={() => setStep(4)}
        disabled={selectedServices.length === 0}
      >
        Continue
      </Button>
    </div>
  );

  const renderAccountsStep = () => (
    <div className={styles.stepContent}>
      <Typography variant="h2" className={styles.stepTitle}>
        Choose accounts to monitor
      </Typography>
      <Typography variant="body2" className={styles.stepSubtitle}>
        Alerts will only fire for the selected accounts.
      </Typography>

      <div className={styles.marketplaceList}>
        {MARKETPLACES.map((mp) => {
          const isExpanded = expandedMarketplaces.includes(mp.id);
          const hasAccounts = mp.accounts.length > 0;
          const allSelected =
            hasAccounts &&
            mp.accounts.every((a) => selectedAccounts.includes(a.id));

          return (
            <div key={mp.id} className={styles.marketplaceSection}>
              <div
                className={styles.marketplaceHeader}
                onClick={() =>
                  hasAccounts ? toggleMarketplace(mp.id) : undefined
                }
              >
                <div className={styles.marketplaceLeft}>
                  <StorefrontIcon size={18} className={styles.marketplaceIcon} />
                  <Typography
                    variant="body1"
                    className={styles.marketplaceName}
                  >
                    {mp.name}
                  </Typography>
                  {hasAccounts ? (
                    <span className={styles.marketplaceCount}>
                      {selectedAccounts.filter((a) =>
                        mp.accounts.some((ma) => ma.id === a)
                      ).length }
                      /{mp.accounts.length} selected
                    </span>
                  ) : (
                    <span className={styles.marketplaceEmpty}>no accounts</span>
                  )}
                </div>
                <div className={styles.marketplaceRight}>
                  {hasAccounts && (
                    <>
                      <button
                        className={styles.selectAllLink}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAllAccounts(
                            mp.accounts.map((a) => a.id)
                          );
                        }}
                      >
                        {allSelected ? 'Deselect all' : 'Select all'}
                      </button>
                      {isExpanded ? (
                        <CaretUpIcon size={16} className={styles.caretIcon} />
                      ) : (
                        <CaretDownIcon
                          size={16}
                          className={styles.caretIcon}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              {hasAccounts ? (
                <Collapse in={isExpanded}>
                  <div className={styles.accountList}>
                    {mp.accounts.map((acc) => (
                      <div key={acc.id} className={styles.accountItem}>
                        <Checkbox
                          checked={selectedAccounts.includes(acc.id)}
                          onChange={() => toggleAccount(acc.id)}
                          disableRipple
                          className={styles.accountCheckbox}
                        />
                        <div>
                          <Typography
                            variant="body1"
                            className={styles.accountName}
                          >
                            {acc.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            className={styles.accountDetail}
                          >
                            {acc.detail}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </Collapse>
              ) : (
                <div className={styles.emptyAccountMsg}>
                  <Typography variant="body2" className={styles.emptyAccountText}>
                    {mp.emptyMsg}
                  </Typography>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="contained"
        fullWidth
        disableTouchRipple
        className={styles.primaryBtn}
        onClick={onClose}
      >
        Finish
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogHeader}>
        <div className={styles.dialogHeaderLeft}>
          <div className={styles.dialogIconWrap}>
            <WhatsappLogoIcon size={22} weight="fill" color="#25D366" />
          </div>
          <div>
            <Typography variant="body1" className={styles.dialogTitle}>
              Connect WhatsApp
            </Typography>
            <Typography variant="body2" className={styles.dialogSubtitle}>
              Receive Anarix alerts on WhatsApp.
            </Typography>
          </div>
        </div>
        <Button
          onClick={onClose}
          className={styles.closeBtn}
          disableTouchRipple
        >
          <XIcon size={20} />
        </Button>
      </DialogTitle>

      {renderStepIndicator()}

      <DialogContent className={styles.dialogContent}>
        {step === 1 && renderPhoneStep()}
        {step === 2 && renderVerifyStep()}
        {step === 3 && renderServicesStep()}
        {step === 4 && renderAccountsStep()}
      </DialogContent>
    </Dialog>
  );
}
