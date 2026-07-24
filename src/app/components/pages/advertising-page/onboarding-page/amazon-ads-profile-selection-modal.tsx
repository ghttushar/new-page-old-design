import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import TextButton from '@/app/components/common/text-button/text-button';
import { searchFieldStyles } from '@/app/components/page-components/advertising-create-dialogs/advertising-create-dialogs-styles';
import { IAdvertisingProfiles } from '@/interfaces/onboarding.interface';
import { Dialog, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import styles from './amazon-ads-profiles-selection.module.scss';

interface IAmazonAdsProfileSelectionModalProps {
  amazonProfiles: IAdvertisingProfiles[];
  setAmazonProfiles: (amazonAdsProfiles: IAdvertisingProfiles[]) => void;
  isOpen: boolean;
  onComplete: () => void;
  handleModalClose: () => void;
}

export default function SelectAmazonAdsProfiles({
  amazonProfiles,
  setAmazonProfiles,
  onComplete,
  handleModalClose,
  isOpen,
}: IAmazonAdsProfileSelectionModalProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedProfileIds, setSelectedProfileIds] = useState<Set<string>>(
    new Set()
  );

  const profilesOptions: IDropdownItem<string>[] = useMemo(
    () =>
      amazonProfiles.map((profile) => ({
        label: profile.accountInfo.name,
        value: String(profile.profileId),
        tooltipText: profile.countryCode,
      })),
    [amazonProfiles]
  );

  const filteredProfiles = useMemo(() => {
    if (!searchText) return profilesOptions;
    const searchLower = searchText.toLowerCase();
    return profilesOptions.filter(
      (profile) =>
        profile.label.toLowerCase().includes(searchLower) ||
        profile.value.includes(searchText)
    );
  }, [profilesOptions, searchText]);

  const textButtonStyles = {
    color: '#969696',
    fontWeight: '400',
    width: 'auto',
    fontSize: '1.2rem',
  };

  const handleClick = useCallback((value: string) => {
    setSelectedProfileIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    []
  );

  const handleSelectClearAll = useCallback(
    (selectAll: boolean) => {
      setSelectedProfileIds((prev) => {
        const newSet = new Set(prev);
        filteredProfiles.forEach((profile) => {
          selectAll ? newSet.add(profile.value) : newSet.delete(profile.value);
        });
        return newSet;
      });
    },
    [filteredProfiles]
  );

  const handleSubmit = useCallback(() => {
    const selectedProfiles = amazonProfiles.filter((profile) =>
      selectedProfileIds.has(String(profile.profileId))
    );
    setAmazonProfiles(selectedProfiles);

    if (selectedProfileIds.size > 0) {
      setTimeout(onComplete, 500);
    }
  }, [amazonProfiles, selectedProfileIds]);

  return (
    <Dialog
      open={isOpen}
      sx={{
        '& .MuiPaper-root': {
          padding: '1rem',
          display: 'flex',
          alignItems: 'end',
        },
      }}
    >
      <span className={styles.headerContainer}>
        Select an account to connect
        <span className={styles.subText}>
          You can add more than one account here
        </span>
      </span>
      <div className={styles.searchContainer}>
        <TextField
          value={searchText}
          placeholder="Search by name,profileId"
          onChange={handleChange}
          sx={searchFieldStyles}
        />

        <div className={styles.buttonContainer}>
          <TextButton
            label={'Clear All'}
            handleClick={() => handleSelectClearAll(false)}
            customStyles={textButtonStyles}
            isDisabled={selectedProfileIds.size === 0}
            disableReason="No Profiles Selected"
          />
          <span className={styles.divider}></span>
          <TextButton
            label={'Select All'}
            handleClick={() => handleSelectClearAll(true)}
            customStyles={textButtonStyles}
            isDisabled={selectedProfileIds.size === profilesOptions.length}
            disableReason="Selected All Profiles"
          />
        </div>
      </div>
      <div className={styles.container}>
        {filteredProfiles.map((profile) => (
          <div
            key={profile.value}
            className={`${styles.profileContainer} ${
              selectedProfileIds.has(profile.value) ? styles.selected : ''
            }`}
            onClick={() => handleClick(profile.value)}
          >
            <span className={styles.profileName}>{profile.label}</span>
            <span
              className={`${styles.subText} ${
                selectedProfileIds.has(profile.value) ? styles.selected : ''
              }`}
            >
              <span>{profile.value}</span>
              {profile.tooltipText}
            </span>
          </div>
        ))}
      </div>
      <span className={styles.buttonContainer}>
        <SecondaryButton
          buttonText={'Cancel'}
          buttonFunction={handleModalClose}
          disabled={false}
          width="100%"
          height="3rem"
        />
        <PrimaryButton
          buttonText={'Connect'}
          buttonFunction={handleSubmit}
          disabled={selectedProfileIds.size === 0}
          width="100%"
          height="3rem"
        />
      </span>
    </Dialog>
  );
}
