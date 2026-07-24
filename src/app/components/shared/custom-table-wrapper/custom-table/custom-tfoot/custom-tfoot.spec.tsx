import { render } from '@testing-library/react';

import CustomTfoot from './custom-tfoot';

describe('CustomTfoot', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTfoot />);
    expect(baseElement).toBeTruthy();
  });
});
