import { render } from '@testing-library/react';

import CustomTableWrapper from './custom-table-wrapper';

describe('CustomTableWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTableWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
