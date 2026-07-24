import { debounce } from '@/utils';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PushPinIcon } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { IUpdateMappedAccountsPinning } from 'src/interfaces/auth.interfaces';
import { useAppDispatch } from 'src/redux/hooks';
import { setUpdatedMappedAccountsPinning } from 'src/redux/slices/auth/auth.slice';
import AuthServices from 'src/services/auth.service';
import { avatarStyles, pinTooltipStyles } from './accounts-list-styles';
import styles from './accounts-list.module.scss';

interface IAccountsListProps {
  brandName: string;
  accountId: string;
  isAccountPinned: boolean;
  onAccountClick: (selectedId: string | number) => Promise<void>;
}

export default function AccountsList({
  brandName,
  accountId,
  isAccountPinned,
  onAccountClick,
}: IAccountsListProps) {
  const [isPinned, setIsPinned] = useState<boolean>(isAccountPinned);

  const dispatch = useAppDispatch();

  const getBrandInitials = (name: string) => {
    if (!name) return '-';
    const nameArr = name.split(' ');
    const nameInitials = nameArr.reduce((acc, name) => {
      acc += name[0]?.toUpperCase();
      return acc;
    }, '');

    if (nameInitials.length > 2) return nameInitials.slice(0, 2);
    return nameInitials;
  };

  const handleClick = async () => {
    await onAccountClick(accountId);
  };
  const updatedPinningLogic = useCallback(
    (newVal: boolean, currValue: boolean, accountId: string) => {
      const updatedData: IUpdateMappedAccountsPinning = {
        accountId: accountId,
        updatedPinValue: newVal,
      };
      dispatch(setUpdatedMappedAccountsPinning(updatedData));
      AuthServices.updateIsPinned(accountId, newVal).catch(() => {
        setIsPinned(currValue);
        const revertedData: IUpdateMappedAccountsPinning = {
          accountId: accountId,
          updatedPinValue: currValue,
        };
        dispatch(setUpdatedMappedAccountsPinning(revertedData));
      });
    },
    [dispatch]
  );

  const debouncedUpdatePinning = useMemo(
    () => debounce(updatedPinningLogic, 300),
    [updatedPinningLogic]
  );

  const handleUpdatePinning = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const currValue = isPinned;
    const newVal = !isPinned;

    setIsPinned(newVal);
    debouncedUpdatePinning(newVal, currValue, accountId);
  };

  return (
    <div className={styles.accountContainer} onClick={handleClick}>
      <div className={styles.account}>
        <div
          className={styles.accountDetails}
          data-test={`account-id-${accountId}`}
        >
          <Avatar
            sx={avatarStyles}
            alt={`${brandName}`}
            children={`${getBrandInitials(brandName)}`}
          />
          <h3>{brandName}</h3>
        </div>

        <Tooltip
          title={isPinned ? 'Pinned' : 'Not Pinned'}
          placement={TooltipPlacement.Bottom}
          componentsProps={{
            tooltip: {
              sx: pinTooltipStyles,
            },
            popper: {
              disablePortal: true,
            },
          }}
        >
          <IconButton onClick={handleUpdatePinning}>
            {isPinned ? (
              <PushPinIcon size={14} color="#77469B" weight="fill" />
            ) : (
              <PushPinIcon size={14} color="#B0B0B0" />
            )}
          </IconButton>
        </Tooltip>
      </div>

      <Divider />
    </div>
  );
}
