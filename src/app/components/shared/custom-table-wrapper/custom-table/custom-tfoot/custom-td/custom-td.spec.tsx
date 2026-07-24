import { render } from '@testing-library/react';

import CustomTd from './custom-td';

describe('CustomTd', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTd />);
    expect(baseElement).toBeTruthy();
  });
});
