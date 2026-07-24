import { render } from '@testing-library/react';

import KeywordTrackerTable from './keyword-tracker-table';

describe('KeywordTrackerTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KeywordTrackerTable />);
    expect(baseElement).toBeTruthy();
  });
});
