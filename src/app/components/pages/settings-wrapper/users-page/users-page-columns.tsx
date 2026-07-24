import { DISABLE_TOOLTIP } from '@/enums/tooltip-texts.enums';
import { ColumnDef } from '@tanstack/react-table';
import UserPageActions from 'src/app/components/page-components/user-page-actions/user-page-actions';
import { UserTypeEnum } from 'src/enums/auth.enums';
import { UserRolesEnum } from 'src/enums/invites.enums';
import { IUserAccountMapping } from 'src/interfaces/auth.interfaces';
import { isLast2RowsReached } from 'src/utils';
import styles from './users-page.module.scss';

export const usersColumns = (
  selectedUserAccountMapping: IUserAccountMapping | null,
  totalRowCount: number,
  handleRevokeAccess: (userId: string) => void,
  handleUpdateUserRole: (userId: string, updatedRole: string) => void,
  last2RowsIndex: number[],
  currentUserType: UserTypeEnum | undefined
): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      id: 'name',
      size: 400,
      header: (props) => {
        return (
          <div
            className={styles.tableHeader}
            style={{
              textAlign: 'left',
              marginLeft: '2rem',
            }}
          >
            Name
          </div>
        );
      },
      cell: (props) => {
        const { row } = props;

        const formattedName = `${row.original.userId?.firstName} ${row.original.userId?.lastName}`;

        return (
          <div
            className={styles.nameCell}
            style={{
              marginLeft: '2rem',
            }}
          >
            {formattedName}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      id: 'email',
      size: 400,
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
        const { row } = props;

        const email = row.original.userId?.email;

        return (
          <div
            className={styles.nameCell}
            style={{
              marginLeft: '2rem',
            }}
          >
            {email}
          </div>
        );
      },
    },
    {
      accessorKey: 'roles',
      id: 'roles',
      size: 200,
      header: (props) => {
        return (
          <div
            className={styles.tableHeader}
            style={{
              textAlign: 'center',
            }}
          >
            Role
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as any[];

        return (
          <div
            className={styles.userType}
            style={{
              textAlign: 'center',
            }}
          >
            {value?.join(' | ')}
          </div>
        );
      },
    },
    {
      accessorKey: 'action',
      id: 'action',
      size: 140,
      enableSorting: false,
      header: (props) => {
        return (
          <div
            className={styles.tableHeader}
            style={{
              textAlign: 'center',
            }}
          ></div>
        );
      },
      cell: (props) => {
        const { row } = props;
        const rowIndex = row.index;

        const isActionDisabled =
          !selectedUserAccountMapping?.roles?.includes(UserRolesEnum.ADMIN) ||
          (selectedUserAccountMapping?.roles?.includes(UserRolesEnum.ADMIN) &&
            row.original.roles?.includes(UserRolesEnum.ADMIN));
        let disableReason = '';

        if (!selectedUserAccountMapping?.roles?.includes(UserRolesEnum.ADMIN)) {
          disableReason = DISABLE_TOOLTIP.ONLY_ADMIN_ACCESS;
        } else {
          if (row.original.roles?.includes(UserRolesEnum.ADMIN)) {
            disableReason =
              'Admins can neither change the role of nor delete an existing admin.';
          } else {
            disableReason = '';
          }
        }

        return (
          <UserPageActions
            userId={row.original.userId._id}
            currentRole={row.original.roles[0] ?? null}
            userName={`${row.original.userId?.firstName} ${row.original.userId?.lastName}`}
            userEmail={row.original.userId?.email}
            isTableEndReached={isLast2RowsReached(
              rowIndex,
              last2RowsIndex,
              totalRowCount
            )}
            handleRevokeAccess={handleRevokeAccess}
            handleUpdateUserRole={handleUpdateUserRole}
            isActionDisabled={isActionDisabled}
            disableReason={disableReason}
            selectedUserAccountMapping={selectedUserAccountMapping}
          />
        );
      },
    },
  ];

  if (currentUserType === UserTypeEnum.INTERNAL) {
    columns.push({
      accessorKey: 'userType',
      id: 'userType',
      size: 200,
      header: (props) => {
        return (
          <div
            className={styles.tableHeader}
            style={{
              textAlign: 'center',
            }}
          >
            User Type
          </div>
        );
      },
      cell: (props) => {
        const { row } = props;

        const userType = row.original.userId?.userType;
        return (
          <div
            className={styles.userType}
            style={{
              textAlign: 'center',
            }}
          >
            {userType}
          </div>
        );
      },
    });
  }

  return columns;
};
