import { render } from '@testing-library/react';

import ServerSideCustomTable from './server-side-custom-table';

describe('ServerSideCustomTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServerSideCustomTable />);
    expect(baseElement).toBeTruthy();
  });
});
