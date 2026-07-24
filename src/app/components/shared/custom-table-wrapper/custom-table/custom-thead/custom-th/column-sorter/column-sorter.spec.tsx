import { render } from '@testing-library/react';

import ColumnSorter from './column-sorter';

describe('ColumnSorter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ColumnSorter />);
    expect(baseElement).toBeTruthy();
  });
});
