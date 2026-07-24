import React, { useCallback, useMemo, useState } from 'react';
import {
  IDownloadButtonOptions,
  IDownloadTableButtonProps,
} from 'src/interfaces/download-button.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { getCSVDownload } from 'src/utils';
import DownloadButtonUI from './download-button-ui';

export function DownloadTableButton<T>(props: IDownloadTableButtonProps<T>) {
  const {
    data,
    filename,
    squareDimension,
    enclosingCharacter = '',
    title,
    hoverInfoText,
    handleDownload,
    downloadOptionsRequired = true,
    accountType,
    iconButton = false,
    isDisabled = false,
    iconColor,
    iconSize,
    shouldTranspose = false,
    marketPlace,
  } = props;
  const [isDownloading, setIsDownloading] = useState(false);

  const appliedFilters = useAppSelector(selectAppliedFilters);
  const grayedOut = appliedFilters.length === 0;

  const downloadCsvFile = useCallback(
    async (isAllDownload: boolean) => {
      setIsDownloading(true);
      let exportData: Array<any>;
      if (data.length) exportData = data;
      else if (handleDownload) exportData = await handleDownload(isAllDownload);
      else exportData = [];

      getCSVDownload(
        exportData,
        filename,
        title,
        accountType,
        false,
        '',
        shouldTranspose
      );
      setIsDownloading(false);
    },
    [data, filename, title, accountType, handleDownload, shouldTranspose]
  );

  const handleCsvDownload = useCallback(
    () => downloadCsvFile(true),
    [downloadCsvFile]
  );

  const tableDownloadOptions: Array<IDownloadButtonOptions> = useMemo(
    () => [
      {
        title: 'Download with Filters',
        onClick: () => {
          downloadCsvFile(false);
        },
        isDisabled: grayedOut,
      },
      {
        title: 'Download all Results',
        onClick: () => {
          downloadCsvFile(true);
        },
        isDisabled: false,
      },
    ],
    [grayedOut, downloadCsvFile]
  );

  return (
    <DownloadButtonUI
      hoverInfoText={hoverInfoText}
      isDownloading={isDownloading}
      handleOriginalDownload={handleCsvDownload}
      downloadOptionsRequired={downloadOptionsRequired}
      iconButton={iconButton}
      squareDimension={squareDimension}
      downloadOptionsArray={tableDownloadOptions}
      isDisabled={isDisabled}
      iconColor={iconColor}
      iconSize={iconSize}
    />
  );
}

export default React.memo(DownloadTableButton);
