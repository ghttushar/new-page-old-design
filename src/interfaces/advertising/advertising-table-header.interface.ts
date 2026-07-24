import {
  IAdGroup,
  IAdvertisingNavigationBarOption,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { ColumnDef } from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { ISBAdGroup } from './amazon/sb-advertising.interface';
import { ISDAdGroup } from './amazon/sd-advertising.interface';
import { IWalmartAdGroup } from './walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from './walmart/walmart-sv-advertising.interface';

interface IMetricDropdownData {
  metricFilter: IDropdownItem<string>;
  metricOptions: IDropdownItem<string>[];
}

export interface ITableHeaderProps<T, G = T> {
  selectedNavTab: IAdvertisingNavigationBarOption;
  handleSelectedAdvertisingNavTitle: (value: string) => void;
  hideGraph: boolean;
  handleShowGraph: () => void;
  columnsToFilter?: Array<ColumnDef<T>>;
  setSelectedColumns?: (selectedColumns: Array<ColumnDef<T>>) => void;
  _selectedColumns?: Array<ColumnDef<T>>;
  __setSelectedColumns?: (selectedColumns: string[]) => void;
  initialRows: any[];
  isTableDataLoading: boolean;
  selectedAdvertisingNavTitle: string;
  setUpdatedRows: (data: any[]) => void;
  exportData: G[];
  isMetricDropdownRequired?: boolean;
  metricDropdownData?: IMetricDropdownData;
  onMetricDropdownChange?: (value: IDropdownItem<string>) => void;
  exportFileTitle: string;
  selectedCampaignId?: string | number;
  selectedAdGroupId?: string | number;
  triggerReloadFunction?: () => void;
  setCreateDialogLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  areActionButtonsRequired?: boolean;
  handleDownload?: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  selectedAdGroup:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup
    | null;
  showColumnFilterComp?: boolean;
}
