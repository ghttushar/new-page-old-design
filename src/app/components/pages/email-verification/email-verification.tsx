import { getDeviceContext } from '@/utils/auth.utils';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SELECT_ACCOUNT_URL } from 'src/constants/urls.constants';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import AuthServices from 'src/services/auth.service';
import OnProgress from '../../common/loader/onprogress';
import VerificationAnimation from '../../common/loader/verification-animation';
import styles from './email-verification.module.scss';

export default function EmailVerification() {
  const { login } = useAuthSelector();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchTokenAndVerifyEmail = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const verificationToken = queryParams.get('token');
        if (verificationToken) {
          const response = await AuthServices.verifyEmail(
            verificationToken,
            getDeviceContext()
          );
          const data = response.data.data;
          login(data.user, data.authToken);
        }
        setTimeout(() => setIsVerified(true), 2000);
        setTimeout(() => navigate(SELECT_ACCOUNT_URL), 3000);
      } catch (error) {
        handleAxiosError(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTokenAndVerifyEmail();
  }, []);

  const handleAxiosError = (error: unknown) => {
    const axiosError = error as AxiosError<IAPIResponse<null>>;
    if (axiosError.response) {
      const errorMessage = axiosError.response.data.message;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.verifyContainer}>
        <h1>Verifying...</h1>
      </div>
    );
  } else if (!isLoading && !isError && !isVerified) {
    return (
      <div className={styles.verifyContainer}>
        <div className={styles.verifyContent}>
          <div>
            <VerificationAnimation />
          </div>
          <h1>Email Verified Successfully!</h1>
          <div className={styles.verifyBody}>
            <span>You can log in and start using Anarix, our platform.</span>
            <span>
              Get ready for an amazing experience!{' '}
              <span role="img" aria-label="happy-emoji">
                😄
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  } else if (!isLoading && isError) {
    return (
      <div className={styles.verifyContainer}>
        <div className={styles.verifyContent}>
          <h1>Sorry, something went wrong.</h1>
        </div>
      </div>
    );
  } else if (!isLoading && !isError && isVerified) {
    return (
      <div className={styles.verifyContainer}>
        <OnProgress />
        <h1>Signing you in few seconds...</h1>
      </div>
    );
  }
}
