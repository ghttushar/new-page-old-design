import { DISABLED_FEATURE_REASON } from '@/constants/feature-flag/feature-flag.constants';
import { SETTINGS_HOME_PAGE_URL } from '@/constants/urls.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import { DropdownLabelEnum } from '@/enums/index.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  selectIsChatbotExpanded,
  selectIsChatbotOpen,
  setIsChatbotExpanded,
  setIsChatbotOpen,
  setIsSidebarMenuOpen,
} from '@/redux/slices/auth/auth.slice';
import { checkIsPageInBeta, getTitleCaseString } from '@/utils';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { ArrowLineLeftIcon } from '@phosphor-icons/react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import ChatbotWrapper from '../../page-components/chatbot-page/chatbot-wrapper';
import CustomDateRangePickerWrapper from '../../shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import CustomBadge from '../custom-badge/custom-badge';
import Dropdown, { IDropdownItem } from '../dropdown/dropdown';
import SearchableDropdown from '../dropdown/searchable-dropdown';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import InfoIcon from '../info-icon/info-icon';
import SecondaryButton from '../secondary-button/secondary-button';
import Header from './../../layout/header/header';
import styles from './sub-header.module.scss';

export interface ISubHeaderDataItem {
  selectedItem: IDropdownItem<string>;
  setSelectedItem: (value: IDropdownItem<string>) => void;
  label: string;
  options: IDropdownItem<string>[];
  previousRangeState?: IDropdownItem<string> | null;
  fallbackRangeState?: IDropdownItem<string>;
  customDateRange?: IDateRange;
  showDateRangeModal?: boolean;
  setShowDateRangeModal?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetCustomDateRangeForModal?: (dateRange: IDateRange) => void;
  prefixElement?: JSX.Element;
  flagElement?: JSX.Element;
  disabled?: boolean;
  timeZone?: TimezoneEnum;
}
export interface ISubHeaderProps {
  title: string;
  titleTooltip: string;
  isDropdownRequired?: boolean;
  dropdownOptions: ISubHeaderDataItem[];
  height?: string;
  subTitle?: string | null;
  isSettingsPage?: boolean;
  goBackButton?: boolean;
  defaultPreset?: IDropdownItem<string>;
  selectedCustomDateRange?: IDateRange;
  backgroundColor?: string;
}

export default function SubHeader(props: ISubHeaderProps) {
  const {
    title,
    titleTooltip,
    isDropdownRequired = false,
    dropdownOptions,
    height,
    goBackButton = false,
    defaultPreset,
    selectedCustomDateRange,
    backgroundColor = '#f3f5fa',
  } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const isChatbotExpanded = useAppSelector(selectIsChatbotExpanded);

  const onGoBackClick = () => navigate(SETTINGS_HOME_PAGE_URL);

  const toggleChatbot = () => {
    dispatch(setIsSidebarMenuOpen(false));
    dispatch(setIsChatbotExpanded(false));
    dispatch(setIsChatbotOpen(!isChatbotOpen));
  };

  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const isFixedMode = chatbotUtils.isChatbotFixedMode(location.pathname);
  const isJiVAPage = chatbotUtils.isOnJIVAPage(location.pathname);

  const isJIVADisabled =
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.JIVA_CHATBOT
    ) || isFixedMode;

  return (
    <div
      className={styles.subHeader}
      style={{
        marginTop: '-0.2rem',
        height: height ? height : 'auto',
        width:
          isChatbotOpen && !isChatbotExpanded && !isJiVAPage
            ? 'calc(100% - 36rem)'
            : '100%',
        transition: 'width 0.2s ease-in',
        backgroundColor,
      }}
      data-test="sub-header"
    >
      <div className={styles.subHeaderContent}>
        {goBackButton === true && (
          <SecondaryButton
            buttonText={'Go Back'}
            buttonFunction={onGoBackClick}
            disabled={false}
            buttonIcon={<ArrowLineLeftIcon size={'1.5rem'} color="#464646" />}
            isButtonIconRequired={true}
            width="max-content"
          />
        )}
        <div data-test={`page-name`} className={styles.subHeaderTitle}>
          {!goBackButton && (
            <span className="flex">
              <CustomBadge
                badgeContent={'Beta'}
                invisible={checkIsPageInBeta(title) === false}
                customBadgeStyles={{
                  width: 'fit-content',
                  right: '1.5rem',
                  padding: '0.4rem',
                }}
              >
                {title}
              </CustomBadge>
              {title ? (
                <InfoIcon
                  title={titleTooltip || title}
                  position={TooltipPlacement.Right}
                  customIconStyles={{
                    height: 'auto',
                    width: '1.6rem',
                  }}
                />
              ) : null}
            </span>
          )}

          <span className={styles.subHeaderSubTitle}>{props.subTitle}</span>
          {/* <PageDisclaimer pageTitle={title as PageTitleEnum} /> */}
        </div>

        <div className={styles.subHeaderFilter}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '0.8rem',
            }}
          >
            {isDropdownRequired === true
              ? dropdownOptions.map((item, index) => {
                  if (
                    item.label === DropdownLabelEnum.DATE_RANGE &&
                    item.handleSetCustomDateRangeForModal
                  ) {
                    return (
                      <CustomDateRangePickerWrapper
                        key={`${item.label}-${index}`}
                        title={'Date Range'}
                        handleDateChange={item.setSelectedItem}
                        setCustomDateRange={
                          item.handleSetCustomDateRangeForModal
                        }
                        rangeOptions={item.options}
                        dropShadow={true}
                        height="3.2rem"
                        defaultPreset={defaultPreset}
                        selectedCustomDateRange={selectedCustomDateRange}
                        timeZone={item.timeZone}
                      />
                    );
                  }
                  if (item.label === DropdownLabelEnum.REGION) {
                    return (
                      <SearchableDropdown
                        key={`${item.label}-${index}`}
                        options={item.options}
                        label={item.label}
                        selected={item.selectedItem}
                        onSelect={item.setSelectedItem}
                        isDisabled={item.disabled}
                        width="24rem"
                        dropShadow={true}
                      />
                    );
                  }
                  return (
                    <SubHeaderDropdown
                      key={`${item.label}-${index}`}
                      item={item}
                    />
                  );
                })
              : null}

            <HoverInfoTooltip
              title={DISABLED_FEATURE_REASON[FeaturesEnum.JIVA_CHATBOT]}
            >
              <div
                style={{
                  opacity: isJIVADisabled ? 0.5 : 1,
                }}
              >
                <ChatbotWrapper
                  toggleChatbot={toggleChatbot}
                  isDisabled={isJIVADisabled}
                />
              </div>
            </HoverInfoTooltip>

            <Header />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ISubHeaderDropdownProps {
  item: ISubHeaderDataItem;
}
const SubHeaderDropdown = (props: ISubHeaderDropdownProps) => {
  const { item } = props;

  const onSelectWrapper = (value: IDropdownItem<string>) => {
    item.setSelectedItem(value);
  };

  return (
    <div
      data-test={`marketplace-header-${item.label}`}
      className={styles.singleDropdown}
    >
      <Dropdown
        label={getTitleCaseString(item.label)}
        options={item.options}
        selected={item.selectedItem}
        onSelect={onSelectWrapper}
        width={item.label === DropdownLabelEnum.AD_TYPE ? '16rem' : '24rem'}
        height="3.2rem"
        customDateRange={
          item.customDateRange &&
          item.customDateRange.startDate &&
          item.customDateRange.endDate
            ? item.customDateRange
            : {
                startDate: '',
                endDate: '',
              }
        }
        prefixElement={item.prefixElement}
        flagElement={item.flagElement}
        dropShadow={true}
        disabled={item.disabled}
      />
    </div>
  );
};
