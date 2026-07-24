import { selectIsWmtApplyBtnDisabled } from '@/redux/slices/keyword-action/walmart/keyword-action.slice';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsApplyBtnDisabled } from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  confirmationApplyButtonStyle,
  confirmationCancelButtonStyle,
  confirmationModalStyle,
} from './keyword-action-filter-modal-styles';

interface IConfirmationModalProps {
  title: string;
  message: string;
  handleKeywordOperation: () => void;
  handleClose: () => void;
  style?: React.CSSProperties;
}

export const ConfirmationModal: React.FC<IConfirmationModalProps> = ({
  title,
  message,
  handleKeywordOperation,
  handleClose,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  const isApplyBtnDisabled = useAppSelector(selectIsApplyBtnDisabled);
  const isWmtApplyBtnDisabled = useAppSelector(selectIsWmtApplyBtnDisabled);

  const handleApplyClick = () => {
    handleKeywordOperation();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        event.target !== document.body
      ) {
        handleClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div style={style || confirmationModalStyle} ref={containerRef}>
      <h4>{title}</h4>
      <p>{message}</p>
      <div style={{ marginTop: '1rem' }}>
        <LoadingButton
          variant="contained"
          onClick={handleApplyClick}
          sx={confirmationApplyButtonStyle}
          loading={isApplyBtnDisabled || isWmtApplyBtnDisabled}
        >
          Apply
        </LoadingButton>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={confirmationCancelButtonStyle}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
