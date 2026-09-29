import { ReactNode, useState } from 'react';
import { SparkleIcon } from '@/app/components/signals/alerts/icons';
import { WarningTriangleIcon, XCircleIcon } from './campaign-creator-icons';
import styles from './campaign-creator-shared-ui.module.scss';

export function CcSection({ title, description, children, trailing }: { title: string; description?: string; children: ReactNode; trailing?: ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.sectionTitle}>{title}</div>
          {description && <div className={styles.sectionDescription}>{description}</div>}
        </div>
        {trailing}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

export function CcField({ label, required, hint, children, width }: { label: string; required?: boolean; hint?: string; children: ReactNode; width?: string }) {
  return (
    <div className={styles.field} style={{ width: width ?? '100%' }}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      {children}
      {hint && <div className={styles.fieldHint}>{hint}</div>}
    </div>
  );
}

export function CcFieldRow({ children }: { children: ReactNode }) {
  return <div className={styles.fieldRow}>{children}</div>;
}

export function CcTextInput({ value, onChange, placeholder, type = 'text', error, min, step, prefix, suffix }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: boolean; min?: string; step?: string; prefix?: string; suffix?: string }) {
  return (
    <div className={styles.inputWithAffix}>
      {prefix && <span className={styles.inputAffix}>{prefix}</span>}
      <input
        className={`${styles.textInput} ${error ? styles.textInputError : ''} ${prefix ? styles.textInputHasPrefix : ''}`}
        value={value}
        type={type}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix && <span className={styles.inputAffix}>{suffix}</span>}
    </div>
  );
}

export interface CcChoiceCardOption<T extends string> {
  value: T;
  title: string;
  description: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string;
  recommended?: boolean;
}

export function CcChoiceCards<T extends string>({ options, value, onChange, columns = 2 }: { options: CcChoiceCardOption<T>[]; value: T | null; onChange: (v: T) => void; columns?: number }) {
  return (
    <div className={styles.choiceGrid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={opt.disabled}
          onClick={() => !opt.disabled && onChange(opt.value)}
          className={`${styles.choiceCard} ${value === opt.value ? styles.choiceCardActive : ''} ${opt.disabled ? styles.choiceCardDisabled : ''}`}
        >
          {opt.recommended && <span className={styles.recommendedRibbon}>Recommended</span>}
          {opt.badge && !opt.recommended && <span className={styles.choiceCardBadge}>{opt.badge}</span>}
          {opt.icon && <span className={styles.choiceCardIcon}>{opt.icon}</span>}
          <span className={styles.choiceCardTitle}>{opt.title}</span>
          <span className={styles.choiceCardDescription}>{opt.description}</span>
        </button>
      ))}
    </div>
  );
}

export function CcCheckboxCard({ checked, onChange, title, description, recommended, disabled }: { checked: boolean; onChange: (v: boolean) => void; title: string; description: string; recommended?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`${styles.checkCard} ${checked ? styles.checkCardActive : ''} ${disabled ? styles.choiceCardDisabled : ''}`}
    >
      <span className={`${styles.checkCardBox} ${checked ? styles.checkCardBoxChecked : ''}`}>{checked && '✓'}</span>
      <span className={styles.checkCardBody}>
        <span className={styles.checkCardTitleRow}>
          <span className={styles.checkCardTitle}>{title}</span>
          {recommended && <span className={styles.recommendedPill}>Recommended</span>}
        </span>
        <span className={styles.checkCardDescription}>{description}</span>
      </span>
    </button>
  );
}

export function CcCheckboxRow({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  return (
    <label className={`${styles.checkboxRow} ${disabled ? styles.checkboxRowDisabled : ''}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <div>
        <div className={styles.checkboxLabel}>{label}</div>
        {description && <div className={styles.checkboxDescription}>{description}</div>}
      </div>
    </label>
  );
}

export function CcPill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'purple' | 'green' | 'red' | 'amber' }) {
  return <span className={`${styles.pill} ${styles[`pill_${tone}`]}`}>{children}</span>;
}

export function CcWhyExplain({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.whyBlock}>
      <button type="button" className={styles.whyToggle} onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide explanation' : "Why we're recommending this"} <span className={styles.whyChevron}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className={styles.whyBody}>{children}</div>}
    </div>
  );
}

export function CcStatRow({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className={styles.statRow}>
      {stats.map((s) => (
        <div key={s.label} className={styles.statTile}>
          <div className={styles.statValue}>{s.value}</div>
          <div className={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CcRecommendationCard({ title, value, description, onUse }: { title: string; value: string; description: string; onUse: () => void }) {
  return (
    <div className={styles.recCard}>
      <div className={styles.recCardTitle}><SparkleIcon size={11} color="#77469b" /> {title}</div>
      <div className={styles.recCardValue}>{value}</div>
      <div className={styles.recCardDescription}>{description}</div>
      <button type="button" className={styles.recCardButton} onClick={onUse}>Use recommendation</button>
    </div>
  );
}

export function CcWarningBanner({ title, children, tone = 'warning' }: { title: string; children: ReactNode; tone?: 'warning' | 'error' }) {
  return (
    <div className={`${styles.warningBanner} ${tone === 'error' ? styles.warningBannerError : ''}`}>
      <div className={styles.warningTitle}>{tone === 'error' ? <XCircleIcon size={14} /> : <WarningTriangleIcon size={14} />} {title}</div>
      <div className={styles.warningBody}>{children}</div>
    </div>
  );
}
