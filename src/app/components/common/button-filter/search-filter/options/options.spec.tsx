import { render } from '@testing-library/react';

import Options from './options';

describe('Options', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Options />);
    expect(baseElement).toBeTruthy();
  });
});
