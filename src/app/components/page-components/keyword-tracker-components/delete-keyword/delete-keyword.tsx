import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MarketplaceEnum } from '@/enums/serp.enums';
import IconButton from '@mui/material/IconButton';
import { TrashIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useRef, useState } from 'react';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { marketplaceOptions } from 'src/constants/market-intelligence.constants';
import { QueryKeyEnums } from 'src/enums/query.enums';
import { IDeleteKeyword } from 'src/interfaces/keyword-tracker.interfaces';
import { ISerpKeyword } from 'src/interfaces/serp.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { useAppMutation } from 'src/redux/react-query-hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import KeywordTrackerService from 'src/services/market-intelligence/keyword-tracker.service';
import ActionConfirmationPopup from '../confirmation-pop-up/action-confirmation-popup';
import styles from './delete-keyword.module.scss';

interface IToggleStatusProps {
  rowData: ISerpKeyword;
  countryCode?: string;
}

const formattedChannelOptions = marketplaceOptions.map((option) => ({
  ...option,
  selected: true,
}));

export default function DeleteKeyword({
  rowData,
  countryCode,
}: IToggleStatusProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const confirmationPopUpRef = useRef<HTMLDivElement | null>(null);

  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [channelOptions, setChannelOptions] = useState<IDropdownItem<string>[]>(
    formattedChannelOptions
  );

  const handleDelete = () => {
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

  const { mutateAsync: deleteKeywordMutate, isPending: isDeletePending } =
    useAppMutation({
      mutationFn: ({ id, payload }: { id: string; payload: IDeleteKeyword }) =>
        KeywordTrackerService.deleteKeyword(id, payload),
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

  const deleteKeyword = async () => {
    let updatedChannels: string[] = [];
    const channels = rowData?.channels;

    if (channels.length <= 1) {
      updatedChannels = channels.map((channel) => channel.channel);
    } else {
      const selectedChannels = channelOptions.filter(
        (option) =>
          option.selected === true && option.value !== MarketplaceEnum.All
      );

      if (selectedChannels.length <= 0) {
        updatedChannels = [];
      } else {
        updatedChannels = selectedChannels.map((channel) => channel.value);
      }
    }

    const payload: IDeleteKeyword = {
      channelsToDeleteFrom: updatedChannels,
      countryCode,
    };

    await deleteKeywordMutate({ id: rowData?._id ?? '', payload });
    cancelConfirmation();
  };

  const cancelConfirmation = () => {
    setOpenConfirmation(false);
    setChannelOptions(formattedChannelOptions);
  };

  const isDeleteButtonDisabled = useMemo(() => {
    return (
      isDeletePending ||
      (rowData?.channels.length > 1 &&
        channelOptions.find((channel) => channel.selected === true) ===
          undefined)
    );
  }, [channelOptions, isDeletePending, rowData?.channels.length]);

  return (
    <div
      ref={confirmationPopUpRef}
      className={styles.deleteButton}
      data-test="delete-keyword"
    >
      <Popover
        open={openConfirmation}
        onOpenChange={() => setOpenConfirmation(!openConfirmation)}
      >
        <PopoverTrigger onClick={handleDelete}>
          <IconButton disableRipple>
            <TrashIcon size={20} color="#ff0000" weight="bold" />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={0}
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
            handleConfirmationAction={deleteKeyword}
            isActionDisabled={isDeleteButtonDisabled}
            actionButtonText="Delete"
            confirmationDescription="Are you sure you want to delete the keyword?"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
