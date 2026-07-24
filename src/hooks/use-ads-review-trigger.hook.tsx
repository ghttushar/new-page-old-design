import CustomizablePopup, {
  ICustomizablePopupDetails,
} from '@/app/components/common/customizable-dialog/customizable-popup';
import { useCallback, useMemo, useState } from 'react';

export default function useAdsReviewTrigger() {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupParams, setPopupParams] =
    useState<ICustomizablePopupDetails | null>(null);
  const [confirmationActionRef, setConfirmationActionRef] = useState<
    (() => void) | null
  >(null);

  const handlePopupOpen = useCallback(
    (
      params: ICustomizablePopupDetails,
      handleConfirmationAction: () => void
    ) => {
      setIsPopupOpen(true);
      setConfirmationActionRef(() => handleConfirmationAction);
      setPopupParams(params);
    },
    []
  );

  const handlePopupClose = useCallback(() => {
    setIsPopupOpen(false);
    setConfirmationActionRef(null);
    setPopupParams(null);
  }, []);

  const updatePopupLoading = useCallback((value: boolean) => {
    setPopupParams((prev) => (prev ? { ...prev, isLoading: value } : prev));
  }, []);

  const PopupComponent = useMemo(() => {
    if (isPopupOpen === false || !popupParams || !confirmationActionRef)
      return null;

    return (
      <CustomizablePopup
        {...popupParams}
        openModal={isPopupOpen}
        handleClose={handlePopupClose}
        handleConfirmationAction={() => {
          confirmationActionRef?.();
        }}
      />
    );
  }, [handlePopupClose, isPopupOpen, popupParams, confirmationActionRef]);

  return {
    handlePopupOpen,
    handlePopupClose,
    PopupComponent,
    updatePopupLoading,
  };
}
