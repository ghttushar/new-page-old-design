import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { IUserAccountMapping } from 'src/interfaces/auth.interfaces';
import AccountsList from './accounts-list';
import {
  listItemStyles,
  optionsPopperStyles,
  searchBarStyles,
} from './accounts-list-styles';
import styles from './accounts-list.module.scss';

interface IAccountsListWrapperProps {
  mappedAccounts: IUserAccountMapping[];
  onAccountClick: (selectedId: string | number) => Promise<void>;
}

export default function AccountsListWrapper({
  mappedAccounts,
  onAccountClick,
}: IAccountsListWrapperProps) {
  const isMounted = useRef(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredMappedAccounts, setFilteredMappedAccounts] =
    useState<IUserAccountMapping[]>(mappedAccounts);

  const handleInputChange = (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setFilteredMappedAccounts(
        mappedAccounts.filter((account) =>
          account.accountId.brandName
            ?.toLowerCase()
            .includes(inputValue?.toLowerCase())
        )
      );

      (event.target as HTMLInputElement).blur();
    }
  };

  const handleChange = (event: React.SyntheticEvent, value: string | null) => {
    if (!value) return;
    setFilteredMappedAccounts(
      mappedAccounts.filter((account) =>
        account.accountId.brandName?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!inputValue) setFilteredMappedAccounts(mappedAccounts);
  }, [mappedAccounts, inputValue]);

  return (
    <div className={styles.accountsListContainer}>
      <div className={styles.search}>
        <Autocomplete
          freeSolo
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onChange={handleChange}
          options={mappedAccounts.map((account) => account.accountId.brandName)}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              variant="outlined"
              placeholder="Search by account name"
              autoFocus
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option} style={listItemStyles}>
              {option}
            </li>
          )}
          sx={searchBarStyles}
          componentsProps={{
            popper: {
              sx: optionsPopperStyles,
            },
          }}
        />
      </div>

      <Divider />

      {filteredMappedAccounts.length > 0 ? (
        <div className={styles.accountList}>
          {filteredMappedAccounts.map((account) => (
            <AccountsList
              key={account.accountId._id}
              brandName={account.accountId.brandName}
              accountId={account.accountId._id}
              isAccountPinned={account.isPinned}
              onAccountClick={onAccountClick}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyList}>
          <p>
            Sorry, there is no account to show with name{' '}
            <span>"{inputValue}"</span>
          </p>
        </div>
      )}
    </div>
  );
}
