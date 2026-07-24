import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import { InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL } from 'src/constants/urls.constants';
import { IRegisterBody, IRegisterForm } from 'src/interfaces/auth.interfaces';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import {
  validateBrand,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from 'src/utils/validations.utils';
import Logo from '../../common/logo/logo';
import {
  ButtonStyles,
  labelStyles,
  selectStyles,
} from './register-page-styles';
import styles from './register-page.module.scss';

const initialRegisterFormState: IRegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  brandName: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerForm, setRegisterForm] = useState<IRegisterForm>(
    initialRegisterFormState
  );
  const [firstNameErrorText, setFirstNameErrorText] = useState<string>('');
  const [lastNameErrorText, setLastNameErrorText] = useState<string>('');
  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [brandErrorText, setBrandErrorText] = useState<string>('');
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] =
    useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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
    setEmailErrorText('');
    setBrandErrorText('');
    setPasswordErrorText('');
    setConfirmPasswordErrorText('');

    const isFirstNameError = validateName(registerForm.firstName, 'First Name');
    const isLastNameError = validateName(registerForm.lastName, 'Last Name');
    const isEmailError = validateEmail(registerForm.email, 'register');
    const isBrandError = validateBrand(registerForm.brandName);
    const isPasswordError = validatePassword(registerForm.password, 'register');
    const isConfirmPasswordError = validateConfirmPassword(
      registerForm.password,
      registerForm.confirmPassword
    );

    if (
      isFirstNameError ||
      isLastNameError ||
      isEmailError ||
      isBrandError ||
      isPasswordError ||
      isConfirmPasswordError
    ) {
      if (isFirstNameError) setFirstNameErrorText(isFirstNameError);
      if (isLastNameError) setLastNameErrorText(isLastNameError);
      if (isEmailError) setEmailErrorText(isEmailError);
      if (isBrandError) setBrandErrorText(isBrandError);
      if (isPasswordError) setPasswordErrorText(isPasswordError);
      if (isConfirmPasswordError)
        setConfirmPasswordErrorText(isConfirmPasswordError);

      return;
    }

    if (
      !isFirstNameError &&
      !isLastNameError &&
      !isEmailError &&
      !isBrandError &&
      !isPasswordError &&
      !isConfirmPasswordError
    ) {
      const payload: IRegisterBody = {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email.toLowerCase().trim(),
        brandName: registerForm.brandName,
        password: registerForm.password,
      };

      setIsLoading(true);
      AuthServices.registerUser(payload)
        .then((res: any) => {
          dispatch(
            showSuccessToastMessage({
              title: res.data.message,
              description: res.data.description,
            })
          );
          navigate(LOGIN_URL);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

          <InputLabel
            htmlFor="email"
            sx={labelStyles}
            error={emailErrorText !== ''}
          >
            Email
          </InputLabel>
          <TextField
            fullWidth
            id="reg-email"
            error={emailErrorText !== ''}
            name="email"
            variant="outlined"
            type="text"
            placeholder="john@gmail.com"
            sx={selectStyles}
            onChange={handleRegisterData}
          />
          {emailErrorText !== '' && (
            <p className={styles.inputErrorStyles}>{emailErrorText}</p>
          )}
          <InputLabel
            htmlFor="brandName"
            sx={labelStyles}
            error={brandErrorText !== ''}
          >
            Brand
          </InputLabel>
          <TextField
            fullWidth
            id="brandName"
            error={brandErrorText !== ''}
            name="brandName"
            variant="outlined"
            type="text"
            placeholder="Your Brand"
            sx={selectStyles}
            onChange={handleRegisterData}
          />
          {brandErrorText !== '' && (
            <p className={styles.inputErrorStyles}>{brandErrorText}</p>
          )}

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
          {confirmPasswordErrorText && (
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
      <div className={styles.registerFooter}>
        <h4>
          Already have an Account? <a href={`${LOGIN_URL}`}>Login here</a>
        </h4>
      </div>
    </div>
  );
}
