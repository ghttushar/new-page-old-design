import { render } from '@testing-library/react';

import UserAuthWrapper from './user-auth-wrapper';

describe('UserAuthWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserAuthWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
