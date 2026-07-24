import { useCallback, useEffect, useState } from 'react';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { useAppDispatch } from 'src/redux/hooks';
import { setInstanceRequest } from 'src/redux/slices/amc/amc.slice';
import { amcInstanceService } from 'src/services/amc/amc-instances.services';
import AmcHomepage from '../amc-homepage/amc-homepage';

export default function AMCHomeWrapper() {
  const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const getInstanceRequest = useCallback(() => {
    setIsRequestLoading(true);
    amcInstanceService
      .getRequest()
      .then((res) => {
        dispatch(setInstanceRequest(res.data.data));
      })
      .finally(() => {
        setIsRequestLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    getInstanceRequest();
  }, [getInstanceRequest]);

  if (isRequestLoading) return <LoaderWrapper />;
  else return <AmcHomepage getInstanceRequest={getInstanceRequest} />;
}
