import { CountryCodeEnum } from '@/enums/advertising.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { KeywordTrackerTabs } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import marketIntelligenceUtils from '@/utils/market-intelligence/market-intelligence.utils';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeywordTrackerSubHeader from 'src/app/components/page-components/keyword-tracker-components/keyword-tracker-action/keyword-tracker-action';
import { MI_CLEAR_KEYWORD_SEARCH_EVENT } from 'src/constants/market-intelligence.constants';
import { QueryKeyEnums } from 'src/enums/query.enums';
import { IExportKeyword, ISerpKeyword } from 'src/interfaces/serp.interface';
import { useAppQuery } from 'src/redux/react-query-hooks';
import SerpService from 'src/services/market-intelligence/serp.service';
import keywordTrackerUtils, {
  ISegregatedKeywords,
} from 'src/utils/market-intelligence/keyword-tracker/keyword-tracker.utils';
import styles from './keyword-tracker-page.module.scss';
import KeywordTrackerTable from './keyword-tracker-table/keyword-tracker-table';

export default function KeywordTrackerPage() {
  const [marketplace, countryCode] = useMarketplaceSubheader(
    PageTitleEnum.KEYWORD_TRACKER,
    marketIntelligenceUtils.getKeywordTrackerUrl
  );
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState<KeywordTrackerTabs>(
    KeywordTrackerTabs.ACTIVE
  );
  const [segregatedKeywords, setSegregatedKeywords] =
    useState<ISegregatedKeywords | null>(null);
  const [keywordData, setKeywordData] = useState<ISerpKeyword[]>([]);
  const [searchedKeywordData, setSearchedKeywordData] = useState<
    ISerpKeyword[]
  >([]);
  const [exportData, setExportData] = useState<IExportKeyword[]>([]);

  const handleSetKeywordData = useCallback(
    (data: ISerpKeyword[]) => setKeywordData(data),
    []
  );
  const handleSetSearchedKeywordData = useCallback(
    (data: ISerpKeyword[]) => setSearchedKeywordData(data),
    []
  );
  const handleSetExportData = useCallback(
    (data: IExportKeyword[]) => setExportData(data),
    []
  );

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setTabValue(value as KeywordTrackerTabs);
    window.dispatchEvent(new Event(MI_CLEAR_KEYWORD_SEARCH_EVENT));
  };

  const fetchKeywords = useAppQuery({
    queryKey: [
      QueryKeyEnums.KEYWORD_TRACKER_FETCH,
      { marketplace, countryCode },
    ],
    queryFn: async () =>
      await SerpService.getKeywords(marketplace, true, countryCode),
  });

  useEffect(() => {
    navigate(marketplace);

    if (fetchKeywords.data) {
      const keywords: ISerpKeyword[] = fetchKeywords.data.data.data;
      const formattedSegregatedKeywords =
        keywordTrackerUtils.getKeywordsSegregatedByType(keywords);
      setSegregatedKeywords(formattedSegregatedKeywords);
    }
  }, [fetchKeywords.data]);

  return (
    <div className={styles.keywordTrackerDashboard}>
      <div className={styles.dashboardContainer}>
        <KeywordTrackerSubHeader
          selectedRegion={countryCode as CountryCodeEnum}
          segregatedKeywords={segregatedKeywords}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          keywordData={keywordData}
          handleSetKeywordData={handleSetKeywordData}
          handleSetSearchedKeywordData={handleSetSearchedKeywordData}
          exportData={exportData}
          handleSetExportData={handleSetExportData}
        />

        <KeywordTrackerTable
          searchedKeywordData={searchedKeywordData}
          setExportData={setExportData}
          isLoading={fetchKeywords.isLoading || fetchKeywords.isRefetching}
          selectedMarketplace={marketplace}
          countryCode={countryCode}
        />
      </div>
    </div>
  );
}
