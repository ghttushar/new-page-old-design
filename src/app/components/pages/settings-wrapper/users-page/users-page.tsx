import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { selectUser } from '@/redux/slices/auth/auth.slice';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { userPageEmptyState } from 'src/constants/empty-state.constants';
import {
  IUpdateUserRoleBody,
  IUserListData,
} from 'src/interfaces/auth.interfaces';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { usersColumns } from './users-page-columns';
import styles from './users-page.module.scss';

export default function UsersPage() {
  const user = useAppSelector(selectUser);
  useSubHeader(PageTitleEnum.USERS, PAGE_TITLE_TOOLTIPS.USERS);
  const [formattedRows, setFormattedRows] = useState<IUserListData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });
  const [last2RowsIndex, setLast2RowsIndex] = useState<number[]>([]);

  const dispatch = useAppDispatch();
  const { logout } = useAuthSelector();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const getUsersList = useCallback(() => {
    setIsLoading(true);
    AuthServices.getUserList()
      .then((res) => {
        if (res?.data.success) {
          setFormattedRows([...res.data.data]);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRevokeAccess = useCallback(
    (userId: string) => {
      setIsLoading(true);
      AuthServices.revokeAccessByUserId(userId)
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
          getUsersList();
        });
    },
    [getUsersList]
  );
  const getLast2RowsIndex = useCallback(
    (index: number[]) => setLast2RowsIndex(index),
    []
  );
  const handleUpdateUserRole = useCallback(
    (userId: string, updatedRole: string) => {
      const body: IUpdateUserRoleBody = {
        userId,
        role: updatedRole,
      };

      setIsLoading(true);
      AuthServices.updateUserRole(body)
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
          getUsersList();
        });
    },
    [dispatch, getUsersList]
  );

  useEffect(() => {
    getUsersList();
  }, [getUsersList]);

  useEffect(() => {
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  if (isLoading === true) return <LoaderWrapper />;
  if (formattedRows.length === 0)
    return (
      <EmptyState
        {...userPageEmptyState}
        buttonText={`Logout`}
        buttonFunction={logout}
      />
    );
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.tableDiv}>
          <CustomTableWrapper
            data={formattedRows}
            columns={usersColumns(
              selectedUserAccountMapping,
              formattedRows.length,
              handleRevokeAccess,
              handleUpdateUserRole,
              last2RowsIndex,
              user?.userType
            )}
            width="100%"
            height="60rem"
            isLoading={isLoading}
            pageSizes={PAGE_SIZE_OPTIONS}
            pagination={pagination}
            setPagination={setPagination}
            getLast2RowsIndex={getLast2RowsIndex}
          />
        </div>
      </div>
    </div>
  );
}
