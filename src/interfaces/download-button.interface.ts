import { MarketplaceEnum } from '@/enums/serp.enums';

export interface IDownloadButtonUIProps {
  handleOriginalDownload: () => void;
  isDownloading: boolean;
  hoverInfoText?: string;
  iconButton?: boolean;
  squareDimension?: string;
  downloadOptionsRequired?: boolean;
  downloadOptionsArray?: Array<IDownloadButtonOptions>;
  isDisabled?: boolean;
  iconColor?: string;
  iconSize?: number;
}

interface IDownloadButtonProps {
  filename?: string;
  squareDimension?: string;
  enclosingCharacter?: string;
  hoverInfoText?: string;
  downloadOptionsRequired?: boolean;
  iconButton?: boolean;
  accountType?: string;
  isDisabled?: boolean;
  iconColor?: string;
  iconSize?: number;
  shouldTranspose?: boolean;
}
export interface IDownloadTableButtonProps<T> extends IDownloadButtonProps {
  data: T[];
  title?: string;
  marketPlace?: MarketplaceEnum;
  handleDownload?: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
}

export interface IDownloadGraphButtonProps extends IDownloadButtonProps {
  chartData: Array<any>;
  chartImageRef: React.RefObject<HTMLDivElement>;
  title?: string;
  frequency?: string;
}

export interface IDownloadButtonOptions {
  title: string;
  onClick: () => void;
  isDisabled: boolean;
}
