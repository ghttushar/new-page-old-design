import {
  ADVERTISING_ACCOUNT_URL,
  SELECT_ACCOUNT_URL,
} from '@/constants/urls.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { checkIsEqual, checkIsNull } from '@/utils/advertising.utils';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SignOutIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ILocation, IUserAccountMapping } from 'src/interfaces/auth.interfaces';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectIsAuthenticated,
  selectMappedAccounts,
  selectUser,
  setAccount,
  setMappedAccounts,
} from 'src/redux/slices/auth/auth.slice';
import AuthServices from 'src/services/auth.service';
import SessionServices from 'src/services/session.service';
import { settingsServices } from 'src/services/settings/settings.service';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import navigationUtils from 'src/utils/navigation/navigation.utils';
import AccountAvatar from '../../common/account-avatar/account-avatar';
import LoaderWrapper from '../../common/loader-wrapper/loader-wrapper';
import Logo from '../../common/logo/logo';
import AccountsListWrapper from '../../page-components/accounts-list/accounts-list-wrapper';
import styles from './select-account.module.scss';

export default function SelectAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAccountLoading, setIsAccountLoading] = useState<boolean>(false);
  const [isCursorEntered, setIsCursorEntered] = useState<boolean>(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const mappedAccounts = useAppSelector(selectMappedAccounts);
  const dispatch = useAppDispatch();
  const { logout } = useAuthSelector();
  const navigate = useNavigate();
  const authSelector = useAuthSelector();
  const location = useLocation() as ILocation | undefined;
  const selectedAccount = localStorageUtils.getSelectedAdvertisingAccount();

  const loginHandler = useCallback(
    async (selectedAccount: IUserAccountMapping, callbackUrl?: string) => {
      setIsAccountLoading(true);
      try {
        // Call switch account endpoint to update session on backend
        await SessionServices.switchAccount(selectedAccount.accountId._id);

        dispatch(setAccount(selectedAccount.accountId));
        localStorageUtils.setSelectedUserAccountMapping(selectedAccount);

        const availableAccounts = await settingsServices
          .getSettingsAccount(MarketplaceEnum.All)
          .then((res) => res.data.data);
        localStorageUtils.setAvailableAccounts(availableAccounts);
        authSelector.setInitialAdvertisingAccount();
        authSelector.setInitialCatalogAccount();

        const availableDSPAccounts = await settingsServices
          .getDSPAccount()
          .then((res) => res.data.data);

        localStorageUtils.setAvailableDSPAccounts(availableDSPAccounts);
        authSelector.setInitialDSPAccount();
        navigate(navigationUtils.getSafeCallbackUrl(callbackUrl));
      } catch (error) {
        console.error('Error while logging in', error);
      }
      setIsAccountLoading(false);
    },
    [dispatch, navigate]
  );

  const handleLoginClick = async (selectedId: string | number) => {
    if (mappedAccounts.length > 0) {
      const selectedAccount = mappedAccounts.filter(
        (account) => account.accountId._id === selectedId
      )[0];
      loginHandler(selectedAccount, location?.state?.callbackUrl);
    }
  };

  const handleLogoutClick = () => {
    logout();
  };

  useEffect(() => {
    if (isAuthenticated && localStorageUtils.getAuthToken()) {
      setIsLoading(true);
      AuthServices.getUserAccountMappings()
        .then(async (res) => {
          if (res?.data.success === true) {
            const _data = res?.data.data;
            dispatch(setMappedAccounts(_data));

            if (_data.length === 1) {
              await loginHandler(_data[0]);
            }
          }
        })
        .then(() => setIsLoading(false));
    }
  }, [isAuthenticated, dispatch, navigate, loginHandler]);

  if (
    checkIsNull(selectedAccount) === false &&
    checkIsEqual(location?.state?.callbackUrl, SELECT_ACCOUNT_URL)
  ) {
    navigate(ADVERTISING_ACCOUNT_URL);
    return;
  }

  if (isLoading || isAccountLoading) return <LoaderWrapper />;
  else
    return (
      <div className={styles.accountPage}>
        <Logo />
        <div className={styles.accountContainer}>
          {user !== null && <AccountAvatar user={user} />}
          <div className={styles.accountHeader}>
            <Typography
              variant="body1"
              fontSize="2rem"
              fontWeight={500}
              m={0}
              p={0}
              lineHeight="19.36px"
            >
              Hi, {user !== null && user.firstName}!
            </Typography>
            <Typography
              variant="body1"
              fontSize="1.2rem"
              fontWeight={400}
              m={0}
              p={0}
              lineHeight="12.1px"
              color="#969191"
            >
              {user !== null && user.email}
            </Typography>
          </div>

          {mappedAccounts.length > 0 ? (
            <div className={styles.accountSelection}>
              <Typography
                variant="subtitle1"
                fontSize="1.2rem"
                fontWeight={500}
                color="#000000"
                m={0}
                p={0}
              >
                Choose your account
              </Typography>

              <AccountsListWrapper
                mappedAccounts={mappedAccounts}
                onAccountClick={handleLoginClick}
              />

              <div className={styles.logoutContainer}>
                Ready to leave? Securely &nbsp;
                <span
                  className={styles.logout}
                  onClick={handleLogoutClick}
                  onMouseEnter={() => setIsCursorEntered(true)}
                  onMouseLeave={() => setIsCursorEntered(false)}
                >
                  {isCursorEntered ? (
                    <SignOutIcon size={16} color="#77469B" weight="fill" />
                  ) : (
                    <SignOutIcon size={16} color="#969191" />
                  )}
                  Logout
                </span>
                &nbsp; here
              </div>
            </div>
          ) : (
            <div className={styles.accountSelection}>
              <div className={styles.noAccountView}>
                <p>
                  Sorry, There is no account linked to{' '}
                  <span>“{user !== null && user.email}”</span>
                </p>
                <p>
                  Please contact your admin or email at{' '}
                  <span>“tech@anarix.ai”</span>
                </p>
              </div>

              <Button
                variant="contained"
                className={styles.logoutBtn}
                disableRipple
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    );
}
