import { advertisingPageNotFound } from '@/constants/empty-state.constants';
import { ADVERTISING_ACCOUNT_URL } from '@/constants/urls.constants';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../common/empty-state/empty-state';

export default function AdvertisingEmptyState() {
  const navigate = useNavigate();

  return (
    <EmptyState
      {...advertisingPageNotFound}
      buttonFunction={() => navigate(ADVERTISING_ACCOUNT_URL)}
    />
  );
}
