import React, { useEffect, useState } from 'react';
import AuthServices from 'src/services/auth.service';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { useAuthSelector } from '../../../redux/auth-selector/auth-selector';
import LoaderWrapper from '../common/loader-wrapper/loader-wrapper';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logout, login } = useAuthSelector();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorageUtils.getAuthToken();
    if (!authToken) {
      setIsLoading(false);
      logout(false);
      return;
    }
    setIsLoading(true);

    AuthServices.authenticateUser(authToken)
      .then((response) => {
        const { user } = response.data.data;
        if (user.shouldLogout) {
          logout();
          return;
        }
        login(user, authToken as string, false);
      })
      .catch((err) => {
        logout(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <LoaderWrapper />;
  else return children;
};
