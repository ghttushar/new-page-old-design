import { render } from '@testing-library/react';

import CustomTableLoader from './custom-table-loader';

describe('CustomTableLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTableLoader />);
    expect(baseElement).toBeTruthy();
  });
});
