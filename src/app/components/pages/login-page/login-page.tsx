import { ChatbotParamEnum } from '@/enums/chatbot.enums';
import { checkIsNull } from '@/utils/advertising.utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FORGOT_PASSWORD_URL,
  PRIVACY_POLICY_URL,
  REGISTER_URL,
  SELECT_ACCOUNT_URL,
  TERMS_AND_CONDITIONS_URL,
} from 'src/constants/urls.constants';
import { IAuthBody, ILoginForm } from 'src/interfaces/auth.interfaces';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import { getDeviceContext } from 'src/utils/auth.utils';
import { validateEmail, validatePassword } from 'src/utils/validations.utils';
import Logo from '../../common/logo/logo';
import {
  ButtonStyles,
  forgotPasswordStyles,
  formBoxStyles,
  inputLabelStyles,
  selectStyles,
} from './login-page-styles';
import styles from './login-page.module.scss';

const initialLoginFormState: ILoginForm = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const { login } = useAuthSelector();
  const location = useLocation();
  const [loginForm, setLoginForm] = useState<ILoginForm>(initialLoginFormState);
  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    setBtnDisabled(!e.target.value);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailErrorText('');
    setPasswordErrorText('');

    const isEmailError = validateEmail(loginForm.email, 'login');
    const isPasswordError = validatePassword(loginForm.password, 'login');

    if (isEmailError || isPasswordError) {
      if (isEmailError) {
        setEmailErrorText(isEmailError);
      }

      if (isPasswordError) {
        setPasswordErrorText(isPasswordError);
      }
      return;
    }

    if (!isEmailError && !isPasswordError) {
      const urlParams = new URLSearchParams(window.location.search);
      const mcpSessionId =
        urlParams.get(ChatbotParamEnum.JIVA_MCP_SESSION_PARAM) ?? undefined;
      const mcpRedirectUrl = urlParams.get(
        ChatbotParamEnum.JIVA_OAUTH_REDIRECT_URI_PARAM
      );
      const mcpState = urlParams.get(ChatbotParamEnum.JIVA_OAUTH_STATE_PARAM);
      const payLoad: IAuthBody = {
        email: loginForm.email.toLowerCase().trim(),
        password: loginForm.password,
        ...getDeviceContext(),
        ...(mcpSessionId && { mcpSessionId }),
      };
      const isMcpAuth =
        !checkIsNull(mcpRedirectUrl) &&
        !checkIsNull(mcpState) &&
        !checkIsNull(mcpSessionId);
      setIsLoading(true);
      AuthServices.loginUser(payLoad)
        .then((res) => {
          const authToken = res.data.data.authToken;
          if (!authToken) return;
          login(res.data.data.user, res.data.data.authToken, !isMcpAuth);
          dispatch(
            showSuccessToastMessage({
              title: res.data.message,
              description: res.data.description,
            })
          );
          if (isMcpAuth) {
            window.location.replace(
              `${mcpRedirectUrl}?state=${mcpState}&code=${mcpSessionId}`
            );
            return;
          } else
            navigate(SELECT_ACCOUNT_URL, {
              state: {
                callbackUrl: location.state?.callbackUrl,
              },
            });
        })
        .finally(() => setIsLoading(isMcpAuth));
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <Logo />
      <form
        className={styles.loginForm}
        onSubmit={handleLogin}
        autoComplete="on"
      >
        <div className={styles.loginTitle}>
          <h1>Welcome Back!</h1>
        </div>
        <Box component="div" sx={formBoxStyles}>
          <InputLabel
            htmlFor="email"
            error={emailErrorText !== ''}
            sx={inputLabelStyles}
          >
            Email
          </InputLabel>
          <TextField
            data-test="login-email-input"
            id="email"
            error={emailErrorText !== ''}
            variant="outlined"
            type="text"
            name="email"
            placeholder="john@gmail.com"
            sx={selectStyles}
            onChange={handleLoginData}
          />
          {emailErrorText !== '' && (
            <p className={styles.errorMessage}>{emailErrorText}</p>
          )}
          <div className={styles.passwordDiv}>
            <InputLabel
              htmlFor="password"
              error={passwordErrorText !== ''}
              sx={inputLabelStyles}
            >
              Password
            </InputLabel>
            <InputLabel htmlFor="forgot-password" sx={forgotPasswordStyles}>
              <a href={`${FORGOT_PASSWORD_URL}`}>Forgot Password?</a>
            </InputLabel>
          </div>
          <TextField
            data-test="login-password-input"
            id="password"
            error={passwordErrorText !== ''}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="*********"
            sx={selectStyles}
            onChange={handleLoginData}
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
            <p className={styles.errorMessage}>{passwordErrorText}</p>
          )}
          <LoadingButton
            data-test="login-button"
            variant="contained"
            autoCapitalize="false"
            disabled={btnDisabled}
            sx={ButtonStyles}
            type="submit"
            loading={isLoading}
            loadingIndicator="Please wait..."
          >
            {isLoading ? '' : 'Login'}
          </LoadingButton>
          <div className={styles.loginFormFooter} style={{ marginTop: '3rem' }}>
            <p>By continuing, you agree to Anarix's</p>
            <p>
              <Link target={'_blank'} href={TERMS_AND_CONDITIONS_URL}>
                Terms & Condition
              </Link>{' '}
              and{' '}
              <Link target={'_blank'} href={PRIVACY_POLICY_URL}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </Box>
      </form>
      <div className={styles.loginFooter}>
        <h4>
          Don't have an Account? <a href={`${REGISTER_URL}`}>Register here</a>
        </h4>
      </div>
    </div>
  );
}
