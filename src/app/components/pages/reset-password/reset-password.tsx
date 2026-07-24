import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL, REGISTER_URL } from 'src/constants/urls.constants';
import { IForgotPasswordPayload } from 'src/interfaces/auth.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import {
  validateConfirmPassword,
  validatePassword,
} from 'src/utils/validations.utils';
import Logo from '../../common/logo/logo';
import {
  ButtonStyles,
  box,
  inputLabelStyles,
  selectStyles,
} from '../forgot-password/forgot-password-styles';
import styles from '../register-page/register-page.module.scss';

const initialForgotPassFormState: IForgotPasswordPayload = {
  password: '',
};

export default function ResetPassword() {
  const [forgotPassEmailForm, setForgotPassEmailForm] =
    useState<IForgotPasswordPayload>(initialForgotPassFormState);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');
  const [confirmPasswordErrText, setConfirmPasswordErrText] =
    useState<string>('');
  const [confirmPassword, setConfirmPassword] =
    useState<IForgotPasswordPayload>(initialForgotPassFormState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPasswordVerifyToken = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const verificationToken = queryParams.get('token');
        if (verificationToken) {
          setToken(verificationToken);
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPasswordVerifyToken();
  }, []);

  const handleAxiosError = (error: unknown) => {
    const axiosError = error as AxiosError<IAPIResponse<null>>;
    if (axiosError.response) {
      const errorMessage = axiosError.response.data.message;
    }
  };

  const handleChangePassData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPassEmailForm({
      ...forgotPassEmailForm,
      [e.target.name]: e.target.value,
    });
    setBtnDisabled(!e.target.value);
  };

  const reConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword({
      ...confirmPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordErrorText('');
    setConfirmPasswordErrText('');

    const isPasswordError = validatePassword(
      forgotPassEmailForm.password,
      'reset'
    );
    const isConfirmPasswordError = validateConfirmPassword(
      forgotPassEmailForm.password,
      confirmPassword.password
    );

    if (isPasswordError || isConfirmPasswordError) {
      if (isPasswordError) setPasswordErrorText(isPasswordError);
      if (isConfirmPasswordError)
        setConfirmPasswordErrText(isConfirmPasswordError);
      return;
    }

    if (!isPasswordError && !isConfirmPasswordError) {
      const payLoad: IForgotPasswordPayload = {
        password: forgotPassEmailForm.password,
      };

      setIsLoading(true);

      AuthServices.forgotPassword(token, payLoad)
        .then((res) => {
          dispatch(
            showSuccessToastMessage({
              title: res.data.message,
              description: res.data.description,
            })
          );

          setTimeout(() => {
            navigate(LOGIN_URL);
          }, 2000);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.registerContainer}>
      <Logo />
      <form
        className={styles.registerForm}
        onSubmit={handlePassChange}
        autoComplete="on"
      >
        <div className={styles.registerTitle}>
          <h1>Reset Password</h1>
        </div>
        <Box component="div" sx={box}>
          <InputLabel
            htmlFor="password"
            error={passwordErrorText !== ''}
            sx={inputLabelStyles}
          >
            Password
          </InputLabel>

          <TextField
            id="password"
            error={passwordErrorText !== ''}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="*********"
            sx={selectStyles}
            onChange={handleChangePassData}
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
            htmlFor="password"
            error={confirmPasswordErrText !== ''}
            sx={inputLabelStyles}
          >
            Confirm Password
          </InputLabel>

          <TextField
            id="password"
            error={confirmPasswordErrText !== ''}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="*********"
            sx={selectStyles}
            onChange={reConfirmPassword}
          />
          {confirmPasswordErrText !== '' && (
            <p className={styles.inputErrorStyles}>{confirmPasswordErrText}</p>
          )}

          <LoadingButton
            variant="contained"
            autoCapitalize="false"
            disabled={btnDisabled}
            sx={ButtonStyles}
            type="submit"
            loading={isLoading}
            loadingIndicator="Please wait..."
          >
            {isLoading ? '' : 'Reset Password'}
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
      </form>
      <div className={styles.registerFooter}>
        <h4>
          Don't have an Account?{' '}
          <a href={`${REGISTER_URL}`} style={{ fontWeight: 700 }}>
            Start A Free Trail
          </a>
        </h4>
      </div>
    </div>
  );
}
