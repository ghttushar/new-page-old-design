import { MarketplaceEnum } from '@/enums/serp.enums';
import { useEffect, useState } from 'react';
import {
  KeywordActionActionType,
  KeywordActionPriority,
  KeywordActionTabsEnum,
} from 'src/enums/keyword-action.enums';
import { KEYWORD_ACTIONS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { IKeywordActionFilterForm } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import InfoIcon from '../info-icon/info-icon';
import styles from './filter.module.scss';

const selectedTabStyle = {
  borderBottom: '0.19rem solid #77469b',
  color: '#77469b',
  padding: '0 0 0.6rem 0',
};

const fontWeightStyles = {
  fontWeight: 700,
};

interface KeywordActionTableFilterProps {
  activeTab: KeywordActionPriority;
  actionTypeFilters: IKeywordActionFilterForm;
  selectedTab: KeywordActionTabsEnum;
}

export const KeywordActionTableFilter = (
  props: KeywordActionTableFilterProps
) => {
  const { activeTab, actionTypeFilters, selectedTab } = props;
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount;

  const KEYWORD_ADDITION_TAB =
    marketplace.marketplace === MarketplaceEnum.AMAZON
      ? KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON
      : KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART;

  const handleClick = (tab: KeywordActionPriority, isDisabled?: boolean) => {
    if (isDisabled) return;
  };

  useEffect(() => {
    if (
      actionTypeFilters.actionType.value ===
        KeywordActionActionType.MANUAL_TO_MANUAL &&
      selectedTab === KEYWORD_ADDITION_TAB
    ) {
      setIsDisabled(true);
    } else if (selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [selectedTab, actionTypeFilters.actionType.value]);

  return (
    <div className={styles.filterTableContainer}>
      <div
        className={
          selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
            ? styles.disabledPriorityTab
            : styles.priorityTab
        }
        id={KeywordActionPriority.HIGH}
        onClick={() => handleClick(KeywordActionPriority.HIGH)}
        style={
          activeTab === KeywordActionPriority.HIGH &&
          selectedTab !== KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
            ? selectedTabStyle
            : { padding: '0 0 0.6rem 0' }
        }
      >
        <h4
          style={
            activeTab === KeywordActionPriority.HIGH &&
            selectedTab !== KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
              ? fontWeightStyles
              : {}
          }
        >
          High Priority
        </h4>
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.HIGH_PRIORITY} />
      </div>
      <div
        className={isDisabled ? styles.disabledPriorityTab : styles.priorityTab}
        id={KeywordActionPriority.MEDIUM}
        onClick={() => handleClick(KeywordActionPriority.MEDIUM, isDisabled)}
        style={
          activeTab === KeywordActionPriority.MEDIUM &&
          selectedTab !== KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
            ? selectedTabStyle
            : { padding: '0 0 0.6rem 0' }
        }
      >
        <h4
          style={
            activeTab === KeywordActionPriority.MEDIUM &&
            selectedTab !== KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
              ? fontWeightStyles
              : {}
          }
        >
          Medium Priority
        </h4>
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.MEDIUM_PRIORITY} />
      </div>
      <div
        className={isDisabled ? styles.disabledPriorityTab : styles.priorityTab}
        id={KeywordActionPriority.LOW}
        onClick={() => handleClick(KeywordActionPriority.LOW, isDisabled)}
        style={
          activeTab === KeywordActionPriority.LOW &&
          selectedTab !== KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
            ? selectedTabStyle
            : { padding: '0 0 0.6rem 0' }
        }
      >
        <h4
          style={
            activeTab === KeywordActionPriority.LOW &&
            selectedTab !== KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
              ? fontWeightStyles
              : {}
          }
        >
          Low Priority
        </h4>
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.LOW_PRIORITY} />
      </div>
    </div>
  );
};
