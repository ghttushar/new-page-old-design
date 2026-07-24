import { DISABLE_TOOLTIP } from '@/enums/tooltip-texts.enums';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import { ColumnDef } from '@tanstack/react-table';
import TextButton from 'src/app/components/common/text-button/text-button';
import { InvitationStatusEnum } from 'src/enums/invites.enums';
import { IInviteUserBody } from 'src/interfaces/auth.interfaces';
import styles from './invites-page.module.scss';

export const invitesColumns = (
  handleDeleteInvite: (inviteId: string) => void,
  handleReinvite: (reinvitePayload: IInviteUserBody) => void
): ColumnDef<any>[] => [
  {
    accessorKey: 'email',
    id: 'email',
    size: 460,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            textAlign: 'left',
            marginLeft: '2rem',
          }}
        >
          Email
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      return (
        <div
          className={styles.nameCell}
          style={{
            width: '100%',
            marginLeft: '2rem',
          }}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    id: 'status',
    size: 220,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Status
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      return (
        <div
          className={styles.userType}
          style={{
            width: '100%',
            textAlign: 'center',
          }}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    id: 'role',
    size: 220,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Role
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      return (
        <div
          className={styles.userType}
          style={{
            width: '100%',
            textAlign: 'center',
          }}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    id: 'action',
    size: 220,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Action
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const isDeleteDisabled =
        !accessControlUtils.hasAdminAccess() ||
        row.original.status === InvitationStatusEnum.ACCEPTED;
      const isReinviteDisabled =
        row.original.isExpired === false ||
        !accessControlUtils.hasAdminAccess() ||
        row.original.status === InvitationStatusEnum.ACCEPTED;

      const isReinviteEnabled =
        row.original.isExpired === true &&
        row.original.status === InvitationStatusEnum.INVITED;
      let disableReason = '';

      if (!accessControlUtils.hasAdminAccess()) {
        disableReason = DISABLE_TOOLTIP.ONLY_ADMIN_ACCESS;
      } else {
        if (row.original.status === InvitationStatusEnum.ACCEPTED) {
          disableReason = 'Invite cannot be deleted as it has been accepted.';
        } else {
          disableReason = '';
        }
      }
      const reinvitePayload: IInviteUserBody = {
        email: row.original.email,
        role: row.original.role,
      };

      return isReinviteEnabled ? (
        <TextButton
          label="Reinvite"
          handleClick={() => handleReinvite(reinvitePayload)}
          isVisible={true}
          customStyles={{ fontSize: '1.3rem', fontWeight: 600 }}
          isDisabled={isReinviteDisabled}
          disableReason={disableReason}
          tooltipPosition="top"
        />
      ) : (
        <TextButton
          label="Delete Invite"
          handleClick={() => handleDeleteInvite(row.original._id)}
          isVisible={true}
          customStyles={{ fontSize: '1.3rem', fontWeight: 600 }}
          isDisabled={isDeleteDisabled}
          disableReason={disableReason}
          tooltipPosition="bottom"
        />
      );
    },
  },
];
