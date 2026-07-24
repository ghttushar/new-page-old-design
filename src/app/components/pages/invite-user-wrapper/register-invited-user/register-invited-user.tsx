import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LOGIN_URL } from 'src/constants/urls.constants';
import {
  IInviteDetails,
  IRegisterInvitedUserBody,
  IRegisterInvitedUserForm,
} from 'src/interfaces/auth.interfaces';
import { useAppDispatch } from 'src/redux/hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import {
  validateConfirmPassword,
  validateName,
  validatePassword,
} from 'src/utils/validations.utils';
import Logo from '../../../common/logo/logo';
import styles from '../../register-page/register-page.module.scss';
import {
  ButtonStyles,
  disabledSelectStyles,
  labelStyles,
  selectStyles,
} from './register-invited-user-styles';
import Loader from 'src/app/components/common/loader/loader';

const initialRegisterFormState: IRegisterInvitedUserForm = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterInvitedUser() {
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const [registerForm, setRegisterForm] = useState<IRegisterInvitedUserForm>(
    initialRegisterFormState
  );
  const [firstNameErrorText, setFirstNameErrorText] = useState<string>('');
  const [lastNameErrorText, setLastNameErrorText] = useState<string>('');
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] =
    useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [inviteDetails, setInviteDetails] = useState<IInviteDetails | null>(
    null
  );

  const handleRegisterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
    setBtnDisabled(!e.target.value);
  };

  const handleRegister = () => {
    setFirstNameErrorText('');
    setLastNameErrorText('');
    setPasswordErrorText('');
    setConfirmPasswordErrorText('');

    const isFirstNameError = validateName(registerForm.firstName, 'First Name');
    const isLastNameError = validateName(registerForm.lastName, 'Last Name');
    const isPasswordError = validatePassword(registerForm.password, 'register');
    const isConfirmPasswordError = validateConfirmPassword(
      registerForm.password,
      registerForm.confirmPassword
    );

    if (
      isFirstNameError ||
      isLastNameError ||
      isPasswordError ||
      isConfirmPasswordError
    ) {
      if (isFirstNameError) setFirstNameErrorText(isFirstNameError);
      if (isLastNameError) setLastNameErrorText(isLastNameError);
      if (isPasswordError) setPasswordErrorText(isPasswordError);
      if (isConfirmPasswordError)
        setConfirmPasswordErrorText(isConfirmPasswordError);

      return;
    }

    if (
      !isFirstNameError &&
      !isLastNameError &&
      !isPasswordError &&
      !isConfirmPasswordError
    ) {
      const payload: IRegisterInvitedUserBody = {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        password: registerForm.password,
      };

      if (token !== undefined) {
        setIsLoading(true);
        AuthServices.registerInvitedUser(token, payload)
          .then((res) => {
            dispatch(
              showSuccessToastMessage({
                title: res.data.message,
                description: res.data.description,
              })
            );
            navigate(LOGIN_URL);
          })
          .finally(() => setIsLoading(false));
      } else {
        showErrorToastMessage({
          title: 'Invalid token',
          description: 'Token provided in the invite link is invalid',
        });
      }
    } else {
      setBtnDisabled(true);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      AuthServices.inviteDetails(token)
        .then((res) => {
          if (res?.data.success === true) {
            setInviteDetails(res?.data.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [token]);
  if (!inviteDetails) {
    <Loader/>
  }
  return (
    <div className={styles.registerContainer}>
      <Logo />
      <div className={styles.registerForm}>
        <div className={styles.registerTitle}>
          <h1>Register Your Account</h1>
        </div>
        <Box
          component="form"
          sx={{
            '& > :not(style)': {
              m: 1,
              display: 'flex',
              borderRadius: '0rem',
              fontFamily: 'Inter, sans-serif !important',
            },
          }}
          autoComplete="on"
        >
          <div className={styles.nameContainer}>
            <div className={styles.firstLastNameStyles}>
              <InputLabel
                htmlFor="firstName"
                sx={labelStyles}
                error={firstNameErrorText !== ''}
              >
                First Name
              </InputLabel>
              <TextField
                fullWidth
                id="firstName"
                error={firstNameErrorText !== ''}
                name="firstName"
                variant="outlined"
                type="text"
                placeholder="John"
                sx={selectStyles}
                onChange={handleRegisterData}
              />
              {firstNameErrorText !== '' && (
                <p className={styles.nameErrorStyles}>{firstNameErrorText}</p>
              )}
            </div>

            <div className={styles.firstLastNameStyles}>
              <InputLabel
                htmlFor="lastName"
                sx={labelStyles}
                error={lastNameErrorText !== ''}
              >
                Last Name
              </InputLabel>
              <TextField
                fullWidth
                id="lastName"
                error={lastNameErrorText !== ''}
                name="lastName"
                variant="outlined"
                type="text"
                placeholder="Doe"
                sx={selectStyles}
                onChange={handleRegisterData}
              />
              {lastNameErrorText !== '' && (
                <p className={styles.nameErrorStyles}>{lastNameErrorText}</p>
              )}
            </div>
          </div>

          <InputLabel htmlFor="email" sx={labelStyles}>
            Email
          </InputLabel>
          <TextField
            fullWidth
            id="reg-email"
            name="email"
            variant="outlined"
            type="text"
            placeholder="john@gmail.com"
            sx={disabledSelectStyles}
            value={
              !isLoading && inviteDetails !== null ? inviteDetails.email : ''
            }
            disabled={true}
          />

          <InputLabel htmlFor="brandName" sx={labelStyles}>
            Brand
          </InputLabel>
          <TextField
            fullWidth
            id="brandName"
            name="brandName"
            variant="outlined"
            type="text"
            placeholder="Your Brand"
            sx={disabledSelectStyles}
            value={
              !isLoading && inviteDetails !== null
                ? inviteDetails.accountId.brandName
                : ''
            }
            disabled={true}
          />

          <InputLabel
            htmlFor="password"
            error={passwordErrorText !== ''}
            sx={labelStyles}
          >
            Password
          </InputLabel>
          <TextField
            fullWidth
            id="reg-password"
            error={passwordErrorText !== ''}
            name="password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            placeholder="*********"
            sx={selectStyles}
            className={styles.passwordInput}
            onChange={handleRegisterData}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disableRipple onClick={handleShowPassword}>
                    {showPassword ? (
                      <VisibilityOffIcon
                        fontSize="medium"
                        sx={{ color: '#77469B' }}
                      />
                    ) : (
                      <VisibilityIcon
                        fontSize="medium"
                        sx={{ color: '#77469B' }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordErrorText !== '' && (
            <p className={styles.inputErrorStyles}>{passwordErrorText}</p>
          )}
          <InputLabel
            htmlFor="confirmPassword"
            error={confirmPasswordErrorText !== ''}
            sx={labelStyles}
          >
            Confirm Password
          </InputLabel>
          <TextField
            fullWidth
            id="password"
            error={confirmPasswordErrorText !== ''}
            name="confirmPassword"
            variant="outlined"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="*********"
            sx={selectStyles}
            onChange={handleRegisterData}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disableRipple onClick={handleShowConfirmPassword}>
                    {showConfirmPassword ? (
                      <VisibilityOffIcon
                        fontSize="medium"
                        sx={{ color: '#77469B' }}
                      />
                    ) : (
                      <VisibilityIcon
                        fontSize="medium"
                        sx={{ color: '#77469B' }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {confirmPasswordErrorText !== '' && (
            <p className={styles.inputErrorStyles}>
              {confirmPasswordErrorText}
            </p>
          )}

          <LoadingButton
            fullWidth
            variant="contained"
            autoCapitalize="false"
            disabled={btnDisabled}
            sx={ButtonStyles}
            onClick={handleRegister}
            loading={isLoading}
            loadingIndicator="Please wait..."
          >
            {isLoading ? '' : 'Register'}
          </LoadingButton>
          <div
            className={styles.registerFormFooter}
            style={{ marginTop: '3rem' }}
          >
            <p>By continuing, you agree to Anarix's</p>
            <p>
              <a href="/*">Terms & Condition</a> and{' '}
              <a href="/*">Privacy Policy</a>
            </p>
          </div>
        </Box>
      </div>
    </div>
  );
}
