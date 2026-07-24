import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { applyButtonStyles } from './action-confirmation-dialog-styles';
import styles from './action-confirmation-dialog.module.scss';

interface IActionConfirmationDialogProps {
  dialogMessage: string;
  children: React.ReactNode;
  onApply: () => void;
  onClose?: () => void;
  isApplyDisabled?: boolean;
  isErrorPopupOpen: boolean;
}

export default function ActionConfirmationDialog({
  dialogMessage,
  children,
  onApply,
  onClose,
  isApplyDisabled = false,
  isErrorPopupOpen,
}: IActionConfirmationDialogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    if (isErrorPopupOpen) setCounter((prevVal) => prevVal + 1);
    else setCounter(0);
  }, [isErrorPopupOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body &&
        isErrorPopupOpen === false &&
        counter % 2 === 0
      ) {
        onClose && onClose();
        setCounter(0);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [counter, isErrorPopupOpen, onClose]);

  return (
    <div className={styles.container} ref={containerRef}>
      {children}
      <Typography className={styles.confirmHeading}>Confirmation</Typography>
      <Typography className={styles.confirmMessage}>{dialogMessage}</Typography>

      <Button
        disableRipple
        sx={applyButtonStyles}
        onClick={() => {
          onClose && onClose();
          setCounter(0);
        }}
      >
        Cancel
      </Button>
      <Button
        disableRipple
        disabled={isApplyDisabled}
        sx={{
          ...applyButtonStyles,
          marginLeft: '1rem',
          backgroundColor: '#77469B',
          color: '#fff',
        }}
        onClick={() => {
          onApply();
          setCounter(0);
        }}
      >
        Apply
      </Button>
    </div>
  );
}
