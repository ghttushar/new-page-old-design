import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  selectAppliedKeywordNegationFilters,
  setKeywordNegationFilters,
} from '@/redux/slices/keyword-action/amazon/keyword-action-negation.slice';
import {
  selectAppliedProductActionFilters,
  setProductActionFilters,
} from '@/redux/slices/keyword-action/amazon/product-action.slice';
import {
  selectAppliedProductNegationFilters,
  setProductNegationFilters,
} from '@/redux/slices/keyword-action/amazon/product-negation.slice';
import React, { useEffect } from 'react';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { setAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import {
  selectAppliedKeywordActionFilters,
  setBidErrorMessage,
  setKeywordActionFilters,
  setKeywordActionSelectedRowIds,
  setSelectedTab,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  setWalmartBidErrorMessage,
  setWalmartKeywordActionSelectedRowIds,
  setWalmartSelectedTab,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import { getStoredLsFilters } from 'src/utils/row-filter.utils';
import styles from './keyword-actions-tabs.module.scss';

const selectedTabStyle = {
  borderBottom: '1.5px solid #77469b',
  color: '#77469b',
};

interface KeywordActionsTabsProps {
  activeTab: KeywordActionTabsEnum;
}

export const KeywordActionsTabs: React.FC<KeywordActionsTabsProps> = ({
  activeTab,
}) => {
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const keywordAdditionAppliedFilters = useAppSelector(
    selectAppliedKeywordActionFilters
  );
  const keywordNegationAppliedFilters = useAppSelector(
    selectAppliedKeywordNegationFilters
  );
  const productAdditionAppliedFilters = useAppSelector(
    selectAppliedProductActionFilters
  );
  const productNegationAppliedFilters = useAppSelector(
    selectAppliedProductNegationFilters
  );

  const marketplace = advertisingAccount;

  const KEYWORD_ADDITION_TAB =
    marketplace.marketplace === MarketplaceEnum.AMAZON
      ? KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON
      : KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART;
  const HISTORY_TAB =
    marketplace.marketplace === MarketplaceEnum.AMAZON
      ? KeywordActionTabsEnum.HISTORY_AMAZON
      : KeywordActionTabsEnum.HISTORY_WALMART;
  const ARCHIVE_TAB =
    marketplace.marketplace === MarketplaceEnum.AMAZON
      ? KeywordActionTabsEnum.ARCHIVE_AMAZON
      : KeywordActionTabsEnum.ARCHIVE_WALMART;

  const syncAmzAppliedFiltersToCurrFilters = () => {
    if (activeTab === KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON) {
      dispatch(setKeywordActionFilters(keywordAdditionAppliedFilters));
    } else if (activeTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      dispatch(setKeywordNegationFilters(keywordNegationAppliedFilters));
    } else if (activeTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) {
      dispatch(setProductActionFilters(productAdditionAppliedFilters));
    } else if (activeTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON) {
      dispatch(setProductNegationFilters(productNegationAppliedFilters));
    } else return;
  };

  const handleTabChange = (tab: KeywordActionTabsEnum) => {
    const storedFilters = getStoredLsFilters(tab);
    dispatch(setAppliedFilters(storedFilters));

    dispatch(setSearchText(''));
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      syncAmzAppliedFiltersToCurrFilters();
      dispatch(setSelectedTab(tab));
      dispatch(setKeywordActionSelectedRowIds({}));
      dispatch(setBidErrorMessage(null));
    } else {
      dispatch(setWalmartSelectedTab(tab));
      dispatch(setWalmartKeywordActionSelectedRowIds({}));
      dispatch(setWalmartBidErrorMessage(null));
    }
  };

  useEffect(() => {
    const storedFilters = getStoredLsFilters(activeTab);
    dispatch(setAppliedFilters(storedFilters));
  }, []);
  return (
    <div className={styles.keywordActionTabContainer}>
      <div
        className={styles.keywordActionTab}
        id={KEYWORD_ADDITION_TAB}
        onClick={() => handleTabChange(KEYWORD_ADDITION_TAB)}
        style={activeTab === KEYWORD_ADDITION_TAB ? selectedTabStyle : {}}
      >
        <h4>Keyword Action</h4>
      </div>
      {marketplace.marketplace === MarketplaceEnum.AMAZON && (
        <React.Fragment>
          <div
            className={styles.keywordActionTab}
            id={KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON}
            onClick={() =>
              handleTabChange(KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON)
            }
            style={
              activeTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON
                ? selectedTabStyle
                : {}
            }
          >
            <h4>Product Action</h4>
          </div>

          <div
            className={styles.keywordActionTab}
            id={KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON}
            onClick={() =>
              handleTabChange(KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON)
            }
            style={
              activeTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
                ? selectedTabStyle
                : {}
            }
          >
            <h4>Keyword Negation</h4>
          </div>

          <div
            className={styles.keywordActionTab}
            id={KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON}
            onClick={() =>
              handleTabChange(KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON)
            }
            style={
              activeTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON
                ? selectedTabStyle
                : {}
            }
          >
            <h4>Product Negation</h4>
          </div>
        </React.Fragment>
      )}

      <div
        className={styles.keywordActionTab}
        id={HISTORY_TAB}
        onClick={() => handleTabChange(HISTORY_TAB)}
        style={activeTab === HISTORY_TAB ? selectedTabStyle : {}}
      >
        <h4>History</h4>
      </div>
      <div
        className={styles.keywordActionTab}
        id={ARCHIVE_TAB}
        onClick={() => handleTabChange(ARCHIVE_TAB)}
        style={activeTab === ARCHIVE_TAB ? selectedTabStyle : {}}
      >
        <h4>Archive</h4>
      </div>
    </div>
  );
};
