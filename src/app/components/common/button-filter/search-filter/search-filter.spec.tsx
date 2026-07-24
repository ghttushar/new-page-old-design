import { render } from '@testing-library/react';

import SearchFilter from './search-filter';

describe('SearchFilter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchFilter />);
    expect(baseElement).toBeTruthy();
  });
});
