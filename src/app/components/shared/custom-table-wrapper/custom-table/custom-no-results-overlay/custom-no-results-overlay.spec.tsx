import { render } from '@testing-library/react';

import CustomNoResultsOverlay from './custom-no-results-overlay';

describe('CustomNoResultsOverlay', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomNoResultsOverlay />);
    expect(baseElement).toBeTruthy();
  });
});
