import { render } from '@testing-library/react';

import ClientSideCustomTable from './client-side-custom-table';

describe('ClientSideCustomTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientSideCustomTable />);
    expect(baseElement).toBeTruthy();
  });
});
