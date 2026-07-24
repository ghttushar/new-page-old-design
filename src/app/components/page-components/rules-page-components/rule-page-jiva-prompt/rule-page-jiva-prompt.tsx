import CustomChipCarousel from '@/app/components/common/custom-carousel/custom-chip-carousel';
import OutlineInputWithEndButton from '@/app/components/common/outline-input-with-button/outline-input-with-end-button';
import PrimaryLoadingButton from '@/app/components/common/primary-button/primary-loading-button';
import ReusableDialogPopupSkeleton from '@/app/components/common/reusable-dialog-popup-skeleton/reusable-dialog-popup-skeleton';
import { jivaPromptSuggestions } from '@/constants/rules/rules.constants';
import { FeatureRoutes, FeaturesEnum } from '@/enums/auth.enums';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { RuleTypeEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISearchRecognitionPayload } from '@/interfaces/rules/rules.interfaces';
import { setViewType } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  resetRuleState,
  setRuleTemplateDetails,
  setSelectedEntityType,
  setSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { getEntityTypesForRule } from '@/utils/rules.utils';
import { SparkleIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RulesCustomTemplateDialogPopup from '../../rules-dialog-popup/rules-custom-template-dialog-popup/rules-custom-template-dialog-popup';
import styles from './rule-page-jiva-prompt.module.scss';

export default function RulePageJivaPrompt() {
  const [prompt, setPrompt] = useState<string>('');
  const [request, setRequest] = useState<string>('');
  const [createRuleClick, setCreateRuleClick] = useState<boolean>(false);
  const [isRuleTypeUnknown, setIsRuleTypeUnknown] = useState<boolean>(false);
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const isJIVADisabled =
    navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.JIVA_CHATBOT
    ) === false;

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const handlePromptChange = (value: string) => setPrompt(value);

  const handleSuggestionPopupClose = () => {
    setIsRuleTypeUnknown(false);
    setRequest('');
  };

  const handleRequestChange = (value: string) => setRequest(value);

  const handleSubmitRequest = () => {
    handleSuggestionPopupClose();
    setPrompt('');
    dispatch(
      showSuccessToastMessage({
        title: 'Successful!!!',
        description: 'Successfully fetched template details',
      })
    );
  };

  const fetchTemplateFromPrompt = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_TEMPLATE_FROM_PROMPT,
      {
        prompt,
        selectedAdvertisingAccount,
      },
    ],
    queryFn: async () => {
      const payload: ISearchRecognitionPayload = {
        searchText: prompt,
        marketplace: marketplace,
      };
      return await rulesServices.getTemplateFromPrompt(payload);
    },
    enabled:
      selectedAdvertisingAccount.marketplace !== undefined &&
      createRuleClick === true &&
      isJIVADisabled,
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchTemplateFromPrompt.data) {
      setPrompt('');
      const resData = fetchTemplateFromPrompt.data.data.data;

      if (!resData || resData.rule?.ruleType === RuleTypeEnum.UNKNOWN) {
        setIsRuleTypeUnknown(true);
        dispatch(resetRuleState());
      } else {
        setIsRuleTypeUnknown(false);
        dispatch(setRuleTemplateDetails(resData));
        dispatch(
          setSelectedEntityType(
            getEntityTypesForRule(resData.rule.ruleType, marketplace)[0]
          )
        );
        dispatch(setSelectedRuleType(resData.rule.ruleType));
        dispatch(setViewType(JIVAViewTypeEnum.INSIGHTS));
        navigate(`${FeatureRoutes.RULE_CREATION}`);
      }
    }

    setCreateRuleClick(false);
  }, [fetchTemplateFromPrompt.data, dispatch, navigate]);

  const isSearchLoading = useMemo(
    () =>
      fetchTemplateFromPrompt.isLoading || fetchTemplateFromPrompt.isRefetching,
    [fetchTemplateFromPrompt.isLoading, fetchTemplateFromPrompt.isRefetching]
  );

  return (
    <div className={styles.jivaContainer}>
      <div className={styles.titleContainer}>
        <p className={styles.heading}>
          Create <span className={styles.heading2}>Rules with AI</span>
        </p>
        <p className={styles.subHeading}>
          Describe your automation or choose from templates below
        </p>
      </div>

      <div className={styles.promptActionContainer}>
        <OutlineInputWithEndButton
          suggestedPrompt={prompt}
          onChangeCustom={handlePromptChange}
          placeholder="Describe the rule you want to create..."
          isMultilineRequired={true}
          isDisabled={isJIVADisabled}
          endButton={
            <PrimaryLoadingButton
              buttonText="Create Rule"
              width="auto"
              buttonFunction={() => {
                setCreateRuleClick(true);
              }}
              isButtonIconRequired={true}
              buttonIcon={
                <SparkleIcon size={'1.6rem'} color="#fff" weight="fill" />
              }
              disabled={!prompt || isJIVADisabled}
              isHoverTooltipEnabled={false}
              disableRipple={false}
              isLoading={isSearchLoading}
            />
          }
        />
      </div>

      <div className={styles.promptTemplateContainer}>
        <CustomChipCarousel
          suggestions={jivaPromptSuggestions}
          onSuggestionClick={handlePromptChange}
          isJIVADisabled={isJIVADisabled}
        />
      </div>

      <ReusableDialogPopupSkeleton
        dialogMaxWidth="sm"
        open={isRuleTypeUnknown}
        onClose={handleSuggestionPopupClose}
        needTitleBox={false}
        needConfirmActionButton={true}
        confirmActionButtonText="Submit request"
        onConfirmActionButtonClick={handleSubmitRequest}
        disableConfirmActionButton={!request}
        needCancelActionButton={true}
        isLoading={false}
      >
        <RulesCustomTemplateDialogPopup
          currReqValue={request}
          onCustomReqValueChange={handleRequestChange}
        />
      </ReusableDialogPopupSkeleton>
    </div>
  );
}
