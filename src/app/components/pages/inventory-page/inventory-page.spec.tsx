import { render } from '@testing-library/react';

import InventoryPage from './inventory-page';

describe('InventoryPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InventoryPage />);
    expect(baseElement).toBeTruthy();
  });
});
