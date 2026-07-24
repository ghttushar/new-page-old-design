import { render } from '@testing-library/react';

import ToastMessageQueue from './toast-message-queue';

describe('ToastMessageQueue', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToastMessageQueue />);
    expect(baseElement).toBeTruthy();
  });
});
