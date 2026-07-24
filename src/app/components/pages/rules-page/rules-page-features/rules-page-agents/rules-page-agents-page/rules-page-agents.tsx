import RulePageJivaPrompt from '@/app/components/page-components/rules-page-components/rule-page-jiva-prompt/rule-page-jiva-prompt';
import RulesPageRuleTypes from '@/app/components/page-components/rules-page-components/rules-page-rule-types/rules-page-rule-types';
import ConnectAccountStaticPage from '@/app/components/pages/connect-account-static-page/connect-account-static-page';
import { JIVAPageIdEnum } from '@/enums/chatbot.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import {
  clearPageDetails,
  setPageDetails,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import {
  resetRuleState,
  selectSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useEffect, useMemo } from 'react';
import styles from '../../../rules-page.module.scss';

export default function RulesPageAgents() {
  useAdsAccountSubHeader(
    PageTitleEnum.RULES_AGENTS,
    PAGE_TITLE_TOOLTIPS.RULES_AGENTS,
    false
  );
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const dispatch = useAppDispatch();

  const pageDetailsValue = useMemo(() => {
    if (selectedRuleType) {
      return {
        page_id: JIVAPageIdEnum.RULES,
        page_arguments: {
          ruleType: selectedRuleType,
        },
      };
    }
    return {
      page_id: JIVAPageIdEnum.RULES,
    };
  }, [selectedRuleType]);

  // Set page details when component mounts or selectedRuleType changes
  useEffect(() => {
    dispatch(setPageDetails(pageDetailsValue));
  }, [dispatch, pageDetailsValue]);

  // Clear page details when component unmounts (navigating away from rules page)
  useEffect(() => {
    return () => {
      dispatch(clearPageDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetRuleState());
  }, [dispatch]);

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

  if (!hasAccounts) return <ConnectAccountStaticPage />;

  return (
    <div
      className={styles.agentsSubContainer}
      style={{
        paddingLeft: isChatbotOpen ? '1.5rem' : '10rem ',
        paddingRight: isChatbotOpen ? ' 1.5rem' : ' 10rem ',
      }}
    >
      <div className={styles.promptContainer}>
        <RulePageJivaPrompt />
      </div>

      <div className={styles.ruleTypeContainer}>
        <RulesPageRuleTypes />
      </div>
    </div>
  );
}
