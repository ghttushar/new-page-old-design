import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { REGISTER_URL } from 'src/constants/urls.constants';
import { IFormatPasswordEmailPayload } from 'src/interfaces/auth.interfaces';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import { validateEmail } from 'src/utils/validations.utils';
import Logo from '../../common/logo/logo';
import {
  ButtonStyles,
  box,
  inputLabelStyles,
  selectStyles,
} from './forgot-password-styles';
import styles from './forgot-password.module.scss';

const initialForgotPassFormState: IFormatPasswordEmailPayload = {
  email: '',
};

export default function ForgotPassword() {
  const [forgotPassEmailForm, setForgotPassEmailForm] =
    useState<IFormatPasswordEmailPayload>(initialForgotPassFormState);
  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleForgotPassData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotPassEmailForm({
      ...forgotPassEmailForm,
      [e.target.name]: e.target.value,
    });
    setBtnDisabled(!e.target.value);
  };

  const handleForgotPass = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailErrorText('');

    const isEmailError = validateEmail(
      forgotPassEmailForm.email,
      'forgotPassword'
    );

    if (isEmailError) {
      setEmailErrorText(isEmailError);
      return;
    }

    if (!isEmailError) {
      const payLoad: IFormatPasswordEmailPayload = {
        email: forgotPassEmailForm.email.toLowerCase().trim(),
      };

      setIsLoading(true);

      AuthServices.forgotPasswordEmail(payLoad)
        .then((res) => {
          dispatch(
            showSuccessToastMessage({
              title: res.data.message,
              description: res.data.description,
            })
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Logo />
      <form
        className={styles.loginForm}
        onSubmit={handleForgotPass}
        autoComplete="on"
      >
        <div className={styles.loginTitle}>
          <h1>Forgot Password</h1>
        </div>
        <Box component="div" sx={box}>
          <InputLabel
            htmlFor="email"
            error={emailErrorText !== ''}
            sx={inputLabelStyles}
          >
            Email
          </InputLabel>
          <TextField
            id="email"
            error={emailErrorText !== ''}
            variant="outlined"
            type="text"
            name="email"
            placeholder="john@gmail.com"
            sx={selectStyles}
            onChange={handleForgotPassData}
          />
          {emailErrorText !== '' && (
            <p className={styles.errorMessage}>{emailErrorText}</p>
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
            {isLoading ? '' : 'Send Email'}
          </LoadingButton>
          <div className={styles.loginFormFooter} style={{ marginTop: '3rem' }}>
            <p>By continuing, you agree to Anarix's</p>
            <p>
              <a href="/*">Terms & Condition</a> and{' '}
              <a href="/*">Privacy Policy</a>
            </p>
          </div>
        </Box>
      </form>
      <div className={styles.loginFooter}>
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
