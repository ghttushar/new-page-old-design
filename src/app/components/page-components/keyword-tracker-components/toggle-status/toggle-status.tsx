import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AntSwitch } from 'src/app/components/common/ant-switch/ant-switch';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { marketplaceOptions } from 'src/constants/market-intelligence.constants';
import { QueryKeyEnums } from 'src/enums/query.enums';
import { IChannel, ISerpKeyword } from 'src/interfaces/serp.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { useAppMutation } from 'src/redux/react-query-hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import KeywordTrackerService from 'src/services/market-intelligence/keyword-tracker.service';
import ActionConfirmationPopup from '../confirmation-pop-up/action-confirmation-popup';
import styles from './toggle-status.module.scss';

interface IToggleStatusProps {
  rowData: ISerpKeyword;
}

const formattedChannelOptions = marketplaceOptions.map((option) => ({
  ...option,
  selected: true,
}));

export default function ToggleStatus({ rowData }: IToggleStatusProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const confirmationPopUpRef = useRef<HTMLDivElement | null>(null);

  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [channelOptions, setChannelOptions] = useState<IDropdownItem<string>[]>(
    formattedChannelOptions
  );
  const [status, setStatus] = useState<boolean | null>(null);

  useEffect(() => {
    setStatus(null);
    let _status = true;
    rowData?.channels.forEach((channel) => {
      _status = _status && channel.isActive;
    });

    setStatus(_status);
  }, [rowData]);

  const { mutateAsync: updateKeywordMutate, isPending: isUpdatePending } =
    useAppMutation({
      mutationFn: (payload: ISerpKeyword) =>
        KeywordTrackerService.updateKeyword(payload),
      options: {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.KEYWORD_TRACKER_FETCH],
          });

          dispatch(
            showSuccessToastMessage({
              title: data.data.message,
              description: data.data.description,
            })
          );
        },
      },
    });

  const handleStatusChange = () => {
    return setOpenConfirmation(!openConfirmation);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedChannelOptions = channelOptions.map((option) => ({
      ...option,
      selected:
        option.value === event.target.name ? !option.selected : option.selected,
    }));

    setChannelOptions(updatedChannelOptions);
  };

  const toggleStatus = async () => {
    let updatedChannels: IChannel[] = [];
    const channels = rowData?.channels;

    if (channels.length <= 1) {
      updatedChannels = channels.map((channel) => {
        return {
          ...channel,
          isActive: !channel.isActive,
        };
      });
    } else {
      const selectedCount = channelOptions.filter(
        (option) => option.selected === true
      );

      if (selectedCount.length <= 0) {
        updatedChannels = channels;
      } else {
        updatedChannels = channels.map((channel) => {
          const targetChannel = channelOptions.find(
            (option) =>
              option.value === channel.channel && option.selected === true
          );

          if (targetChannel)
            return {
              ...channel,
              isActive: !channel.isActive,
            };

          return channel;
        });
      }
    }

    const payload: ISerpKeyword = {
      _id: rowData?._id,
      keyword: rowData?.keyword,
      channels: updatedChannels,
    };

    await updateKeywordMutate(payload);
    cancelConfirmation();
  };

  const cancelConfirmation = () => {
    setOpenConfirmation(false);
    setChannelOptions(formattedChannelOptions);
  };

  const isChangeButtonDisabled = useMemo(() => {
    return (
      isUpdatePending ||
      (rowData?.channels.length > 1 &&
        channelOptions.find((channel) => channel.selected === true) ===
          undefined)
    );
  }, [channelOptions, isUpdatePending, rowData?.channels.length]);

  return (
    <div
      ref={confirmationPopUpRef}
      className={styles.statusButton}
      data-test="toggle-status"
    >
      <Popover open={openConfirmation} onOpenChange={cancelConfirmation}>
        <PopoverTrigger>
          {status !== null && (
            <AntSwitch
              disabled={false}
              checked={status}
              onChange={handleStatusChange}
              inputProps={{ 'aria-label': 'ant design' }}
              sx={{
                '&:hover': { cursor: 'not-allowed' },
              }}
            />
          )}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          style={{
            zIndex: '99999',
            width: '30rem',
          }}
        >
          <ActionConfirmationPopup
            rowChannelCount={rowData?.channels?.length}
            channelOptions={channelOptions}
            handleOptionSelect={handleSelect}
            handleCancelConfirmation={cancelConfirmation}
            handleConfirmationAction={toggleStatus}
            isActionDisabled={isChangeButtonDisabled}
            actionButtonText="Change"
            confirmationDescription="Are you sure you want to change the status?"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
