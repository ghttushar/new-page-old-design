import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAmcSubHeader from '@/hooks/use-amc-sub-header.hook';
import Button from '@mui/material/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MultiSelectDropdown from 'src/app/components/common/dropdown/multi-select-dropdown';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import SearchClear from 'src/app/components/common/search/search-clear';
import TabsSelect from 'src/app/components/common/tabs-select/tabs-select';
import {
  amcTagsFilterOptions,
  audienceTabOptions,
} from 'src/constants/amc.constants';
import { AMCAccessTypes } from 'src/enums/amc.enums';
import {
  IAMCCustomQueryRequest,
  IAccountQueryMapping,
} from 'src/interfaces/amc.interfaces';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { AMCAudienceServices } from 'src/services/amc/amc-audience.services';
import styles from './audience-page.module.scss';
import CustomAudience from './custom-audience/custom-audience';
import DefaultAudience from './default-audience/default-audience';

export default function AudiencePage() {
  const amcFilters = useAmcSubHeader(
    PageTitleEnum.AUDIENCES,
    PAGE_TITLE_TOOLTIPS.AUDIENCES
  );
  const [tabValue, setTabValue] = useState<string>(AMCAccessTypes.DEFAULT);
  const [initialAudienceData, setInitialAudienceData] = useState<
    IAccountQueryMapping[]
  >([]);
  const [searchedData, setSearchData] = useState<IAccountQueryMapping[]>([]);
  const [requestData, setRequestData] = useState<IAMCCustomQueryRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] =
    useState<IMultiSelectDropdownItem[]>(amcTagsFilterOptions);
  const [searchText, setSearchText] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSearchedQueries = (data: any[]) => {
    return;
  };

  const handleTagsSelect = (selectedOptions: IMultiSelectDropdownItem[]) => {
    setSelectedTags(selectedOptions);

    handleSearchAndFilter(searchText, selectedOptions);
  };

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue);

    handleSearchAndFilter(searchValue, selectedTags);
  };

  const handleSearchAndFilter = (
    searchValue: string,
    _selectedTags: IMultiSelectDropdownItem[]
  ) => {
    const tagsSelected = _selectedTags
      .filter((tag) => tag.selected === true)
      .map((tag) => tag.value);

    const filteredQueries = initialAudienceData.filter((audience) => {
      const query = audience.queryId;
      const tagsPresentInAudience =
        query?.tags?.filter((tag) =>
          tagsSelected.includes(tag.toLowerCase())
        ) || [];

      if (!searchValue)
        return tagsPresentInAudience.length === tagsSelected.length;

      return (
        tagsPresentInAudience.length === tagsSelected.length &&
        query.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setSearchData(filteredQueries);
  };

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setTabValue(value);
    navigate(`/amc/audience/${value.toLowerCase()}`);
  };

  const handleCreateCustomClick = () => {
    setShowCustomForm(!showCustomForm);
  };

  const getDefaultAudienceQueries = useCallback(() => {
    setShowCustomForm(false);
    setIsLoading(true);
    AMCAudienceServices.getDefaultAudience(
      amcFilters?.value as string
    )
      .then((res) => {
        setInitialAudienceData(res.data.data);
        setSearchData(res.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [amcFilters?.value]);

  const getCustomAudienceQueries = useCallback(() => {
    setShowCustomForm(false);
    setIsLoading(true);
    AMCAudienceServices.getCustomAudience(
      amcFilters?.value as string
    )
      .then((res) => {
        setInitialAudienceData(res.data.data.queries);
        setRequestData(res.data.data.requests);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [amcFilters?.value]);

  useEffect(() => {
    const currentTab = window.location.pathname
      .replace(`/amc/audience`, '')
      .toUpperCase();

    const checkedTab = currentTab
      ? currentTab.split('/')[1]
      : AMCAccessTypes.DEFAULT;

    setTabValue(checkedTab);
    navigate(`/amc/audience/${checkedTab.toLowerCase()}`);
  }, [navigate]);

  useEffect(() => {
    // TODO
    setInitialAudienceData([]);
    setSearchData([]);
    setRequestData([]);
    switch (tabValue) {
      case AMCAccessTypes.DEFAULT:
        getDefaultAudienceQueries();
        break;

      case AMCAccessTypes.CUSTOM:
        getCustomAudienceQueries();
        break;

      default:
        setInitialAudienceData([]);
        setSearchData([]);
        setRequestData([]);
        break;
    }
  }, [tabValue, getDefaultAudienceQueries, getCustomAudienceQueries]);

  return (
    <div className={styles.audienceContainer}>
      <div className={styles.subContainer}>
        {isLoading ? (
          <LoaderWrapper />
        ) : (
          <React.Fragment>
            <div className={styles.buttonsContainer}>
              <TabsSelect
                tabValue={tabValue}
                handleTabChange={handleTabChange}
                tabsWithIndicator={true}
                tabData={audienceTabOptions}
              />

              {tabValue === AMCAccessTypes.DEFAULT && (
                <div className={styles.filterContainer}>
                  <SearchClear
                    initialRows={initialAudienceData}
                    title={'AMC_Queries'}
                    setUpdatedRows={handleSearchedQueries}
                    height="2.8rem"
                    customSearchHandler={handleSearch}
                  />

                  <MultiSelectDropdown
                    options={selectedTags}
                    label={'Filter by Tags'}
                    onSelect={handleTagsSelect}
                    width="23rem"
                    height="2.8rem"
                    background="#FFFFFF"
                    customWrapperStyles={{ marginTop: '-2rem' }}
                  />
                </div>
              )}

              {tabValue === AMCAccessTypes.CUSTOM && (
                <div className={styles.createContainer}>
                  <p className={styles.createActionText}>
                    Looking for Audience?
                  </p>
                  <Button
                    className={styles.createButton}
                    variant="contained"
                    onClick={handleCreateCustomClick}
                    disableTouchRipple
                  >
                    Create
                  </Button>
                </div>
              )}
            </div>

            <div className={styles.contentContainer}>
              <Routes>
                <Route
                  path="/default"
                  element={<DefaultAudience audiences={searchedData} />}
                />
                <Route
                  path="/custom"
                  element={
                    <CustomAudience
                      audiences={searchedData}
                      requests={requestData}
                      handleReloadData={getCustomAudienceQueries}
                      showCustomForm={showCustomForm}
                    />
                  }
                />
              </Routes>
            </div>

            {/* <div className={styles.contentContainer}>
              {tabValue === AMCAccessTypes.DEFAULT ? (
                <DefaultAudience audiences={searchedData} />
              ) : (
                <CustomAudience
                  audiences={searchedData}
                  requests={requestData}
                  handleReloadData={getCustomAudienceQueries}
                  showCustomForm={showCustomForm}
                />
              )}
            </div> */}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
