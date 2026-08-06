import {
  ActivityIcon,
  BellRingingIcon,
  CaretDownIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CheckIcon,
  LockKeyIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SpinnerGapIcon,
  XIcon,
} from '@phosphor-icons/react';
import { Collapse, Dialog, DialogContent } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { WhatsappLogo } from '@/app/components/common/integration-logos/integration-logos';
import styles from './whatsapp-connect-dialog.module.scss';

const STEPS = ['Phone', 'Verify', 'Services', 'Accounts'];

const COUNTRIES = [
  { code: 'US', dial: '+1', label: 'United States' },
  { code: 'GB', dial: '+44', label: 'United Kingdom' },
  { code: 'IN', dial: '+91', label: 'India' },
  { code: 'AE', dial: '+971', label: 'United Arab Emirates' },
  { code: 'DE', dial: '+49', label: 'Germany' },
  { code: 'FR', dial: '+33', label: 'France' },
  { code: 'SG', dial: '+65', label: 'Singapore' },
  { code: 'AU', dial: '+61', label: 'Australia' },
];

const OTP_LENGTH = 6;

const SERVICES = [
  {
    id: 'alerts',
    icon: BellRingingIcon,
    title: 'Alerts',
    desc: 'Real-time marketplace signals.',
  },
  {
    id: 'reports',
    icon: ChartBarIcon,
    title: 'Reports',
    desc: 'Scheduled performance reports.',
  },
  {
    id: 'monitoring',
    icon: ActivityIcon,
    title: 'Monitoring',
    desc: 'Account health and spend alerts.',
  },
];

const ACCOUNT_GROUPS = [
  {
    id: 'amazon',
    name: 'Amazon',
    accounts: [
      { id: 'amazon-main', name: 'Main account', detail: 'US marketplace' },
      { id: 'amazon-eu', name: 'Agency account', detail: 'EU marketplace' },
    ],
  },
  {
    id: 'walmart',
    name: 'Walmart',
    accounts: [
      { id: 'walmart-main', name: 'Seller account', detail: 'US marketplace' },
    ],
  },
];

interface IWhatsAppConnectDialogProps {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export default function WhatsAppConnectDialog({
  open,
  onClose,
  onConnected,
}: IWhatsAppConnectDialogProps) {
  const [step, setStep] = useState(1);
  const [countryIndex, setCountryIndex] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['amazon']));
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resent, setResent] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setPhone('');
      setOtp(Array(OTP_LENGTH).fill(''));
      setSelectedServices(new Set());
      setSelectedAccounts(new Set());
      setOpenGroups(new Set(['amazon']));
      setVerifying(false);
      setSuccess(false);
      setResent(false);
    }
  }, [open]);

  const reset = () => {
    setStep(1);
    setPhone('');
    setOtp(Array(OTP_LENGTH).fill(''));
    setSelectedServices(new Set());
    setSelectedAccounts(new Set());
    setOpenGroups(new Set(['amazon']));
    setVerifying(false);
    setSuccess(false);
    setResent(false);
  };

  const handleClose = () => {
    if (verifying) {
      return;
    }
    reset();
    onClose();
  };

  const phoneValid = phone.replace(/\D/g, '').length >= 7;
  const otpValid = otp.every((d) => d !== '');
  const servicesValid = selectedServices.size > 0;
  const accountsValid = selectedAccounts.size > 0;

  const handleConnect = () => {
    if (verifying) {
      return;
    }
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
      onConnected();
      showSuccessToastMessage({
        title: 'WhatsApp connected',
        description: 'Alerts and notifications will be delivered to your number.',
      });
      window.setTimeout(() => {
        reset();
        onClose();
      }, 1600);
    }, 1500);
  };

  const handlePrimary = () => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    } else {
      handleConnect();
    }
  };

  const canProceed =
    (step === 1 && phoneValid) ||
    (step === 2 && otpValid) ||
    (step === 3 && servicesValid) ||
    step === 4;

  // OTP handling
  const handleOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digits;
    setOtp(next);
    if (digits && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!digits) {
      return;
    }
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    digits.split('').forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allGroupSelected = (group: (typeof ACCOUNT_GROUPS)[number]) =>
    group.accounts.every((a) => selectedAccounts.has(a.id));

  const toggleGroupAll = (group: (typeof ACCOUNT_GROUPS)[number]) => {
    setSelectedAccounts((prev) => {
      const next = new Set(prev);
      if (allGroupSelected(group)) {
        group.accounts.forEach((a) => next.delete(a.id));
      } else {
        group.accounts.forEach((a) => next.add(a.id));
      }
      return next;
    });
  };

  const renderStepper = () => (
    <div className={styles.stepper}>
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
                    ? styles.stepCircleCompleted
                    : isCurrent
                    ? styles.stepCircleCurrent
                    : ''
                }`}
              >
                {isCompleted ? (
                  <CheckIcon size={12} weight="bold" />
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
              <span
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
      <h2 className={styles.stepTitle}>Enter your phone number</h2>
      <p className={styles.stepSubtitle}>
        Anarix will send a verification code to this number.
      </p>

      <div className={styles.phoneRow}>
        <select
          className={styles.countrySelect}
          value={countryIndex}
          onChange={(e) => setCountryIndex(Number(e.target.value))}
          aria-label="Country code"
        >
          {COUNTRIES.map((c, i) => (
            <option key={c.code} value={i}>
              {c.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className={styles.phoneInput}
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone number"
        />
      </div>

      <div className={styles.callout}>
        <PhoneIcon size={18} weight="fill" />
        <div>
          <span className={styles.calloutTitle}>What you get</span>
          <p className={styles.calloutText}>
            Receive Anarix alerts, scheduled reports, and account monitoring
            updates directly on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Verify your number</h2>
      <p className={styles.stepSubtitle}>
        Enter the {OTP_LENGTH}-digit code sent to{' '}
        <strong>
          {COUNTRIES[countryIndex].dial} {phone}
        </strong>
        .
      </p>

      <div className={styles.otpRow} onPaste={handleOtpPaste}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              otpRefs.current[i] = el;
            }}
            type="tel"
            inputMode="numeric"
            className={styles.otpInput}
            value={otp[i]}
            maxLength={2}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.resendRow}>
        <span className={styles.resendLabel}>
          Didn't receive the code?
        </span>
        <button
          type="button"
          className={styles.resendBtn}
          onClick={() => {
            setResent(true);
            showSuccessToastMessage({
              title: 'Code resent',
              description: 'A new code has been sent to your number.',
            });
          }}
          disabled={resent}
        >
          {resent ? 'Code sent' : 'Resend code'}
        </button>
      </div>
    </div>
  );

  const renderServicesStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Choose services</h2>
      <p className={styles.stepSubtitle}>
        Select what you want to receive on WhatsApp.
      </p>

      <div className={styles.servicesGrid}>
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedServices.has(service.id);
          return (
            <button
              key={service.id}
              type="button"
              className={`${styles.serviceCard} ${
                isSelected ? styles.serviceCardSelected : ''
              }`}
              onClick={() => toggleService(service.id)}
              aria-pressed={isSelected}
            >
              <span className={styles.serviceTop}>
                <span className={styles.serviceIcon}>
                  <Icon size={18} weight="fill" />
                </span>
                <span className={styles.serviceCheck}>
                  {isSelected && <CheckIcon size={11} weight="bold" />}
                </span>
              </span>
              <span className={styles.serviceName}>{service.title}</span>
              <span className={styles.serviceDesc}>{service.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderAccountsStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Choose accounts</h2>
      <p className={styles.stepSubtitle}>
        Select the accounts your WhatsApp alerts will cover.
      </p>

      <div className={styles.groupList}>
        {ACCOUNT_GROUPS.map((group) => {
          const isOpen = openGroups.has(group.id);
          return (
            <div key={group.id} className={styles.groupCard}>
              <div className={styles.groupHeader}>
                <button
                  type="button"
                  className={styles.groupToggle}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                >
                  <CaretDownIcon
                    size={14}
                    className={`${styles.groupChevron} ${
                      isOpen ? styles.groupChevronOpen : ''
                    }`}
                  />
                  <span className={styles.groupName}>{group.name}</span>
                  <span className={styles.groupCount}>
                    {group.accounts.filter((a) => selectedAccounts.has(a.id))
                      .length || ''}
                    {group.accounts.filter((a) => selectedAccounts.has(a.id))
                      .length > 0
                      ? `/${group.accounts.length}`
                      : ''}
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.selectAllBtn}
                  onClick={() => toggleGroupAll(group)}
                >
                  {allGroupSelected(group) ? 'Clear all' : 'Select all'}
                </button>
              </div>
              <Collapse in={isOpen}>
                <div className={styles.groupBody}>
                  {group.accounts.map((account) => {
                    const isSelected = selectedAccounts.has(account.id);
                    return (
                      <button
                        key={account.id}
                        type="button"
                        className={styles.accountItem}
                        onClick={() => toggleAccount(account.id)}
                        aria-pressed={isSelected}
                      >
                        <span className={styles.accountCheck}>
                          {isSelected && <CheckIcon size={11} weight="bold" />}
                        </span>
                        <span className={styles.accountInfo}>
                          <span className={styles.accountName}>
                            {account.name}
                          </span>
                          <span className={styles.accountDetail}>
                            {account.detail}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Collapse>
            </div>
          );
        })}
      </div>

      {success && (
        <div className={styles.statusRow}>
          <CheckCircleIcon size={16} color="#429488" weight="fill" />
          <span className={styles.statusSuccess}>
            WhatsApp connected — alerts are on their way.
          </span>
        </div>
      )}
    </div>
  );

  const primaryLabel = step < STEPS.length ? 'Next' : 'Connect';
  const isVerifying = verifying && step === STEPS.length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: styles.dialogPaper }}
    >
      <div className={styles.dialogHeader}>
        <div className={styles.dialogHeaderLeft}>
          <span className={styles.dialogIconWrap}>
            <WhatsappLogo size={22} />
          </span>
          <div>
            <h2 className={styles.dialogTitle}>Connect WhatsApp</h2>
            <p className={styles.dialogCaption}>
              Get Anarix alerts and reports on WhatsApp.
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>
      </div>

      {renderStepper()}

      <DialogContent className={styles.dialogContent}>
        {step === 1 && renderPhoneStep()}
        {step === 2 && renderVerifyStep()}
        {step === 3 && renderServicesStep()}
        {step === 4 && renderAccountsStep()}
      </DialogContent>

      <div className={styles.dialogFooter}>
        {step > 1 && (
          <button
            type="button"
            className={styles.previousBtn}
            onClick={() => setStep((s) => s - 1)}
          >
            Previous
          </button>
        )}
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handlePrimary}
          disabled={!canProceed || isVerifying}
        >
          {isVerifying ? (
            <>
              <SpinnerGapIcon size={16} className={styles.spin} />
              Connecting…
            </>
          ) : (
            primaryLabel
          )}
        </button>
      </div>
    </Dialog>
  );
}
