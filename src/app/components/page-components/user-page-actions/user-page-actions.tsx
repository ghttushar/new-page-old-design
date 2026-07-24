import { IUserAccountMapping } from '@/interfaces/auth.interfaces';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { DotsThreeOutlineVerticalIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { userRoleOptions } from 'src/constants/settings/settings.constants';
import { UserRolesEnum } from 'src/enums/invites.enums';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import AltPrimaryButton from '../../common/alt-primary-button/alt-primary-button';
import Dropdown, { IDropdownItem } from '../../common/dropdown/dropdown';
import InfoIcon from '../../common/info-icon/info-icon';
import PrimaryButton from '../../common/primary-button/primary-button';
import { dialogStyles } from './user-page-actions-styles';
import styles from './user-page-actions.module.scss';

interface IUserPageActionsProps {
  userId: string;
  currentRole: string | null;
  userName: string;
  userEmail: string;
  isTableEndReached: boolean;
  handleRevokeAccess: (userId: string) => void;
  handleUpdateUserRole: (userId: string, updatedRole: string) => void;
  isActionDisabled: boolean;
  disableReason: string;
  selectedUserAccountMapping: IUserAccountMapping | null;
}

export default function UserPageActions({
  userId,
  currentRole,
  userName,
  userEmail,
  isTableEndReached,
  handleRevokeAccess,
  handleUpdateUserRole,
  isActionDisabled,
  disableReason,
  selectedUserAccountMapping,
}: IUserPageActionsProps) {
  const [isActionOpen, setIsActionOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [updatedOptions, setUpdatedOptions] =
    useState<IDropdownItem<UserRolesEnum>[]>(userRoleOptions);
  const [selectedRole, setSelectedRole] = useState<
    IDropdownItem<UserRolesEnum>
  >(
    userRoleOptions.filter((user) => user.value === currentRole)[0] ??
      userRoleOptions[2]
  );

  const toggleActionButton = () => setIsActionOpen(!isActionOpen);
  const handleActionOptions = () => setIsActionOpen(false);
  const toggleUpdateModal = () => setIsUpdateModalOpen(!isUpdateModalOpen);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  useEffect(() => {
    if (selectedUserAccountMapping?.roles?.includes(UserRolesEnum.ADMIN)) {
      setUpdatedOptions((prev) =>
        prev.map((role) => {
          if (role.value === UserRolesEnum.ADMIN) {
            return {
              ...role,
              isDisabled: false,
            };
          }
          return role;
        })
      );
    }
  }, [selectedUserAccountMapping?.roles]);

  const handleUpdateRole = (value: IDropdownItem<UserRolesEnum>) => {
    setSelectedRole(value);
  };

  const handleUpdate = () => {
    handleUpdateUserRole(userId, selectedRole.value);
    closeUpdateModal();
  };

  return (
    <div className={styles.actionContainer}>
      <div
        className={styles.actionIconContainer}
        style={{
          cursor: isActionDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        <IconButton
          disabled={isActionDisabled}
          disableRipple
          onClick={toggleActionButton}
          sx={{
            '&.Mui-disabled': {
              cursor: isActionDisabled ? 'not-allowed' : 'pointer',
              svg: {
                fill: 'rgba(0,0,0,0.26)',
              },
            },
          }}
        >
          <DotsThreeOutlineVerticalIcon
            size={15}
            color="#77469B"
            weight="fill"
          />
        </IconButton>

        {isActionDisabled === true && (
          <div className={styles.infoIconWrapper}>
            <InfoIcon
              title={disableReason}
              position={TooltipPlacement.Top}
              customIconStyles={{
                width: '100%',
              }}
            />
          </div>
        )}
      </div>

      {isActionOpen === true && (
        <ActionOptions
          userId={userId}
          handleActionOptions={handleActionOptions}
          isTableEndReached={isTableEndReached}
          handleRevokeAccess={handleRevokeAccess}
          toggleUpdateModal={toggleUpdateModal}
        />
      )}

      {isUpdateModalOpen === true && (
        <Dialog
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          aria-labelledby="update-title"
          aria-describedby="update-description"
          sx={dialogStyles}
          maxWidth="md"
        >
          <DialogTitle id="update-title" className={styles.dialogTitle}>
            Update User Role
          </DialogTitle>

          <Divider />

          <DialogContent id="update-description">
            <div className={styles.userDataContainer}>
              <div className={styles.userFieldContainer}>
                <h4>Name</h4>
                <p className={styles.textField}>{userName}</p>
              </div>

              <div className={styles.userFieldContainer}>
                <h4>Email</h4>
                <p className={styles.textField}>{userEmail}</p>
              </div>

              <div className={styles.userFieldContainer}>
                <h4>Role</h4>
                <Dropdown
                  options={updatedOptions}
                  selected={selectedRole}
                  onSelect={handleUpdateRole}
                  width="10rem"
                  isNewDesign={true}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ display: 'flex', gap: '1rem' }}>
            <AltPrimaryButton
              buttonText="Cancel"
              buttonFunction={closeUpdateModal}
              disabled={false}
              height="3rem"
              fontSize="1.1rem"
            />
            <PrimaryButton
              buttonText="Update"
              buttonFunction={handleUpdate}
              disabled={currentRole === selectedRole.value}
              height="3rem"
              fontSize="1.1rem"
            />
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

interface IActionOptionsProps {
  userId: string;
  handleActionOptions: () => void;
  isTableEndReached: boolean;
  handleRevokeAccess: (userId: string) => void;
  toggleUpdateModal: () => void;
}

const ActionOptions = ({
  userId,
  handleActionOptions,
  isTableEndReached,
  handleRevokeAccess,
  toggleUpdateModal,
}: IActionOptionsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  const handleRevokeUserAccess = () => {
    handleRevokeAccess(userId);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        handleActionOptions();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleActionOptions]);

  return (
    <div
      className={styles.optionsContainer}
      style={{
        top: isTableEndReached ? 'unset' : '3rem',
        bottom: isTableEndReached ? '3rem' : 'unset',
      }}
      ref={containerRef}
    >
      <div className={styles.option} onClick={toggleUpdateModal}>
        <span>Update Role</span>
      </div>
      <div
        className={`${styles.option} ${styles.revokeOption}`}
        onClick={handleRevokeUserAccess}
      >
        <span>Revoke Access</span>
      </div>
    </div>
  );
};
