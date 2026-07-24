import { getAvatarTitle } from '@/utils';
import { Button, Divider, Menu } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { SignOutIcon } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { IUserAccountMapping } from 'src/interfaces/auth.interfaces';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectAccount,
  selectMappedAccounts,
  selectUser,
} from 'src/redux/slices/auth/auth.slice';
import HoverInfoTooltip from '../../common/hover-info-tooltip/hover-info-tooltip';
import ProfileAccount from '../../common/profile-account/profile-account';
import {
  avatarStyle,
  buttonStyles,
  dividerStyles,
  headerMenuStyles,
} from './header-styles';
import styles from './header.module.scss';

function Header() {
  const { logout, switchAccount } = useAuthSelector();
  const user = useAppSelector(selectUser);
  const mappedAccounts = useAppSelector(selectMappedAccounts);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accountsList, setAccountsList] = useState<IUserAccountMapping[]>([]);
  const open = Boolean(anchorEl);
  const account = useAppSelector(selectAccount);

  const tootlipTitle = () => {
    return (
      <span className={styles.tooltipTitle}>
        <span className={styles.accountType}>{account?.brandName}</span>
        <span className={styles.accountEmail}>{user?.email}</span>
      </span>
    );
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  const handleSwitchAccount = () => {
    switchAccount();
  };

  useEffect(() => {
    setAccountsList([...mappedAccounts]);
  }, [mappedAccounts]);

  return (
    <React.Fragment>
      <div
        data-test="profile-present"
        onClick={handleClick}
        className={styles.Avatar}
      >
        <HoverInfoTooltip title={tootlipTitle()}>
          <Avatar
            sx={avatarStyle}
            className={styles.avatarLogo}
            alt={`${user?.firstName} ${user?.lastName}`}
            children={getAvatarTitle(user?.firstName, user?.lastName)}
          />
        </HoverInfoTooltip>
      </div>
      <Menu
        sx={headerMenuStyles}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <div className={styles.profileSection}>
          <div className={styles.avatarSection}>
            <Avatar
              sx={avatarStyle}
              alt={`${user?.firstName} ${user?.lastName}`}
              children={getAvatarTitle(user?.firstName, user?.lastName)}
            />
            <Typography
              fontSize="1.2rem"
              fontWeight={300}
              display="flex"
              flexDirection="column"
              justifyContent={'center'}
              marginTop={'0.2rem'}
              gap={'0.8rem'}
              lineHeight={'1.2rem'}
            >
              <span
                style={{
                  fontWeight: '600',
                }}
              >
                {user?.firstName}
              </span>
              <Typography
                fontSize="1rem"
                fontWeight={300}
                lineHeight={'0.96rem'}
                color={'#7c7c7c'}
              >
                {user?.email}
              </Typography>
            </Typography>
          </div>
          <Divider sx={dividerStyles} />
          <ProfileAccount />

          <span>
            <Button
              sx={buttonStyles}
              disableRipple
              onClick={handleSwitchAccount}
              disabled={accountsList.length > 1 ? false : true}
            >
              <span>Switch Account</span>
            </Button>
            <Divider />
            <Button sx={buttonStyles} disableRipple onClick={handleLogout}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                Logout <SignOutIcon size={18} />
              </span>
            </Button>
          </span>
        </div>
      </Menu>
    </React.Fragment>
  );
}

export default Header;
