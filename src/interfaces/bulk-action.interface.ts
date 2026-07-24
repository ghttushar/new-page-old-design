import { ReactNode } from 'react';
import { BulkActionKeyEnum } from 'src/enums/bulk-action.enums';

export interface IBulkAction {
  key: BulkActionKeyEnum;
  node: ReactNode;
}
