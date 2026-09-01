import {
  CheckCircleIcon,
  ArrowSquareOutIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  CreditCardIcon,
  CalendarDotsIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import styles from './billing-page.module.scss';

interface PlanFeature {
  label: string;
}

interface BillingPlan {
  id: string;
  name: string;
  billingCycle: string;
  price: string;
  renewsOn: string;
  status: string;
  features: PlanFeature[];
  paymentLastFour: string;
  paymentBrand: string;
  nextBilling: string;
}

interface Invoice {
  date: string;
  invoiceNumber: string;
  plan: string;
  amount: string;
  status: string;
}

const MOCK_PLANS: BillingPlan[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    billingCycle: 'Monthly',
    price: '$0/month',
    renewsOn: 'May 30, 2027',
    status: 'Active',
    features: [
      { label: '50,000 API calls/month' },
      { label: '10 team members' },
      { label: 'Basic analytics dashboard' },
      { label: 'Email support (48h response)' },
      { label: '1 GB data storage' },
      { label: 'Standard integrations' },
    ],
    paymentLastFour: '4242',
    paymentBrand: 'Visa',
    nextBilling: 'May 30, 2027',
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    billingCycle: 'Monthly',
    price: '$49/month',
    renewsOn: 'Jun 15, 2026',
    status: 'Active',
    features: [
      { label: '200,000 API calls/month' },
      { label: '25 team members' },
      { label: 'Advanced analytics & reports' },
      { label: 'Priority email support (24h response)' },
      { label: '10 GB data storage' },
      { label: 'All integrations + API access' },
    ],
    paymentLastFour: '8812',
    paymentBrand: 'Mastercard',
    nextBilling: 'Jun 15, 2026',
  },
];

const MOCK_INVOICES: Invoice[] = [
  { date: 'February 2026', invoiceNumber: 'ABHS123456', plan: 'Pro Plan', amount: '$299.00', status: 'Upcoming' },
  { date: 'January 2026', invoiceNumber: 'ABHS123455', plan: 'Enterprise Plan', amount: '$599.00', status: 'Paid' },
  { date: 'December 2025', invoiceNumber: 'ABHS123454', plan: 'Starter Plan', amount: '$149.00', status: 'Paid' },
  { date: 'November 2025', invoiceNumber: 'ABHS123453', plan: 'Pro Plan', amount: '$299.00', status: 'Paid' },
  { date: 'October 2025', invoiceNumber: 'ABHS123452', plan: 'Enterprise Plan', amount: '$599.00', status: 'Paid' },
];

function getInvoiceColumns(): ColumnDef<Invoice>[] {
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
      cell: () => (
        <div className={styles.actionCell}>
          <button type="button" className={styles.actionBtn}>
            •••
          </button>
        </div>
      ),
    },
  ];
}

function PlanCard({ plan }: { plan: BillingPlan }) {
  return (
    <div className={styles.planCard}>
      <div className={styles.planCardHeader}>
        <div className={styles.planCardInfo}>
          <span className={styles.cardLabel}>CURRENT PLAN</span>
          <div className={styles.planNameRow}>
            <h2 className={styles.planName}>{plan.name}</h2>
            <span className={styles.planDetailsInline}>
              {plan.billingCycle} | {plan.price} | Renews {plan.renewsOn}
            </span>
          </div>
        </div>
        <div className={styles.planCardActions}>
          <PrimaryButton
            buttonText="Upgrade"
            width="auto"
            height="3.4rem"
            disabled={false}
            isNewDesign={true}
            isButtonIconRequired={true}
            buttonIcon={<ArrowSquareOutIcon size={16} weight="bold" />}
          />
        </div>
      </div>

      <div className={styles.planCardExpandedContent}>
        <div className={styles.expandedGrid}>
          <div className={styles.expandedSection}>
            <h4 className={styles.expandedSectionTitle}>Plan Features</h4>
            <ul className={styles.featureList}>
              {plan.features.map((feature, i) => (
                <li key={i} className={styles.featureItem}>
                  <CheckIcon size={14} weight="bold" className={styles.featureCheck} />
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.expandedSection}>
            <h4 className={styles.expandedSectionTitle}>Billing Details</h4>
            <div className={styles.billingDetailRows}>
              <div className={styles.billingDetailRow}>
                <CreditCardIcon size={16} className={styles.billingDetailIcon} />
                <span className={styles.billingDetailLabel}>Payment Method</span>
                <span className={styles.billingDetailValue}>
                  {plan.paymentBrand} •••• {plan.paymentLastFour}
                </span>
              </div>
              <div className={styles.billingDetailRow}>
                <CalendarDotsIcon size={16} className={styles.billingDetailIcon} />
                <span className={styles.billingDetailLabel}>Next Billing Date</span>
                <span className={styles.billingDetailValue}>{plan.nextBilling}</span>
              </div>
              <div className={styles.billingDetailRow}>
                <ShieldCheckIcon size={16} className={styles.billingDetailIcon} />
                <span className={styles.billingDetailLabel}>Status</span>
                <span className={styles.billingDetailValue}>
                  <span className={styles.activePill}>
                    <CheckCircleIcon size={12} weight="fill" />
                    {plan.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  useSubHeader(PageTitleEnum.BILLING, PAGE_TITLE_TOOLTIPS.BILLING);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const filteredInvoices = MOCK_INVOICES.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      inv.plan.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = getInvoiceColumns();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Plans & Billing<span className={styles.betaTag}>Beta</span></h1>
        <p className={styles.pageSubtitle}>Manage your subscription plans, payment methods, and billing history.</p>
      </div>

      <div className={styles.activePlansSection}>
        <h3 className={styles.sectionTitle}>Active Plans</h3>
        <div className={styles.planCardsList}>
          {MOCK_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      <div className={styles.invoicesSection}>
        <h3 className={styles.sectionTitle}>Invoices</h3>
        <div className={styles.invoicesToolbar}>
          <div className={styles.searchInput}>
            <MagnifyingGlassIcon size={14} weight="bold" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search Invoice Number"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.searchField}
            />
          </div>
          <SecondaryButton
            buttonText="Manage Payment Method"
            isButtonIconRequired={false}
            height="3.4rem"
            disabled={false}
          />
        </div>

        <div className={styles.tableWrapper}>
          <CustomTableWrapper
            data={filteredInvoices}
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
    </div>
  );
}
