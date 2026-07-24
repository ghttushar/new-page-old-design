import { render } from '@testing-library/react';

import AdvertisingWrapper from './advertising-wrapper';

describe('AdvertisingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdvertisingWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
