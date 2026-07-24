import React from 'react';
import PrivateRoute from './private-route';

interface IAmcRouteProps {
  component: React.ComponentType<any>;
}

const AmcRoute: React.FC<IAmcRouteProps> = ({ component: Component }) => {
  return <PrivateRoute component={<Component />} />;
};

export default AmcRoute;
