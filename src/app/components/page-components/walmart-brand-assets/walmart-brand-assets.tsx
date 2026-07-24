import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { IWalmartBrandProfile } from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { setWalmartBrandProfileEditState } from 'src/redux/slices/advertising/walmart/advertising-walmart.slice';
import ImgComponent from '../../common/img-component/img-component';
import InfoIcon from '../../common/info-icon/info-icon';
import {
  inputLabelStyles,
  textFieldStyles,
} from './walmart-brand-assets-styles';
import styles from './walmart-brand-assets.module.scss';

interface IWalmartBrandProfileProps {
  brandProfileData: IWalmartBrandProfile | null;
  isLoading: boolean;
  isDisabled?: boolean;
}

export default function WalmartBrandProfile({
  brandProfileData,
  isLoading,
  isDisabled = true,
}: IWalmartBrandProfileProps) {
  const dispatch = useAppDispatch();

  const handleBrandNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setWalmartBrandProfileEditState({
        ...brandProfileData,
        searchAmpName: event.target.value,
      } as IWalmartBrandProfile)
    );
  };

  const handleBrandHeadlineChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setWalmartBrandProfileEditState({
        ...brandProfileData,
        headlineText: event.target.value,
      } as IWalmartBrandProfile)
    );
  };

  const handleBrandUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setWalmartBrandProfileEditState({
        ...brandProfileData,
        clickUrl: event.target.value,
      } as IWalmartBrandProfile)
    );
  };

  const handleClickUrl = () => {
    if (!isDisabled || !brandProfileData || !brandProfileData?.clickUrl) return;

    const clickUrl = brandProfileData?.clickUrl;
    window.open(clickUrl, '_blank');
  };

  return (
    <div className={styles.brandAssetsWrapper}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress sx={{ color: '#77469b' }} />
          <Typography
            variant="body1"
            fontSize="1.2rem"
            fontWeight={600}
            color="#666666"
          >
            Please wait while data is being fetched
          </Typography>
        </div>
      ) : brandProfileData !== null ? (
        <div className={styles.brandAssetsContainer}>
          <div className={styles.brandAssetsHeader}>
            <p>Brand Profile</p>
            <InfoIcon
              title="Brand Profile can be edited when the campaign is in Paused state"
              position={TooltipPlacement.Right}
            />
          </div>

          <div className={styles.brandAssetsData}>
            <div className={styles.dataComponent}>
              <p className={styles.heading}>Brand Logo</p>
              <ImgComponent
                className={styles.logoImg}
                alt={brandProfileData?.searchAmpName || 'brand-logo'}
                imageURL={brandProfileData?.logoUrl}
              />
            </div>
            <div className={styles.dataComponent}>
              <InputLabel htmlFor="brandName" sx={inputLabelStyles}>
                Brand Name
              </InputLabel>
              <TextField
                value={brandProfileData?.searchAmpName ?? '-'}
                id="brandName"
                variant="outlined"
                type="text"
                placeholder="Enter Brand Name"
                sx={textFieldStyles}
                onChange={handleBrandNameChange}
                disabled={isDisabled}
                className="brand-name"
              />
            </div>

            <div className={styles.dataComponent}>
              <InputLabel htmlFor="headline" sx={inputLabelStyles}>
                Headline
              </InputLabel>
              <TextField
                value={brandProfileData?.headlineText ?? '-'}
                id="headline"
                variant="outlined"
                type="text"
                placeholder="Enter Headline"
                sx={textFieldStyles}
                onChange={handleBrandHeadlineChange}
                disabled={isDisabled}
                className="brand-headline"
              />
            </div>

            <div
              className={styles.dataComponent}
              onClick={handleClickUrl}
              style={{ cursor: isDisabled ? 'pointer' : 'inherit' }}
            >
              <InputLabel htmlFor="url" sx={inputLabelStyles}>
                URL
              </InputLabel>
              <TextField
                value={brandProfileData?.clickUrl ?? '-'}
                id="url"
                variant="outlined"
                type="text"
                placeholder="Enter URL"
                sx={textFieldStyles}
                onChange={handleBrandUrlChange}
                disabled={isDisabled}
                className="brand-url"
              />
            </div>
            <div className={styles.dataComponent}></div>
          </div>
        </div>
      ) : (
        <div>No Brand Asset found for this campaign</div>
      )}
    </div>
  );
}
