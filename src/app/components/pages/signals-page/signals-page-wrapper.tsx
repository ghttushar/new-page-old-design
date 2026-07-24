import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLiveMode } from '@/redux/slices/signals/signals.slice';
import { SignalsPage } from './signals-page';

export default function SignalsPageWrapper() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.endsWith('/assisted')) dispatch(setLiveMode(false));
    else if (pathname.endsWith('/live')) dispatch(setLiveMode(true));
  }, [dispatch, pathname]);

  return <SignalsPage />;
}