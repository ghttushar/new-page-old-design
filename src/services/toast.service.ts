import { TOAST_AUTO_CLEAR_TIME } from 'src/constants';
import { TOAST_MESSAGE_TYPES } from 'src/enums/toast.enums';
import { useAppDispatch } from 'src/redux/hooks';
import {
  IToastMessageState,
  showToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';

const useToastService = () => {
  const dispatch = useAppDispatch();
  const genMessage = (
    type: TOAST_MESSAGE_TYPES,
    title: string,
    description?: string
  ) => {
    const message: IToastMessageState = {
      title: title,
      description: description || '',
      autoClear: true,
      autoClearTime: TOAST_AUTO_CLEAR_TIME,
      type: type,
    };
    return message;
  };

  const showSuccessToast = (title: string, description?: string) => {
    dispatch(
      showToastMessage(
        genMessage(TOAST_MESSAGE_TYPES.SUCCESS, title, description)
      )
    );
  };

  const showErrorToast = (title: string, description?: string) => {
    dispatch(
      showToastMessage(
        genMessage(TOAST_MESSAGE_TYPES.ERROR, title, description)
      )
    );
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};

export default useToastService;
