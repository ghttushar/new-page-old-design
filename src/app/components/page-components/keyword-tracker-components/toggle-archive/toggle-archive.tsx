import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ArchiveBoxIcon } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import AltPrimaryButton from 'src/app/components/common/alt-primary-button/alt-primary-button';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import { marketplaceOptions } from 'src/constants/market-intelligence.constants';
import { IChannel } from 'src/interfaces/serp.interface';
import {
  checkboxStyles,
  formControlLabelStyles,
} from './toggle-archive-styles';
import styles from './toggle-archive.module.scss';

interface IToggleArchiveProps {
  currChannels: IChannel[];
  onClick: (updatedChannels: IChannel[]) => void;
  isUnarchive?: boolean;
}

export function ToggleArchive(props: IToggleArchiveProps) {
  const { currChannels, onClick, isUnarchive = false } = props;

  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [channelOptions, setChannelOptions] =
    useState<IDropdownItem<string>[]>(marketplaceOptions);

  const confirmationPopUpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickedOutside = (event: MouseEvent) => {
      if (
        confirmationPopUpRef.current &&
        !confirmationPopUpRef.current.contains(event.target as Node)
      ) {
        cancelConfirmation();
      }
    };

    document.body.addEventListener('click', handleClickedOutside);

    return () => {
      document.body.removeEventListener('click', handleClickedOutside);
    };
  }, []);

  const handleToggleArchiveChange = () => {
    return setOpenConfirmation(!openConfirmation);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedOptions = channelOptions.map((option) => ({
      ...option,
      selected:
        option.value === event.target.name ? !option.selected : option.selected,
    }));

    setChannelOptions(updatedOptions);
  };

  const toggleArchive = () => {
    const channels = currChannels;
    const selectedCount = channelOptions.filter(
      (option) => option.selected === true
    );
    let updatedChannels: IChannel[] = [];

    if (selectedCount.length === 0) {
      updatedChannels = channels.map((channel) => {
        return {
          ...channel,
          isArchived: !channel.isArchived,
        };
      });
    } else {
      updatedChannels = channels.map((channel) => {
        const targetChannel = channelOptions.find(
          (option) => option.value === channel.channel
        );

        if (!targetChannel?.selected) return channel;

        return {
          ...channel,
          isArchived: !channel.isArchived,
        };
      });
    }

    onClick(updatedChannels);
    cancelConfirmation();
  };

  const cancelConfirmation = () => {
    setOpenConfirmation(false);
    setChannelOptions(marketplaceOptions);
  };

  return (
    <div ref={confirmationPopUpRef}>
      <IconButton
        size="small"
        onClick={handleToggleArchiveChange}
        className={styles.archiveButton}
      >
        <ArchiveBoxIcon size={20} color="#77469b" />
      </IconButton>

      {openConfirmation === true && (
        <div className={styles.archiveConfirmation}>
          <Typography variant="h4" fontSize="1.4rem" fontWeight={700}>
            Confirmation
          </Typography>
          <Typography
            variant="body1"
            fontSize="1.2rem"
            fontWeight={400}
            sx={{ mt: 1 }}
          >
            {isUnarchive
              ? 'Are you sure you want to unarchive the keyword?'
              : 'Are you sure you want to archive the keyword?'}
          </Typography>

          <FormGroup
            className={styles.optionContainer}
            sx={{
              display: 'flex',
              flexDirection: 'row !important',
            }}
          >
            {currChannels.length > 1 &&
              channelOptions.length > 0 &&
              channelOptions.map((option, index) => (
                <FormControlLabel
                  key={`${option.value}-${index}`}
                  control={
                    <Checkbox
                      checked={option.selected}
                      onChange={handleSelect}
                      name={option.value}
                      sx={checkboxStyles}
                    />
                  }
                  label={option.label}
                  className={styles.option}
                  sx={formControlLabelStyles}
                />
              ))}
          </FormGroup>

          <div className={styles.buttonContainer}>
            <AltPrimaryButton
              buttonText="Cancel"
              buttonFunction={cancelConfirmation}
              disabled={false}
              height="2.3rem"
            />
            <PrimaryButton
              buttonText={isUnarchive ? 'Unarchive' : 'Archive'}
              buttonFunction={toggleArchive}
              disabled={false}
              height="2.3rem"
              fontSize="1rem"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ToggleArchive;
