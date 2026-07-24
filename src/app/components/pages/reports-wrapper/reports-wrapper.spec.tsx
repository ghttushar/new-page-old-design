import { render } from '@testing-library/react';

import ReportsWrapper from './reports-wrapper';

describe('ReportsWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReportsWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
