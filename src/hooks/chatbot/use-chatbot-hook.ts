import { SETTINGS_HOME_PAGE_URL } from '@/constants/urls.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IJIVAInsights,
  IPageDetails,
  IUploadFilePayload,
} from '@/interfaces/chatbot.interface';
import {
  selectInsightsData,
  setInsightsData,
  setSessions,
  updateInsight,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  invalidateQueries,
  useAppMutation,
  useAppQueries,
  useAppQuery,
} from '@/redux/react-query-hooks';
import { selectAdvertisingFilter } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectAdvertisingAccount,
  selectIsChatbotOpen,
} from '@/redux/slices/auth/auth.slice';
import chatbotServices from '@/services/bidder/llm-chatbot/chatbot.service';
import { checkIsEqual, checkIsNull } from '@/utils/advertising.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useChatbotData = (params: {
  enabled: boolean;
  pageDetails?: IPageDetails;
}) => {
  const { enabled, pageDetails } = params;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const advertisingFilters = useAppSelector(selectAdvertisingFilter);
  const accountId = localStorageUtils.getAccountId();
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const insightsData = useAppSelector(selectInsightsData);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const hasAdvertisingAccounts = !!localStorageUtils
    .getAvailableAccounts()
    .filter((acc) => acc.advertising).length;

  const shouldMakeCall =
    hasAdvertisingAccounts &&
    enabled &&
    checkIsNull(accountId) === false &&
    location.pathname.startsWith(SETTINGS_HOME_PAGE_URL) === false &&
    navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.JIVA_CHATBOT
    ) === true &&
    isChatbotOpen;

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  useAppQueries(
    chatbotUtils.getInsightsQueriesConfig(
      insightsData,
      shouldMakeCall,
      (s3Link) => chatbotServices.postGetDownloadCSVData({ csv_url: s3Link })
    )
  );

  const fetchHistoryMetadata = useAppQuery({
    queryKey: [
      QueryKeyEnums.HISTORY_METADATA_FETCH,
      selectedAdvertisingAccount.value,
    ],
    queryFn: () => {
      return chatbotServices.postGetHistoryMetadata(marketplace);
    },
    enabled: shouldMakeCall,
  });

  const fetchInsights = useAppQuery({
    queryKey: [
      QueryKeyEnums.INSIGHTS_FETCH,
      selectedAdvertisingAccount.value,
      advertisingFilters.range.value,
      advertisingFilters.customDateRange,
      pageDetails,
    ],
    queryFn: ({ signal }) => {
      const { startDate, endDate } = chatbotUtils.getValidatedDateRange(
        advertisingFilters.range.value,
        advertisingFilters.customDateRange,
        marketplace
      );
      dispatch(setInsightsData([]));
      return chatbotServices.getInsights(
        selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
        signal,
        startDate,
        endDate,
        pageDetails
      );
    },
    enabled: shouldMakeCall,
  });

  const isInsightsLoading = useMemo(
    () => fetchInsights.isLoading || fetchInsights.isRefetching,
    [fetchInsights.isLoading, fetchInsights.isRefetching]
  );

  useAppQueries(
    chatbotUtils.getInsightsQueriesConfig(
      insightsData,
      shouldMakeCall && isInsightsLoading === false,
      (s3Link) => chatbotServices.postGetDownloadCSVData({ csv_url: s3Link })
    )
  );
  useEffect(() => {
    if (fetchInsights.isSuccess && fetchInsights.data?.data) {
      const insights = fetchInsights.data.data.data
        .filter((item) => item !== null)
        .map((insight) => ({
          ...insight,
          hidden_insight_text:
            insight.hidden_insight_text ||
            [insight.title, insight.summary]
              .filter((text) => text?.trim())
              .join('\n\n'),
        }));
      dispatch(setInsightsData(insights));
    }
  }, [fetchInsights.data?.data, dispatch, fetchInsights.isSuccess]);

  useEffect(() => {
    if (fetchHistoryMetadata.data) {
      const sessions = fetchHistoryMetadata.data.data.data?.sessions;
      dispatch(setSessions(sessions));
    }
  }, [fetchHistoryMetadata.data, dispatch]);
};

export const useUploadFile = (insight: IJIVAInsights | undefined) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const {
    mutateAsync: uploadFile,
    isIdle,
    isPending,
  } = useAppMutation({
    mutationFn: (data: IUploadFilePayload) => chatbotServices.uploadFile(data),
    options: {
      onSuccess(data) {
        if (data.data.data.backend_s3_url && data.data.data.frontend_s3_url)
          dispatch(
            updateInsight({
              insightId: insight?.insight_id ?? '',
              updates: {
                uploaded_s3_url: data.data.data.backend_s3_url,
                uploaded_frontend_s3_url: data.data.data.frontend_s3_url,
              },
            })
          );

        const queriesToInvalidate = checkIsEqual(
          data.data.data.frontend_s3_url,
          insight?.uploaded_frontend_s3_url
        )
          ? [data.data.data.frontend_s3_url]
          : [data.data.data.frontend_s3_url, insight?.uploaded_frontend_s3_url];

        invalidateQueries(queryClient, queriesToInvalidate);
      },
    },
  });
  return { uploadFile, isIdle, isPending };
};
