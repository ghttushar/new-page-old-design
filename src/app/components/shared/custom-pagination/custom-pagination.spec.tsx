import { render } from '@testing-library/react';

import CustomPagination from './custom-pagination';

describe('CustomPagination', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomPagination />);
    expect(baseElement).toBeTruthy();
  });
});
