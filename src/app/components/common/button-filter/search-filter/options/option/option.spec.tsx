import { render } from '@testing-library/react';

import Option from './option';

describe('Option', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Option />);
    expect(baseElement).toBeTruthy();
  });
});
