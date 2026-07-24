import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ALL_VALUE } from '@/constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IDaypartingCampaignList,
  IDaypartingJob,
  IWalmartDaypartingJob,
} from '@/interfaces/day-parting.interfaces';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CircleIcon, ClockCountdownIcon } from '@phosphor-icons/react';
import { Popover } from '@radix-ui/react-popover';
import { useCallback, useMemo, useState } from 'react';
import { IMultiSelectCustomDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { checkIsAllDropdownItemSelected } from 'src/utils/dropdown.utils';
import DayPartingCampaignDetails from '../../page-components/day-parting-components/walmart/day-parting-campaign-details/day-parting-camp-detail';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import SecondaryButton from '../secondary-button/secondary-button';
import {
  checkboxStyles,
  formControlLabelStyles,
  textFieldStyles,
} from './multiselect-custom-option-box-styles';
import styles from './multiselect-custom-option-box.module.scss';

interface MultiselectDropdownContentProps {
  options: IMultiSelectCustomDropdownItem[];
  onSelect: (selectedOptions: IMultiSelectCustomDropdownItem[]) => void;
  width?: string;
  isHorizontalScroll?: boolean;
  emptyOptionListMessage: string;
  campaigns?: IDaypartingCampaignList[];
  handleEditRuleClick?: (job: IWalmartDaypartingJob | IDaypartingJob) => void;
  isModal?: boolean;
}

interface DayPartingDetailsPopupProps {
  option: IMultiSelectCustomDropdownItem;
  activeIndex: string;
  onMouseEnter: (index: string) => void;
  onMouseLeave: () => void;
  getSelectedCampaignsInfo: (
    campaignId: string
  ) => IDaypartingCampaignList | null | undefined;
  handleEditRuleClick?: (job: IWalmartDaypartingJob | IDaypartingJob) => void;
}
function DayPartingDetailsPopup({
  option,
  activeIndex,
  onMouseEnter,
  onMouseLeave,
  getSelectedCampaignsInfo,
  handleEditRuleClick,
}: DayPartingDetailsPopupProps) {
  const campaignData = useMemo(
    () => getSelectedCampaignsInfo(option.value),
    [getSelectedCampaignsInfo, option.value]
  );

  const isPopoverOpen = useMemo(
    () => option.value === activeIndex,
    [option.value, activeIndex]
  );

  const handleEditClick = () => {
    if (campaignData && handleEditRuleClick && campaignData.associatedJobs[0]) {
      handleEditRuleClick(campaignData.associatedJobs[0]);
    } else return;
  };

  if (!option.isDayParting) {
    return null;
  }

  return (
    <Popover open={isPopoverOpen}>
      <PopoverTrigger
        asChild={true}
        style={{
          cursor: 'pointer',
        }}
        onMouseEnter={() => onMouseEnter(option.value)}
        onMouseLeave={onMouseLeave}
      >
        <ClockCountdownIcon size={'1.4rem'} />
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={() => onMouseEnter(option.value)}
        onMouseLeave={onMouseLeave}
        sticky="partial"
        align="end"
        side="right"
        sideOffset={-1}
        style={{
          zIndex: '1000',
          borderRadius: '0.8rem',
          border: 'none',
          width: '30rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.6rem 1rem',
        }}
      >
        <DayPartingCampaignDetails campaign={campaignData} />
        <SecondaryButton
          buttonText={'Edit Dayparting Rule'}
          buttonFunction={handleEditClick}
          hoverColor="#77469b"
          disabled={false}
          fontSize={'1rem'}
        />
      </PopoverContent>
    </Popover>
  );
}

export default function MultiselectDropdownContent({
  options,
  onSelect,
  width,
  isHorizontalScroll = true,
  emptyOptionListMessage,
  campaigns,
  handleEditRuleClick,
  isModal = false,
}: MultiselectDropdownContentProps) {
  const [activeIndex, setActiveIndex] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showActiveCamp, setShowActiveCamp] = useState(false);
  const [showDayPartingCamp, setShowDayPartingCamp] = useState(false);

  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    handleMouseLeave();
    setIsScrolling(true);

    setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  const handleMouseEnter = (index: string) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex('');
  };

  const getSelectedCampaignsInfo = useCallback(
    (campaignId: string) => {
      if (!campaigns || activeIndex !== campaignId) return null;
      let campaignData: any;
      for (const element of campaigns) {
        if (element.campaignId === campaignId) {
          campaignData = element;
          break;
        }
      }
      if (campaignData) return campaignData as IDaypartingCampaignList;
    },
    [activeIndex, campaigns]
  );

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

  const applyFilters = useCallback(
    (optionsToFilter: IMultiSelectCustomDropdownItem[]) => {
      let filtered = optionsToFilter;

      if (showActiveCamp) {
        filtered = filtered.filter((option) => {
          if (option.value === ALL_VALUE) return true;
          return option.isActive;
        });
      }

      if (showDayPartingCamp) {
        filtered = filtered.filter((option) => {
          if (option.value === ALL_VALUE) return true;
          return option.isDayParting;
        });
      }

      if (searchText.trim() !== '') {
        filtered = filtered.filter((option) => {
          if (option.value === ALL_VALUE) return true;
          return option.label?.toLowerCase().includes(searchText.toLowerCase());
        });
      }

      return filtered;
    },
    [showActiveCamp, showDayPartingCamp, searchText]
  );

  const handleClear = () => {
    const updatedOptions = options.map((option) => ({
      ...option,
      selected: false,
    }));

    onSelect(updatedOptions);
  };

  const handleActiveCampChange = (checked: boolean) => {
    setShowActiveCamp(checked);
  };

  const handleDayPartingCampChange = (checked: boolean) => {
    setShowDayPartingCamp(checked);
  };

  const searchedOptions = useMemo(() => {
    const filtered = applyFilters(options);
    const nonAllOptions = filtered.filter(
      (option) => option.value !== ALL_VALUE
    );

    if (nonAllOptions.length === 0) {
      return [];
    }

    return filtered;
  }, [options, applyFilters]);

  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (
        event.target.name === '' ||
        event.target.name === MarketplaceEnum.All
      ) {
        const currentValue = searchedOptions[0];
        const shouldSelectAll = !currentValue.selected;
        const visibleOptionValues = new Set(
          searchedOptions.map((option) => option.value)
        );

        const updatedOptions = options.map((option) => {
          if (visibleOptionValues.has(option.value)) {
            return {
              ...option,
              selected: shouldSelectAll,
            };
          }
          return option;
        });

        onSelect(updatedOptions);
      } else {
        const updatedOptions = options.map((option) => ({
          ...option,
          selected:
            option.value === event.target.name
              ? !option.selected
              : option.selected,
        }));

        const filteredUpdatedOptions = applyFilters(updatedOptions);
        updatedOptions[0].selected = checkIsAllDropdownItemSelected(
          filteredUpdatedOptions
        );

        onSelect(updatedOptions);
      }
    },
    [options, searchedOptions, applyFilters, onSelect]
  );

  const selected = useMemo(
    () => searchedOptions.slice(1).filter((option) => option.selected).length,
    [searchedOptions]
  );

  const selectedCount = useMemo(
    () => (selected > 9 || selected === 0 ? selected : `0${selected}`),
    [selected]
  );

  const isAllSelected = useMemo(
    () => checkIsAllDropdownItemSelected(applyFilters(options)),
    [applyFilters, options]
  );

  return (
    <div className={styles.optionBoxContainer}>
      <div
        className={styles.optionBox}
        style={{
          position: isModal ? 'inherit' : 'absolute',
        }}
      >
        <div className={styles.searchContainer}>
          <TextField
            value={searchText}
            id="search"
            variant="outlined"
            type="text"
            placeholder="Search..."
            autoFocus
            sx={textFieldStyles}
            onChange={handleSearchTextChange}
          />
        </div>

        <div
          className={styles.optionBoxButtonContainer}
          style={{
            width: width || '60rem',
            justifyContent: 'start',
            alignItems: 'center',
            display: 'flex',
            gap: '1.6rem',
          }}
        >
          <Typography fontSize="1.2rem" fontWeight={600} minWidth={'8.6rem'}>
            {isAllSelected ? (
              'All'
            ) : (
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '144%',
                  letterSpacing: 0,
                  color: '#464646',
                }}
              >
                <span
                  style={{
                    color: '#77469b',
                    fontWeight: '700',
                  }}
                >
                  {selectedCount}
                </span>{' '}
                of{' '}
                {searchedOptions.slice(1).length > 0
                  ? searchedOptions.slice(1).length
                  : 0}{' '}
                Selected
              </span>
            )}
          </Typography>

          <SecondaryButton
            buttonText={'Clear All'}
            height="2.2rem"
            width="6rem"
            fontSize="1rem"
            buttonFunction={handleClear}
            disabled={selected === 0}
            borderRadius="1.2rem"
            stopPropagation={true}
          />

          <span className={styles.vl}></span>

          <div style={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyles}
                  checked={showActiveCamp}
                  onChange={(e) => handleActiveCampChange(e.target.checked)}
                />
              }
              label={'Active Campaign'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  sx={checkboxStyles}
                  checked={showDayPartingCamp}
                  onChange={(e) => handleDayPartingCampChange(e.target.checked)}
                />
              }
              label={'Dayparting'}
            />
          </div>
        </div>

        <FormGroup
          className={
            isHorizontalScroll
              ? styles.optionBoxOptionsContainerHorizontal
              : styles.optionBoxOptionsContainerVertical
          }
          onScroll={handleScroll}
          sx={
            isHorizontalScroll
              ? {}
              : {
                  flexWrap: 'nowrap',
                  paddingLeft: '1.8rem',
                  marginLeft: '-3rem !important',
                }
          }
        >
          {searchedOptions.length > 0 ? (
            searchedOptions.map((option) =>
              option.value === ALL_VALUE ? (
                <div key={option.value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={option.selected || isAllSelected}
                        indeterminate={
                          selected > 0 && selected < searchedOptions.length - 1
                        }
                        indeterminateIcon={
                          <IndeterminateCheckBoxIcon
                            style={{
                              color: '#77469b',
                            }}
                          />
                        }
                        onChange={handleSelect}
                        name={option.value}
                        sx={checkboxStyles}
                      />
                    }
                    label={option.label}
                    className={styles.optionBoxOption}
                    sx={formControlLabelStyles(false)}
                  />
                </div>
              ) : (
                <div
                  key={option.value}
                  style={{
                    display: 'flex',
                    width: 'fit-content',
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={option.selected}
                        onChange={handleSelect}
                        name={option.value}
                        sx={checkboxStyles}
                      />
                    }
                    label={option.label}
                    className={styles.optionBoxOption}
                    sx={formControlLabelStyles(false)}
                  />
                  <span
                    style={{
                      display: 'flex',
                      gap: '0.4rem',
                    }}
                  >
                    <DayPartingDetailsPopup
                      option={option}
                      activeIndex={activeIndex}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      getSelectedCampaignsInfo={getSelectedCampaignsInfo}
                      handleEditRuleClick={handleEditRuleClick}
                    />

                    {option.isActive && (
                      <HoverInfoTooltip
                        title={'Active Campaign'}
                        disableTooltip={isScrolling}
                      >
                        <CircleIcon
                          color="#96DD27"
                          weight="fill"
                          size={'1.4rem'}
                        />
                      </HoverInfoTooltip>
                    )}
                  </span>
                </div>
              )
            )
          ) : (
            <Typography fontSize="1.2rem" fontWeight={600} color="#171717">
              {emptyOptionListMessage}
            </Typography>
          )}
        </FormGroup>
      </div>
    </div>
  );
}
