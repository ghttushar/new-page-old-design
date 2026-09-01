import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import {
  CreditCardIcon,
  CheckCircleIcon,
  ArrowSquareOutIcon,
  PencilSimpleIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { AntSwitch } from '@/app/components/common/ant-switch/ant-switch';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import styles from './billing-page.module.scss';

interface CurrentPlan {
  name: string;
  billingCycle: string;
  price: string;
  renewsOn: string;
  status: string;
}

interface PaymentMethod {
  brand: string;
  lastFour: string;
  expiry: string;
  cardholder: string;
  autoRenew: boolean;
}

interface Invoice {
  date: string;
  invoiceNumber: string;
  plan: string;
  amount: string;
  status: string;
}

const MOCK_CURRENT_PLAN: CurrentPlan = {
  name: 'Free Trial',
  billingCycle: 'Monthly',
  price: '$0/month',
  renewsOn: 'May 30, 2027',
  status: 'Active',
};

const MOCK_PAYMENT_METHOD: PaymentMethod = {
  brand: 'Mastercard',
  lastFour: '4857',
  expiry: '12/27',
  cardholder: 'Jane Doe',
  autoRenew: true,
};

const MOCK_INVOICES: Invoice[] = [
  { date: 'February 2026', invoiceNumber: 'ABHS123456', plan: 'Pro Plan', amount: '$299.00', status: 'Upcoming' },
  { date: 'January 2026', invoiceNumber: 'ABHS123455', plan: 'Enterprise Plan', amount: '$599.00', status: 'Paid' },
  { date: 'December 2025', invoiceNumber: 'ABHS123454', plan: 'Starter Plan', amount: '$149.00', status: 'Paid' },
  { date: 'November 2025', invoiceNumber: 'ABHS123453', plan: 'Pro Plan', amount: '$299.00', status: 'Paid' },
  { date: 'October 2025', invoiceNumber: 'ABHS123452', plan: 'Enterprise Plan', amount: '$599.00', status: 'Paid' },
];

function getInvoiceColumns(handleDownload: (invoice: Invoice) => void): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: 'date',
      id: 'date',
      size: 180,
      header: () => <div className={styles.tableHeader}>Date</div>,
      cell: (props) => <div className={styles.tableCell}>{props.row.original.date}</div>,
    },
    {
      accessorKey: 'invoiceNumber',
      id: 'invoiceNumber',
      size: 200,
      header: () => <div className={styles.tableHeader}>Invoice Number</div>,
      cell: (props) => <div className={styles.tableCell}>{props.row.original.invoiceNumber}</div>,
    },
    {
      accessorKey: 'plan',
      id: 'plan',
      size: 220,
      header: () => <div className={styles.tableHeader}>Plan</div>,
      cell: (props) => <div className={styles.tableCell}>{props.row.original.plan}</div>,
    },
    {
      accessorKey: 'amount',
      id: 'amount',
      size: 140,
      header: () => <div className={styles.tableHeader}>Amount</div>,
      cell: (props) => <div className={styles.tableCell}>{props.row.original.amount}</div>,
    },
    {
      accessorKey: 'status',
      id: 'status',
      size: 140,
      header: () => <div className={styles.tableHeader}>Status</div>,
      cell: (props) => {
        const status = props.row.original.status;
        const isPaid = status === 'Paid';
        return (
          <span className={`${styles.statusPill} ${isPaid ? styles.statusPaid : styles.statusUpcoming}`}>
            {isPaid && <CheckCircleIcon size={12} weight="fill" />}
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'action',
      id: 'action',
      size: 80,
      header: () => <div className={styles.tableHeader}>Action</div>,
      cell: (props) => (
        <div className={styles.actionCell}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => handleDownload(props.row.original)}
            title="Download Receipt"
          >
            <DownloadSimpleIcon size={16} weight="bold" />
          </button>
        </div>
      ),
    },
  ];
}

export default function BillingPage() {
  useSubHeader(PageTitleEnum.BILLING, PAGE_TITLE_TOOLTIPS.BILLING);
  const [autoRenew, setAutoRenew] = useState(MOCK_PAYMENT_METHOD.autoRenew);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const handleDownloadReceipt = (invoice: Invoice) => {
    void invoice;
  };

  const columns = getInvoiceColumns(handleDownloadReceipt);

  return (
    <div className={styles.page}>
      <div className={styles.topGrid}>
        <div className={styles.currentPlanCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>CURRENT PLAN</span>
            <span className={styles.activePill}>
              <CheckCircleIcon size={12} weight="fill" />
              {MOCK_CURRENT_PLAN.status}
            </span>
          </div>
          <h2 className={styles.planName}>{MOCK_CURRENT_PLAN.name}</h2>
          <p className={styles.planDetails}>
            {MOCK_CURRENT_PLAN.billingCycle} | {MOCK_CURRENT_PLAN.price} | Renews {MOCK_CURRENT_PLAN.renewsOn}
          </p>
          <div className={styles.planActions}>
            <PrimaryButton
              buttonText="Buy a Plan"
              width="auto"
              height="3.4rem"
              disabled={false}
              isNewDesign={true}
            />
            <SecondaryButton
              buttonText="Cancel Plan"
              isButtonIconRequired={false}
              height="3.4rem"
              disabled={false}
            />
            <button type="button" className={styles.viewPlansLink}>
              <ArrowSquareOutIcon size={14} weight="bold" />
              View Plans
            </button>
          </div>
        </div>

        <div className={styles.paymentMethodCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>PAYMENT METHOD</span>
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => setPaymentDialogOpen(true)}
            >
              <PencilSimpleIcon size={14} weight="bold" />
              Edit
            </button>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardBrandIcon}>
              <CreditCardIcon size={28} weight="fill" />
            </div>
            <div className={styles.cardDetails}>
              <span className={styles.cardNumber}>•••• {MOCK_PAYMENT_METHOD.lastFour}</span>
              <span className={styles.cardMeta}>
                Exp {MOCK_PAYMENT_METHOD.expiry} | {MOCK_PAYMENT_METHOD.cardholder}
              </span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.autoRenewRow}>
            <div className={styles.autoRenewInfo}>
              <span className={styles.autoRenewLabel}>Auto-renew</span>
              <span className={styles.autoRenewDesc}>
                Automatically renew your plan when it expires.
              </span>
            </div>
            <AntSwitch
              checked={autoRenew}
              onChange={() => setAutoRenew(!autoRenew)}
              isNewDesign={true}
            />
          </div>
        </div>
      </div>

      <div className={styles.billingHistory}>
        <h3 className={styles.sectionTitle}>Billing History</h3>
        <div className={styles.tableWrapper}>
          <CustomTableWrapper
            data={MOCK_INVOICES}
            columns={columns}
            width="100%"
            height="auto"
            isLoading={false}
            pagination={pagination}
            setPagination={setPagination}
            isNewDesign={true}
          />
        </div>
      </div>

      {paymentDialogOpen && (
        <div className={styles.paymentOverlay} onClick={() => setPaymentDialogOpen(false)}>
          <div className={styles.paymentDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogTitle}>
              <h3>Change Payment Method</h3>
              <button className={styles.dialogClose} onClick={() => setPaymentDialogOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.dialogContent}>
              <p className={styles.dialogDesc}>
                Update your saved payment method. This will apply to all future billing cycles.
              </p>
              <div className={styles.dialogCardOption}>
                <CreditCardIcon size={24} />
                <div>
                  <span className={styles.dialogCardOptionTitle}>Add New Card</span>
                  <span className={styles.dialogCardOptionDesc}>Visa, Mastercard, or American Express</span>
                </div>
              </div>
            </div>
            <div className={styles.dialogActions}>
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
