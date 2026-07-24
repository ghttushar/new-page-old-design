import { PageTitleEnum } from '@/enums/index.enums';
import {
  DISABLE_TOOLTIP,
  PAGE_TITLE_TOOLTIPS,
} from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import AddIcon from '@mui/icons-material/Add';
import { PaginationState } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { inviteUserEmptyState } from 'src/constants/empty-state.constants';
import { IInviteUserBody } from 'src/interfaces/auth.interfaces';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import AddUserPage from './add-user-page/add-user-page';
import { invitesColumns } from './invites-page-columns';
import styles from './invites-page.module.scss';

export default function InvitesPage() {
  useSubHeader(PageTitleEnum.INVITES, PAGE_TITLE_TOOLTIPS.INVITES);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formattedRows, setFormattedRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });

  const dispatch = useAppDispatch();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const handleGetInvites = useCallback(() => {
    setIsLoading(true);
    AuthServices.getInviteList()
      .then((res) => {
        if (res?.data.success) {
          setFormattedRows([...res.data.data]);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);
  const handleDeleteInvite = (inviteId: string) => {
    setIsLoading(true);
    AuthServices.deleteInviteByInviteId(inviteId)
      .then((res) => {
        if (res?.data.success) {
          dispatch(
            showSuccessToastMessage({
              title: res?.data.message,
              description: res?.data.description,
            })
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
        handleToggleTable();
      });
  };
  const handleReinvite = (payload: IInviteUserBody) => {
    setIsLoading(true);
    AuthServices.inviteUser(payload)
      .then((res) => {
        if (res?.data.success) {
          dispatch(
            showSuccessToastMessage({
              title: res?.data.message,
              description: res?.data.description,
            })
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
        handleToggleTable();
      });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggleTable = () => {
    handleGetInvites();
  };

  useEffect(() => {
    handleGetInvites();
  }, [handleGetInvites]);

  useEffect(() => {
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);
  return (
    <React.Fragment>
      {isLoading === true ? (
        <LoaderWrapper />
      ) : formattedRows.length > 0 ? (
        <div className={styles.profilePage}>
          <div className={styles.profileContainer}>
            <div className={styles.buttonContainer}>
              <PrimaryButton
                buttonText={'Invite User'}
                buttonFunction={handleOpenDialog}
                disabled={!accessControlUtils.hasAdminManagerAccess()}
                tooltipText={
                  !accessControlUtils.hasAdminManagerAccess()
                    ? DISABLE_TOOLTIP.ONLY_ADMIN_ACCESS
                    : ''
                }
                isHoverTooltipEnabled={true}
                width="9rem"
              ></PrimaryButton>
            </div>

            <div className={styles.tableDiv}>
              <CustomTableWrapper
                data={formattedRows}
                columns={invitesColumns(handleDeleteInvite, handleReinvite)}
                width="100%"
                height="60rem"
                isLoading={isLoading}
                pageSizes={PAGE_SIZE_OPTIONS}
                pagination={pagination}
                setPagination={setPagination}
              />
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          {...inviteUserEmptyState}
          isButtonIconRequired={true}
          buttonIcon={<AddIcon />}
          buttonFunction={handleOpenDialog}
        />
      )}

      {openDialog && (
        <AddUserPage
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          handleToggleTable={handleToggleTable}
          setIsLoading={setIsLoading}
        />
      )}
    </React.Fragment>
  );
}
