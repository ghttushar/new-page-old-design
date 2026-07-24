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
import styles from './custom-queries.module.scss';

interface ICustomQueriesProps {
  workflows: IAccountQueryMapping[];
  requests: IAMCCustomQueryRequest[];
  handleReloadData: () => void;
  showCustomForm: boolean;
}

export default function CustomQueries({
  workflows,
  requests,
  handleReloadData,
  showCustomForm,
}: ICustomQueriesProps) {
  const currentTime = getCurrentDateTime()
    .split('_')[1]
    .split('-')
    .slice(0, 2)
    .join(':');

  const [queryTitle, setQueryTitle] = useState<string>('');
  const [queryDescription, setQueryDescription] = useState<string>('');
  const [contactDate, setContactDate] = useState<string>(
    getCurrentDateTime().split('_')[0]
  );
  const [contactTime, setContactTime] = useState<string>(currentTime);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState<boolean>(false);
  const [filteredWorkflows, setFilteredWorkflows] = useState<
    IAccountQueryMapping[]
  >([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleQueryTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQueryTitle(event.target.value);
  };

  const handleQueryDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQueryDescription(event.target.value);
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

  const handleQueryRun = (workflowId: string, instanceId: string) => {
    navigate(
      `/amc/query-execution/instance/${instanceId}/workflow/${workflowId}`
    );
  };

  const handleReset = () => {
    setQueryTitle('');
    setQueryDescription('');
    setContactDate(getCurrentDateTime().split('_')[0]);
    setContactTime(currentTime);
  };

  const handleCustomQuerySubmit = () => {
    const selectedInstance = localStorageUtils.getSelectedAMCInstance()
      ?.value as string;

    const body: IAMCCustomQueryCreateBody = {
      endDate: getISODateTime(contactDate, contactTime).split('.')[0],
      startDate: getISODateTime(contactDate, contactTime).split('.')[0],
      queryType: AMCQueryTypes.DATA_QUERY,
      description: queryDescription,
      title: queryTitle,
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
    setIsWorkflowLoading(true);

    if (workflows.length) {
      const _filteredWorkflows = workflows.filter(
        (workflow) => !!workflow.queryId
      );
      setFilteredWorkflows(_filteredWorkflows);
    }

    setIsWorkflowLoading(false);
  }, [workflows]);

  return isWorkflowLoading ? (
    <LoaderWrapper />
  ) : (filteredWorkflows.length > 0 || requests.length > 0) &&
    showCustomForm === false ? (
    <div className={styles.customQueriesContainer}>
      {filteredWorkflows.length > 0 &&
        filteredWorkflows.map((workflow) => {
          const query = workflow.queryId;

          return (
            <QueryCardWrapper
              key={workflow._id}
              data={query}
              buttonTitle="Run"
              handleButtonClick={() =>
                handleQueryRun(
                  workflow.workflowId as string,
                  workflow.instanceId
                )
              }
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
        formHeading="Custom Queries"
        subHeading="Provide custom query details, and the Anarix team will reach out to
        you shortly for assistance."
        titleHeading="Query Title"
        title={queryTitle}
        description={queryDescription}
        contactDate={contactDate}
        contactTime={contactTime}
        handleTitleChange={handleQueryTitleChange}
        handleDescriptionChange={handleQueryDescriptionChange}
        handleContactDateChange={handleContactDateChange}
        handleContactTimeChange={handleContactTimeChange}
        handleCustomSubmit={handleCustomQuerySubmit}
        disableSubmitButton={
          !queryTitle || !queryDescription || !contactDate || !contactTime
        }
      />

      {isLoading === true && <LoaderWrapper />}
    </div>
  );
}
