import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import CustomQueryForm from 'src/app/components/page-components/amc-components/custom-form/custom-query-form';
import QueryCardWrapper, {
  QueryCard,
} from 'src/app/components/page-components/amc-components/query-cards/query-card-wrapper';
import { AMCQueryTypes } from 'src/enums/amc.enums';
import {
  IAMCCustomQueryCreateBody,
  IAMCCustomQueryRequest,
  IAccountQueryMapping,
} from 'src/interfaces/amc.interfaces';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { AMCQueryServices } from 'src/services/amc/amc-queries.services';
import { getCurrentDateTime, getISODateTime } from 'src/utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import styles from './custom-audience.module.scss';

interface ICustomAudienceProps {
  audiences: IAccountQueryMapping[];
  requests: IAMCCustomQueryRequest[];
  handleReloadData: () => void;
  showCustomForm: boolean;
}

export default function CustomAudience({
  audiences,
  requests,
  handleReloadData,
  showCustomForm,
}: ICustomAudienceProps) {
  const currentTime = getCurrentDateTime()
    .split('_')[1]
    .split('-')
    .slice(0, 2)
    .join(':');

  const [audienceTitle, setAudienceTitle] = useState<string>('');
  const [audienceDescription, setAudienceDescription] = useState<string>('');
  const [contactDate, setContactDate] = useState<string>(
    getCurrentDateTime().split('_')[0]
  );
  const [contactTime, setContactTime] = useState<string>(currentTime);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAudienceLoading, setIsAudienceLoading] = useState<boolean>(false);
  const [filteredAudiences, setFilteredAudiences] = useState<
    IAccountQueryMapping[]
  >([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAudienceTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudienceTitle(event.target.value);
  };

  const handleAudienceDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudienceDescription(event.target.value);
  };

  const handleContactDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContactDate(event.target.value);
  };

  const handleContactTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContactTime(event.target.value);
  };

  const handleAudienceCreate = (queryId: string) => {
    navigate(`/amc/create-audience/query/${queryId}`);
  };

  const handleReset = () => {
    setAudienceTitle('');
    setAudienceDescription('');
    setContactDate(getCurrentDateTime().split('_')[0]);
    setContactTime(currentTime);
  };

  const handleCustomAudienceSubmit = () => {
    const selectedInstance = localStorageUtils.getSelectedAMCInstance()
      ?.value as string;

    const body: IAMCCustomQueryCreateBody = {
      endDate: getISODateTime(contactDate, contactTime).split('.')[0],
      startDate: getISODateTime(contactDate, contactTime).split('.')[0],
      queryType: AMCQueryTypes.AUDIENCE_QUERY,
      description: audienceDescription,
      title: audienceTitle,
      instanceId: selectedInstance,
    };

    setIsLoading(true);
    AMCQueryServices.createCustomQuery(body)
      .then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message,
            description: res.data.description,
          })
        );
      })
      .finally(() => {
        handleReset();
        handleReloadData();
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsAudienceLoading(true);

    if (audiences.length) {
      const _filteredAudiences = audiences.filter(
        (audience) => !!audience.queryId
      );
      setFilteredAudiences(_filteredAudiences);
    }

    setIsAudienceLoading(false);
  }, [audiences]);

  return isAudienceLoading ? (
    <LoaderWrapper />
  ) : (filteredAudiences.length > 0 || requests.length > 0) &&
    showCustomForm === false ? (
    <div className={styles.customQueriesContainer}>
      {filteredAudiences.length > 0 &&
        filteredAudiences.map((audience) => {
          const query = audience.queryId;

          return (
            <QueryCardWrapper
              key={audience._id}
              data={query}
              buttonTitle="Create"
              handleButtonClick={() => handleAudienceCreate(query._id)}
            />
          );
        })}

      {requests.length > 0 &&
        requests.map((request) => (
          <QueryCard
            key={request._id}
            title={request.title}
            description={request.description}
            isRequest={true}
            status={request.status}
          />
        ))}
    </div>
  ) : (
    <div className={styles.customContainer}>
      <CustomQueryForm
        formHeading="Custom Audience"
        subHeading="Provide custom audience details, and the Anarix team will reach out to
        you shortly for assistance."
        titleHeading="Audience Name"
        title={audienceTitle}
        description={audienceDescription}
        contactDate={contactDate}
        contactTime={contactTime}
        handleTitleChange={handleAudienceTitleChange}
        handleDescriptionChange={handleAudienceDescriptionChange}
        handleContactDateChange={handleContactDateChange}
        handleContactTimeChange={handleContactTimeChange}
        handleCustomSubmit={handleCustomAudienceSubmit}
        disableSubmitButton={
          !audienceTitle || !audienceDescription || !contactDate || !contactTime
        }
      />

      {isLoading === true && <LoaderWrapper />}
    </div>
  );
}
