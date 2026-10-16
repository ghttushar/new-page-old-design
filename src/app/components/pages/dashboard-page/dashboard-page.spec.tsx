import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '@/redux/store';

import DashboardPage from './dashboard-page';

describe('DashboardPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
