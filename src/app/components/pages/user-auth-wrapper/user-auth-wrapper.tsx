import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../../private-route/private-route';
import EmailVerification from '../email-verification/email-verification';
import ForgotPassword from '../forgot-password/forgot-password';
import AcceptUser from '../invite-user-wrapper/accept-user/accept-user';
import InviteUserWrapper from '../invite-user-wrapper/invite-user-wrapper';
import RegisterInvitedUser from '../invite-user-wrapper/register-invited-user/register-invited-user';
import LoginPage from '../login-page/login-page';
import PageNotFound from '../page-not-found/page-not-found';
import RegisterPage from '../register-page/register-page';
import ResetPassword from '../reset-password/reset-password';
import SelectAccount from '../select-account/select-account';

export function UserAuthWrapper() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<EmailVerification />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/select-account"
        element={
          <PrivateRoute
            component={<SelectAccount />}
            checkIsAuthenticatedOnly={true}
            renderComponent={true}
          />
        }
      />
      <Route path="/invite/" element={<InviteUserWrapper />} />
      <Route path="/register-invite/:token" element={<RegisterInvitedUser />} />
      <Route path="/accept-invite/:token" element={<AcceptUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/verify" element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default UserAuthWrapper;
