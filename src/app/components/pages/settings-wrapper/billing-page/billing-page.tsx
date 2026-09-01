import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import {
  CaretDownIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ArrowSquareOutIcon,
  ReceiptIcon,
} from '@phosphor-icons/react';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import styles from './billing-page.module.scss';

interface Plan {
  id: string;
  title: string;
  tenure: string;
  status: string;
  lastFour: string;
  cardBrand: string;
  purchaseDate: string;
  amountPaid: string;
}

interface PaymentMethod {
  brand: string;
  lastFour: string;
  expiry: string;
}

const MOCK_PLANS: Plan[] = [
  {
    id: 'pro',
    title: 'Pro Plan',
    tenure: '6 months',
    status: 'Active',
    lastFour: '4242',
    cardBrand: 'Visa',
    purchaseDate: 'Jan 15, 2026',
    amountPaid: '$1,794.00',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Plan',
    tenure: '30 days',
    status: 'Active',
    lastFour: '8812',
    cardBrand: 'Mastercard',
    purchaseDate: 'Feb 3, 2026',
    amountPaid: '$599.00',
  },
  {
    id: 'starter',
    title: 'Starter Plan',
    tenure: '3 months',
    status: 'Active',
    lastFour: '3344',
    cardBrand: 'Visa',
    purchaseDate: 'Dec 1, 2025',
    amountPaid: '$447.00',
  },
];

const MOCK_PAYMENT: PaymentMethod = {
  brand: 'Visa',
  lastFour: '4242',
  expiry: '12/2027',
};

function PlanCard({
  plan,
  isExpanded,
  onToggle,
}: {
  plan: Plan;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`${styles.planCard} ${isExpanded ? styles.planCardExpanded : ''}`}>
      <div className={styles.planCardTop}>
        <div className={styles.planCardInfo}>
          <div className={styles.planCardTitleRow}>
            <span className={styles.planDot} />
            <h3 className={styles.planTitle}>{plan.title}</h3>
            <span className={styles.statusPill}>{plan.status}</span>
          </div>
          <span className={styles.planTenure}>{plan.tenure}</span>
        </div>
        <div className={styles.planCardActions}>
          <SecondaryButton
            buttonText="Upgrade"
            isButtonIconRequired={false}
            height="3rem"
            disabled={false}
          />
          <button
            type="button"
            className={styles.detailsToggle}
            onClick={onToggle}
          >
            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
            <CaretDownIcon
              size={14}
              className={`${styles.detailsChevron} ${isExpanded ? styles.detailsChevronOpen : ''}`}
            />
          </button>
        </div>
      </div>

      <Collapse in={isExpanded}>
        <div className={styles.planCardDetails}>
          <div className={styles.detailRow}>
            <CreditCardIcon size={16} className={styles.detailIcon} />
            <span className={styles.detailLabel}>Card:</span>
            <span className={styles.detailValue}>{plan.cardBrand} •••• {plan.lastFour}</span>
          </div>
          <div className={styles.detailRow}>
            <ReceiptIcon size={16} className={styles.detailIcon} />
            <span className={styles.detailLabel}>Purchased:</span>
            <span className={styles.detailValue}>{plan.purchaseDate}</span>
          </div>
          <div className={styles.detailRow}>
            <CurrencyDollarIcon size={16} className={styles.detailIcon} />
            <span className={styles.detailLabel}>Amount Paid:</span>
            <span className={styles.detailValue}>{plan.amountPaid}</span>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

export default function BillingPage() {
  useSubHeader(PageTitleEnum.BILLING, PAGE_TITLE_TOOLTIPS.BILLING);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleTogglePlan = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  return (
    <div className={styles.page}>
      <div className={styles.paymentBar}>
        <div className={styles.paymentBarLeft}>
          <CreditCardIcon size={20} className={styles.paymentBarIcon} />
          <div className={styles.paymentBarInfo}>
            <span className={styles.paymentBarLabel}>Manage Payment Method</span>
            <span className={styles.paymentBarCard}>
              {MOCK_PAYMENT.brand} •••• {MOCK_PAYMENT.lastFour} — Expires {MOCK_PAYMENT.expiry}
            </span>
          </div>
        </div>
        <SecondaryButton
          buttonText="Change"
          buttonFunction={() => setPaymentDialogOpen(true)}
          isButtonIconRequired={true}
          buttonIcon={<ArrowSquareOutIcon size={14} weight="bold" />}
          height="3.2rem"
          disabled={false}
        />
      </div>

      <div className={styles.grid}>
        {MOCK_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isExpanded={expandedPlan === plan.id}
            onToggle={() => handleTogglePlan(plan.id)}
          />
        ))}
      </div>

      {paymentDialogOpen && (
        <div className={styles.paymentOverlay} onClick={() => setPaymentDialogOpen(false)}>
          <div className={styles.paymentDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.paymentDialogTitle}>
              <h3>Change Payment Method</h3>
              <button className={styles.paymentDialogClose} onClick={() => setPaymentDialogOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.paymentDialogContent}>
              <p className={styles.paymentDialogDesc}>
                Update your saved payment method. This will apply to all future billing cycles.
              </p>
              <div className={styles.paymentCardOption}>
                <CreditCardIcon size={24} />
                <div>
                  <span className={styles.paymentCardOptionTitle}>Add New Card</span>
                  <span className={styles.paymentCardOptionDesc}>Visa, Mastercard, or American Express</span>
                </div>
              </div>
            </div>
            <div className={styles.paymentDialogActions}>
              <SecondaryButton
                buttonText="Cancel"
                buttonFunction={() => setPaymentDialogOpen(false)}
                height="3rem"
                disabled={false}
              />
              <PrimaryButton
                buttonText="Save"
                width="6rem"
                height="3rem"
                disabled={false}
                isNewDesign={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
