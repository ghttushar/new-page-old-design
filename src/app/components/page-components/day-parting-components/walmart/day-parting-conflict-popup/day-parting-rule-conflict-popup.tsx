import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import { IExistingCampaigns } from '@/interfaces/day-parting.interfaces';
import { Dialog } from '@mui/material';
import { WarningIcon } from '@phosphor-icons/react';
import styles from './day-parting-rule-conflict-popup.module.scss';
interface RuleConflictPopupProps {
  isOpen: boolean;
  campaignsList: IExistingCampaigns[];
  handleConfirm: () => void;
  handleCancel: () => void;
}

const DAY_PARTING_RULE_CONFLICT_COLUMNS = [
  'Rule Name',
  'Campaign Name',
  'Campaign ID',
];

const RuleConflictPopup = ({
  campaignsList,
  handleCancel,
  handleConfirm,
  isOpen,
}: RuleConflictPopupProps) => {
  return (
    <Dialog
      open={isOpen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '0.8rem',
          width: '54rem',
          padding: '1.6rem',
        },
      }}
    >
      <div className={styles.container}>
        <span className={styles.header}>
          <WarningIcon weight="fill" color="#FFAF38" size={'2.2rem'} />
          <span className="text-[1.6rem]">Rule Conflict Warning</span>
        </span>

        <span className={styles.subContainer}>
          The following campaigns already exist in other rules!
          <div className={styles.tableContainer}>
            {RuleConflictTable(campaignsList)}
          </div>
          Creating this rule will remove these campaigns from existing rules.
          <br />
          <br />
          Do you still want to proceed?
        </span>

        <div className={styles.buttonContainer}>
          <SecondaryButton
            buttonText={'Cancel'}
            buttonFunction={handleCancel}
            disabled={false}
          />
          <PrimaryButton
            buttonText={'Yes, Go Ahead '}
            buttonFunction={handleConfirm}
            disabled={false}
            width="auto"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default RuleConflictPopup;

function RuleConflictTable(campaignsList: IExistingCampaigns[]) {
  return (
    <table className={styles.table}>
      <thead className="bg-gray-100">
        <tr
          className={styles.thead}
          style={{
            boxShadow: '0 0 0.4rem 0 rgba(0,0,0,0.2)',
          }}
        >
          {DAY_PARTING_RULE_CONFLICT_COLUMNS.map((col) => (
            <th className={styles.thSticky}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {campaignsList.map((rule) =>
          rule.campaigns.map((campaign, campaignIndex) => (
            <tr key={`${rule.jobId}-${campaignIndex}`}>
              {campaignIndex === 0 && (
                <td
                  className="border py-2 px-4 align-top"
                  rowSpan={rule.campaigns.length}
                  style={{ borderRight: '1px solid #dadeeb' }}
                >
                  {rule.title}
                </td>
              )}
              <td
                className="px-4 py-2"
                style={{
                  borderTop:
                    rule.campaigns.length === 1 || campaignIndex === 0
                      ? '1px solid #dadeeb'
                      : 'none',
                  borderRight: '1px solid #dadeeb',
                }}
              >
                <div style={{ maxHeight: '2rem', overflow: 'hidden' }}>
                  {campaign.campaignName}{' '}
                </div>
              </td>
              <td
                className="px-4 py-2"
                style={{
                  borderTop:
                    rule.campaigns.length === 1 || campaignIndex === 0
                      ? '1px solid #dadeeb'
                      : 'none',
                }}
              >
                <div style={{ maxHeight: '2rem', overflow: 'hidden' }}>
                  {campaign.campaignId}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
