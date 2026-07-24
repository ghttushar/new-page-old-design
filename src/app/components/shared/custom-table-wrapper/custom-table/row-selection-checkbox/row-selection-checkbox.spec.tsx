import { render } from '@testing-library/react';

import RowSelectionCheckbox from './row-selection-checkbox';

describe('RowSelectionCheckbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RowSelectionCheckbox />);
    expect(baseElement).toBeTruthy();
  });
});
