import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAmcSubHeader from '@/hooks/use-amc-sub-header.hook';
import { IAMCGetInstanceRequestResponse } from '@/interfaces/amc.interfaces';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import { AMCInstanceRequestStatus } from 'src/enums/amc.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectInstanceRequest } from 'src/redux/slices/amc/amc.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { amcInstanceService } from 'src/services/amc/amc-instances.services';
import styles from './amc-homepage.module.scss';

interface IAmcHomepageProps {
  getInstanceRequest: () => void;
}

export default function AmcHomepage({ getInstanceRequest }: IAmcHomepageProps) {
  useAmcSubHeader(PageTitleEnum.AMC, PAGE_TITLE_TOOLTIPS.AMC);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const instanceRequest = useAppSelector(selectInstanceRequest);

  const handleInstanceRequest = () => {
    setIsLoading(true);
    amcInstanceService
      .createRequest()
      .then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message,
            description: res.data.description,
          })
        );
      })
      .finally(() => {
        getInstanceRequest();
        setIsLoading(false);
      });
  };

  const getMessageBasedOnStatus = (
    instanceRequest: IAMCGetInstanceRequestResponse
  ) => {
    switch (instanceRequest.status) {
      case AMCInstanceRequestStatus.INITIATED:
        return `Your instance request has been initiated. We'll provide further
                updates from our side.`;
      case AMCInstanceRequestStatus.IN_PROGRESS:
        return `Your instance request is in progress. We'll provide further
                updates from our side.`;
      case AMCInstanceRequestStatus.AMAZON_PROCESSING:
        return `Your instance request is in Amazon Processing phase. We'll
                provide further updates from our side.`;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.homepageSubContainer}>
        {isLoading ? (
          <LoaderWrapper />
        ) : (
          <div className={styles.contentContainer}>
            <Typography
              fontSize="6rem"
              fontWeight={700}
              lineHeight="7rem"
              sx={{
                mb: 1,
              }}
            >
              Welcome to AMC
            </Typography>

            {!instanceRequest ? (
              <React.Fragment>
                <Typography
                  fontSize="2rem"
                  fontWeight={400}
                  lineHeight="2.5rem"
                  sx={{
                    mb: 2,
                    px: 2,
                  }}
                >
                  Our team will generate an instance for you within 24 hours.
                  We'll provide updates from our side.
                </Typography>

                <PrimaryButton
                  buttonText="Instance Request"
                  width="20rem"
                  buttonFunction={handleInstanceRequest}
                  isButtonIconRequired={false}
                  disabled={false}
                />
              </React.Fragment>
            ) : (
              <Typography
                fontSize="2rem"
                fontWeight={400}
                lineHeight="2.5rem"
                sx={{
                  mb: 2,
                  px: 2,
                }}
              >
                {getMessageBasedOnStatus(instanceRequest)}
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
