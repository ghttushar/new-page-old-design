import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import { UserRolesEnum } from 'src/enums/invites.enums';
import { PROFILE_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { IInviteUserBody } from 'src/interfaces/auth.interfaces';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAccount, selectUser } from 'src/redux/slices/auth/auth.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import { validateEmail, validateRole } from 'src/utils/validations.utils';
import {
  BootstrapDialog,
  buttonCloseStyles,
  buttonInviteStyles,
  labelStyles,
  selectStyles,
} from './add-user-page-styles';
import styles from './add-user-page.module.scss';

export interface IRoleOptions {
  value: string;
  label: string;
  disabled: boolean;
}

const roleOptions: IRoleOptions[] = [
  {
    value: 'choose',
    label: 'Choose Access Type',
    disabled: true,
  },
  {
    value: UserRolesEnum.MANAGER,
    label: 'Editor',
    disabled: false,
  },
  {
    value: UserRolesEnum.USER,
    label: 'Viewer',
    disabled: false,
  },
];

interface IDialogTitleProps {
  id: string;
  children?: React.ReactNode;
}

function BootstrapDialogTitle(props: IDialogTitleProps) {
  const { children, ...other } = props;

  return (
    <DialogTitle
      sx={{
        height: '7.5rem',
        m: 0,
        p: '1rem 1rem 1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      {...other}
    >
      {children}
    </DialogTitle>
  );
}

interface IAddUserData {
  email: string;
  role: string;
}

const initialData: IAddUserData = {
  email: '',
  role: '',
};

interface IAddUserPageProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  handleToggleTable: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddUserPage(props: IAddUserPageProps) {
  const { openDialog, handleCloseDialog, handleToggleTable, setIsLoading } =
    props;

  const [addUserData, setAddUserData] = useState<IAddUserData>(initialData);
  const [isInviteDisabled, setIsInviteDisabled] = useState<boolean>(true);
  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [roleErrorText, setRoleErrorText] = useState<string>('');

  const user = useAppSelector(selectUser);
  const account = useAppSelector(selectAccount);
  const dispatch = useAppDispatch();

  const handleInviteUser = () => {
    setEmailErrorText('');
    setRoleErrorText('');

    const isEmailError = validateEmail(addUserData.email, 'addUser');
    const isRoleError = validateRole(addUserData.role, roleOptions);

    if (isEmailError || isRoleError) {
      if (isEmailError) setEmailErrorText(isEmailError);
      if (isRoleError) setRoleErrorText(isRoleError);
      return;
    }

    if (!isEmailError && !isRoleError) {
      if (user !== null && account !== null) {
        const payload: IInviteUserBody = {
          email: addUserData.email,
          role: addUserData.role,
        };

        setIsLoading(true);
        AuthServices.inviteUser(payload)
          .then((res) => {
            if (res?.data.success === true) {
              dispatch(
                showSuccessToastMessage({
                  title: res?.data.message,
                  description: res?.data.description,
                })
              );
            }
          })
          .finally(() => {
            handleToggleTable();
            handleCloseDialog();
          });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const user: IAddUserData = {
      ...addUserData,
      [e.target.name]: e.target.value,
    };
    setAddUserData(user);

    if (user.email === '' || user.role === '' || user.role === 'choose') {
      setIsInviteDisabled(true);
    } else {
      setIsInviteDisabled(false);
    }
  };

  return (
    <BootstrapDialog
      onClose={handleCloseDialog}
      aria-labelledby="add-user-title"
      aria-describedby="add-user-description"
      open={openDialog}
      sx={{
        '.MuiPaper-root': {
          maxHeight: 'unset',
        },
      }}
    >
      <BootstrapDialogTitle id="add-user-title">
        <Typography
          fontSize="2.4rem"
          fontWeight={700}
          sx={{ height: 'auto', alignSelf: 'flex-end' }}
        >
          Invite User
        </Typography>
        <DialogActions
          sx={{
            padding: '0 !important',
          }}
        >
          <Button
            variant="contained"
            id="close-button"
            autoFocus
            onClick={handleCloseDialog}
            sx={buttonCloseStyles}
          >
            Close
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={handleInviteUser}
            sx={buttonInviteStyles}
            disabled={isInviteDisabled}
          >
            Invite
          </Button>
        </DialogActions>
      </BootstrapDialogTitle>
      <Divider />
      <DialogContent id="add-user-description">
        <InputLabel htmlFor="email" sx={labelStyles}>
          Email ID <InfoIcon title={PROFILE_TOOLTIPS.EMAIL} />
        </InputLabel>
        <TextField
          fullWidth
          id="email"
          name="email"
          variant="outlined"
          type="text"
          placeholder="john@example.com"
          error={emailErrorText.length > 0}
          sx={selectStyles}
          onChange={handleChange}
        />
        {emailErrorText.length > 0 && (
          <p className={styles.inputErrorStyles}>{emailErrorText}</p>
        )}

        <InputLabel htmlFor="role" sx={labelStyles}>
          Type of Access <InfoIcon title={PROFILE_TOOLTIPS.ACCESS_TYPE} />
        </InputLabel>
        <TextField
          select
          id="role"
          name="role"
          variant="outlined"
          error={roleErrorText.length > 0}
          sx={{ ...selectStyles, width: '18rem' }}
          onChange={handleChange}
          defaultValue="choose"
        >
          {roleOptions.map((option, index) => (
            <MenuItem
              key={`${option.value}-${index}`}
              value={option.value}
              defaultChecked={index === 0}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {roleErrorText.length > 0 && (
          <p className={styles.inputErrorStyles}>{roleErrorText}</p>
        )}
      </DialogContent>
    </BootstrapDialog>
  );
}
