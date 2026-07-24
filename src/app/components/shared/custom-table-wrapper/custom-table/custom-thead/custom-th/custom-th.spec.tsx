import { render } from '@testing-library/react';

import CustomTh from './custom-th';

describe('CustomTh', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTh />);
    expect(baseElement).toBeTruthy();
  });
});
