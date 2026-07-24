import VerificationAnimation from '@/app/components/common/loader/verification-animation';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import AuthServices from 'src/services/auth.service';
import OnProgress from '../../../common/loader/onprogress';
import styles from './accept-user.module.scss';

export default function AcceptUser() {
  const { token } = useParams();
  const { logout } = useAuthSelector();
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      AuthServices.acceptInvite(token)
        .then((res) => {
          if (res?.data.success === true) {
            showSuccessToastMessage({
              title: res?.data.message,
              description: res?.data.description,
            });

            setIsSuccess(true);
            setIsError(false);
          }
        })
        .catch((error) => {
          setIsError(true);
          setIsSuccess(false);
        })
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess && !isError) {
      setTimeout(() => setIsVerified(false), 2000);
      setTimeout(() => logout(), 2000);
    }
  }, [isError, isSuccess, logout]);

  if (isLoading) {
    return (
      <div className={styles.verifyContainer}>
        <h1>Verifying...</h1>
      </div>
    );
  } else if (!isLoading && !isError && isSuccess) {
    return (
      <div className={styles.verifyContainer}>
        <div className={styles.verifyContent}>
          <div>
            <VerificationAnimation />
          </div>
          <h1>Invite Accepted Successfully!</h1>
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
  } else if (!isLoading && isError && !isSuccess) {
    return (
      <div className={styles.verifyContainer}>
        <div className={styles.verifyContent}>
          <h1>Sorry, something went wrong.</h1>
        </div>
      </div>
    );
  } else if (!isLoading && !isError && isSuccess && isVerified) {
    return (
      <div className={styles.verifyContainer}>
        <OnProgress />
        <h1>Signing you in few seconds...</h1>
      </div>
    );
  } else if (!isLoading && !isError && isSuccess && !isVerified) {
    return (
      <div className={styles.verifyContainer}>
        <OnProgress />
        <h1>Re-directing to Login page...</h1>
      </div>
    );
  }
}
