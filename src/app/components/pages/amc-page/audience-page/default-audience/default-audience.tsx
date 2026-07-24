import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import QueryCardWrapper from 'src/app/components/page-components/amc-components/query-cards/query-card-wrapper';
import { amcDefaultAudienceEmptyStateConf } from 'src/constants/empty-state.constants';
import { IAccountQueryMapping } from 'src/interfaces/amc.interfaces';
import styles from './default-audience.module.scss';

interface IDefaultAudienceProps {
  audiences: IAccountQueryMapping[];
}

export default function DefaultAudience({ audiences }: IDefaultAudienceProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredAudiences, setFilteredAudiences] = useState<
    IAccountQueryMapping[]
  >([]);

  const navigate = useNavigate();

  const handleAudienceCreate = (queryId: string) => {
    navigate(`/amc/create-audience/query/${queryId}`);
  };

  useEffect(() => {
    setIsLoading(true);

    const _filteredAudiences = audiences.filter(
      (audience) => !!audience.queryId
    );
    setFilteredAudiences(_filteredAudiences);

    setIsLoading(false);
  }, [audiences]);

  return (
    <div className={styles.defaultContainer}>
      {isLoading ? (
        <LoaderWrapper />
      ) : filteredAudiences.length > 0 ? (
        filteredAudiences.map((audience) => {
          const query = audience.queryId;

          return (
            <QueryCardWrapper
              key={audience._id}
              data={query}
              buttonTitle="Create"
              handleButtonClick={() =>
                handleAudienceCreate(audience.queryId._id)
              }
            />
          );
        })
      ) : (
        <div className={styles.emptyStateWrapper}>
          <EmptyState {...amcDefaultAudienceEmptyStateConf} height="100%" />
        </div>
      )}
    </div>
  );
}
