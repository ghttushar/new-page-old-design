import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import SessionTimoutLoginModal from './session-timeout-login-modal';
import SessionTimeoutModal from './session-timeout-modal';

interface SessionTimeoutContextProps {
  resetIdleTimer: () => void;
}

const SessionTimeoutContext = createContext<
  SessionTimeoutContextProps | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const SessionTimeoutProvider = ({ children }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { logout } = useAuthSelector();
  const timeout = 60 * 60 * 1000;
  const warningTime = 2 * 60 * 1000;
  const authToken = localStorageUtils.getAuthToken();
  const handleSessionTimeout = () => {
    setIsModalVisible(false);
    logout();
  };

  const showWarningModal = () => {
    setIsModalVisible(true);
  };

  const { reset } = useIdleTimer({
    timeout,
    onIdle: handleSessionTimeout,
    onPrompt: showWarningModal, // Called before timeout
    promptBeforeIdle: warningTime, // Show modal before session ends
    debounce: 500,
    // disabled: !authToken,
    disabled: true,
  });
  const stayLoggedIn = () => {
    reset();
    setIsModalVisible(false);
  };

  return (
    <SessionTimeoutContext.Provider value={{ resetIdleTimer: reset }}>
      {children}
      <SessionTimeoutModal
        isOpen={isModalVisible}
        title="You will be logged out soon"
        message="We noticed you've been inactive. Your session will automatically
              end in 2 minutes."
        onConfirm={stayLoggedIn}
        onCancel={handleSessionTimeout}
        showLoginModal={() => setIsLoginModalOpen(true)}
      />
      <SessionTimoutLoginModal
        isOpen={isLoginModalOpen}
        onConfirm={() => setIsLoginModalOpen(false)}
      />
    </SessionTimeoutContext.Provider>
  );
};

export const useSessionTimeout = () => {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error(
      'useSessionTimeout must be used within a SessionTimeoutProvider'
    );
  }
  return context;
};
