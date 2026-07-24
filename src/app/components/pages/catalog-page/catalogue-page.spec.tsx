import { render } from '@testing-library/react';

import CateloguePage from './catalog-wrapper';

describe('CateloguePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CateloguePage />);
    expect(baseElement).toBeTruthy();
  });
});
