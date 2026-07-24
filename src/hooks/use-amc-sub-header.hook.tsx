import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { ISubHeaderDataItem } from '@/app/components/common/sub-header/sub-header';
import { customRangeFilterOption } from '@/constants';
import { DropdownLabelEnum } from '@/enums/index.enums';
import { useAuthSelector } from '@/redux/auth-selector/auth-selector';
import { resetChatbotState } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetAdvEditAccess } from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  resetAdvertisingHeaderOptions,
  resetPaginationModel,
  setAdvertisingRangeCustomOption,
} from '@/redux/slices/advertising/advertising-filter.slice';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import {
  selectAMCOptions,
  selectSelectedInstance,
  setAmcFilters,
  setSelectedInstance,
} from '@/redux/slices/amc/amc.slice';
import {
  selectAdvertisingAccount,
  selectAdvertisingAccountOptions,
  selectDSPAccount,
  selectDspAccountOptions,
} from '@/redux/slices/auth/auth.slice';
import { handleQueryCancellation } from '@/utils';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
const useAmcSubHeader = (
  title: string,
  titleTooltip: string,
  removeInstanceDropdown = false
) => {
  const dispatch = useAppDispatch();
  const amcFilterOptions = useAppSelector(selectAMCOptions);
  const amcFilters = useAppSelector(selectSelectedInstance);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedDSPAccount = useAppSelector(selectDSPAccount);
  const { setAdvertisingAccount, setDSPAccount } = useAuthSelector();
  const queryClient = useQueryClient();

  const advertisingAccountOptions = useAppSelector(
    selectAdvertisingAccountOptions
  );
  const dspAccountOptions = useAppSelector(selectDspAccountOptions);

  const handleInstanceOptionChange = useCallback(
    (value: IDropdownItem<string>) => {
      dispatch(setSelectedInstance(value));
    },
    [dispatch]
  );

  const handleSetAdsAccount = useCallback(
    (account: IDropdownItem<string>) => {
      setAdvertisingAccount(account);
      dispatch(resetPaginationModel());

      dispatch(resetAdvertisingHeaderOptions());
      dispatch(resetChatbotState());
      chatbotUtils.newSession();
      dispatch(resetAdvEditAccess());
      dispatch(setAdvertisingRangeCustomOption(customRangeFilterOption));
      dispatch(setAmcFilters(localStorageUtils.getApplicableInstances() || []));
      handleQueryCancellation(queryClient);
    },
    [dispatch]
  );
  const handleSetDSPAccount = useCallback(
    (account: IDropdownItem<string>) => {
      setDSPAccount(account);
      dispatch(resetPaginationModel());
      handleQueryCancellation(queryClient);
    },
    [dispatch]
  );

  useEffect(() => {
    const dropdownOptions: Array<ISubHeaderDataItem> = [
      {
        selectedItem: amcFilters as IDropdownItem<string>,
        setSelectedItem: handleInstanceOptionChange,
        label: DropdownLabelEnum.INSTANCE,
        options: amcFilterOptions.instanceList,
      },
      {
        selectedItem: selectedAdvertisingAccount,
        setSelectedItem: handleSetAdsAccount,
        label: DropdownLabelEnum.SPONSORED_ACCOUNT,
        options: accountUtils.getAdsAccountOptionsByTitle(
          title,
          advertisingAccountOptions
        ),
        prefixElement: selectedAdvertisingAccount.prefixElement,
        flagElement: selectedAdvertisingAccount.flagElement,
      },
      {
        selectedItem: selectedDSPAccount,
        setSelectedItem: handleSetDSPAccount,
        label: DropdownLabelEnum.DSP_ACCOUNT,
        options: accountUtils.getAdsAccountOptionsByTitle(
          title,
          dspAccountOptions
        ),
        prefixElement: selectedDSPAccount.prefixElement,
        flagElement: selectedDSPAccount.flagElement,
      },
    ];

    dispatch(
      setSubheaderOptions({
        title: title,
        titleTooltip: titleTooltip,
        isDropdownRequired: !removeInstanceDropdown,
        dropdownOptions,
      })
    );
  }, [
    amcFilterOptions.instanceList,
    amcFilters?.selected,
    dispatch,
    handleInstanceOptionChange,
    removeInstanceDropdown,
    title,
  ]);

  return amcFilters;
};

export default useAmcSubHeader;
