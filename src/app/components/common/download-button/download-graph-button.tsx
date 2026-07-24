import {
  IDownloadButtonOptions,
  IDownloadGraphButtonProps,
} from '@/interfaces/download-button.interface';
import { useAppDispatch } from '@/redux/hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { getCSVDownload } from '@/utils';
import * as htmlToImage from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import DownloadButtonUI from './download-button-ui';

export default function DownloadGraphButton({
  chartData,
  chartImageRef,
  filename,
  squareDimension = '2rem',
  enclosingCharacter = '',
  title,
  hoverInfoText,
  downloadOptionsRequired = true,
  accountType,
  iconButton = false,
  isDisabled = false,
  frequency,
}: IDownloadGraphButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const isMounted = useRef<boolean>(false);

  const dispatch = useAppDispatch();

  const downloadCsvFile = async () => {
    try {
      setIsDownloading(true);

      let exportData: Array<any>;
      if (chartData.length) exportData = chartData;
      else exportData = [];

      await getCSVDownload(
        exportData,
        filename,
        title,
        accountType,
        true,
        frequency
      );
    } catch (error) {
      dispatch(
        showErrorToastMessage({
          title: 'Download failed',
          description: `${error}`,
        })
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadGraphImage = async () => {
    if (chartImageRef.current) {
      try {
        setIsDownloading(true);
        const graphUrl = await htmlToImage.toPng(chartImageRef.current);

        const downloadLink = document.createElement('a');
        downloadLink.href = graphUrl;

        if (filename) downloadLink.download = `${filename}_graph.png`;

        downloadLink.click();
      } catch (error) {
        dispatch(
          showErrorToastMessage({
            title: 'Download failed',
            description: `${error}`,
          })
        );
      } finally {
        setIsDownloading(false);
      }
    }
  };

  useEffect(() => {
    if (isMounted.current === false) {
      isMounted.current = true;
      return;
    }

    if (isDownloading === true) {
      dispatch(
        showSuccessToastMessage({
          title: 'Downloading started',
        })
      );
    }

    if (isDownloading === false) {
      dispatch(
        showSuccessToastMessage({
          title: 'Downloaded Successfully',
        })
      );
    }
  }, [isDownloading, dispatch]);

  const tableDownloadOptions: Array<IDownloadButtonOptions> = [
    {
      title: 'Download as PNG',
      onClick: downloadGraphImage,
      isDisabled: false,
    },
    {
      title: 'Download as CSV',
      onClick: downloadCsvFile,
      isDisabled: false,
    },
  ];

  return (
    <DownloadButtonUI
      hoverInfoText={hoverInfoText}
      isDownloading={isDownloading}
      handleOriginalDownload={downloadCsvFile}
      downloadOptionsRequired={downloadOptionsRequired}
      iconButton={iconButton}
      squareDimension={squareDimension}
      downloadOptionsArray={tableDownloadOptions}
      isDisabled={isDisabled}
    />
  );
}
