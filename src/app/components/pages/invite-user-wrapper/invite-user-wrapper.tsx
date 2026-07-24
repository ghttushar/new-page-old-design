import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ACCEPT_INVITE_URL,
  REGISTER_INVITE_URL,
} from 'src/constants/urls.constants';
import { IInviteDetails } from 'src/interfaces/auth.interfaces';
import AuthServices from 'src/services/auth.service';
import LoaderWrapper from '../../common/loader-wrapper/loader-wrapper';
import Loader from '../../common/loader/loader';

export default function InviteUserWrapper() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [inviteDetails, setInviteDetails] = useState<IInviteDetails | null>(
    null
  );
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      AuthServices.inviteDetails(token)
        .then((res) => {
          if (res?.data.success === true) {
            setInviteDetails(res?.data.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [token]);
  if (!inviteDetails) {
    <Loader/>
  }
  if (inviteDetails !== null) {
    if (inviteDetails?.existingUser === true) {
      navigate(`${ACCEPT_INVITE_URL}/${token}`);
    } else {
      navigate(`${REGISTER_INVITE_URL}/${token}`);
    }
    setIsLoading(false);
  }
  return (
    <React.Fragment>{isLoading === true && <LoaderWrapper />}</React.Fragment>
  );
}
