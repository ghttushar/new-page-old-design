import React from 'react';
import { FeaturesEnum } from 'src/enums/auth.enums';

interface IPrivateRouteProps {
  component: React.ReactNode;
  checkIsAuthenticatedOnly?: boolean;
  feature?: FeaturesEnum;
  checkIsSuperAdmin?: boolean;
  renderComponent?: boolean;
  checkHasMonitoringAccess?: boolean;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ component }) => {
  return <React.Fragment>{component}</React.Fragment>;
};

export default PrivateRoute;
