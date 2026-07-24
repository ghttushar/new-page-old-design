import { render } from '@testing-library/react';

import ColumnResizer from './column-resizer';

describe('ColumnResizer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ColumnResizer />);
    expect(baseElement).toBeTruthy();
  });
});
