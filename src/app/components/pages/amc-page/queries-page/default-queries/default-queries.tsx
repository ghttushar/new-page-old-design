import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import QueryCardWrapper from 'src/app/components/page-components/amc-components/query-cards/query-card-wrapper';
import { amcDefaultQueriesEmptyStateConf } from 'src/constants/empty-state.constants';
import { IAccountQueryMapping } from 'src/interfaces/amc.interfaces';
import styles from './default-queries.module.scss';

interface IDefaultQueriesProps {
  workflows: IAccountQueryMapping[];
}

export default function DefaultQueries({ workflows }: IDefaultQueriesProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredWorkflows, setFilteredWorkflows] = useState<
    IAccountQueryMapping[]
  >([]);

  const navigate = useNavigate();

  const handleQueryRun = (workflowId: string, instanceId: string) => {
    navigate(
      `/amc/query-execution/instance/${instanceId}/workflow/${workflowId}`
    );
  };

  useEffect(() => {
    setIsLoading(true);

    const _filteredWorkflows = workflows.filter(
      (workflow) => !!workflow.queryId
    );
    setFilteredWorkflows(_filteredWorkflows);

    setIsLoading(false);
  }, [workflows]);

  return (
    <div className={styles.defaultContainer}>
      {isLoading ? (
        <LoaderWrapper />
      ) : filteredWorkflows.length > 0 ? (
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
        })
      ) : (
        <div className={styles.emptyStateWrapper}>
          <EmptyState {...amcDefaultQueriesEmptyStateConf} height="100%" />
        </div>
      )}
    </div>
  );
}
