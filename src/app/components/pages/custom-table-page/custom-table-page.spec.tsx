import { render } from '@testing-library/react';

import CustomTablePage from './custom-table-page';

describe('CustomTablePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTablePage />);
    expect(baseElement).toBeTruthy();
  });
});
