import DownloadTableButton from '@/app/components/common/download-button/download-table-button';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { KeywordTrackerTabs } from '@/enums/serp.enums';
import { PlusIcon } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import SearchClear from 'src/app/components/common/search/search-clear';
import TabsSelect from 'src/app/components/common/tabs-select/tabs-select';
import AddKeywordPage from 'src/app/components/pages/market-intelligence-wrapper/keyword-tracker-page/add-keyword-page/add-keyword-page';
import { MI_CLEAR_KEYWORD_SEARCH_EVENT } from 'src/constants/market-intelligence.constants';
import { IExportKeyword, ISerpKeyword } from 'src/interfaces/serp.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { getCurrentDateTime } from 'src/utils';
import keywordTrackerUtils, {
  ISegregatedKeywords,
} from 'src/utils/market-intelligence/keyword-tracker/keyword-tracker.utils';
import searchUtils from 'src/utils/search.utils';
import { KeywordTrackerDataTestIds } from '../../../../../../cypress/enums/keyword-tracker';
import styles from './keyword-tracker-action.module.scss';

interface KeywordTrackerActionProps {
  segregatedKeywords: ISegregatedKeywords | null;
  tabValue: string;
  handleTabChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => void;
  keywordData: ISerpKeyword[];
  handleSetKeywordData: (data: ISerpKeyword[]) => void;
  handleSetSearchedKeywordData: (data: ISerpKeyword[]) => void;
  exportData: IExportKeyword[];
  handleSetExportData: (data: IExportKeyword[]) => void;
  selectedRegion?: CountryCodeEnum;
}

const getTabData = (activeCount = 0, inactiveCount = 0) => {
  return [
    {
      value: KeywordTrackerTabs.ACTIVE,
      label: `Active(${activeCount})`,
    },
    {
      value: KeywordTrackerTabs.IN_ACTIVE,
      label: `Inactive(${inactiveCount})`,
    },
  ];
};

export default function KeywordTrackerSubHeader({
  segregatedKeywords,
  tabValue,
  handleTabChange,
  keywordData,
  handleSetKeywordData,
  handleSetSearchedKeywordData,
  exportData,
  handleSetExportData,
  selectedRegion = CountryCodeEnum.UnitedStates,
}: KeywordTrackerActionProps) {
  const [isAddKeywordDialogOpen, setIsAddKeywordDialogOpen] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleSetUpdatedRows = (data: any[]) => {
    handleSetSearchedKeywordData(data);
    handleSetExportData(keywordTrackerUtils.getKeywordsToExport(data));
  };

  const handleDownload = () => {
    dispatch(
      showSuccessToastMessage({
        title: 'Downloaded Successfully',
      })
    );
  };

  const customSearchHandler = (searchValue: string) => {
    const filteredKeywords = searchUtils.getSearchTableData(
      keywordData,
      searchValue,
      'Keyword_Tracker'
    );
    handleSetSearchedKeywordData(filteredKeywords);
    handleSetExportData(
      keywordTrackerUtils.getKeywordsToExport(filteredKeywords)
    );
  };

  const handleOpenDialog = () => {
    setIsAddKeywordDialogOpen(true);
  };

  const toggleIsAddKeywordDialogOpen = () => {
    setIsAddKeywordDialogOpen(!isAddKeywordDialogOpen);
  };

  useEffect(() => {
    if (segregatedKeywords) {
      if (tabValue === KeywordTrackerTabs.ACTIVE) {
        handleSetKeywordData([...segregatedKeywords.activeKeywords]);
        handleSetSearchedKeywordData([...segregatedKeywords.activeKeywords]);
        handleSetExportData(
          keywordTrackerUtils.getKeywordsToExport([
            ...segregatedKeywords.activeKeywords,
          ])
        );
      }

      if (tabValue === KeywordTrackerTabs.IN_ACTIVE) {
        handleSetKeywordData([...segregatedKeywords.inActiveKeywords]);
        handleSetSearchedKeywordData([...segregatedKeywords.inActiveKeywords]);
        handleSetExportData(
          keywordTrackerUtils.getKeywordsToExport([
            ...segregatedKeywords.inActiveKeywords,
          ])
        );
      }
    }
  }, [
    tabValue,
    segregatedKeywords,
    handleSetKeywordData,
    handleSetSearchedKeywordData,
    handleSetExportData,
  ]);

  return (
    <React.Fragment>
      <div className={styles.buttonContainer}>
        <TabsSelect
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          tabsWithIndicator={true}
          tabData={getTabData(
            segregatedKeywords?.activeKeywords.length ?? 0,
            segregatedKeywords?.inActiveKeywords.length ?? 0
          )}
        />

        <div
          data-test={KeywordTrackerDataTestIds.TABLE_BUTTON_CONTAINER}
          className={styles.tableButtonContainer}
        >
          <SearchClear
            initialRows={keywordData}
            title={'Keyword_Tracker'}
            setUpdatedRows={handleSetUpdatedRows}
            height="2.8rem"
            customSearchHandler={customSearchHandler}
            clearSearchEvent={MI_CLEAR_KEYWORD_SEARCH_EVENT}
          />

          <PrimaryButton
            buttonText={'Add Keyword'}
            buttonFunction={handleOpenDialog}
            disabled={selectedRegion === CountryCodeEnum.ALL}
            width="auto"
            height="3rem"
            isButtonIconRequired={true}
            buttonIcon={<PlusIcon size={16} color="#ffffff" weight="bold" />}
          />

          <div onClick={handleDownload}>
            <DownloadTableButton
              data={exportData}
              filename={`tracked-keywords_${getCurrentDateTime()}.csv`}
              squareDimension={'3rem'}
              title={'Keyword_Tracker'}
              downloadOptionsRequired={false}
            />
          </div>
        </div>
      </div>

      {isAddKeywordDialogOpen && (
        <AddKeywordPage
          closeDialog={toggleIsAddKeywordDialogOpen}
          selectedRegion={selectedRegion}
        />
      )}
    </React.Fragment>
  );
}
