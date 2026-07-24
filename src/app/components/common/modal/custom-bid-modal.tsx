import { Button } from '@mui/material';
import React, { useRef } from 'react';
import { adjustmentOptions } from 'src/constants/advertising-filter.constants';
import { Adjustments } from 'src/enums/advertising.enums';
import { IDropdownItem } from '../dropdown/dropdown';
import DropdownTextfield from '../dropdown/dropdown-textfield';
import {
  applyButtonStyle,
  customBidModalStyle,
  errMessageStyles,
  modalChildContainerStyle,
} from './keyword-action-filter-modal-styles';

interface CustomBidModalModalProps {
  title: string;
  customBid: string;
  message: string;
  handleClose: () => void;
  selectedRowIdsCount: number;
  handleApplyCustomBid: (
    customBid: number,
    adjustment: IDropdownItem<Adjustments>
  ) => void;
}

export const CustomBidModal: React.FC<CustomBidModalModalProps> = ({
  handleClose,
  title,
  message,
  selectedRowIdsCount,
  handleApplyCustomBid,
}) => {
  const [internalBid, setInternalBid] = React.useState<number | typeof NaN>(0);
  const [messageText, setMessageText] = React.useState<string>('');
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
  const [selectedAdjustment, setSelectedAdjustment] = React.useState<
    IDropdownItem<Adjustments>
  >(adjustmentOptions[0]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  const handleApply = () => {
    handleApplyCustomBid(Number(internalBid), selectedAdjustment);
    setInternalBid(0);
    handleClose();
  };

  const handleBidChange = (num: number) => {
    setInternalBid(num);

    if (selectedRowIdsCount > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleBudgetOptionChange = (value: IDropdownItem<Adjustments>) => {
    setSelectedAdjustment(value);
  };

  React.useEffect(() => {
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
    <div style={customBidModalStyle} ref={containerRef}>
      <div style={modalChildContainerStyle}>
        <DropdownTextfield
          label=""
          options={adjustmentOptions}
          selected={selectedAdjustment}
          onSelect={handleBudgetOptionChange}
          fieldValue={internalBid}
          onValueChange={handleBidChange}
          stopPropagation={true}
        />
      </div>

      {isDisabled && <p style={errMessageStyles}>{messageText}</p>}
      <h4>{title}</h4>
      <p>{message}</p>
      <Button
        variant="contained"
        onClick={handleApply}
        sx={{ ...applyButtonStyle, marginTop: '0.6rem' }}
        disabled={isDisabled}
      >
        Apply
      </Button>
    </div>
  );
};
