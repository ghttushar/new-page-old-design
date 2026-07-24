import React, { useEffect } from 'react';

interface CustomPopupToggleProps {
  componentRef: React.MutableRefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  handlePopupClose: () => void;
}

export default function CustomPopupToggle({
  componentRef,
  children,
  handlePopupClose,
}: CustomPopupToggleProps) {
  useEffect(() => {
    const handleClickedOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        handlePopupClose();
      }
    };

    document.body.addEventListener('click', handleClickedOutside);

    return () => {
      document.body.removeEventListener('click', handleClickedOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
