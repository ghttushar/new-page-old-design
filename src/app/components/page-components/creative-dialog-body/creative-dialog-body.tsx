import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ISBAssetVersions,
  ISBCreativeAssetData,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreativeTopOfSearch } from 'src/enums/advertising.enums';
import { ICreativeAssetIds } from 'src/redux/slices/advertising/advertising-sb-filter.slice';
import { sbAdvertisingCampaignLevelServices } from 'src/services/advertising/amazon/sb-advertising.service';
import { getProductUrl } from 'src/utils/advertising.utils';
import Dropdown, {
  IDropdownItem,
  IDropdownProps,
} from '../../common/dropdown/dropdown';
import styles from '../../pages/advertising-page/advertising-amazon/sb/account-level/amz-sb-account-level.module.scss';

interface ICreativeDialogBodyProps {
  creativeAssetIds: ICreativeAssetIds;
  dropdownOptions: IDropdownProps<string>[];
  handleVersionSelect: (value: string) => void;
  selectedDropdownOption: IDropdownItem<string>;
  selectedVersion: string;
}

function CreativeDialogBody({
  creativeAssetIds,
  dropdownOptions,
  handleVersionSelect,
  selectedDropdownOption,
  selectedVersion,
}: ICreativeDialogBodyProps) {
  const [assetVersions, setAssetVersions] = useState<ISBAssetVersions[]>([]);
  const [isAssetLoading, setIsAssetLoading] = useState<boolean>(false);
  const [assetData, setAssetData] = useState<ISBCreativeAssetData | null>(null);
  const params = useParams();
  const marketplace = useMemo(
    () => params['marketplace'] || MarketplaceEnum.AMAZON,
    [params]
  );
  useEffect(() => {
    setAssetVersions([]);
    creativeAssetIds.videoAssetIds.length &&
      creativeAssetIds.videoAssetIds.forEach((id) => {
        const version = id.split(':')[1];
        const _version = version.split('_');
        if (_version && _version.length) {
          const vLabel = _version[0];
          const vValue = _version[1][1];
          setAssetVersions([
            ...assetVersions,
            {
              label: `${vLabel[0].toUpperCase()}${vLabel.slice(1)} ${vValue}`,
              value: `${version}`,
              assetId: id,
            },
          ]);
        }
      });
  }, [creativeAssetIds]);

  useEffect(() => {
    if (assetVersions.length) {
      handleVersionSelect(assetVersions[0].value);
    }
  }, [assetVersions]);

  useEffect(() => {
    assetVersions.length &&
      selectedVersion &&
      assetVersions.forEach((version) => {
        if (version.value === selectedVersion) {
          setIsAssetLoading(true);
          setAssetData(null);
          const body = {
            assetId: version.assetId,
          };
          sbAdvertisingCampaignLevelServices
            .getAssetById(body)
            .then((res) => {
              const data = res.data.data;
              setAssetData({
                url: data.url,
                name: data.name,
                products: [...creativeAssetIds.products],
              });
            })
            .finally(() => setIsAssetLoading(false));
        }
      });
  }, [selectedVersion, assetVersions]);

  return (
    <div className={styles.creativeContainer}>
      <div className={styles.creativeDropdownContainer}>
        {dropdownOptions.map((item) => (
          <Dropdown
            key={item.label}
            label={item.label}
            options={item.options}
            selected={item.selected}
            onSelect={item.onSelect}
            width="20rem"
          />
        ))}
      </div>
      <div className={styles.versionContainer}>
        {assetVersions.length &&
          assetVersions.map((version) => (
            <div
              className={`${styles.versionBlock} ${
                version.value === selectedVersion ? styles.versionActive : ''
              }`}
              key={version.value}
              onClick={() => handleVersionSelect(version.value)}
            >
              <h5>{version.label}</h5>
            </div>
          ))}
      </div>
      {isAssetLoading ? (
        <CircularProgress sx={{ color: '#77469b', alignSelf: 'center' }} />
      ) : (
        <div className={styles.creativeContentContainer}>
          {selectedDropdownOption.value === CreativeTopOfSearch.DESKTOP ? (
            <CreativeDesktopContent data={assetData as ISBCreativeAssetData} />
          ) : (
            <CreativeMobileContent data={assetData as ISBCreativeAssetData} />
          )}
        </div>
      )}
    </div>
  );
}

interface ICreativeContentProps {
  data: ISBCreativeAssetData;
}

function CreativeDesktopContent({ data }: ICreativeContentProps) {
  const params = useParams();
  const marketplace = useMemo(
    () => params['marketplace'] || MarketplaceEnum.AMAZON,
    [params]
  );
  return (
    <div className={styles.creativeDesktopContainer}>
      {data !== null && (
        <React.Fragment>
          <video src={data.url} width="30%" height="100%" controls></video>
          {data.products.length &&
            data.products.map((item) => (
              <div className={styles.productNameContainer}>
                <span>Asin No.:</span>
                <a
                  className={styles.productTitle}
                  href={getProductUrl(item, marketplace)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p title={item} style={{ fontWeight: 600 }}>
                    {item}
                  </p>
                </a>
              </div>
            ))}
        </React.Fragment>
      )}
    </div>
  );
}

function CreativeMobileContent({ data }: ICreativeContentProps) {
  const params = useParams();
  const marketplace = useMemo(
    () => params['marketplace'] || MarketplaceEnum.AMAZON,
    [params]
  );
  return (
    <div className={styles.creativeMobileContainer}>
      {data !== null && (
        <React.Fragment>
          <video src={data.url} width="100%" height="50%" controls></video>
          {data.products.length &&
            data.products.map((item) => (
              <div className={styles.productNameContainer}>
                <span>Asin No.:</span>
                <a
                  className={styles.productTitle}
                  href={getProductUrl(item, marketplace)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p title={item} style={{ fontWeight: 600 }}>
                    {item}
                  </p>
                </a>
              </div>
            ))}
        </React.Fragment>
      )}
    </div>
  );
}

export default CreativeDialogBody;
