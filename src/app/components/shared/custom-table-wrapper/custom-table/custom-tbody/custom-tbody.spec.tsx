import { render } from '@testing-library/react';

import CustomTbody from './custom-tbody';

describe('CustomTbody', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomTbody />);
    expect(baseElement).toBeTruthy();
  });
});
