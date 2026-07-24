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
  queriesTabOptions,
} from 'src/constants/amc.constants';
import { AMCAccessTypes } from 'src/enums/amc.enums';
import {
  IAMCCustomQueryRequest,
  IAccountQueryMapping,
} from 'src/interfaces/amc.interfaces';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { AMCQueryServices } from 'src/services/amc/amc-queries.services';
import CustomQueries from './custom-queries/custom-queries';
import DefaultQueries from './default-queries/default-queries';
import styles from './queries-page.module.scss';

export default function QueriesPage() {
  const amcFilters = useAmcSubHeader(
    PageTitleEnum.QUERIES,
    PAGE_TITLE_TOOLTIPS.QUERIES
  );
  const [tabValue, setTabValue] = useState<string>(AMCAccessTypes.DEFAULT);
  const [initialWorkflowList, setInitialWorkflowList] = useState<
    IAccountQueryMapping[]
  >([]);
  const [searchedWorkflowList, setSearchedWorkflowList] = useState<
    IAccountQueryMapping[]
  >([]);
  const [requestWorkflowList, setRequestWorkflowList] = useState<
    IAMCCustomQueryRequest[]
  >([]);
  const [selectedTags, setSelectedTags] =
    useState<IMultiSelectDropdownItem[]>(amcTagsFilterOptions);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setTabValue(value);
    navigate(`/amc/queries/${value.toLowerCase()}`);
  };

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

    const filteredQueries = initialWorkflowList.filter((workflow) => {
      const query = workflow.queryId;
      const tagsPresentInQuery =
        query?.tags?.filter((tag) =>
          tagsSelected.includes(tag.toLowerCase())
        ) || [];

      if (!searchValue)
        return tagsPresentInQuery.length === tagsSelected.length;

      return (
        tagsPresentInQuery.length === tagsSelected.length &&
        query.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setSearchedWorkflowList(filteredQueries);
  };

  const handleCreateCustomClick = () => {
    setShowCustomForm(!showCustomForm);
  };

  const getDefaultDataQueries = useCallback(() => {
    setShowCustomForm(false);
    setIsLoading(true);
    AMCQueryServices.getWorkflowsForAccount(
      amcFilters?.value as string
    )
      .then((res) => {
        setInitialWorkflowList(res.data.data);
        setSearchedWorkflowList(res.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [amcFilters?.value]);

  const getCustomDataQueries = useCallback(() => {
    setShowCustomForm(false);
    setIsLoading(true);
    AMCQueryServices.getCustomDataQueries(
      amcFilters?.value as string
    )
      .then((res) => {
        setInitialWorkflowList(res.data.data.queries);
        setRequestWorkflowList(res.data.data.requests);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [amcFilters?.value]);

  useEffect(() => {
    const currentTab = window.location.pathname
      .replace(`/amc/queries`, '')
      .toUpperCase();

    const checkedTab = currentTab
      ? currentTab.split('/')[1]
      : AMCAccessTypes.DEFAULT;

    setTabValue(checkedTab);
    navigate(`/amc/queries/${checkedTab.toLowerCase()}`);
  }, [navigate]);

  useEffect(() => {
    setInitialWorkflowList([]);
    setSearchedWorkflowList([]);
    switch (tabValue) {
      case AMCAccessTypes.DEFAULT:
        getDefaultDataQueries();
        break;

      case AMCAccessTypes.CUSTOM:
        getCustomDataQueries();
        break;

      default:
        setInitialWorkflowList([]);
        setSearchedWorkflowList([]);
        break;
    }
  }, [tabValue, getDefaultDataQueries, getCustomDataQueries]);

  return (
    <div className={styles.queriesContainer}>
      {/* {amcFilters.selectedInstance !== null &&
        amcFilterOptions.selectedInstance.length > 0 && (
          <SubHeader
            title={'Queries'}
            isDropdownRequired={true}
            dropdownOptions={instanceDropdownOptions}
          />
        )} */}

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
                tabData={queriesTabOptions}
              />

              {tabValue === AMCAccessTypes.DEFAULT && (
                <div className={styles.filterContainer}>
                  <SearchClear
                    initialRows={initialWorkflowList}
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
                    height="3rem"
                    background="#FFFFFF"
                    customWrapperStyles={{ marginTop: '-2rem' }}
                  />
                </div>
              )}

              {tabValue === AMCAccessTypes.CUSTOM && (
                <div className={styles.createContainer}>
                  <p className={styles.createActionText}>
                    Looking for Custom Query?
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
                  element={<DefaultQueries workflows={searchedWorkflowList} />}
                />
                <Route
                  path="/custom"
                  element={
                    <CustomQueries
                      workflows={searchedWorkflowList}
                      requests={requestWorkflowList}
                      handleReloadData={getCustomDataQueries}
                      showCustomForm={showCustomForm}
                    />
                  }
                />
              </Routes>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
