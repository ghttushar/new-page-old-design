import { render } from '@testing-library/react';

import CustomThead from './custom-thead';

describe('CustomThead', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomThead />);
    expect(baseElement).toBeTruthy();
  });
});
